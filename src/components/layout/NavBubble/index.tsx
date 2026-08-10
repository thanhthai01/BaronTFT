'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 980px)';
const NavBubble = dynamic(() => import('./NavBubble'), { ssr: false });

export function NavBubbleLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return enabled ? <NavBubble /> : null;
}
