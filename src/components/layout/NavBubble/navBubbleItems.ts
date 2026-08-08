export type NavBubbleAction =
  | { kind: 'link'; href: string }
  | { kind: 'search' };

export type NavBubbleItem = {
  id: string;
  icon: 'house' | 'book-open' | 'layout-grid' | 'list-checks' | 'file-clock' | 'search';
  label: string;
  action: NavBubbleAction;
};

export const navBubbleItems: NavBubbleItem[] = [
  { id: 'home', icon: 'house', label: 'Trang chủ', action: { kind: 'link', href: '/' } },
  { id: 'kien-thuc', icon: 'book-open', label: 'Kiến thức', action: { kind: 'link', href: '/kien-thuc-nen-tang' } },
  { id: 'mua-18', icon: 'layout-grid', label: 'Mùa 18', action: { kind: 'link', href: '/mua-18' } },
  { id: 'checklist', icon: 'list-checks', label: 'Checklist', action: { kind: 'link', href: '/checklist' } },
  { id: 'patch', icon: 'file-clock', label: 'Patch', action: { kind: 'link', href: '/patch' } },
  { id: 'search', icon: 'search', label: 'Tìm', action: { kind: 'search' } },
];
