"""Sinh src/content/meta-comps.ts (trang /doi-hinh-meta) từ comps.json + các lần chụp MetaTFT.

Chạy từ gốc repo:
  python scripts/meta/gen_meta_comps.py [--snapshot <tiền tố>] [--base <tiền tố>]
    --snapshot  lần chụp dùng làm số liệu hiện tại (mặc định: mới nhất)
    --base      lần chụp để tính xu hướng ▲▼ (mặc định: lần ngay trước --snapshot)

comps.json là danh sách đội được tuyển chọn (tên, carry, lối chơi, ghi chú, dự đoán). Số liệu,
xếp loại, nhãn đều tính lại ở đây. Nếu MetaTFT phân cụm lại (mã cụm đổi), script tự ghép đội theo
độ trùng tướng và ghi mã cụm mới vào comps.json.

`prediction` trong comps.json (dùng ngay sau bản vá, khi số liệu còn mỏng):
  {"direction": "up" | "down", "reason": "..."}
  up   → đội chưa đủ 1.000 trận thì hiện ◆ Dự đoán mạnh thay vì ○/✕
  down → đội chưa đủ 1.000 trận thì không được ★, tối đa ○
"""
import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import meta_snapshot as ms  # noqa: E402

HERE = Path(__file__).resolve().parent
REPO = ms.REPO
COMPS_FILE = HERE / 'comps.json'
OUT = REPO / 'src/content/meta-comps.ts'

RANKS = [('emerald', 'Lục Bảo+'), ('diamond', 'Kim Cương+'), ('master', 'Cao Thủ+')]
DEFAULT_RANK = 'emerald'  # rank của chủ site (Lục Bảo) — xem memory user_tft_rank

META_MAX_AVG = 4.40
MIN_SAMPLE = 1000
PREDICTED_MAX_AVG = 4.45
VIABLE_MAX_AVG = 4.65
AVOID_DROP = 0.15
CONTESTED_PICK = 7.0
HOLD_TOP4 = 54.0
CEILING_WIN = 18.0
AUTO_MATCH = 0.85  # điểm ghép tối thiểu để tự đổi cụm; thấp hơn thì đưa vào danh sách cần xem
NAME_BONUS = 0.3   # cộng điểm khi tên gọi MetaTFT (name_string) trùng — MetaTFT hay giữ tên khi tách cụm

SPECIAL = {
    'ElderDragon': 'The Elder Dragon', 'Sentinel': 'Ancient Sentinel', 'Sentry': 'Pebbles',
    'CrimsonRaptor': 'Raptor', 'GnarSmall': 'Gnar', 'KogMaw_AD': "Kog'Maw", 'Nidalee_AP': 'Nidalee',
    'MasterYi_AD': 'Master Yi', 'Akali_AD': 'Akali', 'KhaZix': "Kha'Zix", 'RekSai': "Rek'Sai",
    'Gromp_AP': 'Gromp', 'MasterYi': 'Master Yi', 'KogMaw': "Kog'Maw", 'Nidalee': 'Nidalee',
}


def unit_name(api):
    n = api.strip().replace('DA_18_', '').replace('DA_', '').replace('18', '')
    return SPECIAL.get(n, n)


def cluster_units(info):
    return {unit_name(u) for u in (info.get('units_string') or '').split(',') if u.strip()}


def jaccard(a, b):
    return len(a & b) / len(a | b) if a | b else 0.0


def candidates(units, catalog, stats, name=None, top=3):
    """Cụm ứng viên xếp theo điểm = độ trùng tướng (+ NAME_BONUS nếu cùng tên gọi MetaTFT)."""
    scored = []
    for c, info in catalog.items():
        if c not in stats:
            continue
        s = jaccard(units, cluster_units(info)) + (NAME_BONUS if name and info.get('name_string') == name else 0)
        scored.append((round(s, 2), c))
    return sorted(scored, reverse=True)[:top]


def best_match(units, catalog, stats, name=None, threshold=AUTO_MATCH):
    found = candidates(units, catalog, stats, name, top=1)
    if found and found[0][0] >= threshold:
        return found[0][1], found[0][0]
    return None, (found[0][0] if found else 0.0)


def snapshot_stats(snap, rank):
    stats, _, total = ms.load(snap, rank, 'd1')
    for v in stats.values():
        for k in ('avg',):
            v[k] = round(v[k], 2)
        v['top4'] = round(v['top4'], 1)
        v['win'] = round(v['win'], 1)
        v['pick'] = round(v['pick'], 1)
    return stats, total


def catalog_of(snap):
    meta = json.loads((snap / 'meta.json').read_text(encoding='utf-8'))
    return ms.read_json(ms.ROOT / meta['catalogRef'], 'catalog'), meta


