'use client';

import dynamic from 'next/dynamic';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { searchActions } from '@/content/search-actions';

const CommandPaletteDialog = dynamic(() => import('./CommandPaletteDialog'), { ssr: false });

type CommandPaletteContextValue = {
  openPalette: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette() {
  const value = useContext(CommandPaletteContext);
  if (!value) throw new Error('useCommandPalette must be used inside CommandPaletteProvider');
  return value;
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const groups = useMemo(() => Array.from(new Set(searchActions.map((action) => action.group))), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <CommandPaletteContext.Provider value={{ openPalette: () => setOpen(true) }}>
      {children}
      {open ? <CommandPaletteDialog groups={groups} open={open} onOpenChange={setOpen} /> : null}
    </CommandPaletteContext.Provider>
  );
}
