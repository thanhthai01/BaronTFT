import React from 'react';

export interface TraitCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** Glyph or short label inside the hex badge. Defaults to the first letter. */
  icon?: React.ReactNode;
  /** e.g. "3 / 6" units contributing. */
  count?: React.ReactNode;
  /** Highlight as an active/breakpoint trait. */
  active?: boolean;
  description?: string;
  /** Breakpoint labels, e.g. ['2','4','6']. */
  tiers?: string[];
  /** Index of the highest reached tier (0-based; -1 = none). */
  activeTier?: number;
}

/**
 * Trait / synergy row — hex badge, breakpoint pips, and effect text. Used in trait panels and comp guides.
 * @startingPoint section="Cards" subtitle="Trait synergy row — hex badge + breakpoints" viewport="700x220"
 */
export function TraitCard(props: TraitCardProps): JSX.Element;
