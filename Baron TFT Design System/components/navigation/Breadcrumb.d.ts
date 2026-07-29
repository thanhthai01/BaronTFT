import React from 'react';

export interface CrumbItem { label: string; href?: string; }

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: CrumbItem[];
  /** Separator glyph. Default "/". */
  separator?: React.ReactNode;
  onNavigate?: (item: CrumbItem, index: number) => void;
}

/**
 * Breadcrumb trail — path back through guide sections; last item is the current page in gold.
 * @startingPoint section="Navigation" subtitle="Breadcrumb trail" viewport="700x80"
 */
export function Breadcrumb(props: BreadcrumbProps): JSX.Element;
