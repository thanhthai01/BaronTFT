import { describe, expect, it } from 'vitest';
import { isNavigationRouteActive } from '../../src/lib/navigation';

describe('isNavigationRouteActive', () => {
  it('matches normal routes exactly', () => {
    expect(isNavigationRouteActive('/checklist', '/checklist')).toBe(true);
    expect(isNavigationRouteActive('/review', '/review')).toBe(true);
    expect(isNavigationRouteActive('/checklist', '/review')).toBe(false);
  });

  it('keeps normal nested-looking routes inactive unless they are exact matches', () => {
    expect(isNavigationRouteActive('/review/chi-tiet', '/review')).toBe(false);
    expect(isNavigationRouteActive('/patch-notes', '/patch')).toBe(false);
  });

  it('groups lesson pages under foundational knowledge', () => {
    expect(isNavigationRouteActive('/kien-thuc-nen-tang', '/kien-thuc-nen-tang')).toBe(true);
    expect(isNavigationRouteActive('/kien-thuc-nen-tang/kinh-te-level-roll', '/kien-thuc-nen-tang')).toBe(true);
    expect(isNavigationRouteActive('/kien-thuc-nen-tang/kinh-te-level-roll', '/checklist')).toBe(false);
  });

  it('groups Mùa 18 entity/section pages under mùa 18', () => {
    expect(isNavigationRouteActive('/mua-18', '/mua-18')).toBe(true);
    expect(isNavigationRouteActive('/mua-18/tuong/akali', '/mua-18')).toBe(true);
    expect(isNavigationRouteActive('/mua-18/chi-tiet-tuong', '/mua-18')).toBe(true);
    expect(isNavigationRouteActive('/mua-18/tuong/akali', '/checklist')).toBe(false);
  });

  it('normalizes trailing slashes consistently', () => {
    expect(isNavigationRouteActive('/checklist/', '/checklist')).toBe(true);
    expect(isNavigationRouteActive('/checklist', '/checklist/')).toBe(true);
    expect(isNavigationRouteActive('/kien-thuc-nen-tang/', '/kien-thuc-nen-tang')).toBe(true);
  });
});
