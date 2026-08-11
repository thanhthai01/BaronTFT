// Migration một lần cho bản PBE 18.1ab (10/08/2026) — cập nhật
// set18_champions/set18_traits/set18_augments theo đúng khuôn replaceExact +
// throw của apply-pbe-champion-updates.ts. Nguồn:
// pbe-notes/Patch_TFT18.1ab-PBE-moderate-balance-pass.md.
//
// Phát hiện quan trọng khi soát dữ liệu trước khi viết script này: base
// `ability`/`abilityVi`/`mana`/`stats` của champion KHÔNG được trang web hiển
// thị khi `forms` đã có dữ liệu (championForms() trong ChampionCard.tsx chỉ
// dùng field base làm fallback khi forms rỗng) — mọi champion trong DB hiện
// tại đều có ít nhất 1 form ("Mặc định" hoặc theo tộc/hệ), nên các field base
// thực chất là dữ liệu chết. Vẫn cập nhật base cùng lúc với forms (giữ đồng
// bộ, theo đúng thói quen các script trước) nhưng field neo THẬT SỰ hiển thị
// lên site là `forms[].abilityHtmlVi`.
//
// Field không có chỗ neo an toàn — liệt kê chi tiết ở cuối file.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits, set18Augments } from '../../src/db/schema';

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
    mana?: { formLabel: string; text: string; statsArray: [number, number] };
    attackSpeed?: number;
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
  if (opts.attackSpeed !== undefined) {
    const current = stats.attackSpeed;
    const expectedFrom = 0.85;
    if (current !== expectedFrom) throw new Error(`[${name}/stats.attackSpeed] hiện tại (${current}) không khớp "from" mong đợi (${expectedFrom})`);
    stats.attackSpeed = opts.attackSpeed;
    for (const f of forms) {
      if (f.stats?.attackSpeed === expectedFrom) f.stats.attackSpeed = opts.attackSpeed;
    }
  }

  if (opts.mana) {
    const form = forms.find((f) => f.label === opts.mana!.formLabel);
    if (!form) throw new Error(`[${name}/forms] không tìm thấy form label=${opts.mana.formLabel} để sửa mana`);
    form.mana = opts.mana.text;
    if (form.stats?.mana) form.stats.mana = opts.mana.statsArray;
  }

  await db.update(set18Champions).set({ ability, abilityVi, stats, forms, updatedAt: new Date() }).where(eq(set18Champions.name, name));
  console.log(`✓ champion ${name}`);
}

