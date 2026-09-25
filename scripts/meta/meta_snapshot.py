"""Chụp và so sánh số liệu đội hình MetaTFT theo thời gian.

Lệnh:
  python meta_snapshot.py fetch [--patch current|18.3b] [--label 18.3b] [--with-d3]
      Lưu một lần chụp (~5 KB, 4 request) vào data/meta-snapshots/<YYYY-MM-DD_HHMM>_<patch>/ :
        meta.json                  thời điểm, nhãn patch, tổng mẫu, catalogRef (thư mục giữ danh mục)
        stats_<rank>_d1.json.gz    comps_stats thô (gzip), 24 giờ gần nhất; --with-d3 thêm lát 3 ngày
        catalog.json.gz            danh mục đội rút gọn (tên, tướng, đồ) — CHỈ lưu khi khác lần trước
  python meta_snapshot.py list
  python meta_snapshot.py compact     chuyển lần chụp định dạng cũ (JSON thô) sang định dạng nén
  python meta_snapshot.py compare [OLD] [NEW] [--rank emerald|diamond|master] [--window d1|d3]
      Mặc định: 2 lần chụp mới nhất, rank Lục Bảo+, lát 24 giờ (d1 — hai lần chụp cách nhau ≥ 1 ngày
      thì không trùng dữ liệu). Ghi báo cáo Markdown vào data/meta-snapshots/reports/.
  python meta_snapshot.py status [--every-hours 44]
      In JSON {mode: patch|regular|skip, ...} — routine dùng để quyết định có làm tiếp không.
      Bản vá lấy từ src/content/patch-notes-index.generated.ts (bản Live mới nhất đã lên /patch).
  python meta_snapshot.py impact [--report patch-tft18-3b]
      Tướng/tộc hệ được buff/nerf và các đội trong comps.json bị ảnh hưởng.

`days=N` của MetaTFT = N ngày gần nhất TRONG bản vá được chọn (kiểm 25/09/2026), nên có thể chụp
cả ngày cuối của bản vá cũ: `fetch --patch 18.3`.
"""
import argparse
import gzip
import hashlib
import json
import math
import re
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import rules  # noqa: E402

API = 'https://api-hc.metatft.com/tft-comps-api'
REPO = Path(__file__).resolve().parents[2]
ROOT = REPO / 'data' / 'meta-snapshots'
RANKS = {
    'emerald': ('Lục Bảo+', 'CHALLENGER,DIAMOND,EMERALD,GRANDMASTER,MASTER'),
    'diamond': ('Kim Cương+', 'CHALLENGER,DIAMOND,GRANDMASTER,MASTER'),
    'master': ('Cao Thủ+', 'CHALLENGER,GRANDMASTER,MASTER'),
}
WINDOWS = {'d1': 1, 'd3': 3}
CATALOG_KEYS = ('name_string', 'units_string', 'traits_string', 'builds')

# Ngưỡng phân loại khi so sánh
STRONG_AVG = 4.40        # coi là mạnh
TRAP_PICK = 1.5          # đội yếu mà tỉ lệ chọn ≥ mức này = bẫy phổ biến
MIN_N = 500              # dưới mức này chỉ ghi "theo dõi"
NEW_MAX_OLD_N = 300      # lần trước gần như không ai chơi
MIN_DELTA = 0.10         # thay đổi hạng TB tối thiểu để tính là mạnh lên/yếu đi
PICK_JUMP = 1.5          # tỉ lệ chọn tăng ≥ 1,5 điểm % => đang bị tranh nhanh
UA = {'User-Agent': 'Mozilla/5.0 (BaronTFT meta snapshot)'}


def get(path):
    with urllib.request.urlopen(urllib.request.Request(f'{API}/{path}', headers=UA), timeout=60) as r:
        return json.load(r)


def stats_url(patch, days, rank_filter, cluster_id):
    return (f'comps_stats?queue=1100&patch={patch}&days={days}&permit_filter_adjustment=true'
            f'&cluster_id={cluster_id}&rank={rank_filter}')


