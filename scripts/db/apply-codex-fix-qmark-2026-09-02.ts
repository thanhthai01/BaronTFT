// Đợt 2 của "Dọn lỗi dữ liệu DB codex Set 18": vá các mục dấu "?" do scrape
// hỏng (6 tướng ban đầu → còn 5 sau khi loại Teemo, xem dưới), Trait Ladder,
// 2 item Nashor's Tooth, và trả nợ hệ số hồi máu Amumu 2.5%.
//
// Hỗ trợ --dry-run — LUÔN chạy trước khi ghi thật.
//
// Nguồn số liệu: tftips.app/vi (embedded JSON/HTML trong trang tướng/item —
// khác trang danh sách tướng dùng SVG radar không có số, các trang chi tiết
// tướng/item này CÓ số thật trong HTML). Đối chiếu thêm với ảnh chụp màn
// hình người dùng gửi cho Ivern và Maokai — khớp 100%.
//
// Người dùng đã xác nhận:
// - Teemo "Reds/Greens/Yellows Foraged: ?": KHÔNG sửa — đây là bộ đếm động
//   trong trận (giống Veigar, Gold Collector... ở mục E của kế hoạch gốc),
//   không phải lỗi scrape.
// - Aegis of Dawn / Lich Bane: tftips chỉ cho khoảng min~max, không phải đủ
//   mảng 6 Giai Đoạn như quy ước DB (vd Guinsoo's "30/30/55/75/95/115") —
//   dùng khoảng min~max, chấp nhận chưa đúng định dạng đầy đủ, vá tiếp sau
//   nếu tìm được nguồn đủ 6 mốc.
// - Amumu: total hồi máu suy ra theo tỉ lệ 2.5/2.2, khớp đúng gợi ý đã ghi
//   sẵn trong pbe-notes/Patch_TFT18.1d-skipped-items.md mục 4 phương án (a).
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Augments, set18Items } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  return text.split(oldStr).join(newStr);
}

/** Chỉ thay occurrence ĐẦU TIÊN — dùng khi cùng 1 chuỗi xuất hiện nhiều lần
 * với ý nghĩa khác nhau (vd 2 chỗ "?" của Maokai). */
function replaceFirst(text: string, oldStr: string, newStr: string, ctx: string): string {
  const i = text.indexOf(oldStr);
  if (i === -1) throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  return text.slice(0, i) + newStr + text.slice(i + oldStr.length);
}

function diffLine(label: string, from: unknown, to: unknown) {
  const a = JSON.stringify(from);
  const b = JSON.stringify(to);
  if (a === b) return;
  console.log(`    ${label}: ${a} -> ${b}`);
}

