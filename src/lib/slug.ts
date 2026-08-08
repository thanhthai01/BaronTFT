/**
 * `String.prototype.normalize('NFD')` không tách được "đ"/"Đ" (chúng không có
 * dạng tổ hợp Unicode) — phải thay tay trước khi bỏ dấu, nếu không slug tiếng
 * Việt có "đ" sẽ giữ nguyên ký tự này thay vì đổi thành "d".
 */
export function foldDiacritics(value: string): string {
  return value
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function toSlug(value: string): string {
  return foldDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
