import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { PatchBoard } from '@/components/features/patch/PatchBoard';
import { patchReports } from '@/content/patch-notes';
import styles from '../page.module.css';

// Bản mới nhất (patchReports[0]) không có trang riêng ở đây — nó đã có URL
// canonical là /patch. Không sinh static param cho nó để tránh 2 URL cùng
// serve một nội dung (route.tsx bên dưới redirect nếu ai gõ tay URL đó).
export function generateStaticParams() {
  return patchReports.slice(1).map((report) => ({ version: report.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ version: string }> }): Promise<Metadata> {
  const { version } = await params;
  const report = patchReports.find((item) => item.id === version);
  if (!report) return {};
  const title = `Bản vá TFT ${report.version} — thay đổi và ảnh hưởng meta`;
  return {
    title,
    description: report.summaryVi,
    alternates: { canonical: `/patch/${version}` },
    openGraph: { title, description: report.summaryVi },
  };
}

export default async function PatchVersionPage({ params }: { params: Promise<{ version: string }> }) {
  const { version } = await params;
  const report = patchReports.find((item) => item.id === version);
  if (!report) notFound();
  if (report.id === patchReports[0].id) redirect('/patch');

  return (
    <section className={styles.page}>
      <div className="wide-container">
        <PatchBoard reportId={report.id} />
      </div>
    </section>
  );
}
