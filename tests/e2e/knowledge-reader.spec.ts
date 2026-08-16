import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = '/kien-thuc-nen-tang/level-roll-outs-va-breakpoint';
const lessonSummary = 'Tính outs trước mỗi lần rolldown, chọn breakpoint lên cấp và đặt ngưỡng dừng rõ ràng — nền tảng cho các bài roll và xác suất nâng cao.';

test('desktop reader keeps one masthead and a readable measure', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop reader contract');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(lessonPath);

  const article = page.getByRole('article');
  await expect(article.getByRole('heading', { level: 1, name: 'Level, roll, outs và breakpoint' })).toHaveCount(1);
  await expect(page.getByText(lessonSummary, { exact: true })).toHaveCount(1);

  const metrics = await article.evaluate((node) => {
    const paragraph = node.querySelector('section p');
    const style = paragraph ? getComputedStyle(paragraph) : null;
    return {
      width: node.getBoundingClientRect().width,
      fontSize: style ? Number.parseFloat(style.fontSize) : 0,
      lineHeight: style ? Number.parseFloat(style.lineHeight) : 0,
    };
  });

  expect(metrics.width).toBeGreaterThanOrEqual(736);
  expect(metrics.width).toBeLessThanOrEqual(800);
  expect(metrics.fontSize).toBeGreaterThanOrEqual(17);
  expect(metrics.lineHeight).toBeGreaterThanOrEqual(28);
});

test('compact reader tools open accessible panels and keep article first', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile reader contract');

  await page.goto(lessonPath);

  const contentsTrigger = page.getByRole('button', { name: 'Mở mục lục bài' });
  await contentsTrigger.click();
  const dialog = page.getByRole('dialog', { name: 'Mục lục bài' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(contentsTrigger).toBeFocused();

  const orderIsCorrect = await page.getByRole('article').evaluate((node) => {
    const firstBlock = node.querySelector('#level-la-mua-slot-va-phan-phoi-shop');
    const actions = node.querySelector('[data-reader-actions]');
    return Boolean(firstBlock && actions && (firstBlock.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING));
  });

  expect(orderIsCorrect).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('reader has no serious automated accessibility violations', async ({ page }) => {
  await page.goto(lessonPath);

  const results = await new AxeBuilder({ page }).include('article').analyze();
  expect(results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')).toEqual([]);
});
