'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { searchActions } from '@/content/search-actions';
import styles from './CommandPalette.module.css';

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
  const router = useRouter();
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
      {open ? (
        <Command.Dialog
          contentClassName={styles.dialog}
          label="Tìm nhanh"
          open={open}
          onOpenChange={setOpen}
          overlayClassName={styles.overlay}
        >
          <Command.Input className={styles.input} placeholder="Tìm bài học, checklist, review, biểu mẫu…" />
          <Command.List className={styles.list}>
            <Command.Empty className={styles.empty}>Không tìm thấy hành động phù hợp.</Command.Empty>
            {groups.map((group) => (
              <Command.Group heading={group} key={group} className={styles.groupHeading}>
                {searchActions
                  .filter((action) => action.group === group)
                  .map((action) => (
                    <Command.Item
                      className={styles.item}
                      key={action.id}
                      keywords={action.keywords}
                      value={`${action.label} ${action.description}`}
                      onSelect={() => {
                        setOpen(false);
                        router.push(action.href);
                      }}
                    >
                      <strong>{action.label}</strong>
                      <span>{action.description}</span>
                    </Command.Item>
                  ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command.Dialog>
      ) : null}
    </CommandPaletteContext.Provider>
  );
}
