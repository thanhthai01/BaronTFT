// Migration một lần cho bản PBE 18.1ac (Truexy ghi ngày 8/11, đăng lúc 12:04
// AM giờ hiển thị Aug 12, 2026) — cập nhật set18_champions/set18_traits/
// set18_wisps theo đúng khuôn replaceExact + throw của
// apply-pbe-champion-updates-aug10ab.ts. Nguồn:
// pbe-notes/Patch_TFT18.1ac-PBE-minor-balance-pass.md.
//
// Đã dump toàn bộ text/field hiện tại trước khi viết script này (đọc-only,
// script tạm scripts/db/inspect-1ac-targets.ts, đã xoá sau khi dùng xong).
// Field không có chỗ neo an toàn — liệt kê chi tiết ở cuối file.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits, set18Wisps } from '../../src/db/schema';

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

type FormEdit = { label?: string; html: [string, string][] };

async function updateChampion(
  name: string,
  opts: {
    abilityEn?: [string, string][];
    abilityVi?: [string, string][];
    forms?: FormEdit[];
    attackDamageIndex0?: { from: number; to: number };
  },
) {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, name));
  if (!row) throw new Error(`Champion không tìm thấy: ${name}`);

  let ability = row.ability;
  let abilityVi = row.abilityVi;
  for (const [from, to] of opts.abilityEn ?? []) ability = replaceExact(ability, from, to, `${name}/ability`);
  for (const [from, to] of opts.abilityVi ?? []) abilityVi = replaceExact(abilityVi, from, to, `${name}/abilityVi`);

  const forms = row.forms as any[];
  for (const edit of opts.forms ?? []) {
    const targets = edit.label ? forms.filter((f) => f.label === edit.label) : forms;
    if (!targets.length) throw new Error(`[${name}/forms] không tìm thấy form label=${edit.label}`);
    for (const form of targets) {
      let html = form.abilityHtmlVi as string;
      for (const [from, to] of edit.html) html = replaceExact(html, from, to, `${name}/forms[${form.label}].abilityHtmlVi`);
      form.abilityHtmlVi = html;
    }
  }

  const stats = row.stats as Record<string, unknown>;
  if (opts.attackDamageIndex0) {
    const { from, to } = opts.attackDamageIndex0;
    const ad = stats.attackDamage as number[];
    if (ad?.[0] !== from) throw new Error(`[${name}/stats.attackDamage[0]] hiện tại (${ad?.[0]}) không khớp "from" mong đợi (${from})`);
    ad[0] = to;
    for (const f of forms) {
      const fad = f.stats?.attackDamage as number[] | undefined;
      if (fad?.[0] === from) fad[0] = to;
    }
  }

  await db.update(set18Champions).set({ ability, abilityVi, stats, forms, updatedAt: new Date() }).where(eq(set18Champions.name, name));
  console.log(`✓ champion ${name}`);
}

async function updateWisp(
  name: string,
  opts: {
    description?: [string, string][];
    descriptionVi?: [string, string][];
    blossomUpgradeDescriptionVi?: [string, string][];
    cost?: { from: number; to: number };
    blossomUpgradeCost?: { from: number; to: number };
  },
) {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
  if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  let blossomUpgradeDescriptionVi = row.blossomUpgradeDescriptionVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);
  for (const [from, to] of opts.blossomUpgradeDescriptionVi ?? []) {
    if (!blossomUpgradeDescriptionVi) throw new Error(`[${name}/blossomUpgradeDescriptionVi] rỗng, không thể thay`);
    blossomUpgradeDescriptionVi = replaceExact(blossomUpgradeDescriptionVi, from, to, `${name}/blossomUpgradeDescriptionVi`);
  }

  let cost = row.cost;
  if (opts.cost) {
    if (row.cost !== opts.cost.from) throw new Error(`[${name}/cost] hiện tại (${row.cost}) không khớp "from" mong đợi (${opts.cost.from})`);
    cost = opts.cost.to;
  }
  let blossomUpgradeCost = row.blossomUpgradeCost;
  if (opts.blossomUpgradeCost) {
    if (row.blossomUpgradeCost !== opts.blossomUpgradeCost.from) {
      throw new Error(`[${name}/blossomUpgradeCost] hiện tại (${row.blossomUpgradeCost}) không khớp "from" mong đợi (${opts.blossomUpgradeCost.from})`);
    }
    blossomUpgradeCost = opts.blossomUpgradeCost.to;
  }

  await db
    .update(set18Wisps)
    .set({ description, descriptionVi, blossomUpgradeDescriptionVi, cost, blossomUpgradeCost, updatedAt: new Date() })
    .where(eq(set18Wisps.name, name));
  console.log(`✓ wisp ${name}`);
}

