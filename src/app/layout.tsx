import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Epilogue, JetBrains_Mono, Libre_Franklin } from 'next/font/google';
import type { ReactNode } from 'react';
import { CommandPaletteProvider } from '@/components/features/command-palette/CommandPaletteProvider';
import { BackToTop } from '@/components/layout/BackToTop';
import { NavBubbleLoader } from '@/components/layout/NavBubble';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SITE_URL, IS_PRODUCTION_DEPLOY } from '@/lib/site';
import '@/styles/globals.css';
import '@/styles/prose.css';

const epilogue = Epilogue({ subsets: ['latin', 'latin-ext'], variable: '--font-epilogue', display: 'swap' });
const libreFranklin = Libre_Franklin({ subsets: ['latin', 'latin-ext'], variable: '--font-libre-franklin', display: 'swap' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-jetbrains-mono', display: 'swap' });

const SITE_TITLE = 'Baron TFT — Phòng huấn luyện quyết định TFT';
const SITE_DESCRIPTION = 'Giáo trình TFT tiếng Việt giúp người chơi luyện kỹ năng xuyên mùa: chọn đúng bài cần học, đọc tín hiệu trong trận và sửa một hành vi sau trận.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s · Baron TFT',
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: '/favicon.png',
  },
  alternates: { canonical: '/' },
  robots: IS_PRODUCTION_DEPLOY ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Baron TFT',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// KHÔNG kèm `potentialAction: SearchAction` — schema đó đòi hỏi 1 URL mẫu
// (vd /search?q={query}) thực sự trả kết quả. Site chỉ có command palette phía
// client (Ctrl+K), không có trang kết quả tìm kiếm server-rendered nào để trỏ
// tới; khai báo SearchAction giả sẽ là structured data sai, Search Console sẽ
// gắn cờ lỗi.
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Baron TFT',
  url: SITE_URL,
  inLanguage: 'vi-VN',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className={`${epilogue.variable} ${libreFranklin.variable} ${jetBrainsMono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} type="application/ld+json" />
        <CommandPaletteProvider>
          <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
          <SiteHeader />
          <main className="main-shell" id="main-content">
            {children}
          </main>
          <SiteFooter />
          <BackToTop />
          <NavBubbleLoader />
        </CommandPaletteProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
