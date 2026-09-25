// Gom `metaComps` (nguồn: src/content/meta-comps.ts, KHÔNG sửa) thành ma trận
// 2 cột (AP/AD) x 5 hàng (giá vàng carry 1-5) cho trang /doi-hinh-meta.

import type { MetaComp, MetaCompDamage, MetaCompRankKey, MetaCompVerdict } from '@/content/meta-comps';

/** Thứ tự hàng trong ma trận: 5 vàng ở trên cùng, xuống dần đến 1 vàng. */
export const MATRIX_COSTS = [5, 4, 3, 2, 1] as const;
export const MATRIX_DAMAGE: MetaCompDamage[] = ['AP', 'AD'];

/** Thứ tự xếp trong 1 ô: meta trước, avoid xuống cuối. */
const VERDICT_ORDER: Record<MetaCompVerdict, number> = {
  meta: 0,
  predicted: 1,
  viable: 2,
  avoid: 3,
};

export type MetaMatrixCell = {
  cost: number;
  damage: MetaCompDamage;
  comps: MetaComp[];
};

export type MetaMatrixRow = {
  cost: number;
  ap: MetaMatrixCell;
  ad: MetaMatrixCell;
};

/** So sánh 2 comp trong cùng 1 ô, theo số liệu của `rankKey` đang chọn:
 * verdict trước (meta > predicted > viable > avoid), rồi tới avg tăng dần
 * (avg thấp = hạng tốt hơn). */
function compareComps(a: MetaComp, b: MetaComp, rankKey: MetaCompRankKey): number {
  const verdictDiff = VERDICT_ORDER[a.ranks[rankKey].verdict] - VERDICT_ORDER[b.ranks[rankKey].verdict];
  if (verdictDiff !== 0) return verdictDiff;
  return a.ranks[rankKey].avg - b.ranks[rankKey].avg;
}

/** Dựng ma trận 5 hàng (giá vàng, 5→1) x 2 cột (AP/AD) từ danh sách comp
 * phẳng, xếp loại/sắp xếp theo số liệu của `rankKey`. Ô nào không có comp
 * nào vẫn xuất hiện (comps: []) để trang render "Chưa có đội đủ mạnh" thay
 * vì thiếu ô. */
export function buildMetaMatrix(comps: MetaComp[], rankKey: MetaCompRankKey): MetaMatrixRow[] {
  return MATRIX_COSTS.map((cost) => {
    const forCost = comps.filter((comp) => comp.cost === cost);
    const buildCell = (damage: MetaCompDamage): MetaMatrixCell => ({
      cost,
      damage,
      comps: forCost.filter((comp) => comp.damage === damage).sort((a, b) => compareComps(a, b, rankKey)),
    });
    return { cost, ap: buildCell('AP'), ad: buildCell('AD') };
  });
}

/** Số thập phân kiểu Việt Nam: dấu phẩy thay dấu chấm, giữ đủ số chữ số lẻ
 * (avg luôn x,xx — 4,60 chứ không 4,6 — để cột số thẳng hàng; pick/top4/win x,x%). Không dùng
 * Intl.NumberFormat để tránh phụ thuộc locale data khi build server. */
export function formatViDecimal(value: number, fractionDigits = 2): string {
  return value.toFixed(fractionDigits).replace('.', ',');
}

/** Số nguyên lớn kiểu Việt Nam: chấm phân cách hàng nghìn (vd 53.296). */
export function formatViInteger(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
