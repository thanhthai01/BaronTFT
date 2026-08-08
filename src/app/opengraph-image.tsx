import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Bắt buộc dùng font TTF nhúng thủ công (Be Vietnam Pro — có subset Vietnamese):
// next/og build trên Satori, chỉ tự nạp được font khi có sẵn buffer, không tự
// suy ra được font hệ thống hay font Google Fonts đã load qua next/font — nếu bỏ
// qua bước này, mọi dấu tiếng Việt trong ảnh OG sẽ vỡ (mất dấu hoặc ô vuông).
async function loadFont(weight: 'Regular' | 'Bold') {
  const path = join(process.cwd(), 'src', 'assets', 'fonts', `BeVietnamPro-${weight}.ttf`);
  return readFile(path);
}

export default async function OpengraphImage() {
  const [regular, bold] = await Promise.all([loadFont('Regular'), loadFont('Bold')]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#141413',
          fontFamily: 'Be Vietnam Pro',
        }}
      >
        <span style={{ color: '#87867F', fontSize: 28, letterSpacing: 4, textTransform: 'uppercase' }}>
          Baron TFT
        </span>
        <span style={{ color: '#FAF9F5', fontSize: 64, fontWeight: 700, marginTop: 24, lineHeight: 1.15 }}>
          Ghi lại kiến thức cơ bản mình học được khi chơi TFT
        </span>
        <span style={{ color: '#D1CFC5', fontSize: 30, marginTop: 32 }}>
          Kiến thức nền tảng · Mùa 18 · Checklist · Patch
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Be Vietnam Pro', data: regular, weight: 400, style: 'normal' },
        { name: 'Be Vietnam Pro', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );
}
