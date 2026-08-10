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
  await expect(page.getByRole('heading', { name: 'Tư duy TFT xuyên mùa' })).toBeVisible();
  // TOC desktop là accordion — bài học nằm trong nhóm khác category đang active
  // (mặc định là "Ra quyết định") chỉ có trong DOM sau khi mở nhóm chứa nó.
  const desktopGroupToggle = page.getByRole('button', { name: /Vận hành kinh tế/i });
  if (await desktopGroupToggle.isVisible()) {
    await desktopGroupToggle.click();
    await page.getByRole('link', { name: /Level, roll, outs và breakpoint/i }).click();
  } else {
    await page.getByLabel('Chọn bài học').selectOption('level-roll-outs-va-breakpoint');
  }
  await expect(page.getByRole('heading', { name: 'Level, roll, outs và breakpoint' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Thiết kế outs trước rolldown/i })).toBeVisible();
});

test('mobile lesson shows apply before article content without lesson TOC', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile-only lesson reading order');

  await page.goto('/kien-thuc-nen-tang/level-roll-outs-va-breakpoint');
  const article = page.locator('article');
  await expect(article.getByLabel('Chọn bài học')).toBeVisible();
  const applyPanel = article.getByLabel('Áp dụng ngay');
  await expect(applyPanel.getByRole('heading', { name: 'Áp dụng ngay' })).toBeVisible();
  await expect(applyPanel.getByText('Tôi có ít nhất ba nhóm outs.')).toBeVisible();
  await expect(applyPanel.getByText('Roll một số vàng ngẫu nhiên.')).toBeVisible();
  await expect(applyPanel.getByText('Trước roll ghi:')).toBeVisible();
  await expect(article.getByRole('link', { name: 'Patch cập nhật' })).toHaveCount(0);
  await expect(article.getByRole('link', { name: 'Xem Mùa 18' })).toHaveCount(0);

  await expect(article.getByRole('heading', { name: 'Trong bài' })).toHaveCount(0);
  const order = await article.evaluate((node) => {
    const apply = node.querySelector('[aria-labelledby="mobile-lesson-apply-title"]');
    const firstBlock = node.querySelector('#level-la-mua-slot-va-phan-phoi-shop');
    return apply && firstBlock
      ? Boolean(apply.compareDocumentPosition(firstBlock) & Node.DOCUMENT_POSITION_FOLLOWING)
      : false;
  });
  expect(order).toBe(true);
});

test('checklist persists a checked item after reload', async ({ page }) => {
  await page.goto('/checklist');
  const checkbox = page.getByLabel(/Lõi\/portal đang khuyến khích tempo/i);
  await checkbox.check();
  await page.reload();
  await expect(page.getByLabel(/Lõi\/portal đang khuyến khích tempo/i)).toBeChecked();
});

test('review route redirects to checklist', async ({ page }) => {
  await page.goto('/review');
  await expect(page).toHaveURL(/\/checklist$/);
  await expect(page.getByRole('heading', { name: 'Checklist trong trận' })).toBeVisible();
});

