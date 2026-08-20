// Migration một lần cho bản PBE 18.1ag (Truexy ghi "(8/19)", đăng 1:24 AM
// giờ hiển thị Aug 20, 2026) — cập nhật set18_champions/set18_traits/
// set18_augments. Nguồn: pbe-notes/Patch_TFT18.1ag-PBE-final-pass.md,
// pbe-notes/Patch_TFT18.1ag-skipped-items.md.
//
// Hỗ trợ --dry-run (log before/after, không ghi DB) — LUÔN chạy trước khi
// ghi thật.
//
// Đã dump trực tiếp dữ liệu THẬT từ DB production để đối chiếu (không đoán
// theo patch note) trước khi viết script này — xem
// pbe-notes/Patch_TFT18.1ag-skipped-items.md để có toàn bộ căn cứ.
//
// Người dùng đã xác nhận trực tiếp các quyết định sau (không phải suy đoán):
// - Akali AD: DB thật (140/210/320) lệch hẳn "from" ảnh gốc (145/220/345),
//   không theo kiểu lệch 1 chu kỳ patch thường thấy. Người dùng chọn: ghi đè
//   theo ĐỘ LỆCH tương ứng của patch (mốc 3 tăng +35: 345→380) áp lên DB thật
//   → 320+35=355. Term AD trong calc cũng cộng thêm 35 tương ứng (295→330).
// - Ezreal Spell AS: ability thật là "25%/25%/100%" (3 mốc). Người dùng chọn
//   đổi CẢ 2 mốc đầu (không chỉ mốc 1): 25%/25%/100% → 30%/30%/100%.
// - Nesting Anvils (+): DB thật chỉ có số "12 gold" (không có số "8" nào).
//   Người dùng chọn "thay đổi theo patch" — patch ghi "8/12 → 4/8", số duy
//   nhất có trong DB (12) tương ứng vị trí thứ 2 trong cặp patch, áp giá trị
//   đích tương ứng (vị trí thứ 2 của "to"): 12 → 8.
// - Cassiopeia: ability/abilityVi (text thường) đã sẵn ở giá trị ĐÍCH của
//   patch này (440/660/1050) từ trước — không phải "from" (425/640/1020).
//   Không rõ lý do (có thể đã đồng bộ từ trước). Chỉ riêng abilityHtmlVi còn
//   stale ở "400/600/960" (khác cả from lẫn to) — người dùng xác nhận sửa lại
//   cho khớp (400/600/960 → 440/660/1050), đây là fix đồng bộ nội bộ, không
//   phải áp dụng số liệu patch hôm nay.
//
// VẪN SKIP (không có anchor — cấu trúc DB không lưu khái niệm này, xem
// skipped-items.md để có đầy đủ lý do từng mục):
// - Elder Dragon AD (110→115): stats.attackDamage thật [100,150,225], không
//   có giá trị "110" nào — không rõ đây có phải field khác không.
// - Maokai HP (1100→1150): stats.health thật [0,0,0] — dữ liệu placeholder
//   chưa công bố đầy đủ (ability cũng dùng dấu "?").
// - Elderwood Protector Slam Damage (445/670→500/750, 220/335→250/375) và
//   9 Piece HP Bonus (60%→55%): breakpointDetails threshold 7 và 9 đều có
//   bullet.values rỗng — giống hệt case "Elderwood 7pc" đã gặp ở 18.1af,
//   schema không lưu số liệu riêng cho hiệu ứng Hộ Vệ Rừng hay HP Bonus %.
// - Heroic Sacrifice (wisp) Health (1500/1800→1200/1500): bảng set18_wisps
//   không có field lưu "Health" cho wisp nào cả.
// - Booster Pack, Dummify: chỉ là bugfix thuần, description hiện tại đã đúng
//   giá trị mong đợi sau khi fix — không cần đổi text.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits, set18Augments } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

function diffLine(label: string, from: string, to: string) {
  if (from === to) return;
  console.log(`    ${label}: ${JSON.stringify(from)} -> ${JSON.stringify(to)}`);
}