async function main() {
  await updateChampion('Akali', {
    forms: [{ label: 'AP', html: [['s18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>170/255/385</span> sát thương phép', 's18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>155/235/385</span> sát thương phép']] }],
  });

  await updateChampion('Camille', {
    abilityEn: [['160/240/390 physical damage', '160/240/410 physical damage'], ['60/85/135 Shield', '60/85/160 Shield']],
    abilityVi: [['160/240/390 sát thương vật lý', '160/240/410 sát thương vật lý'], ['60/85/135 Lá Chắn', '60/85/160 Lá Chắn']],
    forms: [{ html: [
      ['160/240/390</span> sát thương vật lý', '160/240/410</span> sát thương vật lý'],
      ['s18-style-colorStat">60/85/135</span> Lá Chắn', 's18-style-colorStat">60/85/160</span> Lá Chắn'],
    ] }],
  });

  await updateChampion('Leona', {
    abilityEn: [['decays over 10 seconds', 'decays over 12 seconds']],
    abilityVi: [['giảm dần trong 10 giây', 'giảm dần trong 12 giây']],
    forms: [{ html: [['giảm dần trong <span class="s18-value">10</span> giây', 'giảm dần trong <span class="s18-value">12</span> giây']] }],
  });

  await updateChampion('Ornn', {
    abilityEn: [['400/480/600 Shield for 4 seconds', '400/460/550 Shield for 4 seconds'], ['(Forge Power: 90000/220000/400000)', '(Forge Power: 90000/235000/400000)']],
    abilityVi: [['400/480/600 Lá Chắn', '400/460/550 Lá Chắn'], ['(Sức Mạnh Lò Rèn: 90000/220000/400000)', '(Sức Mạnh Lò Rèn: 90000/235000/400000)']],
    forms: [{ html: [
      ['s18-style-colorStat"><span class="s18-icon s18-icon-icon_ap"></span>400/480/600</span> Lá Chắn', 's18-style-colorStat"><span class="s18-icon s18-icon-icon_ap"></span>400/460/550</span> Lá Chắn'],
      ['s18-style-Rules">90000/220000/400000</span>', 's18-style-Rules">90000/235000/400000</span>'],
    ] }],
  });

  await updateChampion('Murkwolf', {
    abilityEn: [['increased up to 50% based on missing Health', 'increased up to 75% based on missing Health']],
    abilityVi: [['tăng lên tối đa 50% dựa trên Máu đã mất', 'tăng lên tối đa 75% dựa trên Máu đã mất']],
    forms: [{ html: [['tăng lên tối đa <span class="s18-value">50%</span> dựa trên Máu đã mất', 'tăng lên tối đa <span class="s18-value">75%</span> dựa trên Máu đã mất']] }],
  });

  await updateChampion('Gromp', {
    abilityEn: [['Gromp gains 25% Ability Power', 'Gromp gains 30% Ability Power']],
    abilityVi: [['Gromp nhận 25% Sức Mạnh Phép Thuật', 'Gromp nhận 30% Sức Mạnh Phép Thuật']],
    forms: [
      { label: 'AP', html: [['nhận <span class="s18-value s18-style-colorStat">25%</span> Sức Mạnh Phép Thuật', 'nhận <span class="s18-value s18-style-colorStat">30%</span> Sức Mạnh Phép Thuật']] },
      { label: 'AD', html: [['nhận được <span class="s18-value s18-style-colorStat">25%</span> Sức Mạnh Công Kích', 'nhận được <span class="s18-value s18-style-colorStat">30%</span> Sức Mạnh Công Kích']] },
    ],
  });

  await updateChampion('Hecarim', {
    abilityEn: [['restore 400/500/720 Health', 'restore 375/475/685 Health']],
    abilityVi: [['hồi phục 400/500/720 Máu', 'hồi phục 375/475/685 Máu']],
    forms: [{ html: [['s18-style-colorHealth"><span class="s18-icon s18-icon-icon_ap"></span>400/500/720</span> Máu', 's18-style-colorHealth"><span class="s18-icon s18-icon-icon_ap"></span>375/475/685</span> Máu']] }],
  });

  await updateChampion("Kog'Maw", {
    forms: [{ label: 'AP', html: [['s18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>170/255/450</span> sát thương phép', 's18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>160/240/415</span> sát thương phép']] }],
  });

  await updateChampion('Rengar', {
    abilityEn: [['270/405/650 physical damage', '255/385/615 physical damage']],
    abilityVi: [['270/405/650 sát thương vật lý', '255/385/615 sát thương vật lý']],
    forms: [{ html: [['s18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>270/405/650</span> sát thương vật lý', 's18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>255/385/615</span> sát thương vật lý']] }],
  });

  // Lillia — Mana 50/150 → 40/140 (không đụng ability text, Mana là field riêng)
  await updateChampion('Lillia', { mana: { formLabel: 'Mặc định', text: '40 / 140', statsArray: [40, 140] } });

  await updateChampion('Morgana', {
    abilityEn: [['Cursed enemies take 18/27/240 more damage per curse', 'Cursed enemies take 22/33/240 more damage per curse']],
    abilityVi: [['mất 18/27/240 Sát thương mỗi lời nguyền càng cao', 'mất 22/33/240 Sát thương mỗi lời nguyền càng cao']],
    forms: [{ html: [['s18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>18/27/240</span> sát thương', 's18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>22/33/240</span> sát thương']] }],
  });

  await updateChampion('Nidalee', {
    forms: [{ label: 'AD', html: [['s18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>215/325/2500</span> sát thương vật lý', 's18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>225/340/2500</span> sát thương vật lý']] }],
  });

  await updateChampion('Ashe', {
    abilityEn: [['400/600/1000 physical damage, reduced by 80%', '440/660/1000 physical damage, reduced by 80%']],
    abilityVi: [['400/600/1000 sát thương vật lý, giảm thiểu bởi 80%', '440/660/1000 sát thương vật lý, giảm thiểu bởi 80%']],
    forms: [{ html: [['s18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>400/600/1000</span> sát thương vật lý', 's18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>440/660/1000</span> sát thương vật lý']] }],
  });

  // Kennen — Dash Damage (2-tier 50/75→80/120 + mốc 3 sao 300→1500 gộp
  // chung 1 chuỗi số) và Shield 225/300→250/350. Spell Damage 525/785→450/675
  // và mốc 3 sao 3000→5000 KHÔNG có chỗ neo (xem ghi chú cuối file).
  await updateChampion('Kennen', {
    abilityEn: [['gain 225/300/3000 Shield', 'gain 250/350/3000 Shield'], ['dealing 50/75/300 magic damage to each', 'dealing 80/120/1500 magic damage to each']],
    abilityVi: [['nhận 225/300/3000 Lá Chắn', 'nhận 250/350/3000 Lá Chắn'], ['gây 50/75/300 sát thương phép lên mỗi kẻ địch', 'gây 80/120/1500 sát thương phép lên mỗi kẻ địch']],
    forms: [{ html: [
      ['s18-style-colorStat"><span class="s18-icon s18-icon-icon_ap"></span>225/300/3000</span> Lá Chắn', 's18-style-colorStat"><span class="s18-icon s18-icon-icon_ap"></span>250/350/3000</span> Lá Chắn'],
      ['s18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>50/75/300</span> sát thương phép', 's18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>80/120/1500</span> sát thương phép'],
    ] }],
  });

  // Draven — Bleed Damage 150/225→140/210 (nerf) gộp chung chuỗi với mốc 3
  // sao Bleed Damage 1000→3000 (buff), cùng 1 vị trí số liệu trong text.
  await updateChampion('Draven', {
    abilityEn: [['150/225/1000 physical damage over 12 seconds', '140/210/3000 physical damage over 12 seconds']],
    abilityVi: [['gây 150/225/1000 sát thương vật lý trong vòng 12 giây', 'gây 140/210/3000 sát thương vật lý trong vòng 12 giây']],
    forms: [{ html: [['s18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>150/225/1000</span> sát thương vật lý trong vòng', 's18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>140/210/3000</span> sát thương vật lý trong vòng']] }],
  });

  // Ivern — chỉ Base AS có chỗ neo an toàn (stats.attackSpeed); toàn bộ cơ chế
  // Hex (Rock/Water/Tree/Flower) + Greenfather Seeds + Shield không có neo,
  // xem ghi chú cuối file.
  await updateChampion('Ivern', { attackSpeed: 0.8 });

  // Lux — Lunar (Mặt Trăng): Suy Yếu 12%/6s → 10%/4s. Blossom (Hoa Linh):
  // 15% → 10%. Elderwood (Thần Rừng) 4%→2.5% KHÔNG khớp (DB hiện 5%).
  await updateChampion('Lux', {
    forms: [
      { label: 'Mặt Trăng', html: [['Suy Yếu</span> <span class="s18-value">12</span>% lên kẻ địch trong <span class="s18-value">6</span> giây', 'Suy Yếu</span> <span class="s18-value">10</span>% lên kẻ địch trong <span class="s18-value">4</span> giây']] },
      { label: 'Hoa Linh', html: [['Mục tiêu đầu tiên trúng đòn nhận <span class="s18-value">15%</span> sát thương cộng thêm', 'Mục tiêu đầu tiên trúng đòn nhận <span class="s18-value">10%</span> sát thương cộng thêm']] },
    ],
  });

  // ── Tướng 3 sao ─────────────────────────────────────────────────
  await updateChampion('Alune', {
    abilityEn: [['2200/3400/6500 magic damage', '2200/3400/7500 magic damage']],
    abilityVi: [['2200/3400/6500 sát thương phép', '2200/3400/7500 sát thương phép']],
    forms: [{ html: [['s18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>2200/3400/6500</span> sát thương phép', 's18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>2200/3400/7500</span> sát thương phép']] }],
  });

  await updateChampion('Gnar', {
    forms: [{ html: [['s18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>150/225/1500</span> sát thương vật lý lên kẻ địch trong phạm vi', 's18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>150/225/2000</span> sát thương vật lý lên kẻ địch trong phạm vi']] }],
  });

  await updateChampion('Ezreal', {
    abilityEn: [['225/340/900 physical damage to them', '225/340/1200 physical damage to them']],
    abilityVi: [['225/340/900 sát thương vật lý lên nạn nhân', '225/340/1200 sát thương vật lý lên nạn nhân']],
    forms: [{ html: [['s18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>225/340/900</span> sát thương vật lý lên nạn nhân', 's18-style-colorPhysical"><span class="s18-icon s18-icon-icon_ad"></span>225/340/1200</span> sát thương vật lý lên nạn nhân']] }],
  });

  // ── Tộc Hệ ──────────────────────────────────────────────────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Hunter'));
    if (!row) throw new Error('Trait không tìm thấy: Hunter');
    const details = row.breakpointDetails as any[];
    const edits: [string, string, string][] = [
      ['2', '15%', '20%'],
      ['3', '25%', '30%'],
      ['4', '40%', '45%'],
      ['5', '60%', '65%'],
    ];
    for (const [threshold, from, to] of edits) {
      const d = details.find((x) => x.threshold === threshold);
      const v = d?.bullet?.values?.find((x: any) => x.row === 'HunterAD');
      if (!v || v.value !== from) throw new Error(`[Hunter/mốc${threshold}] hiện tại (${v?.value}) không khớp "from" mong đợi ("${from}")`);
      v.value = to;
    }
    await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, 'Hunter'));
    console.log('✓ trait Hunter (mốc 2/3/4/5)');
  }

  // ── Nâng cấp (Augments) ─────────────────────────────────────────
  await updateAugment('Capital Gains I', {
    description: [['110% of the interest', '100% of the interest'], ['Gain 2 gold now', 'Gain 1 gold now']],
    descriptionVi: [['110% lượng lợi tức', '100% lượng lợi tức'], ['Nhận ngay 2 vàng', 'Nhận ngay 1 vàng']],
  });

  // Capital Gains II — Gold Earned 110%→125% KHÔNG khớp (DB hiện 150%),
  // chỉ Initial Gold 4→1 có chỗ neo.
  await updateAugment('Capital Gains II', {
    description: [['Gain 4 gold now', 'Gain 1 gold now']],
    descriptionVi: [['Nhận ngay 4 vàng', 'Nhận ngay 1 vàng']],
  });

  await updateAugment('Going Long', {
    description: [['Gain 16 gold now', 'Gain 10 gold now']],
    descriptionVi: [['Nhận ngay 16 vàng', 'Nhận ngay 10 vàng']],
  });

  await updateAugment('Residual Magic', {
    description: [['Your team gains 80 Health', 'Your team gains 60 Health']],
    descriptionVi: [['Đội của bạn được tăng 80 Máu', 'Đội của bạn được tăng 60 Máu']],
  });
  await updateAugment('Residual Magic +', {
    description: [['Your team gains 100 Health', 'Your team gains 75 Health']],
    descriptionVi: [['Đội của bạn được tăng 100 Máu', 'Đội của bạn được tăng 75 Máu']],
  });
  await updateAugment('Residual Magic ++', {
    description: [['Your team gains 120 Health', 'Your team gains 90 Health']],
    descriptionVi: [['Đội của bạn được tăng 120 Máu', 'Đội của bạn được tăng 90 Máu']],
  });

  console.log('✓ Hoàn tất cập nhật champions/traits/augments cho 18.1ab (10/08).');
}

