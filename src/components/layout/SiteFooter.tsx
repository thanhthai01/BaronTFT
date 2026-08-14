import Link from 'next/link';
import styles from './SiteFooter.module.css';

const CONTACT_EMAIL = 'barontft.starguardianbaron00@gmail.com';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/u/0/#sent?compose=new&to=${encodeURIComponent(CONTACT_EMAIL)}`;

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={[styles.inner, 'wide-container'].join(' ')}>
        <div>
          <p className={styles.brand}>BARON TFT</p>
          <p className={styles.note}>
            Một fan project độc lập về kỹ năng ra quyết định trong Teamfight Tactics. Không liên kết với Riot Games; không dùng làm tier list hoặc meta database.
          </p>
          <div className={styles.contactRow}>
            <a className={styles.contact} href={GMAIL_COMPOSE_URL} rel="noreferrer" target="_blank">{CONTACT_EMAIL}</a>
            <Link className={styles.contact} href="/gop-y">Gửi góp ý ↗</Link>
          </div>
        </div>
        <p className={styles.meta}>Evergreen Rank Manual · VI first</p>
      </div>
    </footer>
  );
}
