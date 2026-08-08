import { patchReports } from '@/content/patch-notes';

/** Bản vá gần nhất có nhắc tới một entity codex cụ thể (tướng/tộc hệ/nâng
 * cấp/Tinh Linh), dùng cho dải "Bản vá gần nhất" ở trang chi tiết entity —
 * chiều ngược của link patch → codex đã có ở PatchBoard. `patchReports` luôn
 * xếp mới nhất trước (`patchReports[0]` = mới nhất, xem patch-notes.ts), nên
 * chỉ cần lấy kết quả `find` đầu tiên, không cần so `reportOrder`. */
export function findLatestPatchForEntity(entityId: string) {
  for (const report of patchReports) {
    const entry = report.entries.find((item) => item.entityId === entityId);
    if (entry) return { report, entry };
  }
  return null;
}
