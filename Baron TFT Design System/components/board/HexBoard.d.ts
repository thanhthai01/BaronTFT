import React from 'react';

export interface BoardUnit {
  row: number;   // 0-based, from the back row
  col: number;   // 0-based
  name?: string;
  cost?: 1 | 2 | 3 | 4 | 5;
  /** 1–3 star tier. */
  stars?: number;
  portrait?: string;
}

export interface HexBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Board rows (TFT standard = 4). */
  rows?: number;
  /** Columns per row (TFT standard = 7). */
  cols?: number;
  /** Placed units keyed by row/col. */
  units?: BoardUnit[];
  /** Hex width in px (height auto = 1.1547×). */
  hexSize?: number;
  onHexClick?: (row: number, col: number, unit?: BoardUnit) => void;
}

/**
 * TFT hexagonal board — offset rows of hexes with placed, cost-colored, starred units. The canvas for teaching positioning and comps.
 * @startingPoint section="Board" subtitle="Hex composition grid — positioning" viewport="700x420"
 */
export function HexBoard(props: HexBoardProps): JSX.Element;
