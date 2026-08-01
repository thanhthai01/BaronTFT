import type { Metadata } from 'next';
import { learningGroups } from '@/content/learning-sources';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Nguồn học' };

export default function ResourcesPage() {
  return (
    <>
      <header className="page-header">
        <div className="wide-container">
          <span className="kicker">Nguồn học</span>
          <h1>Dùng dữ liệu để đặt câu hỏi tốt hơn</h1>
          <p>
            Các trang TFT lớn trùng chức năng gần hết, nên trang này không dựng lại thứ họ đã làm tốt hơn — chỉ chỉ đúng
            chỗ. Xếp theo câu hỏi bạn đang cần trả lời, và mỗi nguồn ghi rõ nó giỏi nhất ở việc gì.
          </p>
        </div>
      </header>

      <section className="section">
        <div className={['wide-container', styles.groups].join(' ')}>
          {learningGroups.map((group) => (
            <div className={styles.group} id={group.id} key={group.id}>
              <div className={styles.groupHead}>
                <h2>{group.question}</h2>
                <p>{group.hint}</p>
              </div>

              <ul className={styles.sourceList}>
                {group.sources.map((source) => (
                  <li className={styles.source} key={source.href}>
                    <div className={styles.sourceHead}>
                      {/* noreferrer đi kèm noopener: nguồn ngoài không cần biết người dùng đến từ trang nào. */}
                      <a className={styles.sourceName} href={source.href} rel="noreferrer noopener" target="_blank">
                        {source.name}
                        <span aria-hidden="true" className={styles.external}>
                          ↗
                        </span>
                      </a>
                      {source.tag ? <span className={styles.sourceTag}>{source.tag}</span> : null}
                    </div>

                    {/* Lý do nguồn này có mặt — đọc trước cả câu mô tả, vì các trang trùng
                        chức năng gần hết nên "giỏi nhất ở đâu" mới là thứ để chọn. */}
                    <p className={styles.best}>{source.best}</p>
                    <p className={styles.use}>{source.use}</p>
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
    </>
  );
}