def verdict(s, prev_avg, prediction):
    drop = s['avg'] - prev_avg
    thin = s['n'] < MIN_SAMPLE
    if prediction and thin:
        if prediction['direction'] == 'up':
            return 'predicted'
        if prediction['direction'] == 'down' and s['avg'] <= META_MAX_AVG:
            return 'viable'
    if s['avg'] > VIABLE_MAX_AVG or (drop >= AVOID_DROP and s['avg'] >= 4.55):
        return 'avoid'
    if not thin and s['avg'] <= META_MAX_AVG:
        return 'meta'
    if thin and s['avg'] <= PREDICTED_MAX_AVG:
        return 'predicted'
    return 'viable'


def pick_snapshot(prefix, default):
    if not prefix:
        return default
    found = [p for p in ms.snapshots() if p.name.startswith(prefix)]
    if not found:
        sys.exit(f'Không thấy lần chụp {prefix}')
    return found[-1]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--snapshot')
    ap.add_argument('--base')
    args = ap.parse_args()

    snaps = ms.snapshots()
    if len(snaps) < 2:
        sys.exit('Cần ít nhất 2 lần chụp trong data/meta-snapshots.')
    snap = pick_snapshot(args.snapshot, snaps[-1])
    base = pick_snapshot(args.base, snaps[snaps.index(snap) - 1])

    champs = {c['name']: c for c in ms.ts_array(REPO / 'src/content/set18/set18-champions.ts')}
    items = {i['apiName']: i for i in ms.ts_array(REPO / 'src/content/set18/set18-items.ts')}
    cat_now, meta_now = catalog_of(snap)
    cat_base, meta_base = catalog_of(base)
    now = {k: snapshot_stats(snap, k) for k, _ in RANKS}
    old = {k: snapshot_stats(base, k)[0] for k, _ in RANKS}

    # Đồ carry cũ làm dự phòng khi cụm mới chưa có bộ đồ nào cho carry đó.
    previous_items = {}
    if OUT.exists():
        for c in ms.ts_array(OUT):
            for carry in c['carries']:
                previous_items[(c['id'], carry['name'])] = carry['items']

    config = json.loads(COMPS_FILE.read_text(encoding='utf-8'))
    out, changed_clusters, skipped = [], [], []
    for comp in config['comps']:
        units = set(comp['units'])
        stats_now = now[DEFAULT_RANK][0]
        cl = comp['cluster'] if comp['cluster'] in stats_now and comp['cluster'] in cat_now else None
        if cl is None:
            cl, score = best_match(units, cat_now, stats_now, comp.get('metatftName'))
            if cl is None:
                opts = candidates(units, cat_now, stats_now, comp.get('metatftName'))
                skipped.append({'comp': comp['id'], 'name': comp['name'], 'oldCluster': comp['cluster'], 'candidates': [
                    {'cluster': c, 'score': s, 'metatftName': cat_now[c].get('name_string'),
                     'avg': round(stats_now[c]['avg'], 2), 'n': stats_now[c]['n'],
                     'units': sorted(cluster_units(cat_now[c]))} for s, c in opts]})
                continue
            changed_clusters.append(f"{comp['name']}: {comp['cluster']} → {cl} (điểm {score:.2f})")
            comp['cluster'] = cl
        info = cat_now[cl]
        comp['metatftName'] = info.get('name_string')
        base_cl = cl if meta_base['clusterId'] == meta_now['clusterId'] else None
        if base_cl is None or base_cl not in old[DEFAULT_RANK]:
            base_cl, _ = best_match(cluster_units(info), cat_base, old[DEFAULT_RANK], info.get('name_string'), threshold=0.6)

        ranks = {}
        for key, _ in RANKS:
            s = now[key][0].get(cl)
            if s is None:
                s = {'n': 0, 'avg': 8.0, 'top4': 0.0, 'win': 0.0, 'pick': 0.0}
            prev = old[key].get(base_cl, s)['avg'] if base_cl else s['avg']
            delta = round(s['avg'] - prev, 2)
            ranks[key] = {
                **s,
                'prevAvg': prev,
                'verdict': verdict(s, prev, comp.get('prediction')),
                'trend': 'up' if delta <= -0.05 else 'down' if delta >= 0.05 else 'flat',
                'contested': s['pick'] >= CONTESTED_PICK,
                'shapes': [k for k, ok in (('hold', s['top4'] >= HOLD_TOP4), ('ceiling', s['win'] >= CEILING_WIN)) if ok],
            }

        def build(carry):
            best = None
            for b in info.get('builds', []):
                if unit_name(b['unit']) == carry and (best is None or b['count'] > best['count']):
                    best = b
            if best and all(i in items for i in best['buildName']):
                return [{'name': items[i]['nameVi'], 'icon': items[i]['icon']} for i in best['buildName']]
            return previous_items.get((comp['id'], carry), [])

        unit_list = sorted((u for u in cluster_units(info) if u in champs), key=lambda u: (champs[u]['cost'], u))
        ref = lambda n: {'name': n, 'cost': champs[n]['cost'], 'image': champs[n]['image']}
        out.append({
            'id': comp['id'], 'name': comp['name'], 'damage': comp['damage'], 'cost': comp['cost'],
            'playstyle': comp['playstyle'],
            'carries': [{**ref(c), 'items': build(c)} for c in comp['carries']],
            'units': [ref(u) for u in unit_list],
            'ranks': ranks,
            'note': comp['note'],
        })

    if changed_clusters:
        COMPS_FILE.write_text(json.dumps(config, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    fetched = datetime.fromisoformat(meta_now['fetchedAt'])
    base_date = datetime.fromisoformat(meta_base['fetchedAt'])
    previous = (f"bản {meta_base['patch']}" if meta_base['patch'] != meta_now['patch']
                else f'ngày {base_date:%d/%m}')
    ranks_meta = [{'key': k, 'label': label, 'sampleSize': now[k][1]} for k, label in RANKS]

    header = f'''// GENERATED FILE — do not edit by hand.
// Sinh bởi scripts/meta/gen_meta_comps.py từ scripts/meta/comps.json + data/meta-snapshots
// (số liệu: {snap.name}, xu hướng so với: {base.name}).

export type MetaCompDamage = 'AP' | 'AD';
/** meta = mạnh, số liệu xác nhận · predicted = dự đoán mạnh · viable = chơi được · avoid = tránh */
export type MetaCompVerdict = 'meta' | 'predicted' | 'viable' | 'avoid';
export type MetaCompTrend = 'up' | 'down' | 'flat';
/** hold = Giữ điểm (Top 4 ≥ {HOLD_TOP4:g}%) · ceiling = Ăn top 1 (Top 1 ≥ {CEILING_WIN:g}%) */
export type MetaCompShape = 'hold' | 'ceiling';
export type MetaCompRankKey = {' | '.join(repr(k) for k, _ in RANKS)};

export type MetaCompChampion = {{ name: string; cost: number; image: string }};
export type MetaCompItem = {{ name: string; icon: string }};

export type MetaCompRankStats = {{
  n: number;
  avg: number;
  top4: number;
  win: number;
  /** % đội hình ở mức rank này chơi đội đó. */
  pick: number;
  /** avg cùng mức rank ở lần chụp dùng để so xu hướng. */
  prevAvg: number;
  verdict: MetaCompVerdict;
  /** So avg lần trước: up = tốt lên ≥ 0,05 hạng, down = tệ đi ≥ 0,05 hạng. */
  trend: MetaCompTrend;
  /** Tỉ lệ chọn ≥ {CONTESTED_PICK:g}% — dễ bị tranh tướng. */
  contested: boolean;
  shapes: MetaCompShape[];
}};

export type MetaComp = {{
  id: string;
  name: string;
  damage: MetaCompDamage;
  /** Giá vàng của carry chính — dùng làm hàng của ma trận. */
  cost: number;
  playstyle: string;
  carries: (MetaCompChampion & {{ items: MetaCompItem[] }})[];
  units: MetaCompChampion[];
  ranks: Record<MetaCompRankKey, MetaCompRankStats>;
  note: string;
}};

export const metaCompsSnapshot = {{
  patch: '{meta_now['patch']}',
  /** Mốc so xu hướng, đã kèm chữ "bản"/"ngày" — vd "bản 18.3" hoặc "ngày 25/09". */
  previousPatch: '{previous}',
  updatedVi: '{fetched:%d/%m/%Y}',
  source: 'MetaTFT',
  defaultRank: '{DEFAULT_RANK}' as MetaCompRankKey,
  ranks: {json.dumps(ranks_meta, ensure_ascii=False)} as {{ key: MetaCompRankKey; label: string; sampleSize: number }}[],
  thresholds: {{ contestedPick: {CONTESTED_PICK:g}, holdTop4: {HOLD_TOP4:g}, ceilingWin: {CEILING_WIN:g} }},
}};

export const metaComps: MetaComp[] = '''
    OUT.write_text(header + json.dumps(out, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')

    print(f'Đã ghi {OUT.relative_to(REPO)}: {len(out)} đội · số liệu {snap.name} · so với {base.name}')
    for line in changed_clusters:
        print('  ghép lại cụm:', line)
    if skipped:
        # Routine đọc khối này, chọn cụm đúng (hoặc bỏ đội) rồi sửa `cluster` trong comps.json và chạy lại.
        print('CẦN XEM — đội chưa ghép được với cụm mới (đã bỏ khỏi trang):')
        print(json.dumps(skipped, ensure_ascii=False, indent=2))
    for c in out:
        r = c['ranks'][DEFAULT_RANK]
        print(f"  {c['name']:<28} {r['avg']:.2f} {r['verdict']:<9} {r['trend']:<4} n={r['n']}")


if __name__ == '__main__':
    main()