async function updateChampion(
  id: string,
  mutate: (row: { ability: string; abilityVi: string; mana: string; forms: any[] | null }) => {
    ability: string;
    abilityVi: string;
    mana: string;
    forms: any[] | null;
  },
) {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.id, id));
  if (!row) throw new Error(`Champion không tìm thấy: ${id}`);
  const before = { ability: row.ability, abilityVi: row.abilityVi, mana: row.mana, forms: row.forms as any[] | null };
  const result = mutate(before);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] champion ${id}`);
    diffLine('ability', before.ability, result.ability);
    diffLine('abilityVi', before.abilityVi, result.abilityVi);
    diffLine('mana', before.mana, result.mana);
    const formsChanged = JSON.stringify(before.forms) !== JSON.stringify(result.forms);
    if (formsChanged) {
      const beforeForms = before.forms ?? [];
      const afterForms = result.forms ?? [];
      afterForms.forEach((f: any, i: number) => {
        const b = beforeForms[i] ?? {};
        diffLine(`forms[${i}].abilityHtmlVi`, b.abilityHtmlVi ?? '', f.abilityHtmlVi ?? '');
        if (JSON.stringify(b.stats) !== JSON.stringify(f.stats)) {
          console.log(`    forms[${i}].stats: ${JSON.stringify(b.stats)} -> ${JSON.stringify(f.stats)}`);
        }
        if (JSON.stringify(b.calcs) !== JSON.stringify(f.calcs)) {
          console.log(`    forms[${i}].calcs: ${JSON.stringify(b.calcs)} -> ${JSON.stringify(f.calcs)}`);
        }
      });
    }
    return;
  }

  await db
    .update(set18Champions)
    .set({ ability: result.ability, abilityVi: result.abilityVi, mana: result.mana, forms: result.forms, updatedAt: new Date() })
    .where(eq(set18Champions.id, id));
  console.log(`✓ champion ${id}`);
}

async function writeTrait(id: string, details: any[], summary: string) {
  if (DRY_RUN) {
    console.log(`[DRY-RUN] trait ${id} — ${summary}`);
    return;
  }
  await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.id, id));
  console.log(`✓ trait ${id} (${summary})`);
}

async function updateAugment(
  id: string,
  opts: {
    description?: [string, string][];
    descriptionVi?: [string, string][];
    isPublished?: boolean;
  },
) {
  const [row] = await db.select().from(set18Augments).where(eq(set18Augments.id, id));
  if (!row) throw new Error(`Augment không tìm thấy: ${id}`);

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${id}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${id}/descriptionVi`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] augment ${id}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    if (opts.isPublished !== undefined && opts.isPublished !== row.isPublished) diffLine('isPublished', String(row.isPublished), String(opts.isPublished));
    return;
  }

  await db
    .update(set18Augments)
    .set({
      description,
      descriptionVi,
      ...(opts.isPublished !== undefined ? { isPublished: opts.isPublished } : {}),
      updatedAt: new Date(),
    })
    .where(eq(set18Augments.id, id));
  console.log(`✓ augment ${id}`);
}