async function main() {
  // ── Tướng — 1 vàng ──────────────────────────────────────────────
  // Karma: DB chỉ có 3 mốc số liệu (không có mốc thứ 4 "995"/"420" mà patch
  // note liệt kê) — chỉ cập nhật được 3 mốc đầu, mốc 4 bỏ qua (xem cuối file).
  // Karma — đã áp dụng thành công ở lượt chạy trước (script dừng giữa chừng vì
  // lỗi case-sensitive ở Warwick ngay sau đó); đã verify lại DB, không chạy
  // lại để tránh throw "không tìm thấy chuỗi" (vì text đã ở trạng thái "to").
  // await updateChampion('Karma', { ... }); — xem lịch sử git/log lượt chạy trước.
  // Varus — ability hiện tại "380/570/860 physical damage", không khớp
  // "from" 350/525/790 ở đâu cả. Bỏ qua, xem cuối file.

  // ── Tướng — 2 vàng ──────────────────────────────────────────────
  // Elise — "On-Attack Healing" 55/85/160 không khớp cả 2 cụm số trong ability
  // (55/85/130 sát thương, 65/100/185 hồi máu). Bỏ qua, xem cuối file.
  // Scuttlecrab — ability hiện "300/375/575", patch "from" là "300/375/625"
  // (lệch mốc 3). Bỏ qua, xem cuối file.
  // Warwick — đã áp dụng thành công ở lượt chạy trước, không chạy lại.
  // Cassiopeia — đã áp dụng thành công ở lượt chạy trước, không chạy lại.
  // Master Yi — đã áp dụng thành công ở lượt chạy trước, không chạy lại.
  // Kha'Zix — đã áp dụng thành công ở lượt chạy trước, không chạy lại.

  await updateChampion('Krug', {
    abilityVi: [['Nhận được 175/225/325 Hồi máu tối đa', 'Nhận được 185/240/350 Hồi máu tối đa']],
    forms: [{ html: [['s18-style-colorHealth"><span class="s18-icon s18-icon-icon_ap"></span>175/225/325</span> Máu tối đa', 's18-style-colorHealth"><span class="s18-icon s18-icon-icon_ap"></span>185/240/350</span> Máu tối đa']] }],
  });

  // Raptor — patch note gọi "Mama Beak" (biệt danh trong caption), codex tên
  // thật là "Raptor" (xác nhận qua ability text tự nhắc "Raptor tấn công").
  await updateChampion('Raptor', {
    abilityVi: [['gây sát thương. 25/38/60 Sát thương vật lý', 'gây sát thương. 27/41/65 Sát thương vật lý']],
    forms: [{ html: [['s18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>25/38/60</span> Sát thương vật lý', 's18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>27/41/65</span> Sát thương vật lý']] }],
  });

  // ── Tướng — 4 vàng ──────────────────────────────────────────────
  await updateChampion('Ancient Sentinel', {
    abilityVi: [['bị Phá Năng Lượng 15.', 'bị Phá Năng Lượng 10.']],
    forms: [{ html: [['s18-style-Keyword">Phá Năng Lượng</span> <span class="s18-value">15</span>', 's18-style-Keyword">Phá Năng Lượng</span> <span class="s18-value">10</span>']] }],
  });

  // ── Tướng — 5 vàng ──────────────────────────────────────────────
  // Lux — Coven không có form riêng tên "Coven" trong DB. Form "Tiên Hắc Ám"
  // (Dark Fae) có đúng số liệu khớp "from"=12 và mô tả giảm Giáp/Kháng Phép —
  // suy đoán có căn cứ đây chính là bonus của tộc Coven, gắn dưới tên hoa mỹ
  // khác (giống trường hợp Raptor/Mama Beak). ĐÂY LÀ SUY ĐOÁN, không phải xác
  // nhận 100% qua tên — cần người dùng soát lại kỹ trước khi duyệt DB write.
  await updateChampion('Lux', {
    forms: [{ label: 'Tiên Hắc Ám', html: [['Giảm Giáp và Kháng Phép của các mục tiêu trúng chiêu đi <span class="s18-value">12</span>', 'Giảm Giáp và Kháng Phép của các mục tiêu trúng chiêu đi <span class="s18-value">8</span>']] }],
  });

  // ── Tộc hệ ──────────────────────────────────────────────────────
  // Coven — chỉ 2/4 mốc Essence Per Loss khớp "from" (mốc 5: 30, mốc 7: 80);
  // mốc 3 (DB=18, from patch=20) và mốc 4 (DB=22, from patch=25) KHÔNG khớp —
  // bỏ qua 2 mốc đó. Essence Per Kill khớp cả 4 mốc (xác nhận thứ tự mốc
  // 3/4/5/7 trong DB đúng khớp thứ tự patch note liệt kê), áp dụng đủ cả 4
  // (mốc 4/5/7 giữ nguyên giá trị, chỉ mốc 3 đổi 1→2).
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Coven'));
    if (!row) throw new Error('Trait không tìm thấy: Coven');
    const details = row.breakpointDetails as any[];

    const lossEdits: [string, number, number][] = [
      ['5', 30, 32],
      ['7', 80, 60],
    ];
    for (const [threshold, from, to] of lossEdits) {
      const d = details.find((x) => x.threshold === threshold);
      const v = d?.bullet?.values?.find((x: any) => x.row === 'EssencePerLoss');
      if (!v || Number(v.value) !== from) throw new Error(`[Coven/EssencePerLoss mốc${threshold}] hiện tại (${v?.value}) không khớp "from" mong đợi (${from})`);
      v.value = String(to);
    }

    const killEdits: [string, number, number][] = [
      ['3', 1, 2],
      ['4', 2, 2],
      ['5', 3, 3],
      ['7', 10, 10],
    ];
    for (const [threshold, from, to] of killEdits) {
      const d = details.find((x) => x.threshold === threshold);
      const v = d?.bullet?.values?.find((x: any) => x.row === 'EssencePerDeath');
      if (!v || Number(v.value) !== from) throw new Error(`[Coven/EssencePerDeath mốc${threshold}] hiện tại (${v?.value}) không khớp "from" mong đợi (${from})`);
      v.value = String(to);
    }

    await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, 'Coven'));
    console.log('✓ trait Coven (Essence Per Loss mốc 5/7, Essence Per Kill mốc 3/4/5/7)');
  }
  // Eclipse — description hiện "repeating every 3 seconds", không khớp "from"
  // 4 giây. Elderwood — mốc 5 (bullet HP bonus) không có field số liệu trong
  // breakpointDetails. Primal — chỉ có ở field `description` tiếng Anh
  // ("gain 30% Attack Speed"), không có bản tiếng Việt tương ứng để đồng bộ
  // hiển thị lên site nên bỏ qua. Sprykin — mốc 5 trong DB đang là 15%/15%,
  // không khớp "from" 30%/30% patch note liệt kê. Cả 4 trait này bỏ qua, xem
  // cuối file.

  // ── Linh Hỏa (Wisps) ────────────────────────────────────────────
  // Barrier — cost DB hiện 5, không khớp "from" 6g; Shield Duration DB hiện
  // đã là 6 giây (khớp "to", không khớp "from" 5s) — cả 2 field này bỏ qua.
  // Chỉ Shield Amount (1200→1250) khớp, áp dụng riêng field đó.
  await updateWisp('Barrier', {
    descriptionVi: [['Tất cả tướng nhận được 1200 Lá Chắn', 'Tất cả tướng nhận được 1250 Lá Chắn']],
    description: [['Allies gain 1200 Shield', 'Allies gain 1250 Shield']],
  });

  await updateWisp('Giant Growth', {
    descriptionVi: [['nhận thêm 600 Máu.', 'nhận thêm 700 Máu.']],
    description: [['gaining 600 Health', 'gaining 700 Health']],
  });

  await updateWisp('Homing Fireflies', {
    descriptionVi: [['Mỗi đom đóm gây 125 sát thương phép.', 'Mỗi đom đóm gây 110 sát thương phép.']],
    description: [['Each deals 125 magic damage.', 'Each deals 110 magic damage.']],
  });
  // Infliction — không có % nào trong description hiện tại để neo "30%→20%".
  // Bỏ qua, xem cuối file.

  await updateWisp('Ironwood', {
    descriptionVi: [
      ['sẽ bị giảm 10% sát thương gây ra.', 'sẽ bị giảm 12% sát thương gây ra.'],
    ],
    description: [['deal 10% less damage.', 'deal 12% less damage.']],
    blossomUpgradeDescriptionVi: [['sẽ bị giảm 14% sát thương gây ra.', 'sẽ bị giảm 18% sát thương gây ra.']],
  });

  await updateWisp('Mana-Rich Soil', {
    descriptionVi: [['được giảm 15% Năng Lượng Tối Đa.', 'được giảm 18% Năng Lượng Tối Đa.']],
    description: [['have 15% reduced Max Mana.', 'have 18% reduced Max Mana.']],
  });

  await updateWisp('Phantom Emblem', { cost: { from: 4, to: 3 }, blossomUpgradeCost: { from: 2, to: 1 } });

  await updateWisp('Quicken', {
    cost: { from: 3, to: 2 },
    descriptionVi: [['các tướng của bạn nhận 30% Tốc Độ Đánh trong 3 giây.', 'các tướng của bạn nhận 30% Tốc Độ Đánh trong 4 giây.']],
    description: [['gain 30% Attack Speed for 3 seconds.', 'gain 30% Attack Speed for 4 seconds.']],
    blossomUpgradeDescriptionVi: [['nhận 40% Tốc Độ Đánh trong 4 giây.', 'nhận 40% Tốc Độ Đánh trong 5 giây.']],
  });
  // Stealthy — bugfix là thay đổi CƠ CHẾ kiểm tra (logic), không phải số liệu
  // hiển thị trong description/blossomUpgradeDescriptionVi. Không có chỗ neo,
  // không cần sync codex (chỉ lên patch report).

  console.log('✓ Hoàn tất cập nhật champions/traits/wisps cho 18.1ac (11/08).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// ── Các mục CỐ Ý bỏ qua (không đủ căn cứ để sửa an toàn) ───────────
// - Karma mốc 4 (995 AP→1070 AP, 420 AP→460 AP): DB chỉ lưu 3 mốc số liệu,
//   không có mốc thứ 4 ở bất kỳ field nào.
// - Varus Spell Damage (350/525/790/1340→350/525/840/1390): ability hiện tại
//   là "380/570/860" — không khớp "from" ở đâu cả (khác cả base lẫn công
//   thức tổng).
// - Elise On-Attack Healing (55/85/160→55/90/170): ability hiện tại có 2 cụm
//   số "55/85/130" (sát thương) và "65/100/185" (hồi máu) — không cụm nào
//   khớp "from" 55/85/160.
// - Scuttlecrab Burrow Heal (300/375/625→325/400/675): ability hiện tại
//   "300/375/575" — khớp 2 mốc đầu, lệch mốc 3 (575 khác 625). Không sửa vì
//   anchor là 1 chuỗi liền, không tách được từng mốc.
// - Cassiopeia forms[Mặc định] (field hiển thị thật lên site): đang lệch hẳn
//   "400/600/960" so với "from" mong đợi 425/640/1020 — chỉ base ability/
//   abilityVi (field dự phòng, không hiển thị) được cập nhật.
// - Kha'Zix mốc 4 sao (935 AP→... , 1150 AP→...): DB chỉ lưu 3 mốc, không có
//   mốc thứ 4.
// - Lux (Tiên Hắc Ám ~ Coven, suy đoán): xem ghi chú ngay tại đoạn code phía
//   trên — SUY ĐOÁN dựa vào số liệu + mô tả khớp, không phải khớp tên trực
//   tiếp, cần soát kỹ trước khi duyệt.
// - Trait Coven Essence Per Loss mốc 3 (20→18) và mốc 4 (25→32): DB hiện tại
//   lần lượt là 18 và 22 — không khớp "from" patch note ở cả 2 mốc.
// - Trait Eclipse Beam Cooldown (4s→3.5s): description hiện tại ghi "repeating
//   every 3 seconds" — không khớp "from" 4 giây.
// - Trait Elderwood 5 Piece HP Bonus (150→200): bullet mốc 5 trong
//   breakpointDetails chỉ có textVi mô tả chữ, mảng `values` rỗng — không có
//   field số liệu nào để sửa.
// - Trait Primal Tiger AS (30%→35%): chỉ tìm thấy trong `description` tiếng
//   Anh ("Primal champions gain 30% Attack Speed"), không có bản tiếng Việt
//   tương ứng nào chứa số liệu này — sửa một mình bản tiếng Anh sẽ không hiện
//   lên site (site đọc field Vi).
// - Trait Sprykin (Health/AS mốc 5: 30%→40%/35%): breakpointDetails mốc 5
//   trong DB hiện là 15%/15%, không khớp "from" 30%/30%.
// - Wisp Barrier: cost (6g→4g) DB hiện là 5, không khớp. Shield Duration
//   (5s→6s) DB mô tả hiện đã ghi "6 giây" (khớp "to", không khớp "from") —
//   có thể đã đổi từ một bản trước chưa ghi nhận, không sửa để tránh set
//   nhầm giá trị.
// - Wisp Infliction Slow Amount (30%→20%): description/descriptionVi không
//   có bất kỳ % nào — chỉ liệt kê tên hiệu ứng (Làm Chậm/Thiêu Đốt/Cào
//   Xé/Phân Tách), không có số liệu để neo.
// - Wisp Stealthy: bugfix logic (kiểm tra Sát Thủ/Đấu Sĩ đã lên đồ), không
//   có số liệu hiển thị trong description để sửa.