def total_of(payload):
    return next(x['places'][0] for x in payload['results'] if not x['cluster'])


def snapshots():
    return sorted(p for p in ROOT.iterdir() if (p / 'meta.json').exists()) if ROOT.exists() else []


def last_meta():
    snaps = snapshots()
    return json.loads((snaps[-1] / 'meta.json').read_text(encoding='utf-8')) if snaps else None


PATCH_INDEX = REPO / 'src/content/patch-notes-index.generated.ts'
PATCH_NOTES = REPO / 'src/content/patch-notes.generated.ts'


def ts_array(path):
    s = path.read_text(encoding='utf-8')
    return json.JSONDecoder().raw_decode(s[s.index('= [') + 2:])[0]


def repo_patch():
    """Bản vá Live mới nhất đã đưa lên /patch — vd ('18.3b', 'patch-tft18-3b').

    Không dò qua MetaTFT: API trả số liệu hiện tại cho cả nhãn không tồn tại (18.3c, 18.4),
    nên thử nhãn cho kết quả sai (kiểm 25/09/2026)."""
    for entry in ts_array(PATCH_INDEX):
        m = re.search(r'\(([\d.]+[a-z]?)\)', entry['version'])
        if entry['version'].startswith('Live') and m:
            return m.group(1), entry['id']
    return None, None


def write_gz(path, obj):
    path.write_bytes(gzip.compress(json.dumps(obj, ensure_ascii=False, separators=(',', ':')).encode('utf-8')))


def read_json(folder, stem):
    """Đọc <stem>.json.gz (định dạng mới) hoặc <stem>.json (lần chụp cũ chưa nén)."""
    gz = folder / f'{stem}.json.gz'
    if gz.exists():
        return json.loads(gzip.decompress(gz.read_bytes()))
    return json.loads((folder / f'{stem}.json').read_text(encoding='utf-8'))


def slim_catalog(comps_data):
    """Chỉ giữ thứ cần để đặt tên đội, ghép đội và lấy đồ carry — 278 KB → ~68 KB (~9 KB khi nén)."""
    details = comps_data['results']['data']['cluster_details']
    return {c: {k: v[k] for k in CATALOG_KEYS if k in v} for c, v in details.items()}


def catalog_hash(catalog):
    """Chỉ băm cấu trúc đội (tên + tướng). `builds` có số lượt dùng đổi liên tục nên không đưa vào,
    nếu không lần chụp nào cũng bị coi là danh mục mới."""
    shape = {c: (v.get('name_string'), v.get('units_string')) for c, v in catalog.items()}
    return hashlib.sha1(json.dumps(shape, sort_keys=True).encode('utf-8')).hexdigest()[:12]


def latest_catalog_ref():
    """(hash, thư mục đang giữ file catalog) của lần chụp gần nhất đã có catalog dạng mới."""
    for snap in reversed(snapshots()):
        meta = json.loads((snap / 'meta.json').read_text(encoding='utf-8'))
        if meta.get('catalogHash'):
            return meta['catalogHash'], meta['catalogRef']
    return None, None


def save_catalog(out, catalog):
    """Danh mục đội gần như không đổi giữa các ngày → trùng hash thì chỉ ghi tham chiếu, không lưu lại."""
    h = catalog_hash(catalog)
    prev_hash, prev_ref = latest_catalog_ref()
    if h == prev_hash:
        return h, prev_ref
    write_gz(out / 'catalog.json.gz', catalog)
    return h, out.name


