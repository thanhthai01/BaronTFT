import Image from 'next/image';
import type { Metadata } from 'next';
import { glossaryTerms } from '@/content/glossary.generated';
import { learningGroups } from '@/content/learning-sources';
import styles from './page.module.css';

/* Đoạn mô tả định vị trước đây nằm dưới h1 đã bỏ khỏi trang cho đỡ chiếm màn hình —
   giữ lại ở description để vẫn còn ngữ cảnh cho kết quả tìm kiếm. */
export const metadata: Metadata = {
  title: 'Nguồn học',
  description:
    'Các trang TFT lớn trùng chức năng gần hết, nên đây không phải danh sách bookmark — mỗi nguồn chỉ ghi đúng việc nó làm tốt hơn phần còn lại, xếp theo câu hỏi bạn đang cần trả lời.',
  alternates: { canonical: '/nguon-hoc' },
};

export default function ResourcesPage() {
  return (
    <>
      <header className={['page-header', styles.header].join(' ')}>
        <div className="wide-container">
          <span className="kicker">Nguồn học</span>
          <h1>Trang nào cho việc gì</h1>
        </div>
      </header>

      <section className={['section', styles.section].join(' ')}>
        <div className={['wide-container', styles.groups].join(' ')}>
          {learningGroups.map((group) => (
            <div className={styles.group} id={group.id} key={group.id}>
              <div className={styles.groupHead}>
                <h2>{group.question}</h2>
              </div>

              <ul className={styles.sourceList}>
                {group.sources.map((source) => (
                  <li className={styles.source} key={source.href}>
                    {/* Cả thẻ là một link: vùng bấm to, khỏi phải nhắm vào chữ. Các chip
                        trang con nằm ngoài thẻ link này vì link lồng link là HTML sai. */}
                    <a className={styles.sourceMain} href={source.href} rel="noreferrer noopener" target="_blank">
                      <Image
                        alt=""
                        className={styles.logo}
                        data-on-dark={source.logoOnDark ? '' : undefined}
                        height={28}
                        sizes="28px"
                        src={`/sources/${source.logo}.png`}
                        width={28}
                      />
                      <span className={styles.sourceText}>
                        <span className={styles.sourceName}>
                          {source.name}
                          <span aria-hidden="true" className={styles.external}>
                            ↗
                          </span>
                        </span>
                        <span className={styles.best}>{source.best}</span>
                      </span>
                    </a>

                    <p className={styles.note}>{source.note}</p>
                    {source.caveat ? <p className={styles.caveat}>{source.caveat}</p> : null}

                    {source.deepLinks?.length ? (
                      <div className={styles.deepLinks}>
                        {source.deepLinks.map((link) => (
                          <a
                            className={styles.deepLink}
                            href={link.href}
                            key={link.href}
                            rel="noreferrer noopener"
                            target="_blank"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className={['section', styles.glossarySection].join(' ')} id="thuat-ngu">
        <div className="wide-container">
          <div className={styles.glossaryHead}>
            <h2>Thuật ngữ</h2>
            <p>{glossaryTerms.length} thuật ngữ dùng trong giáo trình evergreen, sắp theo bảng chữ cái. Dùng Ctrl+F để tìm nhanh.</p>
          </div>
          <dl className={styles.glossaryList}>
            {glossaryTerms.map((entry) => (
              <div className={styles.glossaryEntry} key={entry.term}>
                <dt className={styles.glossaryTerm}>{entry.term}</dt>
                <dd className={styles.glossaryDefinition}>{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
