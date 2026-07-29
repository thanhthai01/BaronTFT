'use client';

import { useRef } from 'react';
import styles from './Tabs.module.css';

export type TabItem = {
  id: string;
  label: string;
};

export function Tabs({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function moveFocus(index: number) {
    const target = refs.current[(index + tabs.length) % tabs.length];
    target?.focus();
  }

  return (
    <div aria-label={label} className={styles.tabs} role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(node) => {
            refs.current[index] = node;
          }}
          aria-controls={`${tab.id}-panel`}
          aria-selected={value === tab.id}
          className={styles.tab}
          id={`${tab.id}-tab`}
          role="tab"
          tabIndex={value === tab.id ? 0 : -1}
          type="button"
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              moveFocus(index + 1);
            }
            if (event.key === 'ArrowLeft') {
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
