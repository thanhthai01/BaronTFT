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
import { clampOffsetY } from './bubbleMath';
import { navBubbleItems } from './navBubbleItems';
import { NavBubbleIcon, NavBubbleStateIcon } from './NavIcons';
import styles from './NavBubble.module.css';
import {
  BOTTOM_SAFE,
  BUBBLE_SIZE,
  COLLAPSED_SIZE,
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

function getDefaultPosition(): BubblePosition {
  const viewportHeight = window.innerHeight;
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
    const stored = readJson<BubblePosition | null>(storageKeys.navBubble, null);
    return stored ?? getDefaultPosition();
  });
  const [open, setOpen] = useState(false);
  const [panelPlacement, setPanelPlacement] = useState<'above' | 'below'>('above');
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
      setViewportWidth(window.innerWidth);
      applyPosition((prev) => ({
        ...prev,
        offsetY: clampOffsetY(prev.offsetY, window.innerHeight, prev.collapsed ? COLLAPSED_SIZE : BUBBLE_SIZE, TOP_SAFE, BOTTOM_SAFE),
      }));
    }

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [applyPosition]);

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

  // Panel mặc định mở phía trên bubble. Nếu bubble đang ở gần đỉnh màn hình
  // (vd. kéo lên cao), mở phía trên sẽ tràn lên header/ra ngoài viewport —
  // lúc đó lật panel xuống dưới bubble thay vì giữ nguyên "quá cao".
  useLayoutEffect(() => {
    if (!open) {
      setPanelPlacement('above');
      return;
    }

    const panelEl = panelRef.current;
    if (!panelEl) return;

    const rect = panelEl.getBoundingClientRect();
    if (panelPlacement === 'above' && rect.top < HEADER_CLEARANCE) {
      setPanelPlacement('below');
    }
  }, [open, panelPlacement]);

  const handleTap = useCallback(() => {
    if (position.collapsed) {
      applyPosition((prev) => ({ ...prev, collapsed: false }));
      setAnnouncement('Đã mở rộng nút điều hướng');
      return;
    }
    setOpen((current) => !current);
  }, [applyPosition, position.collapsed]);

  const handleDragStart = useCallback(() => setOpen(false), []);

  const { onPointerDown, onPointerMove, onPointerUp } = useBubbleDrag(bubbleRef, position, applyPosition, {
    reducedMotion,
    onTap: handleTap,
    onDragStart: handleDragStart,
  });

  const closePanel = useCallback((focusBubble: boolean) => {
    setOpen(false);
    if (focusBubble) bubbleRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (item: (typeof navBubbleItems)[number]) => {
      if (item.action.kind === 'search') {
        setOpen(false);
        openPalette();
        return;
      }
      setOpen(false);
    },
    [openPalette],
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
  const panelStyle: CSSProperties =
    panelPlacement === 'above'
      ? { ...sideStyle, bottom: Math.max(8, window.innerHeight - rect.top + PANEL_GAP) }
      : { ...sideStyle, top: rect.top + rect.size + PANEL_GAP };

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
        onPointerCancel={onPointerUp}
      >
        <NavBubbleStateIcon side={position.side} state={bubbleState} />
      </button>

      {open ? (
        <div
          aria-label="Điều hướng nhanh"
          className={styles.panel}
          data-placement={panelPlacement}
          ref={panelRef}
          role="dialog"
          style={panelStyle}
          onKeyDown={handlePanelKeyDown}
        >
          {navBubbleItems.map((item) => {
            if (item.action.kind === 'search') {
              return (
                <button className={styles.panelItem} key={item.id} type="button" onClick={() => handleSelect(item)}>
                  <NavBubbleIcon icon={item.icon} />
                  {item.label}
                </button>
              );
            }

            const isActive = isNavigationRouteActive(pathname, item.action.href);

            return (
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={styles.panelItem}
                href={item.action.href}
                key={item.id}
                onClick={() => handleSelect(item)}
              >
                <NavBubbleIcon icon={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ) : null}

      <span aria-live="polite" className="visually-hidden">
        {announcement}
      </span>
    </div>
  );
}
