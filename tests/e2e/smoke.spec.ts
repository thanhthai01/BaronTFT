import { expect, test } from '@playwright/test';

test('desktop smoke loads core public routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Học cách thắng lobby/i })).toBeVisible();

  await page.goto('/patch');
  await expect(page.getByRole('heading', { name: 'Patch', level: 1 })).toBeVisible();

  await page.goto('/mua-18/ma-tran-toc-he');
  await expect(page.getByRole('heading', { name: 'Ma trận tộc hệ', level: 1 })).toBeVisible();

  await page.goto('/checklist');
  await expect(page.getByRole('heading', { name: 'Checklist trong trận' })).toBeVisible();
});
