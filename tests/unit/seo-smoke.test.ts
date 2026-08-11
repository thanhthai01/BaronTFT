import { describe, expect, it } from 'vitest';
import sitemap from '../../src/app/sitemap';
import robots from '../../src/app/robots';
import { metadata as patchMetadata } from '../../src/app/patch/page';
import { generateMetadata as generatePatchMetadata, generateStaticParams as generatePatchParams } from '../../src/app/patch/[version]/page';
import { patchReports } from '../../src/content/patch-notes';
import { SITE_URL } from '../../src/lib/site';

describe('SEO smoke checks', () => {
  it('keeps sitemap URLs unique and rooted at SITE_URL', () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls.length).toBeGreaterThan(100);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.startsWith(`${SITE_URL}/`))).toBe(true);
  });

  it('keeps latest patch canonical at /patch without duplicate version URL', () => {
    const latest = patchReports[0];
    const urls = sitemap().map((entry) => entry.url);

    expect(patchMetadata.alternates?.canonical).toBe('/patch');
    expect(urls).toContain(`${SITE_URL}/patch`);
    expect(urls).not.toContain(`${SITE_URL}/patch/${latest.id}`);
    expect(generatePatchParams()).not.toContainEqual({ version: latest.id });
  });

  it('keeps older patch pages self-canonical', async () => {
    const older = patchReports[1];
    const metadata = await generatePatchMetadata({ params: Promise.resolve({ version: older.id }) });

    expect(metadata.alternates?.canonical).toBe(`/patch/${older.id}`);
  });

  it('blocks indexing outside production by default', () => {
    expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } });
  });
});