test('post-game stage keeps old checklist interface', async ({ page }) => {
  await page.goto('/checklist?stage=post');
  await expect(page.getByRole('tab', { name: 'Sau trận' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByLabel(/Lỗi đầu tiên có thể sửa nằm ở stage nào/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Debrief 30–60 giây' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Lưu debrief' })).toHaveCount(0);
});

test('command palette opens from the visible search control', async ({ page }) => {
  await page.goto('/');
  const isDesktop = (page.viewportSize()?.width ?? 0) > 980;

  if (isDesktop) {
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
  } else {
    await page.getByRole('button', { name: 'Mở điều hướng' }).click();
    await page.getByRole('dialog', { name: 'Điều hướng nhanh' }).getByRole('button', { name: 'Tìm' }).click();
  }

  await expect(page.getByPlaceholder(/Tìm bài học/i)).toBeVisible();
  await page.getByPlaceholder(/Tìm bài học/i).fill('rolldown');
  const actions = page.getByLabel('Hành động');
  await expect(actions.getByText('Mở checklist trước rolldown')).toBeVisible();
  await page.getByPlaceholder(/Tìm bài học/i).fill('review vod');
  await expect(actions.getByText('Review VOD sâu')).toBeVisible();
});

test('mobile decision tree completes by guided taps', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile-only guided decision tree flow');

  await page.goto('/cay-quyet-dinh');
  await expect(page.getByRole('heading', { name: 'Tổng hợp theo giai đoạn trận đấu' })).toBeVisible();
  await expect(page.locator('svg[aria-label^="Mindmap cây quyết định"]')).toBeHidden();

  await page.getByRole('button', { name: /Stage 2/ }).click();
  await expect(page.getByRole('heading', { name: /bench và shop/i })).toBeVisible();
  await page.getByRole('button', { name: /Mạnh bất ngờ/ }).click();
  await expect(page.getByRole('heading', { name: /Tối ưu board mạnh nhất hiện có/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Đào sâu: Khi nào chơi winstreak\/losestreak/i })).toBeVisible();

  await page.getByRole('button', { name: 'Câu trước' }).click();
  await expect(page.getByRole('heading', { name: /bench và shop/i })).toBeVisible();
  await page.getByRole('button', { name: 'Bắt đầu lại' }).click();
  await expect(page.getByRole('heading', { name: /Trận đấu hiện tại đang ở giai đoạn nào/i })).toBeVisible();
});

test('desktop decision tree keeps interactive map', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop-only decision map flow');

  await page.goto('/cay-quyet-dinh');
  const map = page.locator('svg[aria-label^="Mindmap cây quyết định"]');
  await expect(map).toBeVisible();
  await expect(map).toHaveAttribute('role', 'group');
  await expect(page.getByText(/Cuộn để zoom/)).toBeVisible();
});

test('visible navigation marks the current route', async ({ page }) => {
  await page.goto('/checklist');
  const isDesktop = (page.viewportSize()?.width ?? 0) > 980;

  if (isDesktop) {
    const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
    await expect(nav.getByRole('link', { name: 'Checklist' })).toHaveAttribute('aria-current', 'page');

    // Trước đây chỗ này bám vào link "Review" — link đó đã bị bỏ khỏi thanh điều
    // hướng nên test hỏng. Thay bằng chính bất biến cần kiểm: đúng MỘT mục được
    // đánh dấu là trang hiện tại. Không bám nhãn nào nên đổi, thêm hay bớt mục
    // điều hướng sau này cũng không làm hỏng test.
    await expect(nav.locator('a[aria-current="page"]')).toHaveCount(1);

    await page.goto('/kien-thuc-nen-tang/level-roll-outs-va-breakpoint');
    const lessonNav = page.getByRole('navigation', { name: 'Điều hướng chính' });
    await expect(lessonNav.getByRole('link', { name: 'Kiến thức nền tảng' })).toHaveAttribute('aria-current', 'page');
    return;
  }

  // Mobile: điều hướng là NavBubble — chỉ hiện mục sau khi mở panel.
  await page.getByRole('button', { name: 'Mở điều hướng' }).click();
  const panel = page.getByRole('dialog', { name: 'Điều hướng nhanh' });
  await expect(panel.getByRole('link', { name: 'Checklist' })).toHaveAttribute('aria-current', 'page');
  await expect(panel.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(panel.getByRole('button', { name: 'Tìm' })).not.toHaveAttribute('aria-current', 'page');
  await page.keyboard.press('Escape');

  await page.goto('/kien-thuc-nen-tang/level-roll-outs-va-breakpoint');
  await page.getByRole('button', { name: 'Mở điều hướng' }).click();
  const lessonPanel = page.getByRole('dialog', { name: 'Điều hướng nhanh' });
  await expect(lessonPanel.getByRole('link', { name: 'Kiến thức' })).toHaveAttribute('aria-current', 'page');
});

test('compact desktop header keeps search visible', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop-only responsive check');

  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/');

  await expect(page.getByRole('navigation', { name: 'Điều hướng chính' })).toBeVisible();
  const search = page.getByRole('button', { name: 'Mở tìm kiếm nhanh' });
  await expect(search).toBeVisible();
  await expect(page.getByRole('banner').getByRole('link', { name: 'Mở checklist', exact: true })).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await search.click();
  await expect(page.getByPlaceholder(/Tìm bài học/i)).toBeVisible();
});