async function main() {
  // ══════════════════════════ CHAMPIONS ══════════════════════════

  await updateChampion('champion:tft18_akali', (r) => ({
    ability: r.ability,
    abilityVi: r.abilityVi,
    mana: r.mana,
    forms: r.forms!.map((f) => {
      if (f.label === 'AD') {
        const calcs = (f.calcs ?? []).map((c: any) =>
          c.id === 'akali:ad:calc-1'
            ? { ...c, terms: c.terms.replace('295 ×', '330 ×'), total: '140/210/355' }
            : c,
        );
        return { ...f, calcs, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '140/210/320', '140/210/355', 'Akali/AD/abilityHtmlVi') };
      }
      if (f.label === 'AP') {
        return { ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '140/210/340', '140/210/365', 'Akali/AP/abilityHtmlVi') };
      }
      return f;
    }),
  }));

  await updateChampion('champion:tft18_gromp', (r) => ({
    ability: replaceExact(r.ability, '145/220/345 magic damage over 3 seconds', '160/240/360 magic damage over 3 seconds', 'Gromp/ability'),
    abilityVi: replaceExact(r.abilityVi, '145/220/345 sát thương phép trong 3 giây', '160/240/360 sát thương phép trong 3 giây', 'Gromp/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) =>
      f.label === 'AP'
        ? { ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '145/220/345', '160/240/360', 'Gromp/AP/abilityHtmlVi') }
        : f,
    ),
  }));

  await updateChampion('champion:tft18_azir', (r) => ({
    ability: replaceExact(r.ability, '46/69/110 magic damage per attack', '48/72/115 magic damage per attack', 'Azir/ability'),
    abilityVi: replaceExact(r.abilityVi, '46/69/110 sát thương phép mỗi đòn đánh', '48/72/115 sát thương phép mỗi đòn đánh', 'Azir/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '46/69/110', '48/72/115', 'Azir/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_cassiopeia', (r) => {
    // ability/abilityVi đã sẵn ở giá trị đích (440/660/1050) từ trước — chỉ
    // sửa abilityHtmlVi cho khớp lại, không phải áp dụng số liệu patch hôm nay.
    return {
      ability: r.ability,
      abilityVi: r.abilityVi,
      mana: r.mana,
      forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '400/600/960', '440/660/1050', 'Cassiopeia/forms/abilityHtmlVi') })),
    };
  });

  await updateChampion('champion:tft18_fiddlesticks', (r) => ({
    ability: replaceExact(r.ability, 'healing for 395/470/790 Health', 'healing for 410/485/850 Health', 'Fiddlesticks/ability'),
    abilityVi: replaceExact(r.abilityVi, 'hồi phục 395/470/790 Máu', 'hồi phục 410/485/850 Máu', 'Fiddlesticks/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '395/470/790', '410/485/850', 'Fiddlesticks/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_ezreal', (r) => ({
    // Người dùng xác nhận đổi CẢ 2 mốc đầu (không chỉ mốc 1 sao):
    // 25%/25%/100% → 30%/30%/100%.
    ability: replaceExact(r.ability, 'gain 25%/25%/100% Attack Speed', 'gain 30%/30%/100% Attack Speed', 'Ezreal/ability'),
    abilityVi: replaceExact(r.abilityVi, 'nhận 25%/25%/100% Tốc Độ Đánh', 'nhận 30%/30%/100% Tốc Độ Đánh', 'Ezreal/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '25%/25%/100%', '30%/30%/100%', 'Ezreal/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_lillia', (r) => ({
    // Patch không nhắc mốc 3 sao (800) — giữ nguyên, chỉ đổi 2 mốc đầu.
    ability: replaceExact(r.ability, 'Restore 300/400/800 Health', 'Restore 325/475/800 Health', 'Lillia/ability'),
    abilityVi: replaceExact(r.abilityVi, 'Hồi lại 300/400/800 Máu', 'Hồi lại 325/475/800 Máu', 'Lillia/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '300/400/600', '325/475/600', 'Lillia/forms/abilityHtmlVi') })),
  }));

  // Elder Dragon (AD 110→115) và Maokai (HP 1100→1150): SKIP — không có
  // anchor trong DB thật, xem ghi chú đầu file.

  // ══════════════════════════ TRAITS ══════════════════════════

  await (async () => {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.id, 'trait:eldritch'));
    if (!row) throw new Error('Trait không tìm thấy: trait:eldritch (Blackthorn)');
    const details = (row.breakpointDetails as any[]).map((d) => {
      if (d.threshold !== '2' && d.threshold !== '4') return d;
      const values = d.bullet.values.map((v: any) => (v.row === 'TankSacrificeHPBonus' ? { ...v, value: '17%' } : v));
      return { ...d, bullet: { ...d.bullet, values } };
    });
    await writeTrait('trait:eldritch', details, 'Tank Sacrifice HP Bonus 20%→17% (mốc 2 & 4)');
  })();

  await (async () => {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.id, 'trait:juggernaut'));
    if (!row) throw new Error('Trait không tìm thấy: trait:juggernaut');
    const details = (row.breakpointDetails as any[]).map((d) => {
      if (d.threshold === '4') {
        const values = d.bullet.values.map((v: any) => (v.row === 'JuggernautDurability' ? { ...v, value: '33%' } : v));
        return { ...d, bullet: { ...d.bullet, values } };
      }
      if (d.threshold === '6') {
        const values = d.bullet.values.map((v: any) => (v.row === 'JuggernautDurability' ? { ...v, value: '45%' } : v));
        return { ...d, bullet: { ...d.bullet, values } };
      }
      return d;
    });
    await writeTrait('trait:juggernaut', details, 'Selfish Damage Reduction mốc 4: 30%→33%, mốc 6: 40%→45%');
  })();

  // Elderwood (Protector Slam Damage + 9pc HP Bonus): SKIP — breakpointDetails
  // threshold 7/9 có bullet.values rỗng, không có anchor. Xem ghi chú đầu file.

  // ══════════════════════════ AUGMENTS ══════════════════════════

  await updateAugment('augment:da_bandofthievesii', {
    description: [['After 6 player combats, gain another.', 'After 5 player combats, gain another.']],
    descriptionVi: [['Sau 6 giao tranh người chơi, nhận thêm 1 Găng Đạo Tặc.', 'Sau 5 giao tranh người chơi, nhận thêm 1 Găng Đạo Tặc.']],
  });

  await updateAugment('augment:da_bonusgift', {
    description: [['Gain 2 gray loot orbs.', 'Gain 1 gray loot orb.']],
    descriptionVi: [['Nhận 2 hộp vật phẩm xám.', 'Nhận 1 hộp vật phẩm xám.']],
  });

  await updateAugment('augment:da_bonusgiftplus', {
    description: [['Gain 3 gray loot orbs.', 'Gain 2 gray loot orbs.']],
    descriptionVi: [['Nhận 3 hộp vật phẩm xám.', 'Nhận 2 hộp vật phẩm xám.']],
  });

  await updateAugment('augment:da_buriedtreasuresiii', {
    // Patch note ghi "Buried Treasures II" nhưng DB chỉ có augment III —
    // người dùng xác nhận map vào III (xem draft patch report để biết đầy
    // đủ lý do).
    description: [['now and at the start of the next 5 rounds.', 'now and at the start of the next 6 rounds.']],
    descriptionVi: [['ngay bây giờ và khi bắt đầu 5 vòng tiếp theo.', 'ngay bây giờ và khi bắt đầu 6 vòng tiếp theo.']],
  });

  await updateAugment('augment:da_capitalgainsii', {
    description: [['Gain 1 gold now.', 'Gain 2 gold now.']],
    descriptionVi: [['Nhận ngay 1 vàng.', 'Nhận ngay 2 vàng.']],
  });

  await updateAugment('augment:da_comebackstory', {
    description: [['0.4% Attack Speed per missing player Health.', '0.3% Attack Speed per missing player Health.']],
    descriptionVi: [['0.4% Tốc Độ Đánh với mỗi Máu người chơi đã mất.', '0.3% Tốc Độ Đánh với mỗi Máu người chơi đã mất.']],
  });

  await updateAugment('augment:da_18_infernotraitaugment', {
    // Gỡ bỏ hoàn toàn khỏi game — người dùng xác nhận.
    isPublished: false,
  });

  await updateAugment('augment:da_thegoldendragon', {
    description: [['gain 700 Health and 20% Durability.', 'gain 600 Health and 20% Durability.']],
    descriptionVi: [['nhận thêm 700 Máu và 20% Chống Chịu.', 'nhận thêm 600 Máu và 20% Chống Chịu.']],
  });

  await updateAugment('augment:da_investmentstrategy', {
    description: [['gain 8 permanent max health per interest you earn', 'gain 9 permanent max health per interest you earn']],
    descriptionVi: [['nhận thêm vĩnh viễn 8 Máu tối đa với mỗi vàng lợi tức bạn kiếm được', 'nhận thêm vĩnh viễn 9 Máu tối đa với mỗi vàng lợi tức bạn kiếm được']],
  });

  await updateAugment('augment:da_livingforge', {
    description: [['after every 9 player combats.', 'after every 10 player combats.']],
    descriptionVi: [['sau mỗi 9 vòng giao chiến với người chơi.', 'sau mỗi 10 vòng giao chiến với người chơi.']],
  });

  await updateAugment('augment:da_moneyhungryplus', {
    description: [['Gain 10 gold now, then 7 gold', 'Gain 13 gold now, then 7 gold']],
    descriptionVi: [['Nhận 10 vàng ngay lập tức, sau đó nhận thêm 7 vàng', 'Nhận 13 vàng ngay lập tức, sau đó nhận thêm 7 vàng']],
  });

  await updateAugment('augment:da_nestinganvilsplus', {
    // DB thật chỉ có số "12 gold" (không có số "8"). Người dùng xác nhận
    // "thay đổi theo patch": patch "8/12 → 4/8", số duy nhất có trong DB (12)
    // ứng vị trí thứ 2 trong cặp — áp giá trị đích tương ứng: 12 → 8.
    description: [['that, gain 12 gold.', 'that, gain 8 gold.']],
    descriptionVi: [['Khi bạn mở thứ đó, nhận 12 vàng.', 'Khi bạn mở thứ đó, nhận 8 vàng.']],
  });

  // Booster Pack, Dummify: chỉ bugfix, description hiện tại đã đúng — không
  // cần đổi text.
}

main()
  .then(() => {
    console.log(DRY_RUN ? 'DRY RUN xong — không có gì được ghi.' : 'Hoàn tất ghi DB.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