def cmd_fetch(args):
    info = get('latest_cluster_info')['cluster_info']
    cid = info['cluster_id']
    patch = args.patch
    label = args.label
    label = label or (repo_patch()[0] if patch == 'current' else patch) or patch
    windows = WINDOWS if args.with_d3 else {'d1': WINDOWS['d1']}
    now = datetime.now()
    out = ROOT / f"{now:%Y-%m-%d_%H%M}_{label}"
    out.mkdir(parents=True, exist_ok=True)
    totals = {}
    for key, (_, rank_filter) in RANKS.items():
        for win, days in windows.items():
            payload = get(stats_url(patch, days, rank_filter, cid))
            write_gz(out / f'stats_{key}_{win}.json.gz', payload)
            totals[f'{key}_{win}'] = total_of(payload)
    catalog = slim_catalog(get(f'comps_data?queue=1100&patch={patch}&cluster_id={cid}'))
    h, ref = save_catalog(out, catalog)
    meta = {'fetchedAt': now.isoformat(timespec='seconds'), 'patch': label, 'patchParam': patch,
            'clusterId': cid, 'tftSet': info['tft_set'], 'totals': totals,
            'catalogHash': h, 'catalogRef': ref}
    (out / 'meta.json').write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding='utf-8')
    size = sum(f.stat().st_size for f in out.iterdir())
    print(f'Đã lưu {out.name}  (patch {label}, cluster {cid}, {size / 1024:.1f} KB'
          f"{', danh mục dùng lại từ ' + ref if ref != out.name else ''})")
    for k, v in totals.items():
        print(f'  {k:<12} {fmt_int(v):>10}')


def cmd_compact(_):
    """Chuyển các lần chụp cũ (JSON thô) sang định dạng nén + danh mục rút gọn dùng chung."""
    for snap in snapshots():
        meta_path = snap / 'meta.json'
        meta = json.loads(meta_path.read_text(encoding='utf-8'))
        for f in sorted(snap.glob('stats_*.json')):
            write_gz(snap / f'{f.name}.gz', json.loads(f.read_text(encoding='utf-8')))
            f.unlink()
        raw = snap / 'comps_data.json'
        if raw.exists():
            meta['catalogHash'], meta['catalogRef'] = save_catalog(snap, slim_catalog(
                json.loads(raw.read_text(encoding='utf-8'))))
            meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding='utf-8')
            raw.unlink()
        size = sum(f.stat().st_size for f in snap.iterdir())
        print(f'{snap.name:<32} {size / 1024:7.1f} KB  danh mục: {meta.get("catalogRef")}')


def cmd_status(args):
    """patch = repo vừa có bản vá Live mới hơn lần chụp gần nhất · regular = lần chụp trước đã đủ cũ ·
    skip = chưa cần làm gì. Chỉ gọi 1 request (latest_cluster_info)."""
    cid = get('latest_cluster_info')['cluster_info']['cluster_id']
    current, report_id = repo_patch()
    last = last_meta()
    hours = None
    if last:
        hours = round((datetime.now() - datetime.fromisoformat(last['fetchedAt'])).total_seconds() / 3600, 1)
    if last is None or (hours is not None and hours >= args.every_hours):
        mode = 'regular'
    else:
        mode = 'skip'
    if last and current and current != last['patch']:
        mode = 'patch'
    print(json.dumps({'mode': mode, 'currentPatch': current, 'patchReportId': report_id,
                      'lastPatch': last and last['patch'], 'lastSnapshotHours': hours,
                      'clusterId': cid, 'clusterChanged': bool(last) and last['clusterId'] != cid},
                     ensure_ascii=False))


