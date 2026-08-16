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

test('desktop reader separates the reading sheet and shows one table of contents', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop reading hierarchy');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(lessonPath);

  await expect(page.locator('aside[aria-label="Mục lục kiến thức nền tảng"]')).toHaveCount(0);
  const article = page.getByRole('article');
  const readerRail = page.locator('aside[aria-label="Mục lục bài"]');
  const lessonTrigger = readerRail.getByRole('button', { name: 'Mở danh sách bài' });

  await expect(readerRail).toBeVisible();
  await expect(article.getByRole('button', { name: 'Mở danh sách bài' })).toHaveCount(0);
  await expect(lessonTrigger).toBeVisible();

  const surfaces = await article.evaluate((article) => {
    const articleStyle = getComputedStyle(article);
    const bodyStyle = getComputedStyle(document.body);
    const regularHeading = article.querySelector<HTMLElement>('[data-block-type="concept"] h2');
    return {
      articleBackground: articleStyle.backgroundColor,
      bodyBackground: bodyStyle.backgroundColor,
      inlinePadding: Number.parseFloat(articleStyle.paddingInlineStart),
      headingBackground: regularHeading ? getComputedStyle(regularHeading).backgroundColor : 'transparent',
    };
  });

  expect(surfaces.articleBackground).not.toBe(surfaces.bodyBackground);
  expect(surfaces.articleBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(surfaces.inlinePadding).toBeGreaterThanOrEqual(32);
  expect(surfaces.headingBackground).not.toBe('rgba(0, 0, 0, 0)');

  const railMetrics = await readerRail.evaluate((rail) => {
    const railStyle = getComputedStyle(rail);
    const bodyStyle = getComputedStyle(document.body);
    const button = rail.querySelector('button');
    const buttonStyle = button ? getComputedStyle(button) : null;
    return {
      background: railStyle.backgroundColor,
      bodyBackground: bodyStyle.backgroundColor,
      buttonHeight: button?.getBoundingClientRect().height ?? 0,
      buttonPaddingInline: buttonStyle ? Number.parseFloat(buttonStyle.paddingInlineStart) : 0,
    };
  });

  expect(railMetrics.background).not.toBe(railMetrics.bodyBackground);
  expect(railMetrics.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(railMetrics.buttonHeight).toBeGreaterThanOrEqual(44);
  expect(railMetrics.buttonPaddingInline).toBeGreaterThanOrEqual(12);
});

test('practice worksheets stay out of the primary reading flow until opened', async ({ page }) => {
  await page.goto(lessonPath);

  const practiceBlock = page.locator('#bai-tap');
  const disclosure = practiceBlock.locator('details');

  await expect(disclosure).not.toHaveAttribute('open', '');
  await expect(practiceBlock.getByText('Phiếu rolldown', { exact: true })).toBeHidden();
  await practiceBlock.locator('summary').click();
  await expect(practiceBlock.getByText('Phiếu rolldown', { exact: true })).toBeVisible();
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
