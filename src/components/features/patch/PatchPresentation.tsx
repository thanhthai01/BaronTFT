'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/design-system/Button/Button';
import { patchCategoryMeta, patchImpactMeta, patchKindMeta, patchOriginMeta, type PatchReport } from '@/content/patch-notes';
import { resolveDisplayName, resolveIcon } from './patch-entity-resolvers';
import { buildPatchSlides, type PatchSlide } from './patch-presentation-slides';
import styles from './PatchPresentation.module.css';

// Khung logic cố định — mọi slide dựng ở đúng kích thước này rồi cả khối được
// scale() theo viewport thật. Đây là điểm mấu chốt để dùng quay video: quay ở
// cửa sổ nào cũng ra bố cục y hệt, chữ không bao giờ nhảy dòng khác giữa các lần.
const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

const HASH_RE = /^#slide-(\d+)$/;

function readSlideIndexFromHash(max: number): number {
  const match = window.location.hash.match(HASH_RE);
  if (!match) return 0;
  return Math.min(Math.max(Number(match[1]), 0), max);
}

function SlideCover({ slide }: { slide: Extract<PatchSlide, { kind: 'cover' }> }) {
  return (
    <div className={styles.slideCover}>
      <span className={styles.eyebrow}>Bản vá TFT</span>
      <h1>{slide.version}</h1>
      <p className={styles.coverTitle}>{slide.title}</p>
      <div className={styles.coverMeta}>
        <span>{slide.dateVi}</span>
        <span aria-hidden="true">•</span>
        <span>{slide.source?.label ?? `Biên soạn: ${slide.author}`}</span>
      </div>
    </div>
  );
}

function SlideSummary({ slide }: { slide: Extract<PatchSlide, { kind: 'summary' }> }) {
  return (
    <div className={styles.slideBody}>
      <span className={styles.eyebrow}>{patchOriginMeta[slide.summaryOrigin].label}</span>
      <h2>Tóm tắt phiên bản</h2>
      <p className={styles.leadText}>{slide.summaryVi}</p>
    </div>
  );
}

function SlideRhythm({ slide }: { slide: Extract<PatchSlide, { kind: 'rhythm' }> }) {
  return (
    <div className={styles.slideBody}>
      <span className={styles.eyebrow}>Phân tích cá nhân</span>
      <h2>Nhịp chỉnh sửa</h2>
      <ul className={styles.bulletList}>
        {slide.lines.map((line) => <li key={line}>{line}</li>)}
      </ul>
    </div>
  );
}

