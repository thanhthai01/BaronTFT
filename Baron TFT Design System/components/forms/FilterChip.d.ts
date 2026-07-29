import React from 'react';

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected state — fills with gold. */
  active?: boolean;
  /** Optional count shown after the label. */
  count?: React.ReactNode;
  /** Show an × when active (deselect affordance). */
  removable?: boolean;
  children?: React.ReactNode;
}

/**
 * Toggleable filter pill — cost, trait, or role facets above a results grid. Fills gold when active.
 * @startingPoint section="Forms" subtitle="Toggle filter pill — facets" viewport="700x120"
 */
export function FilterChip(props: FilterChipProps): JSX.Element;
