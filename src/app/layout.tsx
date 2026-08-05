import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Epilogue, JetBrains_Mono, Libre_Franklin } from 'next/font/google';
import type { ReactNode } from 'react';
import { CommandPaletteProvider } from '@/components/features/command-palette/CommandPaletteProvider';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import '@/styles/globals.css';
import '@/styles/prose.css';

const epilogue = Epilogue({ subsets: ['latin', 'latin-ext'], variable: '--font-epilogue', display: 'swap' });
const libreFranklin = Libre_Franklin({ subsets: ['latin', 'latin-ext'], variable: '--font-libre-franklin', display: 'swap' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-jetbrains-mono', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Baron TFT — Evergreen Rank Manual',
    template: '%s · Baron TFT',
  },
  description: 'Blog cá nhân bằng tiếng Việt ghi lại kiến thức cơ bản về Teamfight Tactics: kiến thức nền tảng, checklist trong trận, dữ liệu Mùa 18 và patch note.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className={`${epilogue.variable} ${libreFranklin.variable} ${jetBrainsMono.variable}`}>
      <body>
        <CommandPaletteProvider>
          <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
          <SiteHeader />
          <main className="main-shell" id="main-content">
            {children}
          </main>
          <SiteFooter />
          <MobileNavigation />
        </CommandPaletteProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
