import React from 'react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md';
  /** Keyboard hint shown at the right when empty, e.g. "/". */
  kbd?: string;
  /** Show a clear (×) button when there's a value. */
  onClear?: () => void;
}

/**
 * Search field with leading glass icon and optional keyboard hint. The primary lookup control for the database.
 * @startingPoint section="Forms" subtitle="Search field — icon + kbd hint" viewport="700x120"
 */
export function SearchInput(props: SearchInputProps): JSX.Element;
