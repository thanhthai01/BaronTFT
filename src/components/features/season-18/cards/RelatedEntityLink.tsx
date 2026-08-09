import Image from 'next/image';
import Link from 'next/link';
import styles from './EntityDetailShell.module.css';

export function RelatedEntityLink({
  href,
  image,
  name,
  meta,
}: {
  href: string;
  image: string;
  name: string;
  meta?: string;
}) {
  return (
    <Link className={styles.relatedItem} href={href}>
      <Image alt="" className={styles.relatedItemLogo} height={40} sizes="40px" src={image} width={40} />
      <span className={styles.relatedItemBody}>
        <span className={styles.relatedItemName}>{name}</span>
        {meta ? <span className={styles.relatedItemMeta}>{meta}</span> : null}
      </span>
    </Link>
  );
}
