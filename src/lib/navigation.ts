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
