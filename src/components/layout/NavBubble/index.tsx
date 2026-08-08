'use client';

import dynamic from 'next/dynamic';

const NavBubble = dynamic(() => import('./NavBubble'), { ssr: false });

export function NavBubbleLoader() {
  return <NavBubble />;
}
