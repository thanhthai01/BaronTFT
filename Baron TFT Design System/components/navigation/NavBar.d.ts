import React from 'react';

export interface NavLink { label: string; key?: string; href?: string; }

export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand text before the accent word. */
  brand?: string;
  /** Accent-colored word after the brand (e.g. "TFT"). */
  accentWord?: string;
  links?: NavLink[];
  /** Active link key (or label). */
  active?: string;
  onNavigate?: (key: string | null) => void;
  /** Right-side slot — buttons, language toggle, search. */
  actions?: React.ReactNode;
}

/**
 * Top navigation bar — hex brand mark, section links with gold underline, and an actions slot. Header for every Baron TFT screen.
 * @startingPoint section="Navigation" subtitle="Top nav — brand, links, actions" viewport="1200x64"
 */
export function NavBar(props: NavBarProps): JSX.Element;
