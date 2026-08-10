'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { prefersReducedMotion } from '@/lib/motion';
import styles from './BackToTop.module.css';

const SHOW_AFTER = 520;

export function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const isPatchPage = pathname?.startsWith('/patch') ?? false;

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      const pageCanScroll = document.documentElement.scrollHeight - window.innerHeight > 48;
      setVisible(isPatchPage ? pageCanScroll : scrollTop > SHOW_AFTER);
      const visibleModal = Array.from(document.querySelectorAll<HTMLElement>('[aria-modal="true"], [data-matrix-modal-open="true"]')).some((element) => {
        if (element === document.documentElement) return false;
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
      });
      setModalOpen(visibleModal);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, [isPatchPage]);

  const isVisible = visible && !modalOpen;

  function goToTop() {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }

  return (
    <button
      aria-hidden={!isVisible}
      aria-label="Về đầu trang"
      className={styles.button}
      data-page={isPatchPage ? 'patch' : undefined}
      data-visible={isVisible}
      disabled={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      type="button"
      onClick={goToTop}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 18V6M7.5 10.5 12 6l4.5 4.5" />
      </svg>
    </button>
  );
}