function SlideCategory({ slide, entitySet }: { slide: Extract<PatchSlide, { kind: 'category' }>; entitySet: number }) {
  return (
    <div className={styles.slideBody}>
      <span className={styles.eyebrow}>Thay đổi trong bản vá</span>
      <h2>{patchCategoryMeta[slide.category].label}</h2>
      <ul className={styles.entryGrid}>
        {slide.entries.map((entry) => {
          const name = resolveDisplayName(entry, entitySet);
          const icon = resolveIcon(entry, entitySet);
          return (
            <li className={styles.entryChip} key={entry.id}>
              {icon.src ? (
                // eslint-disable-next-line @next/next/no-img-element -- render trong stage được scale(); next/image tính layout theo viewport thật nên sẽ sai tỉ lệ ở đây.
                <img alt="" height={64} src={icon.src} width={64} />
              ) : (
                <span className={styles.entryChipPlaceholder} aria-hidden="true" />
              )}
              <span className={styles.entryChipBody}>
                <strong>
                  {name.vi}
                  {entry.note ? ` ${entry.note}` : ''}
                </strong>
                <span className={[styles.entryChipKind, styles[`kind-${entry.kind}`]].join(' ')}>
                  {patchKindMeta[entry.kind].label}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SlideImpact({ slide }: { slide: Extract<PatchSlide, { kind: 'impact' }> }) {
  const { impact } = slide;
  return (
    <div className={styles.slideBody}>
      <span className={[styles.eyebrow, styles[`dir-${impact.direction}`]].join(' ')}>
        {patchImpactMeta[impact.direction].arrow} {patchImpactMeta[impact.direction].label}
      </span>
      <h2>{impact.title}</h2>
      <p className={styles.leadText}>{impact.verdict}</p>
      {impact.context?.length ? (
        <ul className={styles.bulletList}>
          {impact.context.map((line) => <li key={line}>{line}</li>)}
        </ul>
      ) : null}
      <p className={styles.bodyText}>{impact.body}</p>
    </div>
  );
}

function SlideOutro({ slide }: { slide: Extract<PatchSlide, { kind: 'outro' }> }) {
  return (
    <div className={styles.slideCover}>
      <span className={styles.eyebrow}>Baron TFT</span>
      <h1>Đọc đầy đủ bản vá</h1>
      <p className={styles.coverTitle}>barontft.vercel.app{slide.url}</p>
    </div>
  );
}

function SlideRenderer({ slide, entitySet }: { slide: PatchSlide; entitySet: number }) {
  switch (slide.kind) {
    case 'cover':
      return <SlideCover slide={slide} />;
    case 'summary':
      return <SlideSummary slide={slide} />;
    case 'rhythm':
      return <SlideRhythm slide={slide} />;
    case 'category':
      return <SlideCategory entitySet={entitySet} slide={slide} />;
    case 'impact':
      return <SlideImpact slide={slide} />;
    case 'outro':
      return <SlideOutro slide={slide} />;
  }
}

export function PatchPresentation({ report, url }: { report: PatchReport; url: string }) {
  const entitySet = report.entitySet ?? 18;
  const slides = useMemo(() => buildPatchSlides(report, url), [report, url]);
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  // Portal chỉ được tạo phía client (document.body không tồn tại lúc SSR). Nếu
  // render createPortal ngay từ lần render đầu, client render đầu tiên (trước
  // effect) đã khác với HTML server trả về → React báo hydration mismatch. Trì
  // hoãn tới sau khi mount (effect luôn chạy sau hydrate) để lần render đầu ở
  // cả hai phía đều giống nhau (không có portal).
  const [mounted, setMounted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const goTo = (next: number) => setIndex(Math.min(Math.max(next, 0), slides.length - 1));

  function openPresentation() {
    setIndex(readSlideIndexFromHash(slides.length - 1));
    setIsOpen(true);
    const el = stageRef.current?.parentElement;
    // requestFullscreen phải gọi trong cùng lượt click (user gesture) mới được
    // trình duyệt cho phép — el đã tồn tại sẵn trong DOM (portal mount không
    // điều kiện, chỉ ẩn/hiện bằng CSS) nên gọi được ngay ở đây.
    el?.requestFullscreen?.().catch(() => {
      // Từ chối (không hỗ trợ / bị chặn) → vẫn dùng được, rơi về overlay
      // position: fixed; inset: 0 đã có sẵn qua className .fallback.
    });
  }

  function closePresentation() {
    setIsOpen(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  // Đồng bộ #slide-<n> lên URL bằng replaceState — không đụng canonical, không
  // rác lịch sử back — để quay hỏng một slide thì mở lại đúng chỗ đó.
  useEffect(() => {
    if (!isOpen) return;
    history.replaceState(null, '', `#slide-${index}`);
  }, [isOpen, index]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePresentation();
      } else if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
        event.preventDefault();
        goTo(index + 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(slides.length - 1);
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        else stageRef.current?.parentElement?.requestFullscreen?.().catch(() => {});
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goTo đóng trên `index`/`slides.length` qua closure ổn định theo từng lượt render, không cần liệt kê riêng.
  }, [isOpen, index, slides.length]);

  // Khung 16:9 cố định (1920×1080) rồi scale theo kích thước thật của khung
  // chứa — bố cục không đổi giữa các lần quay dù cửa sổ to nhỏ khác nhau.
  useEffect(() => {
    if (!isOpen) return;
    const container = stageRef.current?.parentElement;
    if (!container) return;

    function updateScale() {
      if (!container) return;
      const next = Math.min(container.clientWidth / STAGE_WIDTH, container.clientHeight / STAGE_HEIGHT);
      setScale(next > 0 ? next : 1);
    }

    updateScale();
    window.addEventListener('resize', updateScale);
    document.addEventListener('fullscreenchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      document.removeEventListener('fullscreenchange', updateScale);
    };
  }, [isOpen]);

  const portalNode =
    !mounted
      ? null
      : createPortal(
          <div
            aria-hidden={!isOpen}
            aria-label="Trình chiếu bản vá"
            aria-modal="true"
            className={[styles.overlay, isOpen ? styles.overlayOpen : null].filter(Boolean).join(' ')}
            role="dialog"
          >
            <div className={styles.stageViewport}>
              <div
                className={styles.stage}
                ref={stageRef}
                style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${scale})` }}
              >
                {slides[index] ? <SlideRenderer entitySet={entitySet} slide={slides[index]} /> : null}
              </div>
            </div>

            <div className={styles.controls}>
              <span className={styles.progress}>{index + 1} / {slides.length}</span>
              <div className={styles.controlButtons}>
                <button aria-label="Slide trước" className={styles.controlButton} type="button" onClick={() => goTo(index - 1)}>
                  ‹
                </button>
                <button aria-label="Slide sau" className={styles.controlButton} type="button" onClick={() => goTo(index + 1)}>
                  ›
                </button>
                <button className={styles.exitButton} type="button" onClick={closePresentation}>
                  Thoát (Esc)
                </button>
              </div>
            </div>
          </div>,
          document.body,
        );

  return (
    <>
      <Button size="sm" type="button" variant="secondary" onClick={openPresentation}>
        Trình chiếu
      </Button>
      {portalNode}
    </>
  );
}