test('mobile Set18 matrix opens a zoomable overview instead of live table', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile-only Set18 matrix overview');

  await page.goto('/mua-18/ma-tran-toc-he');
  const trigger = page.getByRole('button', { name: /Ma trận tổng quan/ });
  await expect(trigger).toBeVisible();
  await expect(page.getByRole('table')).toHaveCount(0);
  await expect(page.locator('.specialBox')).toHaveCount(0);

  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Tổng quan Set 18' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Đóng ma trận phóng to' })).toBeFocused();
  await expect(dialog.getByText('100%')).toBeVisible();
  await dialog.getByRole('button', { name: 'Phóng to' }).click();
  await expect(dialog.getByText('125%')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('desktop Set18 matrix keeps live table', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop-only Set18 matrix');

  await page.goto('/mua-18/ma-tran-toc-he');
  await expect(page.getByRole('table').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Ma trận tổng quan/ })).toBeHidden();
});

test('mobile back-to-top returns to filters', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile-only back-to-top control');

  await page.goto('/mua-18/nang-cap');
  await expect(page.getByRole('heading', { name: 'Nâng cấp (Augment)' })).toBeVisible();
  await expect(page.getByText(/Đang hiển thị 48 \/ \d+ nâng cấp/)).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const backToTop = page.getByRole('button', { name: 'Về đầu trang' });
  await expect(backToTop).toHaveAttribute('data-visible', 'true');
  await backToTop.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(120);
  await expect(page.getByLabel('Chọn phần nội dung')).toBeVisible();
});

test('Set18 section route stays synchronized and supports history', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop-only Set18 flow');

  await page.goto('/mua-18/nang-cap');
  await expect(page.getByRole('heading', { name: 'Nâng cấp (Augment)' })).toBeVisible();
  await expect(page.getByText(/Đang hiển thị 48 \/ \d+ nâng cấp/)).toBeVisible();

  await page.getByRole('link', { name: /Chi tiết tướng/ }).click();
  await expect(page).toHaveURL(/\/mua-18\/chi-tiet-tuong/, { timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'Chi tiết tướng', level: 1 })).toBeVisible();

  const flip = page.getByRole('button', { name: 'Xem số liệu của Akali, dạng AD' });
  await expect(flip).toHaveAttribute('aria-pressed', 'false');
  await flip.click();
  await expect(page.getByRole('button', { name: 'Xem kỹ năng của Akali, dạng AD' })).toHaveAttribute('aria-pressed', 'true');

  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Nâng cấp (Augment)' })).toBeVisible();
  await page.getByRole('button', { name: /Hiển thị thêm 48/ }).click();
  await expect(page.getByText(/Đang hiển thị 96 \/ \d+ nâng cấp/)).toBeVisible();
});

