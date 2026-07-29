import React from 'react';

export interface GuideCardProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  /** Difficulty label — drives the corner tag tone. VI: Nhập môn / Cơ bản / Trung cấp / Nâng cao. */
  level?: string;
  /** Lesson number shown large on the cover when no image is given. */
  number?: number;
  /** e.g. "8 phút". */
  duration?: string;
  /** Lesson count. */
  lessons?: number;
  cover?: string;
  as?: any;
}

/**
 * Lesson / guide card — cover, difficulty tag, title, and progress meta. The tile for the beginner's-guide grid.
 * @startingPoint section="Cards" subtitle="Lesson card — cover, difficulty, meta" viewport="700x360"
 */
export function GuideCard(props: GuideCardProps): JSX.Element;
