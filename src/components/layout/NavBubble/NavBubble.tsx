'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { isNavigationRouteActive } from '@/lib/navigation';
import { prefersReducedMotion } from '@/lib/motion';
import { readJson, storageKeys, writeJson } from '@/lib/storage';
import { useCommandPalette } from '../../features/command-palette/CommandPaletteProvider';
import { choosePanelPlacement, clampOffsetY, normalizeBubblePosition } from './bubbleMath';
import { navBubbleSections, type NavBubbleItem } from './navBubbleItems';
import { NavBubbleIcon, NavBubbleStateIcon } from './NavIcons';
import styles from './NavBubble.module.css';
import {
  BOTTOM_SAFE,
  BUBBLE_SIZE,
  COLLAPSED_SIZE,
  COLLAPSED_VISIBLE,
  TOP_SAFE,
  restingRect,
  useBubbleDrag,
  type BubblePosition,
} from './useBubbleDrag';

const ARROW_STEP = 24;
const PANEL_GAP = 12;
// Chiều cao SiteHeader (4.25rem ≈ 68px) cộng biên an toàn — panel mở "phía
// trên" bubble mà tràn lên vùng này thì coi như quá cao, phải lật xuống dưới.
const HEADER_CLEARANCE = 84;

function getDefaultPosition(viewportHeight = window.innerHeight): BubblePosition {
  return {
    side: 'right',
    offsetY: clampOffsetY(viewportHeight * 0.62, viewportHeight, BUBBLE_SIZE, TOP_SAFE, BOTTOM_SAFE),
    collapsed: false,
  };
}

