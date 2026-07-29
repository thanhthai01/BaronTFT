import React from 'react';

export interface UnitStat { label: string; value: React.ReactNode; }
export interface UnitAbility { name: string; mana?: React.ReactNode; desc: React.ReactNode; }

export interface UnitTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  cost?: 1 | 2 | 3 | 4 | 5;
  /** Champion epithet, e.g. "Cửu Vĩ Hồ". */
  title?: string;
  traits?: string[];
  /** Stat rows: HP, Sát thương, Giáp, Tốc đánh… */
  stats?: UnitStat[];
  /** Ability block. `desc` accepts an HTML string (bold via <b>) or a node. */
  ability?: UnitAbility;
}

/**
 * Full champion hover card — name, cost, traits, stat grid, and ability. The teaching surface for "what does this unit do".
 * @startingPoint section="Tooltip" subtitle="Champion hover card — stats + ability" viewport="700x420"
 */
export function UnitTooltip(props: UnitTooltipProps): JSX.Element;
