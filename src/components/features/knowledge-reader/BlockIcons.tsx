import type { LessonBlock } from '@/content/lessons';

export function BlockTypeIcon({ type }: { type: LessonBlock['type'] }) {
  switch (type) {
    case 'principles':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 11.6h.01" strokeLinecap="round" strokeWidth="2.6" />
        </svg>
      );
    case 'checklist':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <rect height="6" rx="1.2" width="6" x="3" y="4" />
          <path d="M4.4 7l1.1 1.1L7.6 6" />
          <path d="M12 6h9" />
          <rect height="6" rx="1.2" width="6" x="3" y="14" />
          <path d="M4.4 17l1.1 1.1 2.1-2.1" />
          <path d="M12 16h9" />
        </svg>
      );
    case 'pitfalls':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 3.5L22 20H2L12 3.5z" />
          <path d="M12 10v4.5" />
          <path d="M12 17.3h.01" strokeLinecap="round" strokeWidth="2.6" />
        </svg>
      );
    case 'drill':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <rect height="10" rx="1" width="2.4" x="2" y="7" />
          <rect height="10" rx="1" width="2.4" x="19.6" y="7" />
          <path d="M6.5 9v6" />
          <path d="M17.5 9v6" />
          <path d="M6.5 12h11" />
        </svg>
      );
    case 'scenario':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M8 3L4 7l4 4" />
          <path d="M4 7h16" />
          <path d="M16 21l4-4-4-4" />
          <path d="M20 17H4" />
        </svg>
      );
    case 'matrix':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <rect height="7" rx="1" width="7" x="3" y="3" />
          <rect height="7" rx="1" width="7" x="14" y="3" />
          <rect height="7" rx="1" width="7" x="3" y="14" />
          <rect height="7" rx="1" width="7" x="14" y="14" />
        </svg>
      );
    case 'concept':
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 5.5c0-1 .9-1.8 2-1.8h6v14.6H6c-1.1 0-2 .5-2 1.2V5.5z" />
          <path d="M20 5.5c0-1-.9-1.8-2-1.8h-6v14.6h6c1.1 0 2 .5 2 1.2V5.5z" />
        </svg>
      );
  }
}

export function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.3 2" />
    </svg>
  );
}

export function FlagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 3v18" />
      <path d="M5 4h12l-2.5 4L17 12H5" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 20l.9-4L14.6 6.3l3.1 3.1L8 19.1 4 20z" />
      <path d="M13 7.6l3.1 3.1" />
    </svg>
  );
}

export function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      aria-hidden="true"
      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
      viewBox="0 0 24 24"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
