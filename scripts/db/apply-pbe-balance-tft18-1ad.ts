// Migration một lần cho bản PBE 18.1ad (Truexy ghi ngày 8/12, đăng lúc 3:22
// AM giờ hiển thị Aug 13, 2026) — cập nhật set18_traits/set18_wisps/
// set18_items. Nguồn: pbe-notes/Patch_TFT18.1ad-PBE-moderate-balance-pass.md.
//
// 4 phần:
// 1. Trait Blackthorn (trait:eldritch) — base sacrifice stats mốc 2/4 (bronze
//    + silver breakpointDetails), replaceExact/assert an toàn, khớp đúng
//    "from" patch note.
// 2. Wisp Curio Cart (wisp:curio-cart) — description/descriptionVi đổi
//    "14 gold"/"14 vàng" -> "15 gold"/"15 vàng" (người dùng xác nhận giá
//    trị đúng là 0-15, DB đang ghi nhầm 0-14).
// 3. Trait Blackthorn mốc 6 (6-Piece Rework) — KHÔNG có anchor số đơn giản
//    (cấu trúc bonus cố định cũ hoàn toàn khác cơ chế mới), nhưng người dùng
//    yêu cầu bổ sung nội dung mới vào DB thay vì bỏ qua. Đây là VIẾT MỚI
//    (ghi đè toàn bộ values[] + textVi của breakpoint mốc 6), không phải
//    replaceExact có assert — rủi ro cao hơn phần 1/2, cần soát kỹ trước khi
//    chạy thật.
// 4. 6 Artifact Items — đã dump lại TOÀN BỘ description/descriptionVi/
//    statLine thật (không suy đoán) qua 2 vòng soát lại, sau khi bị chỉ ra
//    bỏ sót anchor 2 lần liên tiếp (Titanic Hydra ở description, rồi
//    Dawncore/Eternal Pact/Fishbones ở statLine). Anchor thật nằm ở CẢ
//    description LẪN statLine tuỳ item — dùng cả 2 nguồn, ưu tiên
//    replaceExact có assert bất cứ khi nào tìm được:
//    - Dawncore: statLine "15% 15% 2" khớp đúng AD=15/AP=15/ManaRegen=2
//      ("from" patch) — replaceExact toàn statLine "15% 15% 2"->"20% 20% 1".
//      Description "to a minimum of 10." khớp Minimum Mana 10->15 —
//      replaceExact riêng (EN+VI). Mana Reduction Per Cast: description ghi
//      "7%", LỆCH "from"=4% patch note — không đủ tin cậy để replaceExact,
//      chỉ ghi statBadges "to"=5%, cần soát lại vì sao lệch.
//    - Eternal Pact: statLine "40% 1" khớp đúng Base AP=40 ("from" patch) —
//      replaceExact "40% 1"->"35% 1". "40% Ability Power" trong description
//      trùng số NHƯNG là cơ chế proc-on-death khác hẳn Base AP (không xuất
//      hiện trong ability text) — KHÔNG replaceExact description.
//    - Fishbones: statLine "30% 30%" khớp đúng AS=30/AD=30 ("from" patch) —
//      replaceExact "30% 30%"->"25% 25%". Description không có % nào khớp.
//    - Forbidden Idol: description "Shields have 35%...instead." (EN=VI,
//      chưa dịch) khớp Shield Conversion 35%->40% — replaceExact cả 2 field.
//      statLine "350 2": người dùng xác nhận đây là LỖI NHẬP LIỆU CŨ (đáng lẽ
//      "250 2" khớp "from" patch note) — sửa luôn thành "400 2" (400 = Máu
//      mới theo patch, "2" giữ nguyên). Assert theo giá trị thực tế "350 2"
//      đang có trong DB, không assert theo "from" patch note 250 (không
//      khớp thực tế) — vừa sửa lỗi dữ liệu cũ vừa áp patch cùng lúc, khác
//      với các replaceExact thuần theo patch ở trên. Cũng ghi statBadges
//      health=400 song song.
//    - Talisman of Ascension: description (EN) "8 Mana Regen" khớp Ascended
//      Mana Regen 8->12 — replaceExact riêng bản EN; descriptionVi không có
//      cụm này (bản dịch thiếu). statLine "450 20% 20%" không khớp "8" ở
//      đâu — không đụng statLine.
//    - Titanic Hydra: description (EN+VI) "4%...max Health"/"4% Máu tối đa"
//      khớp % Health as Bonus Damage 4%->2% — replaceExact cả 2 field.
//      statLine "300 20% 20%" không khớp "4%" — không đụng statLine.
//    statBadges hiện KHÔNG được component nào tiêu thụ (đã grep toàn bộ
//    src/, không có `.statBadges` nào được đọc) nên an toàn để ghi mới/thêm
//    key mới (manaregen, manareduction) — dùng làm lớp dữ liệu curated bổ
//    sung song song với các field text/statLine đã sửa bằng anchor thật.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Traits, set18Wisps, set18Items } from '../../src/db/schema';

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