export default function NavBubble() {
  const pathname = usePathname();
  const { openPalette } = useCommandPalette();

  const bubbleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [position, setPositionState] = useState<BubblePosition>(() => {
    const viewportHeight = window.innerHeight;
    const fallback = getDefaultPosition(viewportHeight);
    const stored = readJson<unknown>(storageKeys.navBubble, null);
    return normalizeBubblePosition(stored, fallback, viewportHeight, BUBBLE_SIZE, COLLAPSED_SIZE, TOP_SAFE, BOTTOM_SAFE);
  });
  const [open, setOpen] = useState(false);
  const [panelPlacement, setPanelPlacement] = useState<'above' | 'below'>('above');
  const [panelMaxHeight, setPanelMaxHeight] = useState<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());
  const [announcement, setAnnouncement] = useState('');

  const applyPosition = useCallback((update: BubblePosition | ((prev: BubblePosition) => BubblePosition)) => {
    setPositionState((prev) => {
      const next = typeof update === 'function' ? (update as (prev: BubblePosition) => BubblePosition)(prev) : update;
      writeJson(storageKeys.navBubble, next);
      return next;
    });
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    function onResize() {
      const viewport = window.visualViewport;
      const nextWidth = Math.round(viewport?.width ?? window.innerWidth);
      const nextHeight = Math.round(viewport?.height ?? window.innerHeight);
      setViewportWidth(nextWidth);
      applyPosition((prev) => ({
        ...prev,
        offsetY: clampOffsetY(prev.offsetY, nextHeight, prev.collapsed ? COLLAPSED_SIZE : BUBBLE_SIZE, TOP_SAFE, BOTTOM_SAFE),
      }));
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.visualViewport?.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('scroll', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('scroll', onResize);
    };
  }, [applyPosition]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onPointerDownOutside(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || bubbleRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDownOutside);
    return () => document.removeEventListener('pointerdown', onPointerDownOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>('a,button');
    first?.focus();
  }, [open]);

  // Chọn above/below theo không gian thật quanh bubble; nếu cả hai phía đều thiếu
  // chỗ, panel chọn phía rộng hơn và tự cuộn nội bộ thay vì tràn khỏi viewport.
  useLayoutEffect(() => {
    if (!open) {
      setPanelPlacement('above');
      setPanelMaxHeight(null);
      return;
    }

    const panelEl = panelRef.current;
    if (!panelEl) return;

    const rect = panelEl.getBoundingClientRect();
    const viewportHeight = Math.round(window.visualViewport?.height ?? window.innerHeight);
    const bubbleRect = restingRect(position, viewportWidth);
    const next = choosePanelPlacement({
      bubbleTop: bubbleRect.top,
      bubbleSize: bubbleRect.size,
      panelHeight: rect.height,
      viewportHeight,
      topClearance: HEADER_CLEARANCE,
      bottomClearance: BOTTOM_SAFE,
      gap: PANEL_GAP,
    });
    setPanelPlacement(next.placement);
    setPanelMaxHeight(next.maxHeight);
  }, [open, position, viewportWidth]);

  const handleTap = useCallback(() => {
    if (position.collapsed) {
      applyPosition((prev) => ({ ...prev, collapsed: false }));
      setAnnouncement('Đã mở rộng nút điều hướng');
      return;
    }
    setOpen((current) => !current);
  }, [applyPosition, position.collapsed]);

  const handleDragStart = useCallback(() => setOpen(false), []);

  const { onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useBubbleDrag(bubbleRef, position, applyPosition, {
    reducedMotion,
    onTap: handleTap,
    onDragStart: handleDragStart,
  });

  const closePanel = useCallback((focusBubble: boolean) => {
    setOpen(false);
    if (focusBubble) bubbleRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (item: NavBubbleItem) => {
      if (item.action.kind === 'search') {
        setOpen(false);
        openPalette();
        return;
      }
      if (item.action.kind === 'collapse') {
        setOpen(false);
        applyPosition((prev) => ({ ...prev, collapsed: true }));
        setAnnouncement('Đã thu gọn nút điều hướng vào mép màn hình');
        bubbleRef.current?.focus();
        return;
      }
      setOpen(false);
    },
    [applyPosition, openPalette],
  );

  const handlePanelKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel(true);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a,button');
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [closePanel],
  );

  const handleBubbleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      const viewportHeight = window.innerHeight;
      const size = position.collapsed ? COLLAPSED_SIZE : BUBBLE_SIZE;

      switch (event.key) {
        case ' ':
        case 'Enter':
          event.preventDefault();
          handleTap();
          break;
        case 'Escape':
          if (open) {
            event.preventDefault();
            closePanel(true);
          }
          break;
        case 'Delete':
          event.preventDefault();
          setOpen(false);
          applyPosition((prev) => ({ ...prev, collapsed: true }));
          setAnnouncement('Đã thu gọn nút điều hướng vào mép màn hình');
          break;
        case 'ArrowUp':
          event.preventDefault();
          applyPosition((prev) => ({
            ...prev,
            offsetY: clampOffsetY(
              event.ctrlKey || event.metaKey ? TOP_SAFE : prev.offsetY - ARROW_STEP,
              viewportHeight,
              size,
              TOP_SAFE,
              BOTTOM_SAFE,
            ),
          }));
          break;
        case 'ArrowDown':
          event.preventDefault();
          applyPosition((prev) => ({
            ...prev,
            offsetY: clampOffsetY(
              event.ctrlKey || event.metaKey ? viewportHeight : prev.offsetY + ARROW_STEP,
              viewportHeight,
              size,
              TOP_SAFE,
              BOTTOM_SAFE,
            ),
          }));
          break;
        case 'ArrowLeft':
          event.preventDefault();
          applyPosition((prev) => ({ ...prev, side: 'left' }));
          setAnnouncement('Đã chuyển sang cạnh trái màn hình');
          break;
        case 'ArrowRight':
          event.preventDefault();
          applyPosition((prev) => ({ ...prev, side: 'right' }));
          setAnnouncement('Đã chuyển sang cạnh phải màn hình');
          break;
        default:
          break;
      }
    },
    [applyPosition, closePanel, handleTap, open, position.collapsed],
  );

  const rect = restingRect(position, viewportWidth);
  const bubbleStyle: CSSProperties = { left: rect.left, top: rect.top };
  const sideStyle: CSSProperties = position.side === 'left' ? { left: 16 } : { right: 16 };
  const panelStyle: CSSProperties = {
    ...sideStyle,
    ...(panelPlacement === 'above'
      ? { bottom: Math.max(8, (window.visualViewport?.height ?? window.innerHeight) - rect.top + PANEL_GAP) }
      : { top: rect.top + rect.size + PANEL_GAP }),
    ...(panelMaxHeight === null ? {} : { maxHeight: panelMaxHeight }),
  };

  const bubbleState = open ? 'open' : position.collapsed ? 'collapsed' : 'idle';

  return (
    <div className={styles.root} data-testid="nav-bubble-root">
      {open ? <button aria-label="Đóng điều hướng" className={styles.backdrop} type="button" onClick={() => closePanel(false)} /> : null}

      <button
        aria-expanded={open}
        aria-label={position.collapsed ? 'Mở rộng nút điều hướng' : open ? 'Đóng điều hướng' : 'Mở điều hướng'}
        className={styles.bubble}
        data-collapsed={position.collapsed}
        ref={bubbleRef}
        style={bubbleStyle}
        type="button"
        onKeyDown={handleBubbleKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <NavBubbleStateIcon side={position.side} state={bubbleState} />
      </button>

      {open ? (
        <div
          aria-describedby="nav-bubble-instructions"
          aria-label="Điều hướng nhanh"
          aria-modal="true"
          className={styles.panel}
          data-placement={panelPlacement}
          ref={panelRef}
          role="dialog"
          style={panelStyle}
          onKeyDown={handlePanelKeyDown}
        >
          <p className="visually-hidden" id="nav-bubble-instructions">
            Dùng Tab để đi qua các mục, Escape để đóng. Có thể kéo nút nổi sang cạnh màn hình hoặc bấm Thu gọn vào mép.
          </p>
          <nav aria-label="Điều hướng nhanh trên điện thoại" className={styles.panelNav}>
            {navBubbleSections.map((section) => (
              <section className={styles.panelSection} data-section={section.id} key={section.id}>
                {section.label ? <h2 className={styles.sectionTitle}>{section.label}</h2> : null}
                <div className={styles.sectionGrid}>
                  {section.items.map((item) => {
                    const itemClassName = [styles.panelItem, item.emphasis === 'primary' ? styles.primaryItem : null, item.emphasis === 'utility' ? styles.utilityItem : null]
                      .filter(Boolean)
                      .join(' ');

                    if (item.action.kind === 'search' || item.action.kind === 'collapse') {
                      return (
                        <button className={itemClassName} key={item.id} type="button" onClick={() => handleSelect(item)}>
                          <NavBubbleIcon icon={item.icon} />
                          <span>{item.label}</span>
                          {item.description ? <small>{item.description}</small> : null}
                        </button>
                      );
                    }

                    const isActive = isNavigationRouteActive(pathname, item.action.href);

                    return (
                      <Link
                        aria-current={isActive ? 'page' : undefined}
                        className={itemClassName}
                        href={item.action.href}
                        key={item.id}
                        onClick={() => handleSelect(item)}
                      >
                        <NavBubbleIcon icon={item.icon} />
                        <span>{item.label}</span>
                        {item.description ? <small>{item.description}</small> : null}
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </nav>
        </div>
      ) : null}

      <span aria-live="polite" className="visually-hidden">
        {announcement}
      </span>
    </div>
  );
}
