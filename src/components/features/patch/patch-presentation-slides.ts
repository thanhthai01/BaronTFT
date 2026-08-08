import {
  patchCategoryReadingOrder,
  type PatchCategory,
  type PatchContentOrigin,
  type PatchEntry,
  type PatchImpact,
  type PatchReport,
  type PatchSource,
} from '@/content/patch-notes';

export type PatchSlide =
  | { kind: 'cover'; version: string; title: string; dateVi: string; author: string; source?: PatchSource }
  | { kind: 'summary'; summaryVi: string; summaryOrigin: PatchContentOrigin }
  | { kind: 'rhythm'; lines: string[] }
  | { kind: 'category'; category: PatchCategory; entries: PatchEntry[] }
  | { kind: 'impact'; impact: PatchImpact }
  | { kind: 'outro'; url: string };

/** Dựng bộ slide trực tiếp từ dữ liệu bản vá đã có — không cần soạn thêm nội
 * dung riêng cho việc trình chiếu. `url` truyền vào thay vì tự suy từ
 * `report.id` vì bản mới nhất có URL canonical là `/patch`, không phải
 * `/patch/<id-của-chính-nó>` (xem app/patch/[version]/page.tsx::redirect). */
export function buildPatchSlides(report: PatchReport, url: string): PatchSlide[] {
  const slides: PatchSlide[] = [
    { kind: 'cover', version: report.version, title: report.title, dateVi: report.dateVi, author: report.author, source: report.source },
    { kind: 'summary', summaryVi: report.summaryVi, summaryOrigin: report.summaryOrigin ?? 'official' },
  ];

  if (report.rhythmVi?.length) {
    slides.push({ kind: 'rhythm', lines: report.rhythmVi });
  }

  for (const category of patchCategoryReadingOrder) {
    const entries = report.entries.filter((entry) => entry.category === category);
    if (entries.length) slides.push({ kind: 'category', category, entries });
  }

  for (const impact of report.impacts ?? []) {
    slides.push({ kind: 'impact', impact });
  }

  slides.push({ kind: 'outro', url });
  return slides;
}
