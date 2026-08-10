import type { NavBubbleItem } from './navBubbleItems';

/** Icon stroke vẽ tay lại theo hình dáng bộ Lucide (ISC license, lucide.dev)
 * — không cài package, giữ đúng convention SVG inline sẵn có ở BlockIcons.tsx. */
export function NavBubbleIcon({ icon }: { icon: NavBubbleItem['icon'] }) {
  switch (icon) {
    case 'clipboard-list':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M9 4.5h6l.7 2H18a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19V8A1.5 1.5 0 0 1 6 6.5h2.3L9 4.5Z" />
          <path d="M9 4.5h6" />
          <path d="M8 11h8" />
          <path d="M8 15h5" />
        </svg>
      );
    case 'book-open':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 6.5c-1.6-1.3-3.7-2-6.5-2A1.5 1.5 0 0 0 4 6v11c2.8 0 4.9.7 6.5 2 1.6-1.3 3.7-2 6.5-2s3.7.7 6.5.7V6a1.5 1.5 0 0 0-1.5-1.5c-2.8 0-4.9.7-6.5 2v13" />
        </svg>
      );
    case 'flag':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5.5 21V4.5" />
          <path d="M5.5 5.5h9.2l-.8 3 3.1 2.3H5.5" />
        </svg>
      );
    case 'layout-grid':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <rect height="7" rx="1.4" width="7" x="3.5" y="3.5" />
          <rect height="7" rx="1.4" width="7" x="13.5" y="3.5" />
          <rect height="7" rx="1.4" width="7" x="3.5" y="13.5" />
          <rect height="7" rx="1.4" width="7" x="13.5" y="13.5" />
        </svg>
      );
    case 'map':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m8 5-4 2v12l4-2 8 2 4-2V5l-4 2-8-2Z" />
          <path d="M8 5v12" />
          <path d="M16 7v12" />
        </svg>
      );
    case 'list-checks':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M3.5 6.5 5 8l2.5-2.5" />
          <path d="M3.5 13 5 14.5 7.5 12" />
          <path d="M11 6.5h9.5" />
          <path d="M11 13h9.5" />
          <path d="M11 19.5h9.5" />
          <path d="M3.5 19.5h1.6" />
        </svg>
      );
    case 'file-clock':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M13 3.5H6.8a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h6.4" />
          <path d="M13 3.5 17.5 8" />
          <path d="M13 3.5V7a1 1 0 0 0 1 1h3.5" />
          <circle cx="16.5" cy="15" r="4.5" />
          <path d="M16.5 12.8V15l1.6 1" />
        </svg>
      );
    case 'search':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M19.5 19.5 15.4 15.4" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

/** Icon mở/đóng hiển thị trên chính bubble — chevron hướng ra mép ngoài khi
 * thu gọn (collapsed), dấu X khi panel đang mở, chấm tròn khi idle. */
export function NavBubbleStateIcon({ state, side }: { state: 'idle' | 'open' | 'collapsed'; side: 'left' | 'right' }) {
  if (state === 'open') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
      </svg>
    );
  }

  if (state === 'collapsed') {
    const pointsRight = side === 'left';
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d={pointsRight ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="6" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="18" r="1.6" />
    </svg>
  );
}