test('phone hides patch presentation entry point', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Phone-only Patch Presentation check');

  await page.goto('/patch');
  await expect(page.getByRole('heading', { name: 'Patch', level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Trình chiếu' })).toHaveCount(0);
});

test('Patch selector switches reports and labels personal analysis', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop-only Patch flow');

  await page.goto('/patch');
  await expect(page.getByRole('heading', { name: 'Patch', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bản vá này ảnh hưởng gì tới game' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Trình chiếu' })).toBeVisible();

  // Danh sách bản vá là listbox custom vì sidebar sticky có overflow; kèm dòng
  // meta nói ngày cập nhật và nguồn.
  const selector = page.getByLabel('Chọn bản vá');
  await expect(selector).toBeVisible();
  await expect(page.getByText('Cập nhật 07/08/2026')).toBeVisible();
  await expect(page.getByText(/Nguồn: PBE — TheTruexy/)).toBeVisible();

  // Số liệu chính thức phải có nhãn nguồn để không nhầm với nhận định biên tập.
  await expect(page.getByText('Theo patch note gốc').first()).toBeVisible();

  await selector.click();
  await page.getByRole('option', { name: /PBE 06\/08\/2026 \(18\.1z\)/ }).click();
  await expect(page.getByText(/Bản vá PBE nhẹ, chủ yếu bugfix/)).toBeVisible();
  await expect(page.getByText('Cập nhật 06/08/2026')).toBeVisible();
});

test('Patch filters stack and rank badges follow each category scale', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop-only Patch flow');

  await page.goto('/patch');
  const kindGroup = page.getByRole('group', { name: 'Lọc theo loại thay đổi' });
  const categoryList = page.getByRole('tablist', { name: 'Lọc bản vá theo nhóm' });

  // Hai bộ lọc chồng nhau: bật "giảm" thì số của bộ lọc nhóm phải tính lại theo
  // đó, nếu không sẽ bấm vào ô có số mà lưới hiện ra rỗng.
  await kindGroup.getByRole('button', { name: /^giảm/ }).click();
  await expect(kindGroup.getByRole('button', { name: /^giảm/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(categoryList.getByRole('tab', { name: /^Tướng/ })).toHaveAccessibleName('Tướng, 1 thay đổi');
  await expect(categoryList.getByRole('tab', { name: /^Nâng cấp/ })).toHaveAccessibleName('Nâng cấp, 0 thay đổi');

  await kindGroup.getByRole('button', { name: /^Tất cả/ }).click();

  // Mốc kích hoạt của tộc hệ phải là huy hiệu riêng, không lẫn trong tên.
  const trait = page.locator('article').filter({ has: page.getByRole('heading', { name: 'Blackthorn', level: 3 }) });
  await expect(trait.getByText('Mốc 6')).toBeVisible();

  // Mỗi nhóm có thang bậc riêng: tướng theo vàng, nâng cấp theo Bạc/Vàng/Kim
  // Cương, linh hỏa theo cấp.
  await page.getByLabel('Chọn bản vá').click();
  await page.getByRole('option', { name: /PBE 03\/08\/2026/ }).click();
  await kindGroup.getByRole('button', { name: /^Tất cả/ }).click();

  const ranks = await page
    .locator('[class*="PatchBoard_card__"]')
    .evaluateAll((cards) =>
      cards.map((card) => card.querySelector('[class*="rankBadge"], [class*="breakpointBadge"]')?.textContent ?? ''),
    );
  expect(ranks.slice(0, 6)).toEqual(['2 vàng', '3 vàng', '4 vàng', '5 vàng', '5 vàng', 'Mốc 6']);
  expect(ranks).toContain('Mốc 6');
});

test('desktop patch changes are visible without scrolling', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop-only viewport fit check');

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/patch');

  // Yêu cầu chính của trang: thấy thay đổi ngay khung hình đầu tiên. Nhóm đầu
  // tiên luôn là Tướng (thứ tự đọc patch note), và ít nhất 5 thẻ thay đổi —
  // trọn hàng đầu — phải nằm trên nếp gấp.
  const firstGroup = page.getByRole('heading', { level: 2 }).first();
  await expect(firstGroup).toHaveText(/^Tướng/);
  const groupBox = await firstGroup.boundingBox();
  expect(groupBox!.y + groupBox!.height).toBeLessThan(720);

  const cards = page.locator('article').filter({ has: page.getByRole('heading', { level: 3 }) });
  expect(await cards.count()).toBeGreaterThanOrEqual(5);
  for (let index = 0; index < 5; index += 1) {
    const box = await cards.nth(index).boundingBox();
    expect(box!.y + box!.height, `thẻ thứ ${index + 1} phải nằm trong khung hình đầu tiên`).toBeLessThan(720);
  }
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
