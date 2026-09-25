import { describe, expect, it } from 'vitest';
import {
  metaComps,
  metaCompsSnapshot,
  type MetaComp,
  type MetaCompRankKey,
  type MetaCompRankStats,
  type MetaCompVerdict,
} from '../../src/content/meta-comps';
import {
  buildMetaMatrix,
  formatViDecimal,
  formatViInteger,
  MATRIX_COSTS,
} from '../../src/components/features/meta-matrix/meta-matrix-model';

/* Test quy tắc bằng dữ liệu giả lập, KHÔNG bằng số liệu thật: meta-comps.ts được sinh lại
   sau mỗi lần cập nhật meta, nên test gắn vào một đội cụ thể sẽ vỡ mỗi lần dữ liệu đổi. */

const VERDICT_ORDER: Record<MetaCompVerdict, number> = { meta: 0, predicted: 1, viable: 2, avoid: 3 };
const RANK_KEYS: MetaCompRankKey[] = ['emerald', 'diamond', 'master'];

function stats(verdict: MetaCompVerdict, avg: number): MetaCompRankStats {
  return {
    n: 5000,
    avg,
    top4: 50,
    win: 12.5,
    pick: 1,
    prevAvg: avg,
    verdict,
    trend: 'flat',
    falling: false,
    contestPick: 1,
    contested: false,
    shapes: [],
  };
}

function comp(
  id: string,
  cost: number,
  damage: 'AP' | 'AD',
  byRank: Partial<Record<MetaCompRankKey, [MetaCompVerdict, number]>>,
): MetaComp {
  const fallback: [MetaCompVerdict, number] = byRank.emerald ?? ['viable', 4.5];
  const ranks = Object.fromEntries(
    RANK_KEYS.map((key) => [key, stats(...(byRank[key] ?? fallback))]),
  ) as Record<MetaCompRankKey, MetaCompRankStats>;
  return { id, name: id, damage, cost, playstyle: 'Fast 8', carries: [], units: [], ranks, note: '' };
}

const fixture: MetaComp[] = [
  comp('ap3-viable', 3, 'AP', { emerald: ['viable', 4.43], master: ['meta', 4.3] }),
  comp('ap3-meta', 3, 'AP', { emerald: ['meta', 4.39], master: ['meta', 4.35] }),
  comp('ap3-avoid', 3, 'AP', { emerald: ['avoid', 4.8] }),
  comp('ap3-meta-better', 3, 'AP', { emerald: ['meta', 4.2] }),
  comp('ad5', 5, 'AD', { emerald: ['meta', 4.35] }),
  comp('ap1', 1, 'AP', { emerald: ['meta', 4.21] }),
];

describe('buildMetaMatrix', () => {
  const matrix = buildMetaMatrix(fixture, 'emerald');

  it('luôn có 5 hàng, xếp 5 → 1 vàng', () => {
    expect(matrix.map((row) => row.cost)).toEqual([...MATRIX_COSTS]);
    expect([...MATRIX_COSTS]).toEqual([5, 4, 3, 2, 1]);
  });

  it('mỗi đội xuất hiện đúng 1 lần, đúng ô giá × AP/AD', () => {
    const seen = matrix.flatMap((row) => [...row.ap.comps, ...row.ad.comps]);
    expect(seen.map((c) => c.id).sort()).toEqual(fixture.map((c) => c.id).sort());
    for (const row of matrix) {
      row.ap.comps.forEach((c) => expect([c.cost, c.damage]).toEqual([row.cost, 'AP']));
      row.ad.comps.forEach((c) => expect([c.cost, c.damage]).toEqual([row.cost, 'AD']));
    }
  });

  it('ô không có đội thì rỗng (UI hiện "Chưa có đội đủ mạnh")', () => {
    expect(matrix.find((row) => row.cost === 1)?.ad.comps).toEqual([]);
    expect(matrix.find((row) => row.cost === 2)?.ap.comps).toEqual([]);
  });

  it('trong ô: xếp theo ký hiệu (★ → ◆ → ○ → ✕) rồi hạng TB tăng dần', () => {
    const ids = matrix.find((row) => row.cost === 3)?.ap.comps.map((c) => c.id);
    expect(ids).toEqual(['ap3-meta-better', 'ap3-meta', 'ap3-viable', 'ap3-avoid']);
  });

  it('thứ tự đổi theo rank đang chọn', () => {
    const master = buildMetaMatrix(fixture, 'master').find((row) => row.cost === 3)?.ap.comps.map((c) => c.id);
    expect(master?.indexOf('ap3-viable')).toBeLessThan(master?.indexOf('ap3-meta') ?? -1);
  });
});

describe('dữ liệu sinh ra (meta-comps.ts) đúng hợp đồng', () => {
  it('mỗi đội có đủ 3 rank, ký hiệu hợp lệ và số liệu trong khoảng hợp lý', () => {
    expect(metaComps.length).toBeGreaterThan(0);
    for (const c of metaComps) {
      expect(c.cost).toBeGreaterThanOrEqual(1);
      expect(c.cost).toBeLessThanOrEqual(5);
      expect(c.carries.length).toBeGreaterThan(0);
      for (const key of RANK_KEYS) {
        const r = c.ranks[key];
        expect(Object.keys(VERDICT_ORDER)).toContain(r.verdict);
        expect(r.avg).toBeGreaterThanOrEqual(1);
        expect(r.avg).toBeLessThanOrEqual(8);
        expect(r.contested).toBe(r.contestPick >= metaCompsSnapshot.thresholds.contestedPick);
        expect(r.contestPick).toBeGreaterThanOrEqual(r.pick);
      }
    }
  });

  it('id đội không trùng', () => {
    expect(new Set(metaComps.map((c) => c.id)).size).toBe(metaComps.length);
  });

  it('snapshot có đủ 3 rank và rank mặc định nằm trong đó', () => {
    const keys = metaCompsSnapshot.ranks.map((r) => r.key);
    expect(keys).toEqual(RANK_KEYS);
    expect(keys).toContain(metaCompsSnapshot.defaultRank);
  });
});

describe('format số kiểu Việt Nam', () => {
  it('formatViDecimal giữ đủ chữ số lẻ, dùng dấu phẩy', () => {
    expect(formatViDecimal(4.21)).toBe('4,21');
    expect(formatViDecimal(4.6)).toBe('4,60');
    expect(formatViDecimal(55.4, 1)).toBe('55,4');
  });

  it('formatViInteger dùng dấu chấm phân cách hàng nghìn', () => {
    expect(formatViInteger(462360)).toBe('462.360');
    expect(formatViInteger(522)).toBe('522');
  });
});
