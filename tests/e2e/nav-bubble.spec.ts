import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('NavBubble (mobile)', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'NavBubble chỉ hiển thị trên giao diện điện thoại');
  });

  test('mở panel nhóm, điều hướng và đóng lại khi đổi route', async ({ page }) => {
    await page.goto('/');
    const bubble = page.getByRole('button', { name: 'Mở điều hướng' });
    await expect(bubble).toBeVisible();

    await bubble.click();
    const panel = page.getByRole('dialog', { name: 'Điều hướng nhanh' });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('button', { name: /Tìm/ })).toBeVisible();
    await expect(panel.getByRole('heading', { name: 'Học' })).toBeVisible();
    await expect(panel.getByRole('heading', { name: 'Tra cứu' })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Kiến thức' })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Cây quyết định' })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Lộ trình' })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Mùa 18' })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Patch' })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Nguồn học' })).toBeVisible();
    await expect(panel.getByRole('button', { name: /Thu gọn vào mép/ })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Trang chủ' })).toHaveCount(0);
    await expect(panel.getByRole('link', { name: 'Review' })).toHaveCount(0);

    await panel.getByRole('link', { name: 'Checklist' }).click();
    await expect(page).toHaveURL(/\/checklist$/);
    await expect(panel).toBeHidden();
  });

  test('bàn phím: mũi tên đổi cạnh, Delete thu gọn, Space mở panel, Escape đóng', async ({ page }) => {
    await page.goto('/');
    const bubble = page.getByRole('button', { name: 'Mở điều hướng' });
    await bubble.focus();

    const rightBox = await bubble.boundingBox();
    const viewportWidth = page.viewportSize()?.width ?? 0;
    expect(rightBox!.x).toBeGreaterThan(viewportWidth / 2);

    await page.keyboard.press('ArrowLeft');
    const leftBox = await bubble.boundingBox();
    expect(leftBox!.x).toBeLessThan(viewportWidth / 2);

    await page.keyboard.press('ArrowRight');
    const backToRightBox = await bubble.boundingBox();
    expect(backToRightBox!.x).toBeGreaterThan(viewportWidth / 2);

    await page.keyboard.press('Delete');
    const collapsed = page.getByRole('button', { name: 'Mở rộng nút điều hướng' });
    await expect(collapsed).toBeVisible();
    const collapsedBox = await collapsed.boundingBox();
    expect(collapsedBox!.width).toBeGreaterThanOrEqual(44);
    expect(collapsedBox!.height).toBeGreaterThanOrEqual(44);

    await page.keyboard.press(' ');
    const expanded = page.getByRole('button', { name: 'Mở điều hướng' });
    await expect(expanded).toBeVisible();

    await expanded.focus();
    await page.keyboard.press(' ');
    const panel = page.getByRole('dialog', { name: 'Điều hướng nhanh' });
    await expect(panel).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(expanded).toBeFocused();
  });

  test('kéo bubble qua cạnh trái thì snap và ở lại đúng cạnh trái', async ({ page }) => {
    await page.goto('/');
    const bubble = page.getByRole('button', { name: 'Mở điều hướng' });
    const box = await bubble.boundingBox();
    const viewportWidth = page.viewportSize()?.width ?? 0;

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(24, box!.y + box!.height / 2, { steps: 12 });
    await page.mouse.up();

    await page.waitForTimeout(1000);
    const settledBox = await bubble.boundingBox();
    expect(settledBox!.x).toBeLessThan(viewportWidth / 2);
  });

  test('kéo bubble xuống sát đáy chỉ clamp vị trí, không tự thu gọn', async ({ page }) => {
    await page.goto('/');
    const bubble = page.getByRole('button', { name: 'Mở điều hướng' });
    const box = await bubble.boundingBox();
    const viewportHeight = page.viewportSize()?.height ?? 0;

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, viewportHeight - 20, { steps: 12 });
    await page.mouse.up();

    await page.waitForTimeout(1000);
    // Vẫn ở trạng thái mở rộng bình thường — thu gọn chỉ còn kích hoạt qua phím Delete.
    await expect(page.getByRole('button', { name: 'Mở điều hướng' })).toBeVisible();
    const settledBox = await bubble.boundingBox();
    expect(settledBox!.y + settledBox!.height).toBeLessThanOrEqual(viewportHeight);
  });

  test('bubble ở gần đỉnh màn hình thì panel lật xuống dưới thay vì tràn lên trên', async ({ page }) => {
    await page.goto('/');
    const bubble = page.getByRole('button', { name: 'Mở điều hướng' });
    await bubble.focus();

    // Nhảy bubble lên sát mép trên bằng Ctrl+ArrowUp — xác định vị trí chính xác
    // thay vì mô phỏng kéo, để test không phụ thuộc vào timing của cử chỉ kéo.
    await page.keyboard.press('Control+ArrowUp');
    const bubbleBox = await bubble.boundingBox();

    await page.keyboard.press(' ');
    const panel = page.getByRole('dialog', { name: 'Điều hướng nhanh' });
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('data-placement', 'below');

    const panelBox = await panel.boundingBox();
    expect(panelBox!.y).toBeGreaterThanOrEqual(bubbleBox!.y + bubbleBox!.height);
    expect(panelBox!.y).toBeGreaterThanOrEqual(0);
  });

  test('touch utility thu gọn vào mép nhưng vẫn giữ hit target', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Mở điều hướng' }).click();
    await page.getByRole('dialog', { name: 'Điều hướng nhanh' }).getByRole('button', { name: /Thu gọn vào mép/ }).click();

    const collapsed = page.getByRole('button', { name: 'Mở rộng nút điều hướng' });
    await expect(collapsed).toBeVisible();
    const box = await collapsed.boundingBox();
    const viewportWidth = page.viewportSize()?.width ?? 0;
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.x + box!.width).toBeGreaterThan(viewportWidth - 20);
  });

  test('storage hỏng không đẩy bubble khỏi viewport', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('baron-tft/nav-bubble', JSON.stringify({ side: 'top', offsetY: Number.POSITIVE_INFINITY, collapsed: 'yes' }));
    });
    await page.goto('/');

    const bubble = page.getByRole('button', { name: 'Mở điều hướng' });
    await expect(bubble).toBeVisible();
    const box = await bubble.boundingBox();
    const viewport = page.viewportSize()!;
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  });

  test('breakpoint gate: 979px hiện bubble, 981px không khởi tạo', async ({ page }) => {
    await page.setViewportSize({ width: 979, height: 720 });
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Mở điều hướng' })).toBeVisible();

    await page.setViewportSize({ width: 981, height: 720 });
    await expect(page.getByTestId('nav-bubble-root')).toHaveCount(0);
  });

  test('panel mở không có lỗi accessibility nghiêm trọng', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Mở điều hướng' }).click();
    await expect(page.getByRole('dialog', { name: 'Điều hướng nhanh' })).toBeVisible();

    const results = await new AxeBuilder({ page }).include('[data-testid="nav-bubble-root"]').analyze();
    const seriousOrWorse = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
  });
});
