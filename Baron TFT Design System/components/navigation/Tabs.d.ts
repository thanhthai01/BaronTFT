import React from 'react';

export interface TabItem { label: string; key?: string; icon?: React.ReactNode; badge?: React.ReactNode; }

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  /** Active tab key (or label). */
  value?: string;
  onChange?: (key: string) => void;
  /** segment = gold pill inside a track; line = underlined. */
  variant?: 'segment' | 'line';
}

/**
 * Tab switcher — segmented gold pill or underlined line style. Splits content within a page (e.g. Tổng quan / Kỹ năng / Trang bị).
 * @startingPoint section="Navigation" subtitle="Tab switcher — segment / line" viewport="700x120"
 */
export function Tabs(props: TabsProps): JSX.Element;
