import { primaryNavigationLinks } from '@/lib/navigation';

export type NavBubbleIconName =
  | 'book-open'
  | 'clipboard-list'
  | 'file-clock'
  | 'flag'
  | 'layout-grid'
  | 'list-checks'
  | 'map'
  | 'search';

export type NavBubbleAction =
  | { kind: 'link'; href: string }
  | { kind: 'search' }
  | { kind: 'collapse' };

export type NavBubbleItem = {
  id: string;
  icon: NavBubbleIconName;
  label: string;
  description?: string;
  action: NavBubbleAction;
  emphasis?: 'primary' | 'utility';
};

export type NavBubbleSection = {
  id: string;
  label?: string;
  items: NavBubbleItem[];
};

const iconByHref: Record<string, NavBubbleIconName> = {
  '/kien-thuc-nen-tang': 'book-open',
  '/cay-quyet-dinh': 'map',
  '/lo-trinh': 'flag',
  '/checklist': 'list-checks',
  '/mua-18': 'layout-grid',
  '/patch': 'file-clock',
  '/nguon-hoc': 'clipboard-list',
};

function navigationItem(href: string): NavBubbleItem {
  const link = primaryNavigationLinks.find((item) => item.href === href);
  if (!link) throw new Error(`Missing primary navigation link for ${href}`);

  return {
    id: href.replace(/^\//, '').replace(/\//g, '-') || 'home',
    icon: iconByHref[href],
    label: link.shortLabel ?? link.label,
    action: { kind: 'link', href },
    emphasis: href === '/checklist' ? 'primary' : undefined,
  };
}

export const navBubbleSections: NavBubbleSection[] = [
  {
    id: 'top-actions',
    items: [
      {
        id: 'search',
        icon: 'search',
        label: 'Tìm',
        description: 'Mở command palette',
        action: { kind: 'search' },
      },
      navigationItem('/checklist'),
    ],
  },
  {
    id: 'learn',
    label: 'Học',
    items: [navigationItem('/kien-thuc-nen-tang'), navigationItem('/cay-quyet-dinh'), navigationItem('/lo-trinh')],
  },
  {
    id: 'lookup',
    label: 'Tra cứu',
    items: [navigationItem('/mua-18'), navigationItem('/patch'), navigationItem('/nguon-hoc')],
  },
  {
    id: 'utilities',
    items: [
      {
        id: 'collapse',
        icon: 'layout-grid',
        label: 'Thu gọn vào mép',
        description: 'Giữ nút nhỏ lại nhưng vẫn chạm được',
        action: { kind: 'collapse' },
        emphasis: 'utility',
      },
    ],
  },
];

export const navBubbleItems = navBubbleSections.flatMap((section) => section.items);
