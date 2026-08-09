export type PrimaryNavigationLink = {
  href: string;
  label: string;
  navGroup: 'Học' | 'Tra cứu' | 'Thực hành';
  shortLabel?: string;
};

export const primaryNavigationLinks: PrimaryNavigationLink[] = [
  { href: '/kien-thuc-nen-tang', label: 'Kiến thức nền tảng', shortLabel: 'Kiến thức', navGroup: 'Học' },
  { href: '/cay-quyet-dinh', label: 'Cây quyết định', shortLabel: 'Cây quyết định', navGroup: 'Học' },
  { href: '/lo-trinh', label: 'Lộ trình', navGroup: 'Học' },
  { href: '/checklist', label: 'Checklist', navGroup: 'Thực hành' },
  { href: '/mua-18', label: 'Mùa 18', navGroup: 'Tra cứu' },
  { href: '/patch', label: 'Patch', navGroup: 'Tra cứu' },
  { href: '/nguon-hoc', label: 'Nguồn học', navGroup: 'Tra cứu' },
];

function normalizePathname(pathname: string) {
  if (pathname === '/') {
    return pathname;
  }

  return pathname.replace(/\/+$/, '') || '/';
}

export function isNavigationRouteActive(pathname: string, href: string) {
  const currentPath = normalizePathname(pathname);
  const targetPath = normalizePathname(href);

  if (targetPath === '/kien-thuc-nen-tang') {
    return currentPath === targetPath || currentPath.startsWith('/kien-thuc-nen-tang/');
  }

  if (targetPath === '/mua-18') {
    return currentPath === targetPath || currentPath.startsWith('/mua-18/');
  }

  return currentPath === targetPath;
}
