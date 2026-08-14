import { desc } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { FeedbackInbox, type FeedbackInboxItem } from '@/components/features/feedback/FeedbackInbox';
import { feedbackSubmissions } from '@/db/schema';
import { FEEDBACK_ADMIN_COOKIE, isFeedbackAdminSession } from '@/lib/feedback-admin-auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Quản lý góp ý', robots: { index: false, follow: false } };

export default async function FeedbackAdminPage() {
  const cookieStore = await cookies();
  if (!isFeedbackAdminSession(cookieStore.get(FEEDBACK_ADMIN_COOKIE)?.value)) {
    redirect('/quan-ly/gop-y/dang-nhap');
  }

  const { db } = await import('@/db/client');
  const rows = await db
    .select({
      id: feedbackSubmissions.id,
      message: feedbackSubmissions.message,
      contactEmail: feedbackSubmissions.contactEmail,
      status: feedbackSubmissions.status,
      submittedAt: feedbackSubmissions.submittedAt,
    })
    .from(feedbackSubmissions)
    .orderBy(desc(feedbackSubmissions.submittedAt));
  const items: FeedbackInboxItem[] = rows.map((row) => ({ ...row, submittedAt: row.submittedAt.toISOString() }));

  return (
    <>
      <header className="page-header">
        <div className="wide-container">
          <span className="kicker">Quản lý</span>
          <h1>Hộp thư góp ý</h1>
          <p>{items.length} góp ý đã được lưu.</p>
        </div>
      </header>
      <section className="section">
        <div className="wide-container"><FeedbackInbox initialItems={items} /></div>
      </section>
    </>
  );
}