async function updateAugment(name: string, opts: { description?: [string, string][]; descriptionVi?: [string, string][] }) {
  const [row] = await db.select().from(set18Augments).where(eq(set18Augments.name, name));
  if (!row) throw new Error(`Augment không tìm thấy: ${name}`);
  let description = row.description;
  let descriptionVi = row.descriptionVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);
  await db.update(set18Augments).set({ description, descriptionVi, updatedAt: new Date() }).where(eq(set18Augments.name, name));
  console.log(`✓ augment ${name}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// ── Các mục CỐ Ý bỏ qua (không đủ căn cứ để sửa an toàn) ───────────
// - Akali AD Spell Damage (145/220/325→145/220/345): form AD hiện tại là
//   "140/210/320" (base) + "30/45/68" (bonus khi Thiêu Đốt) — không khớp
//   145/220/325 ở đâu cả.
// - Yunara Ability Damage (170/255/450→170/255/415): ability hiện tại là
//   "180/270/425" + "63/94.5/148.75" — không khớp 170/255/450.
// - Kog'Maw AD Spell Damage (155/235/400→145/220/375): form AD hiện tại là
//   "175/265/450" + "245/371/630" — không khớp.
// - Aphelios Bonus AS Per Extra Attack (45%→35%) và Swipe Damage mốc 3 sao
//   (11000→850): không có % Tốc Đánh nào trong text; Swipe hiện tại là
//   "70/105/1100" (không phải 11000) và không nằm trong calcs.
// - Brambleback Spell Armor Ignore (20%→30%): text hiện tại ĐÃ LÀ "30%" — có
//   thể đã đúng giá trị cuối cùng từ trước, không cần sửa. Brambleback Armor
//   Ignore mốc 3 sao (20%→50%): text không phân biệt số liệu theo mốc sao,
//   dùng chung "30%" cho mọi mốc — không có chỗ neo riêng cho mốc 3 sao.
// - Kennen Spell Damage (525/785→450/675) và mốc 3 sao (3000→5000): text
//   hiện tại "600/900/2000" — không khớp cả 2 patch.
// - Draven Spell Base Damage (180/270→130/200): text hiện tại "100/150/500"
//   — không khớp. % Chance to Target Random in Range (85%→70%): không có %
//   nào trong text mô tả cơ chế nhắm mục tiêu. Stun Duration mốc 3 sao
//   (10s→15s): Draven không có hiệu ứng choáng nào trong text.
// - Ivern: Rock/Water/Tree/Flower Hex, Greenfather Seeds, Shield — ability
//   text chỉ ghi "?" cho giá trị Khiên (placeholder chưa điền số), không có
//   bất kỳ đề cập nào tới cơ chế "Hex" trong text hay calcs.
// - Lux Elderwood Health (4%→2.5%): form "Thần Rừng" hiện tại ghi "5%", không
//   khớp "from" 4%.
// - Taric True Damage (15%→25%): không có % nào trong text/calcs khớp — calc
//   duy nhất của Taric là công thức Khiên (12%/12%/100% × Health), không
//   liên quan.
// - Sivir Secondary Boomerang Damage mốc 3 sao (50%→40%): tìm thấy trong
//   calcs[1].terms ("20%/20%/50%") nhưng calcs[1].total ("34/51/575") là giá
//   trị đã tính sẵn, không thể suy ra công thức gốc để cập nhật đồng bộ theo
//   — sửa riêng terms mà không sửa total sẽ tạo dữ liệu mâu thuẫn, nên bỏ qua.
// - Soraka mốc 3 sao (double cast): đây là thay đổi CƠ CHẾ (thêm hành vi mới)
//   chứ không phải số liệu — cần viết lại nguyên đoạn mô tả kỹ năng, rủi ro
//   diễn giải sai cao hơn nhiều so với thay 1 con số; để dành sửa tay.
// - Trait Blossom mốc 9 (AD/AP 50%→45%): breakpointDetails hiện tại ở mốc 9
//   là "60%" (không phải 50%) — không khớp, có thể cấu trúc breakpoint đã
//   đổi từ một bản vá trước đó.
// - Augment Capital Gains II Gold Earned (110%→125%): description hiện tại
//   ghi "150% of the interest" — không khớp "from" 110%.
// - Augment Luxury Subscription Gold (7→3): description hiện tại ghi "5
//   gold" — không khớp "from" 7.
// - Augment Trait Ladder (toàn bộ 8 thay đổi mốc Cashout): description hiện
//   tại chỉ ghi "?" tộc/hệ placeholder kèm ghi chú "(mô tả đang được hoàn
//   thiện)" — không có cấu trúc dữ liệu Cashout theo mốc để sửa.
