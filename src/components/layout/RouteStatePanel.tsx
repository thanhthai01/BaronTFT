import Image from 'next/image';
import styles from './RouteStatePanel.module.css';

type RouteStatePanelProps = {
  label: string;
  command: string;
  title: string;
  description: string;
  errorText?: string;
  retryLabel?: string;
  onRetry?: () => void;
  homeHref?: string;
};

export function RouteStatePanel({
  label,
  command,
  title,
  description,
  errorText,
  retryLabel = 'Thử lại',
  onRetry,
  homeHref,
}: RouteStatePanelProps) {
  return (
    <section className={styles.wrap} aria-live="polite">
      <div className={styles.window}>
        <div className={styles.titlebar}>
          <span className={styles.dots} aria-hidden="true">
            <span className={styles.dot} style={{ background: 'var(--cost-1)' }} />
            <span className={styles.dot} style={{ background: 'var(--cost-3)' }} />
            <span className={styles.dot} style={{ background: 'var(--cost-5)' }} />
          </span>
          <span className={styles.brandMini}>
            <Image alt="" className={styles.brandMark} height={40} src="/logo/logo-main.png" width={34} />
            {label}
          </span>
        </div>
        <div className={styles.body}>
          <p className={styles.term}>
            <span className={styles.prompt}>$</span> {command}
            {errorText ? <span className={styles.err}>{errorText}</span> : null}
          </p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.desc}>{description}</p>
          {onRetry || homeHref ? (
            <div className={styles.actions}>
              {onRetry ? <button className={styles.primary} type="button" onClick={onRetry}>{retryLabel}</button> : null}
              {homeHref ? <a className={styles.secondary} href={homeHref}>Về trang chủ</a> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
