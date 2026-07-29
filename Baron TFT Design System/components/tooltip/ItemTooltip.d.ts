import React from 'react';

export interface ItemTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** Icon image URL or a glyph/node. Falls back to the first letter. */
  icon?: React.ReactNode;
  /** Item category, e.g. "Trang bị hoàn chỉnh". */
  kind?: string;
  /** Stat lines, e.g. ['+20 SM phép', '+10% Tốc đánh']. */
  stats?: React.ReactNode[];
  /** Passive text. HTML string (bold via <b>) or node. */
  description?: React.ReactNode;
  /** Component items that build into this one (labels or short glyphs). */
  recipe?: React.ReactNode[];
}

/**
 * Item hover card — icon, stats, passive, and build recipe. Teaches what an item grants and how to craft it.
 * @startingPoint section="Tooltip" subtitle="Item hover card — stats, passive, recipe" viewport="700x340"
 */
export function ItemTooltip(props: ItemTooltipProps): JSX.Element;