async function updateChampion(
  id: string,
  mutate: (row: { ability: string; abilityVi: string; forms: any[] }) => { ability: string; abilityVi: string; forms: any[] },
) {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.id, id));
  if (!row) throw new Error(`Champion không tìm thấy: ${id}`);
  const before = { ability: row.ability, abilityVi: row.abilityVi, forms: (row.forms as any[]) ?? [] };
  const result = mutate(before);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] champion ${id}`);
    diffLine('ability', before.ability, result.ability);
    diffLine('abilityVi', before.abilityVi, result.abilityVi);
    result.forms.forEach((f, i) => {
      diffLine(`forms[${i}].abilityHtmlVi`, before.forms[i]?.abilityHtmlVi, f.abilityHtmlVi);
      diffLine(`forms[${i}].calcs`, before.forms[i]?.calcs, f.calcs);
    });
    return;
  }

  await db
    .update(set18Champions)
    .set({ ability: result.ability, abilityVi: result.abilityVi, forms: result.forms, updatedAt: new Date() })
    .where(eq(set18Champions.id, id));
  console.log(`✓ champion ${id}`);
}

async function main() {
  // ═══════════════ Amumu: stun bonus khi Thiêu Đốt + trả nợ hệ số 2.5% ═══════════════

  await updateChampion('champion:tft18_amumu', (r) => ({
    ability: replaceExact(
      r.ability,
      'increased to ? seconds if the target is Burning.',
      'increased to 2/2/12 seconds if the target is Burning.',
      'Amumu/ability/stun',
    ).replace('restore 29.04/29.15/30.8 Health', 'restore 33/33.13/35 Health'),
    abilityVi: replaceExact(
      r.abilityVi,
      'tăng lên ? giây nếu mục tiêu đang Thiêu Đốt',
      'tăng lên 2/2/12 giây nếu mục tiêu đang Thiêu Đốt',
      'Amumu/abilityVi/stun',
    ).replace('hồi phục 29.04/29.15/30.8 Máu', 'hồi phục 33/33.13/35 Máu'),
    forms: r.forms.map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(f.abilityHtmlVi, '?', '2/2/12', 'Amumu/forms/abilityHtmlVi/stun').replace(
        '29.04/29.15/30.8',
        '33/33.13/35',
      ),
      calcs: (f.calcs ?? []).map((c: any) => (c.id === 'amumu:mac-inh:calc-1' ? { ...c, total: '33/33.13/35' } : c)),
    })),
  }));

  // ═══════════════ Aphelios: số lần quét ═══════════════

  await updateChampion('champion:tft18_aphelios', (r) => ({
    ability: replaceExact(r.ability, 'swipe the target ? times over 2 seconds', 'swipe the target 5 times over 2 seconds', 'Aphelios/ability'),
    abilityVi: replaceExact(r.abilityVi, 'quét mục tiêu ? lần trong 2 giây', 'quét mục tiêu 5 lần trong 2 giây', 'Aphelios/abilityVi'),
    forms: r.forms.map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(f.abilityHtmlVi, 'icon-icon_as"></span>?</span>', 'icon-icon_as"></span>5</span>', 'Aphelios/forms/abilityHtmlVi'),
    })),
  }));

  // ═══════════════ Sett: lượng hồi máu ═══════════════

  await updateChampion('champion:tft18_sett', (r) => ({
    ability: replaceExact(r.ability, 'rapidly healing for ? before dealing', 'rapidly healing for 369/534/2467 before dealing', 'Sett/ability'),
    abilityVi: replaceExact(r.abilityVi, 'nhanh chóng hồi lại ? trước khi', 'nhanh chóng hồi lại 369/534/2467 trước khi', 'Sett/abilityVi'),
    forms: r.forms.map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(
        f.abilityHtmlVi,
        'icon-icon_health"></span><span class="s18-icon s18-icon-icon_ap"></span>?</span>',
        'icon-icon_health"></span><span class="s18-icon s18-icon-icon_ap"></span>369/534/2467</span>',
        'Sett/forms/abilityHtmlVi',
      ),
    })),
  }));

  // ═══════════════ Ivern: giá trị Lá Chắn ═══════════════

  await updateChampion('champion:tft18_ivern', (r) => ({
    ability: replaceExact(r.ability, 'Grant 2 allies ? Shield', 'Grant 2 allies 165/300/3000 Shield', 'Ivern/ability'),
    abilityVi: replaceExact(r.abilityVi, 'Ban cho 2 đồng minh ? Lá Chắn', 'Ban cho 2 đồng minh 165/300/3000 Lá Chắn', 'Ivern/abilityVi'),
    forms: r.forms.map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(
        f.abilityHtmlVi,
        'icon-icon_damageamp"></span>?</span>',
        'icon-icon_damageamp"></span>165/300/3000</span>',
        'Ivern/forms/abilityHtmlVi',
      ),
    })),
  }));

  // ═══════════════ Maokai: 2 chỗ sát thương phép (passive + active) ═══════════════

  await updateChampion('champion:tft18_maokai', (r) => ({
    ability: replaceExact(
      r.ability,
      'a sapling jumps towards a nearby enemy and deals ? magic damage',
      'a sapling jumps towards a nearby enemy and deals 81/145/2795 magic damage',
      'Maokai/ability/passive',
    ).replace('Deal ? magic damage to target and restore', 'Deal 69/124/3726 magic damage to target and restore'),
    abilityVi: replaceExact(
      r.abilityVi,
      'gây ? sát thương phép. Khi bị hạ gục',
      'gây 81/145/2795 sát thương phép. Khi bị hạ gục',
      'Maokai/abilityVi/passive',
    ).replace('Gây ? sát thương phép lên mục tiêu', 'Gây 69/124/3726 sát thương phép lên mục tiêu'),
    forms: r.forms.map((f) => {
      const step1 = replaceFirst(
        f.abilityHtmlVi,
        'icon-icon_health"></span>?</span>',
        'icon-icon_health"></span>81/145/2795</span>',
        'Maokai/forms/abilityHtmlVi/passive',
      );
      const step2 = replaceFirst(
        step1,
        'icon-icon_health"></span>?</span>',
        'icon-icon_health"></span>69/124/3726</span>',
        'Maokai/forms/abilityHtmlVi/active',
      );
      return { ...f, abilityHtmlVi: step2 };
    }),
  }));

  // ═══════════════ Trait Ladder: chỉ VI lệch, EN đã đúng ═══════════════

  {
    const [row] = await db.select().from(set18Augments).where(eq(set18Augments.id, 'augment:da_traitladder'));
    if (!row) throw new Error('Augment không tìm thấy: augment:da_traitladder');
    const descriptionVi = replaceExact(row.descriptionVi, 'triển khai ? tộc/hệ không độc nhất', 'triển khai 2 tộc/hệ không độc nhất', 'TraitLadder/descriptionVi');
    if (DRY_RUN) {
      console.log('[DRY-RUN] augment augment:da_traitladder');
      diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    } else {
      await db.update(set18Augments).set({ descriptionVi, updatedAt: new Date() }).where(eq(set18Augments.id, 'augment:da_traitladder'));
      console.log('✓ augment augment:da_traitladder');
    }
  }

  // ═══════════════ Nashor's Tooth (+ bản Ánh Sáng): mana khi chí mạng ═══════════════

  for (const [id, from, to] of [
    ['item:da_nashorstooth', 'increased to ? if they critically strike', 'increased to 4 if they critically strike'],
    ['item:da_nashorstoothradiant', 'increased to ? if they critically strike', 'increased to 6 if they critically strike'],
  ] as const) {
    const [row] = await db.select().from(set18Items).where(eq(set18Items.id, id));
    if (!row) throw new Error(`Item không tìm thấy: ${id}`);
    const description = replaceExact(row.description, from, to, `${id}/description`);
    const viFrom = id.includes('radiant') ? 'tăng thành ? nếu là đòn chí mạng' : 'tăng thành ? nếu là đòn chí mạng';
    const viTo = id.includes('radiant') ? 'tăng thành 6 nếu là đòn chí mạng' : 'tăng thành 4 nếu là đòn chí mạng';
    const descriptionVi = replaceExact(row.descriptionVi, viFrom, viTo, `${id}/descriptionVi`);
    if (DRY_RUN) {
      console.log(`[DRY-RUN] item ${id}`);
      diffLine('description', row.description, description);
      diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    } else {
      await db.update(set18Items).set({ description, descriptionVi, updatedAt: new Date() }).where(eq(set18Items.id, id));
      console.log(`✓ item ${id}`);
    }
  }

  // ═══════════════ Aegis of Dawn / Lich Bane: khoảng min~max (chưa đủ 6 mốc) ═══════════════

  {
    const [row] = await db.select().from(set18Items).where(eq(set18Items.id, 'item:da_artifact_aegisofdawn'));
    if (!row) throw new Error('Item không tìm thấy: item:da_artifact_aegisofdawn');
    const description = replaceExact(row.description, "heal ? of the holder's Armor", "heal 15~50% of the holder's Armor", 'AegisOfDawn/description');
    const descriptionVi = replaceExact(row.descriptionVi, 'hồi máu bằng ? Giáp của chủ sở hữu', 'hồi máu bằng 15~50% Giáp của chủ sở hữu', 'AegisOfDawn/descriptionVi');
    if (DRY_RUN) {
      console.log('[DRY-RUN] item item:da_artifact_aegisofdawn');
      diffLine('description', row.description, description);
      diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    } else {
      await db.update(set18Items).set({ description, descriptionVi, updatedAt: new Date() }).where(eq(set18Items.id, 'item:da_artifact_aegisofdawn'));
      console.log('✓ item item:da_artifact_aegisofdawn');
    }
  }

  {
    const [row] = await db.select().from(set18Items).where(eq(set18Items.id, 'item:da_artifact_lichbane'));
    if (!row) throw new Error('Item không tìm thấy: item:da_artifact_lichbane');
    const description = replaceExact(row.description, 'deals ? bonus magic damage', 'deals 250~700 bonus magic damage', 'LichBane/description');
    const descriptionVi = replaceExact(row.descriptionVi, 'sẽ gây thêm ? sát thương phép', 'sẽ gây thêm 250~700 sát thương phép', 'LichBane/descriptionVi');
    if (DRY_RUN) {
      console.log('[DRY-RUN] item item:da_artifact_lichbane');
      diffLine('description', row.description, description);
      diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    } else {
      await db.update(set18Items).set({ description, descriptionVi, updatedAt: new Date() }).where(eq(set18Items.id, 'item:da_artifact_lichbane'));
      console.log('✓ item item:da_artifact_lichbane');
    }
  }
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
