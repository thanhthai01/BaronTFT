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

test('command palette opens with keyboard shortcut', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
  await expect(page.getByPlaceholder(/Tìm bài học/i)).toBeVisible();
  await page.getByPlaceholder(/Tìm bài học/i).fill('rolldown');
  await expect(page.getByText('Mở checklist trước rolldown')).toBeVisible();
});
