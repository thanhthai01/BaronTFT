'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './PatchBoard.module.css';

type PatchVersionOption = {
  id: string;
  label: string;
};

/** `.sidebar` cố ý sticky + overflow-y: auto để bộ lọc luôn trong tầm mắt khi
 * cuộn phần đọc sâu. Nhưng popup của <select> gốc trình duyệt lại bị ảnh hưởng
 * bởi overflow của tổ tiên nên vỡ layout, đè lên nội dung xung quanh. Portal
 * panel này thẳng ra <body> và tự định vị bằng toạ độ thật của nút bấm, thoát
 * hẳn khỏi vùng bị cắt/scroll của sidebar. */
export function PatchVersionSelect({
  id,
  options,
  value,
  onChange,
}: {
  id: string;
  options: PatchVersionOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function place() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }

    place();

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        className={styles.select}
        id={id}
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        {selected?.label}
      </button>
      {open
        ? createPortal(
            <div
              className={styles.selectPanel}
              ref={panelRef}
              role="listbox"
              aria-labelledby={id}
              style={{ top: coords.top, left: coords.left, width: coords.width }}
            >
              {options.map((option) => (
                <button
                  aria-selected={option.id === value}
                  className={styles.selectOption}
                  key={option.id}
                  role="option"
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
