import { describe, expect, it } from 'vitest';
import { metaComps, metaCompsSnapshot } from '../../src/content/meta-comps';
import {
  buildMetaMatrix,
  formatViDecimal,
  formatViInteger,
  MATRIX_COSTS,
} from '../../src/components/features/meta-matrix/meta-matrix-model';

const VERDICT_ORDER = { meta: 0, predicted: 1, viable: 2, avoid: 3 } as const;

describe('meta-matrix-model · buildMetaMatrix', () => {
  const matrix = buildMetaMatrix(metaComps, 'emerald');

  it('trả về đúng 5 hàng theo giá vàng, xếp từ 5 xuống 1', () => {
    expect(matrix).toHaveLength(5);
    expect(matrix.map((row) => row.cost)).toEqual([...MATRIX_COSTS]);
    expect(matrix.map((row) => row.cost)).toEqual([5, 4, 3, 2, 1]);
  });

  it('mỗi comp trong metaComps xuất hiện đúng 1 lần trong ma trận', () => {
    const seen = matrix.flatMap((row) => [...row.ap.comps, ...row.ad.comps]);
    expect(seen).toHaveLength(metaComps.length);
    const ids = new Set(seen.map((comp) => comp.id));
    expect(ids.size).toBe(metaComps.length);
  });

  it('đặt comp vào đúng ô cost/damage', () => {
    for (const row of matrix) {
      for (const comp of row.ap.comps) {
        expect(comp.cost).toBe(row.cost);
        expect(comp.damage).toBe('AP');
      }
      for (const comp of row.ad.comps) {
        expect(comp.cost).toBe(row.cost);
        expect(comp.damage).toBe('AD');
      }
    }
  });

  it('sắp xếp trong ô theo verdict Lục Bảo+ (meta trước avoid) rồi avg tăng dần', () => {
    for (const row of matrix) {
      for (const cell of [row.ap, row.ad]) {
        for (let i = 1; i < cell.comps.length; i += 1) {
          const prev = cell.comps[i - 1];
          const curr = cell.comps[i];
          const prevRank = VERDICT_ORDER[prev.ranks.emerald.verdict];
          const currRank = VERDICT_ORDER[curr.ranks.emerald.verdict];
          if (prevRank === currRank) {
            expect(prev.ranks.emerald.avg).toBeLessThanOrEqual(curr.ranks.emerald.avg);
          } else {
            expect(prevRank).toBeLessThan(currRank);
          }
        }
      }
    }
  });

  it('ô 1 vàng AD rỗng (không có đội AD giá 1 trong dữ liệu hiện tại)', () => {
    const row1 = matrix.find((r) => r.cost === 1);
    expect(row1?.ad.comps).toEqual([]);
    expect(row1?.ap.comps.length).toBeGreaterThan(0);
  });
});

describe('meta-matrix-model · buildMetaMatrix theo từng rank', () => {
  it('thứ tự xếp trong ô khác nhau giữa các rank khi verdict khác nhau (Kha\'Zix Hecarim)', () => {
    // Kha'Zix Hecarim (3 vàng, AP): viable ở Lục Bảo+ nhưng meta ở Cao Thủ+ —
    // thứ tự trong ô 3 vàng/AP phải khác nhau giữa 2 rank này.
    const emeraldRow3 = buildMetaMatrix(metaComps, 'emerald').find((r) => r.cost === 3);
    const masterRow3 = buildMetaMatrix(metaComps, 'master').find((r) => r.cost === 3);

    const comp = metaComps.find((c) => c.id === 'khazix-hecarim');
    expect(comp?.ranks.emerald.verdict).toBe('viable');
    expect(comp?.ranks.master.verdict).toBe('meta');

    const emeraldIds = emeraldRow3?.ap.comps.map((c) => c.id) ?? [];
    const masterIds = masterRow3?.ap.comps.map((c) => c.id) ?? [];
    expect(emeraldIds).not.toEqual(masterIds);

    const emeraldIndex = emeraldIds.indexOf('khazix-hecarim');
    const masterIndex = masterIds.indexOf('khazix-hecarim');
    expect(emeraldIndex).toBeGreaterThan(-1);
    expect(masterIndex).toBeGreaterThan(-1);
    // Ở Cao Thủ+, Kha'Zix Hecarim là meta nên phải đứng trước các đội viable/avoid
    // cùng ô — chỉ số của nó trong danh sách sắp xếp phải thấp hơn (hoặc bằng, nếu
    // toàn bộ ô đều meta) so với ở Lục Bảo+.
    expect(masterIndex).toBeLessThanOrEqual(emeraldIndex);
  });

  it('mỗi rank vẫn giữ đủ 5 hàng 5→1 và đúng số comp', () => {
    for (const rankKey of ['emerald', 'diamond', 'master'] as const) {
      const matrix = buildMetaMatrix(metaComps, rankKey);
      expect(matrix.map((row) => row.cost)).toEqual([5, 4, 3, 2, 1]);
      const seen = matrix.flatMap((row) => [...row.ap.comps, ...row.ad.comps]);
      expect(seen).toHaveLength(metaComps.length);
    }
  });
});

describe('meta-matrix-model · format số kiểu Việt Nam', () => {
  it('formatViDecimal dùng dấu phẩy thay dấu chấm', () => {
    expect(formatViDecimal(4.21)).toBe('4,21');
    expect(formatViDecimal(55.4, 1)).toBe('55,4');
    expect(formatViDecimal(4.6)).toBe('4,60');
  });

  it('formatViInteger chấm phân cách hàng nghìn', () => {
    expect(formatViInteger(53296)).toBe('53.296');
    expect(formatViInteger(522)).toBe('522');
  });

  it('sampleSize của từng rank trong snapshot format đúng theo vi-VN', () => {
    const emerald = metaCompsSnapshot.ranks.find((r) => r.key === 'emerald');
    expect(emerald).toBeDefined();
    expect(formatViInteger(emerald!.sampleSize)).toBe('462.360');
  });
});
