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
  // Vẫn giữ dynamic import chỉ tải khi mở lần đầu (bundle cmdk + search index
  // không cần trong tải trang ban đầu), nhưng KHÔNG gỡ khỏi cây React mỗi lần
  // đóng như trước (`open ? <Dialog/> : null`) — Radix Dialog (cmdk dựng trên đó)
  // tự chạy animation đóng qua Presence dựa vào CSS animation trên
  // [data-state="closed"], nhưng chỉ hoạt động nếu component còn đứng trong DOM
  // để đợi animationend; gỡ ngay theo `open` cắt animation đóng giữa chừng.
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const groups = useMemo(() => Array.from(new Set(searchActions.map((action) => action.group))), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Đang trình chiếu (xem PatchPresentation.tsx) thì bỏ qua — bật popup tìm
      // kiếm đè lên khung 1920×1080 giữa lúc quay/chiếu là hỏng cả video.
      if (document.documentElement.hasAttribute('data-presenting')) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setHasOpenedOnce(true);
        setOpen((current) => !current);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <CommandPaletteContext.Provider
      value={{
        openPalette: () => {
          setHasOpenedOnce(true);
          setOpen(true);
        },
      }}
    >
      {children}
      {hasOpenedOnce ? <CommandPaletteDialog groups={groups} open={open} onOpenChange={setOpen} /> : null}
    </CommandPaletteContext.Provider>
  );
}
