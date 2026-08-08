// Domain production đã chốt: barontft.vercel.app. NEXT_PUBLIC_SITE_URL cho phép
// đổi domain (vd khi có domain riêng) chỉ bằng biến môi trường, không sửa code.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://barontft.vercel.app';

/** true khi build này KHÔNG phải Vercel production — dùng để chặn index bản
 * preview (mỗi PR/branch có domain *-git-*.vercel.app riêng), tránh Google thấy
 * nhiều bản sao của cùng nội dung tự cạnh tranh nhau. Local dev (VERCEL_ENV
 * không tồn tại) cũng coi là non-production, an toàn hơn khi mặc định chặn. */
export const IS_PRODUCTION_DEPLOY = process.env.VERCEL_ENV === 'production';