async function updateItem(
  name: string,
  opts: {
    description?: [string, string][];
    descriptionVi?: [string, string][];
    statLine?: [string, string];
    statBadges?: { stat: string; value: string }[];
  },
) {
  const [row] = await db.select().from(set18Items).where(eq(set18Items.name, name));
  if (!row) throw new Error(`Item không tìm thấy: ${name}`);
  if (opts.statBadges && row.statBadges) {
    throw new Error(`[${name}/statBadges] đã có dữ liệu curated sẵn (${JSON.stringify(row.statBadges)}) — không ghi đè`);
  }

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);

  let statLine = row.statLine;
  if (opts.statLine) {
    const [from, to] = opts.statLine;
    if (statLine !== from) {
      throw new Error(`[${name}/statLine] hiện tại (${JSON.stringify(statLine)}) không khớp "from" mong đợi (${JSON.stringify(from)})`);
    }
    statLine = to;
  }

  await db
    .update(set18Items)
    .set({
      description,
      descriptionVi,
      ...(opts.statLine ? { statLine } : {}),
      ...(opts.statBadges ? { statBadges: opts.statBadges } : {}),
      updatedAt: new Date(),
    })
    .where(eq(set18Items.name, name));
  console.log(`✓ item ${name}`);
}

async function main() {
  // ── 1. Trait Blackthorn — base sacrifice stats mốc 2/4 ──────────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Blackthorn'));
    if (!row) throw new Error('Trait không tìm thấy: Blackthorn');
    const details = row.breakpointDetails as any[];

    const edits: [string, string, string, string][] = [
      ['TankSacrificeHPBonus', '17%', '20%', 'Tank HP Bonus'],
      ['ADSacrificeADBonus', '22', '24', 'Attack Champion AD Bonus'],
      ['ADSacrificeASBonus', '10%', '12%', 'Attack Champion AS Bonus'],
      ['APSacrificeDamageAmpBonus', '13%', '14%', 'Magic Champion Damage Amp Bonus'],
    ];

    for (const threshold of ['2', '4']) {
      const d = details.find((x) => x.threshold === threshold);
      if (!d) throw new Error(`[Blackthorn/mốc${threshold}] không tìm thấy breakpointDetails`);
      for (const [row_, from, to, label] of edits) {
        const v = d.bullet?.values?.find((x: any) => x.row === row_);
        if (!v || v.value !== from) {
          throw new Error(`[Blackthorn/mốc${threshold}/${label}] hiện tại (${v?.value}) không khớp "from" mong đợi (${from})`);
        }
        v.value = to;
      }
    }

    // ── 3. Trait Blackthorn mốc 6 — 6-Piece Rework (viết mới) ───────
    const gold = details.find((x) => x.threshold === '6');
    if (!gold) throw new Error('[Blackthorn/mốc6] không tìm thấy breakpointDetails');
    if (gold.style !== 'gold') {
      throw new Error(`[Blackthorn/mốc6] style hiện tại (${gold.style}) khác "gold" mong đợi — dừng lại, cấu trúc có thể đã đổi khác giả định`);
    }
    gold.bullet = {
      textVi: 'Đơn vị hiến tế giờ chết như mốc 2/4 (bỏ cơ chế/bonus cố định riêng của mốc 6). Hi sinh tăng {0} cho cả đội, và chỉ số hiến tế nhận được ở mốc 2/4 tăng thêm {1}.',
      values: [
        { row: 'SacrificeTeamHealth', icons: ['health'], value: '500' },
        { row: 'SacrificeStatsIncreasePercent', icons: [], value: '50%' },
      ],
    };

    await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, 'Blackthorn'));
    console.log('✓ trait Blackthorn (mốc 2/4 base sacrifice stats + mốc 6 viết mới theo 6-Piece Rework)');
  }

  // ── 2. Wisp Curio Cart — giá tối đa 14 -> 15 vàng ────────────────────
  {
    const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, 'Curio Cart'));
    if (!row) throw new Error('Wisp không tìm thấy: Curio Cart');

    const description = replaceExact(row.description, 'Items cost 0 to 14 gold.', 'Items cost 0 to 15 gold.', 'Curio Cart/description');
    const descriptionVi = replaceExact(
      row.descriptionVi,
      'Trang bị có giá từ 0 đến 14 vàng.',
      'Trang bị có giá từ 0 đến 15 vàng.',
      'Curio Cart/descriptionVi',
    );

    await db.update(set18Wisps).set({ description, descriptionVi, updatedAt: new Date() }).where(eq(set18Wisps.name, 'Curio Cart'));
    console.log('✓ wisp Curio Cart (giá tối đa 14 -> 15 vàng)');
  }

  // ── 4. Artifact Items ─────────────────────────────────────────────
  await updateItem('Dawncore', {
    description: [['to a minimum of 10.', 'to a minimum of 15.']],
    descriptionVi: [['xuống mức tối thiểu là 10.', 'xuống mức tối thiểu là 15.']],
    // statLine "15% 15% 2" khớp đúng AD=15/AP=15/ManaRegen=2 ("from" patch
    // note) — anchor thật, dùng assert + replaceExact toàn chuỗi.
    statLine: ['15% 15% 2', '20% 20% 1'],
    statBadges: [
      { stat: 'ad', value: '20' },
      { stat: 'ap', value: '20' },
      { stat: 'manaregen', value: '1' },
      { stat: 'manareduction', value: '5%' }, // description ghi "7%", lệch "from"=4% patch note — không replaceExact, chỉ lưu "to" đúng ở đây, cần soát lại vì sao lệch
    ],
  });

  await updateItem('Eternal Pact', {
    // "40% Ability Power" trong description là cơ chế proc-on-death, KHÔNG
    // phải Base AP — không replaceExact description. Nhưng statLine "40% 1"
    // khớp đúng Base AP=40 ("from" patch note) — anchor thật ở statLine.
    statLine: ['40% 1', '35% 1'],
    statBadges: [{ stat: 'ap', value: '35' }],
  });

  await updateItem('Fishbones', {
    // Không có % nào trong description khớp AS/AD. Nhưng statLine "30% 30%"
    // khớp đúng AS=30/AD=30 ("from" patch note) — anchor thật ở statLine.
    statLine: ['30% 30%', '25% 25%'],
    statBadges: [
      { stat: 'as', value: '25%' },
      { stat: 'ad', value: '25%' },
    ],
  });

  await updateItem('Forbidden Idol', {
    description: [["Shields have 35% of their value converted to max Health instead.", "Shields have 40% of their value converted to max Health instead."]],
    descriptionVi: [["Shields have 35% of their value converted to max Health instead.", "Shields have 40% of their value converted to max Health instead."]], // chưa có bản dịch, hiện đang trùng hệt bản EN
    // statLine hiện tại "350 2" — người dùng xác nhận đây là lỗi nhập liệu cũ
    // (đáng lẽ phải là "250 2" khớp "from" patch note), không liên quan trực
    // tiếp tới patch này. Theo yêu cầu người dùng, sửa luôn thành "400 2":
    // 400 = Máu mới theo patch (250->400), "2" giữ nguyên (hồi Năng Lượng,
    // không đổi trong patch này). Assert theo giá trị THỰC TẾ đang có trong
    // DB ("350 2"), không assert theo "from" patch note (250) vì DB không
    // khớp — đây là sửa lỗi dữ liệu cũ kết hợp áp patch, không phải
    // replaceExact thuần theo patch.
    statLine: ['350 2', '400 2'],
    statBadges: [{ stat: 'health', value: '400' }], // không có trong ability text (chỉ số ẩn); 400 khớp ảnh gốc patch note, KHÔNG dùng 350 (statLine cũ, đã sửa ở trên)
  });

  await updateItem('Talisman of Ascension', {
    description: [['100% max Health, 8 Mana Regen, and 120%', '100% max Health, 12 Mana Regen, and 120%']],
    // descriptionVi KHÔNG có cụm "Mana Regen" (bản dịch thiếu hẳn phần này) — không replaceExact được, giữ nguyên.
    statBadges: [{ stat: 'manaregen', value: '12' }], // bù cho descriptionVi đang thiếu số liệu này
  });

  await updateItem('Titanic Hydra', {
    description: [["Attacks deal 4% of the holder's max Health", "Attacks deal 2% of the holder's max Health"]],
    descriptionVi: [['cộng thêm bằng 4% Máu tối đa', 'cộng thêm bằng 2% Máu tối đa']],
  });

  console.log('✓ Hoàn tất cập nhật traits/wisps/items cho 18.1ad (12/08).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