def cmd_impact(args):
    """Tướng/tộc hệ được buff, nerf trong bản vá (lấy từ /patch của repo) và đội nào trong comps.json bị đụng."""
    patch_id = args.report or repo_patch()[1]
    report = next(r for r in ts_array(PATCH_NOTES) if r['id'] == patch_id)
    comps = json.loads((Path(__file__).resolve().parent / 'comps.json').read_text(encoding='utf-8'))['comps']
    changes = {}
    for e in report.get('entries', []):
        eid, kind = e.get('entityId') or '', e.get('kind')
        if kind in ('buff', 'nerf') and eid.startswith(('champion:', 'trait:')):
            changes.setdefault(eid, set()).add(kind)
    def champ_key(name):
        return 'champion:tft18_' + re.sub(r"[^a-z]", '', name.lower().replace('the elder dragon', 'elderdragon'))
    out = []
    for c in comps:
        carries = {champ_key(n) for n in c['carries']}
        units = {champ_key(n) for n in c.get('units', [])}
        hits = []
        for eid, kinds in changes.items():
            role = 'carry' if eid in carries else 'unit' if eid in units else None
            if role:
                hits.append({'entity': eid, 'kinds': sorted(kinds), 'role': role})
        if hits:
            out.append({'id': c['id'], 'name': c['name'], 'hits': hits})
    print(json.dumps({'patch': report['version'], 'changes': {k: sorted(v) for k, v in changes.items()},
                      'affectedComps': out}, ensure_ascii=False, indent=2))


def cmd_list(_):
    for p in snapshots():
        m = json.loads((p / 'meta.json').read_text())
        print(f"{p.name:<32} patch {m['patch']:<7} Lục Bảo+ 24h: {fmt_int(m['totals']['emerald_d1']):>9}")


def load(snap, rank, window):
    payload = read_json(snap, f'stats_{rank}_{window}')
    total = total_of(payload)
    out = {}
    for row in payload['results']:
        if not row['cluster']:
            continue
        p = row['places']
        n = p[8]
        out[row['cluster']] = {
            'n': n, 'avg': sum((i + 1) * p[i] for i in range(8)) / n,
            'top4': sum(p[:4]) / n * 100, 'win': p[0] / n * 100, 'pick': n / total * 100,
        }
    meta = json.loads((snap / 'meta.json').read_text(encoding='utf-8'))
    catalog = read_json(ROOT / meta['catalogRef'], 'catalog')
    return out, catalog, total


SITE_TRAITS = REPO / 'src/content/set18/set18-traits.ts'
UNIT_ALIAS = {'KhaZix': "Kha'Zix", 'MasterYi': 'Master Yi', 'KogMaw': "Kog'Maw", 'RekSai': "Rek'Sai",
              'ElderDragon': 'Elder Dragon', 'Sentinel': 'Ancient Sentinel', 'Sentry': 'Pebbles',
              'GnarSmall': 'Gnar', 'CrimsonRaptor': 'Raptor'}


def trait_names():
    """Tên tộc/hệ tiếng Việt từ dữ liệu web (Adaptor -> Thích Ứng); thiếu file thì giữ tên gốc."""
    try:
        s = SITE_TRAITS.read_text(encoding='utf-8')
        data = json.JSONDecoder().raw_decode(s[s.index('= [') + 2:])[0]
        return {t['name'].replace(' ', ''): t['vi'] for t in data}
    except (OSError, ValueError):
        return {}


TRAIT_VI = trait_names()


def pretty_name(info):
    """'DA_18_Invoker, DA_18_Morgana' -> 'Thuật Sĩ · Morgana'."""
    parts = []
    for token in (info.get('name_string') or '').split(','):
        t = re.sub(r'^DA_(18_)?', '', token.strip())
        t = re.sub(r'_(AD|AP)$', '', t).replace('18', '')
        parts.append(TRAIT_VI.get(t) or UNIT_ALIAS.get(t, t))
    return ' · '.join(p for p in parts if p) or '?'


def units(info):
    return {re.sub(r'^DA_(18_)?|18', '', u.strip()) for u in (info.get('units_string') or '').split(',') if u.strip()}


def match_clusters(old_cat, new_cat, same_set):
    """Cùng bộ cluster thì ghép theo id; khác bộ (MetaTFT phân cụm lại) thì ghép theo độ trùng tướng."""
    if same_set:
        return {c: c for c in new_cat if c in old_cat}
    mapping = {}
    for c, info in new_cat.items():
        best, score = None, 0.0
        for oc, oinfo in old_cat.items():
            a, b = units(info), units(oinfo)
            s = len(a & b) / len(a | b) if a | b else 0
            if s > score:
                best, score = oc, s
        if score >= 0.6:
            mapping[c] = best
    return mapping


