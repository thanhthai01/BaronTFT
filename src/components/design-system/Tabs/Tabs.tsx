'use client';

import { useRef, type ReactNode } from 'react';
import styles from './Tabs.module.css';

export type TabItem = {
  id: string;
  label: ReactNode;
  ariaLabel?: string;
  className?: string;
};

export function tabElementId(idPrefix: string, tabId: string) {
  return `${idPrefix}${tabId}-tab`;
}

export function tabPanelId(idPrefix: string, tabId: string) {
  return `${idPrefix}${tabId}-panel`;
}

export function Tabs({
  tabs,
  value,
  onChange,
  label,
  idPrefix = '',
  orientation = 'horizontal',
  className,
}: {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  idPrefix?: string;
  /** Dọc dùng cho danh sách lọc ở cột trái; mũi tên Lên/Xuống thay Trái/Phải. */
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const isVertical = orientation === 'vertical';
  const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
  const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

  function moveFocus(index: number) {
    const normalizedIndex = (index + tabs.length) % tabs.length;
    const targetTab = tabs[normalizedIndex];
    onChange(targetTab.id);
    requestAnimationFrame(() => refs.current[normalizedIndex]?.focus());
  }

  return (
    <div
      aria-label={label}
      aria-orientation={orientation}
      className={[styles.tabs, isVertical ? styles.vertical : null, className].filter(Boolean).join(' ')}
      role="tablist"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(node) => {
            refs.current[index] = node;
          }}
          aria-controls={tabPanelId(idPrefix, tab.id)}
          aria-label={tab.ariaLabel}
          aria-selected={value === tab.id}
          className={[styles.tab, tab.className].filter(Boolean).join(' ')}
          id={tabElementId(idPrefix, tab.id)}
          role="tab"
          tabIndex={value === tab.id ? 0 : -1}
          type="button"
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => {
            if (event.key === nextKey) {
              event.preventDefault();
              moveFocus(index + 1);
            }
            if (event.key === prevKey) {
              event.preventDefault();
              moveFocus(index - 1);
            }
            if (event.key === 'Home') {
              event.preventDefault();
              moveFocus(0);
            }
            if (event.key === 'End') {
              event.preventDefault();
              moveFocus(tabs.length - 1);
            }
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
