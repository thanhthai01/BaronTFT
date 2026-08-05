import Link from 'next/link';
import { roadmapAfterSteps, roadmapSymptoms, roadmapTiers, roadmapWeeks } from '@/content/roadmap.generated';
import styles from './RoadmapView.module.css';

export function RoadmapView() {
  return (
    <div className={styles.shell}>
      <section className={styles.section} aria-labelledby="roadmap-tiers-title">
        <h2 className={styles.sectionTitle} id="roadmap-tiers-title">Sáu tầng năng lực</h2>
        <div className={styles.tierList}>
          {roadmapTiers.map((tier) => (
            <div className={styles.tierRow} key={tier.tier}>
              <strong className={styles.tierName}>{tier.tier}</strong>
              <p className={styles.tierQuestion}>{tier.question}</p>
              <span className={styles.tierSkill}>{tier.skill}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="roadmap-diagnosis-title">
        <h2 className={styles.sectionTitle} id="roadmap-diagnosis-title">Triệu chứng → bài nên đọc</h2>
        <div className={styles.tableWrap}>
          <table className={styles.diagnosisTable}>
            <thead>
              <tr>
                <th>Triệu chứng</th>
                <th>Bài nên đọc trước</th>
              </tr>
            </thead>
            <tbody>
              {roadmapSymptoms.map((row) => (
                <tr key={row.symptom}>
                  <td>{row.symptom}</td>
                  <td><Link href={row.href}>{row.label}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="roadmap-weeks-title">
        <h2 className={styles.sectionTitle} id="roadmap-weeks-title">Lộ trình 9 tuần</h2>
        <div className={styles.weekGrid}>
          {roadmapWeeks.map((week, index) => (
            <article className={styles.weekCard} key={week.title}>
              <span className={styles.weekIndex}>{String(index).padStart(2, '0')}</span>
              <h3 className={styles.weekTitle}>{week.title}</h3>
              {week.read.length > 0 && (
                <div className={styles.weekRead}>
                  <span className={styles.weekLabel}>Đọc</span>
                  <div className={styles.weekReadLinks}>
                    {week.read.map((item) => (
                      <Link className={styles.weekReadLink} href={item.href} key={item.href}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {week.exercises.length > 0 && (
                <ul className={styles.weekExercises}>
                  {week.exercises.map((exercise) => <li key={exercise}>{exercise}</li>)}
                </ul>
              )}
              {week.outcome && (
                <p className={styles.weekOutcome}>
                  <span className={styles.weekLabel}>Qua tuần khi</span>
                  {week.outcome}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="roadmap-after-title">
        <h2 className={styles.sectionTitle} id="roadmap-after-title">Sau 8 tuần</h2>
        <ol className={styles.afterList}>
          {roadmapAfterSteps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>
    </div>
  );
}
