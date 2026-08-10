'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './MatrixOverviewModal.module.css';

export function MatrixOverviewModal() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const historyPushedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    historyPushedRef.current = true;
    window.history.pushState({ matrixOverviewOpen: true }, '', window.location.href);
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.dataset.matrixModalOpen = 'true';
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = document.getElementById('matrix-overview-dialog');
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function onPopState() {
      historyPushedRef.current = false;
      setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('popstate', onPopState);
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
      delete document.documentElement.dataset.matrixModalOpen;
    };
  }, [open]);

  useEffect(() => {
    if (open) return;
    triggerRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    function centerImage() {
      requestAnimationFrame(() => {
        if (!viewportRef.current) return;
        const current = viewportRef.current;
        current.scrollLeft = Math.max(0, (current.scrollWidth - current.clientWidth) / 2);
        current.scrollTop = Math.max(0, (current.scrollHeight - current.clientHeight) / 2);
      });
    }

    centerImage();
    window.addEventListener('resize', centerImage);
    window.addEventListener('orientationchange', centerImage);
    window.visualViewport?.addEventListener('resize', centerImage);
    return () => {
      window.removeEventListener('resize', centerImage);
      window.removeEventListener('orientationchange', centerImage);
      window.visualViewport?.removeEventListener('resize', centerImage);
    };
  }, [open]);

  function close() {
    if (historyPushedRef.current) {
      window.history.back();
      return;
    }
    setOpen(false);
  }

  function openModal() {
    setOpen(true);
  }

  const modal = open && mounted
    ? createPortal(
        <div
          aria-labelledby="matrix-overview-title"
          aria-modal="true"
          className={styles.overlay}
          data-matrix-modal-open="true"
          id="matrix-overview-dialog"
          role="dialog"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className={styles.dialogPanel}>
            <h2 className={styles.srOnly} id="matrix-overview-title">Tổng quan ma trận Tộc Hệ Set 18</h2>
            <button ref={closeRef} aria-label="Quay lại khỏi ma trận phóng to" className={styles.closeButton} type="button" onClick={close}>←</button>
            <div className={styles.imageViewport} ref={viewportRef}>
              <div className={styles.imageCanvas}>
                <Image
                  alt="Ma trận Tộc × Hệ Set 18 với các tướng tại giao điểm tương ứng."
                  className={styles.image}
                  height={680}
                  sizes="(max-width: 980px) 92vw, 1200px"
                  src="/set18/matrix-overview-mobile.png"
                  width={1561}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button ref={triggerRef} aria-controls="matrix-overview-dialog" aria-haspopup="dialog" className={styles.trigger} type="button" onClick={openModal}>
        <span className={styles.previewFrame}>
          <Image alt="Ma trận Tộc × Hệ Set 18" height={680} sizes="(max-width: 860px) 100vw" src="/set18/matrix-overview-mobile.png" width={1561} />
          <span aria-hidden="true" className={styles.zoomBadge}>
            <svg viewBox="0 0 24 24">
              <path d="M10.75 17.5a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5ZM16 16l4 4M8.75 10.75h4M10.75 8.75v4" />
            </svg>
          </span>
        </span>
      </button>
      {modal}
    </>
  );
}