def significant(a, b):
    return rules.significant_change(a, b)


def fmt(v, d=2):
    return f'{v:.{d}f}'.replace('.', ',')


def fmt_int(v):
    return f'{v:,}'.replace(',', '.')


def cmd_compare(args):
    snaps = snapshots()
    if len(snaps) < 2 and not (args.old and args.new):
        sys.exit('Cần ít nhất 2 lần chụp (chạy fetch trước).')
    pick = lambda name, default: next((p for p in snaps if p.name.startswith(name)), None) if name else default
    old_dir, new_dir = pick(args.old, snaps[-2]), pick(args.new, snaps[-1])
    old_meta, new_meta = (json.loads((d / 'meta.json').read_text()) for d in (old_dir, new_dir))
    old, old_cat, _ = load(old_dir, args.rank, args.window)
    new, new_cat, new_total = load(new_dir, args.rank, args.window)
    mapping = match_clusters(old_cat, new_cat, old_meta['clusterId'] == new_meta['clusterId'])

    rows = []
    for c, s in new.items():
        if c not in new_cat:
            continue
        o = old.get(mapping.get(c, ''), None)
        rows.append({'id': c, 'name': pretty_name(new_cat[c]), 'new': s, 'old': o})

    groups = {k: [] for k in ('new', 'up', 'stable', 'contested', 'down', 'trap', 'watch')}
    for r in rows:
        s, o = r['new'], r['old']
        if s['n'] < MIN_N:
            if s['avg'] <= STRONG_AVG and s['n'] >= 150:
                groups['watch'].append(r)
            continue
        if o is None or o['n'] < NEW_MAX_OLD_N:
            if s['avg'] <= 4.50:
                groups['new'].append(r)
            continue
        delta = s['avg'] - o['avg']
        if s['pick'] - o['pick'] >= PICK_JUMP:
            groups['contested'].append(r)
        if delta <= -MIN_DELTA and significant(o, s) and s['avg'] <= STRONG_AVG + 0.05:
            groups['up'].append(r)
        elif delta >= MIN_DELTA and significant(o, s) and s['avg'] >= 4.45:
            # Chỉ đội vừa TỤT mới đáng báo — đội vốn yếu từ trước thì chẳng ai định chơi.
            groups['down'].append(r)
        elif s['avg'] <= STRONG_AVG and o['avg'] <= STRONG_AVG:
            groups['stable'].append(r)
        elif s['avg'] > 4.60 and s['pick'] >= TRAP_PICK:
            groups['trap'].append(r)

    label = RANKS[args.rank][0]
    win = '24 giờ gần nhất' if args.window == 'd1' else '3 ngày gần nhất'
    lines = [
        f"# So sánh đội hình {label}: {old_dir.name} → {new_dir.name}",
        '',
        f"> Nguồn MetaTFT, lát {win} của mỗi lần chụp. Bản vá: {old_meta['patch']} → {new_meta['patch']}. "
        f"Mẫu mới: {fmt_int(new_total)} đội hình.",
        f"> Hạng TB càng thấp càng tốt. Thay đổi chỉ tính khi ≥ {fmt(MIN_DELTA)} hạng **và** vượt nhiễu thống kê (2 sai số chuẩn).",
        '',
    ]

    def table(title, note, items, sort_key):
        lines.append(f'## {title} ({len(items)})')
        lines.append('')
        lines.append(note)
        lines.append('')
        if not items:
            lines.append('_Không có._')
            lines.append('')
            return
        lines.append('| Đội (MetaTFT) | Mã cụm | Hạng TB | Trước | Δ | Top 4 | Top 1 | Tỉ lệ chọn | Số trận |')
        lines.append('|---|---|---|---|---|---|---|---|---|')
        for r in sorted(items, key=sort_key):
            s, o = r['new'], r['old']
            prev = fmt(o['avg']) if o else '—'
            d = f"{'+' if s['avg'] >= o['avg'] else ''}{fmt(s['avg'] - o['avg'])}" if o else 'mới'
            pk = f"{fmt(o['pick'], 1)} → {fmt(s['pick'], 1)}%" if o else f"{fmt(s['pick'], 1)}%"
            lines.append(f"| {r['name']} | `{r['id']}` | **{fmt(s['avg'])}** | {prev} | {d} | {fmt(s['top4'], 1)}% | "
                         f"{fmt(s['win'], 1)}% | {pk} | {fmt_int(s['n'])} |")
        lines.append('')

    by_avg = lambda r: r['new']['avg']
    table('🆕 Mới nổi', 'Lần trước gần như không ai chơi (< 300 trận), giờ đủ mẫu và hạng TB ≤ 4,50.', groups['new'], by_avg)
    table('⬆️ Mạnh lên rõ', 'Hạng TB tốt lên có ý nghĩa và đang ở mức mạnh.', groups['up'], by_avg)
    table('✅ Mạnh ổn định', f'Cả hai lần đều ≤ {fmt(STRONG_AVG)}. Vẫn là lựa chọn an toàn.', groups['stable'], by_avg)
    table('⚠️ Đang bị tranh nhanh', f'Tỉ lệ chọn tăng ≥ {fmt(PICK_JUMP, 1)} điểm %. Dễ đụng người cùng đội.',
          groups['contested'], lambda r: -(r['new']['pick'] - r['old']['pick']))
    table('⬇️ Tụt hạng — nên né', 'Hạng TB tệ đi có ý nghĩa và giờ ở mức ≥ 4,45.', groups['down'],
          lambda r: -(r['new']['avg'] - r['old']['avg']))
    table('🪤 Bẫy phổ biến', f'Hạng TB tệ hơn 4,60 nhưng vẫn ≥ {fmt(TRAP_PICK, 1)}% người chơi. Đừng chơi theo đám đông.',
          groups['trap'], lambda r: -r['new']['pick'])
    table('👀 Theo dõi (mẫu nhỏ)', f'Số đẹp nhưng dưới {MIN_N} trận. Chưa đủ tin, chỉ để ý.', groups['watch'], by_avg)

    report_dir = ROOT / 'reports'
    report_dir.mkdir(parents=True, exist_ok=True)
    dest = report_dir / f'{old_dir.name}__vs__{new_dir.name}_{args.rank}_{args.window}.md'
    dest.write_text('\n'.join(lines), encoding='utf-8')
    print('\n'.join(lines))
    print(f'\nĐã ghi {dest}')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    f = sub.add_parser('fetch')
    f.add_argument('--patch', default='current')
    f.add_argument('--label', help='Nhãn bản vá để đặt tên thư mục (mặc định tự dò)')
    f.add_argument('--with-d3', action='store_true', help='Lấy thêm lát 3 ngày (mặc định chỉ 24 giờ)')
    sub.add_parser('list')
    sub.add_parser('compact')
    st = sub.add_parser('status')
    st.add_argument('--every-hours', type=float, default=44, help='Chế độ regular khi lần chụp trước cũ hơn mức này')
    im = sub.add_parser('impact')
    im.add_argument('--report', help='id bản vá trong patch-notes (mặc định bản Live mới nhất)')
    c = sub.add_parser('compare')
    c.add_argument('old', nargs='?', help='Tiền tố tên thư mục lần chụp cũ')
    c.add_argument('new', nargs='?', help='Tiền tố tên thư mục lần chụp mới')
    c.add_argument('--rank', default='emerald', choices=RANKS)
    c.add_argument('--window', default='d1', choices=WINDOWS)
    args = ap.parse_args()
    {'fetch': cmd_fetch, 'list': cmd_list, 'compare': cmd_compare, 'compact': cmd_compact, 'status': cmd_status, 'impact': cmd_impact}[args.cmd](args)


if __name__ == '__main__':
    main()
