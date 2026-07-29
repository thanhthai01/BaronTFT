import { expect, test } from '@playwright/test';

test('home decision board updates the diagnostic panel', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Học cách thắng lobby/i })).toBeVisible();
  await page.getByRole('button', { name: 'ITEM' }).click();
  const selectedPanel = page.getByRole('complementary').filter({ has: page.getByRole('heading', { name: 'Items' }) });
  await expect(selectedPanel.getByText(/chờ bài hoàn hảo/i)).toBeVisible();
});

test('foundational knowledge reader switches lessons', async ({ page }) => {
  await page.goto('/kien-thuc-nen-tang');
  await expect(page.getByRole('heading', { name: /Đọc đúng kỹ năng/i })).toBeVisible();
  const desktopTocButton = page.getByRole('button', { name: /Gold \/ Roll/i });
  if (await desktopTocButton.isVisible()) {
    await desktopTocButton.click();
  } else {
    await page.getByLabel('Chọn bài học').selectOption('kinh-te-level-roll');
  }
  await expect(page.getByRole('heading', { name: 'Kinh tế, lên cấp và roll' })).toBeVisible();
  await expect(page.getByText(/Trước một rolldown tốt/i)).toBeVisible();
});

test('checklist persists a checked item after reload', async ({ page }) => {
  await page.goto('/checklist');
  const checkbox = page.getByLabel(/Lõi\/portal đang khuyến khích tempo/i);
  await checkbox.check();
  await page.reload();
  await expect(page.getByLabel(/Lõi\/portal đang khuyến khích tempo/i)).toBeChecked();
});

test('review lab generates markdown summary', async ({ page }) => {
  await page.goto('/review');
  await page.getByLabel('Placement').fill('6th');
  await page.getByLabel('Comp / line').fill('AD tempo');
  await page.getByLabel('Lỗi đầu tiên có thể sửa').fill('Rolled without target');
  await expect(page.getByText('- Placement: 6th')).toBeVisible();
  await expect(page.getByText('- Comp/line: AD tempo')).toBeVisible();
});

test('command palette opens from the visible search control', async ({ page }) => {
  await page.goto('/');
  const isDesktop = (page.viewportSize()?.width ?? 0) > 980;

  if (isDesktop) {
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
  } else {
    await page
      .getByRole('navigation', { name: 'Điều hướng nhanh trên điện thoại' })
      .getByRole('button', { name: 'Tìm' })
      .click();
  }

  await expect(page.getByPlaceholder(/Tìm bài học/i)).toBeVisible();
  await page.getByPlaceholder(/Tìm bài học/i).fill('rolldown');
  await expect(page.getByText('Mở checklist trước rolldown')).toBeVisible();
});

test('visible navigation marks the current route', async ({ page }) => {
  await page.goto('/checklist');
  const isDesktop = (page.viewportSize()?.width ?? 0) > 980;
  const nav = page.getByRole('navigation', { name: isDesktop ? 'Điều hướng chính' : 'Điều hướng nhanh trên điện thoại' });
  await expect(nav.getByRole('link', { name: isDesktop ? 'Checklist' : /^Checklist$/ })).toHaveAttribute('aria-current', 'page');

  if (isDesktop) {
    await expect(nav.getByRole('link', { name: 'Review' })).not.toHaveAttribute('aria-current', 'page');
  } else {
    await expect(nav.getByRole('link', { name: 'Review' })).not.toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('button', { name: 'Tìm' })).not.toHaveAttribute('aria-current', 'page');
  }

  await page.goto('/bai-hoc/kinh-te-level-roll');
  const lessonNav = page.getByRole('navigation', { name: isDesktop ? 'Điều hướng chính' : 'Điều hướng nhanh trên điện thoại' });
  await expect(lessonNav.getByRole('link', { name: isDesktop ? 'Kiến thức nền tảng' : 'Học' })).toHaveAttribute('aria-current', 'page');
});

test('desktop checklist stage fits the initial viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop-only viewport fit check');

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/checklist');
  await page.getByRole('tab', { name: 'Stage 4' }).click();

  await expect(page.getByRole('heading', { name: 'Checklist trong trận' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Focus mode' })).toBeVisible();
  await expect(page.getByText(/câu đã tick/i)).toBeVisible();

  const stageItems = [
    /Nếu roll bây giờ, mình đang tìm chính xác điều gì/i,
    /Điểm dừng rolldown là vàng/i,
    /Nếu không ra bài, pivot an toàn nhất là gì/i,
    /Carry và tank đã xếp theo lobby thật chưa/i,
  ];

  for (const item of stageItems) {
    await expect(page.getByLabel(item)).toBeVisible();
  }

  const finalCard = page.getByText(/Carry và tank đã xếp theo lobby thật chưa/i).locator('xpath=ancestor::label[1]');
  const finalCardBox = await finalCard.boundingBox();
  expect(finalCardBox).not.toBeNull();
  expect((finalCardBox?.y ?? 0) + (finalCardBox?.height ?? 0)).toBeLessThanOrEqual(720);
});
