import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={[styles.inner, 'wide-container'].join(' ')}>
        <div>
          <p className={styles.brand}>BARON TFT</p>
          <p className={styles.note}>
            Một fan project độc lập về kỹ năng ra quyết định trong Teamfight Tactics. Không liên kết với Riot Games; không dùng làm tier list hoặc meta database.
          </p>
        </div>
        <p className={styles.meta}>Evergreen Rank Manual · VI first</p>
      </div>
    </footer>
  );
}
