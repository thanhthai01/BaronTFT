import React from 'react';

export interface ChampionCardProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  /** Cost 1–5 — drives the border/glow tier color and cost coin. */
  cost?: 1 | 2 | 3 | 4 | 5;
  /** Trait / origin chips shown under the name. */
  traits?: string[];
  /** Portrait image URL. Falls back to a tinted initial when omitted. */
  portrait?: string;
}

/**
 * Champion tile — portrait, cost coin, traits, tier-colored frame. The core unit of any roster or comp view.
 * @startingPoint section="Cards" subtitle="Champion tile — cost, traits, tier frame" viewport="700x300"
 */
export function ChampionCard(props: ChampionCardProps): JSX.Element;
