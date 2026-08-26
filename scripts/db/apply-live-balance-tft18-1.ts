// Migration một lần cho bản vá LIVE 18.1 (Set 18 Đại Ngàn Kỳ Bí ra mắt máy chủ
// phát hành, 26/08/2026) — đồng bộ set18_augments + set18_items về đúng số liệu
// live. Nguồn: pbe-notes/Patch_TFT18.1-Live-launch.md (đối chiếu patch note
// chính thức EN + VI).
//
// Hỗ trợ --dry-run (log before/after, không ghi DB) — LUÔN chạy trước khi ghi
// thật, xem [[feedback_patch_update_mismatched_anchors_and_dryrun]].
//
// KHÔNG đụng set18_champions / set18_traits / set18_wisps: bản vá live 18.1
// không có mục cân bằng tướng, tộc hệ hay Tinh Linh Set 18 — số liệu đã chốt
// qua chuỗi PBE 18.1x → 18.1ah.
//
// Bối cảnh chung: DB Set 18 được scrape trong giai đoạn PBE nên PHẦN LỚN số
// liệu 18.1 live đã đúng sẵn (Dawncore, Aegis of Dusk, Eternal Pact, Radiant
// Gargoyle/Steadfast, Band of Thieves II, Comeback Story, Going Long, Living
// Forge, Max Build, Money Hungry+ ... đã khớp). Script này chỉ vá những chỗ
// scrape còn lệch: statBadges cũ chưa theo statLine mới, và bản dịch VI chưa
// theo kịp bản EN.
//
// Quyết định khi anchor lệch (ghi ở đây, KHÔNG ghi vào note của PatchEntry vì
// note hiển thị công khai trên /patch):
// - Luxury Subscription: patch ghi "Gold: 7 ⇒ 3" nhưng mô tả DB ghi "5 gold" —
//   không field nào chứa 7. Đã Grep toàn bộ pbe-notes/*.md và scripts/db/
//   drafts/*.ts, không có bản PBE nào từng đổi giá trị này. Ghi đè theo "to"
//   (3 vàng) vì đó là con số live chắc chắn đúng; "from" của patch note lệch.
// - Blighting Jewel: patch ghi "Base AP: 60% ⇒ 30%". statBadges.ap = 60 khớp
//   "from" → đổi thành 30 (có assert). Đã soát lại CẢ 4 cột còn lại theo yêu
//   cầu: `description`/`descriptionVi` đã đúng bản sau vá (giảm 6 Kháng Phép,
//   "4 Năng Lượng" khi mục tiêu còn 0 Kháng Phép — khớp "to" của patch);
//   `statLine = "35% 4"` có token "4" khớp đúng phần mana ở mô tả, nhưng token
//   "35%" KHÔNG khớp cả 60 lẫn 30 → KHÔNG đụng vào, đã báo người dùng. Badge
//   `manaregen: "2%"` nhiều khả năng là scrape nhầm từ giá trị CŨ "Mana gained
//   at 0 MR: 2" (vốn là hiệu ứng trong mô tả, không phải chỉ số hồi năng
//   lượng) → cũng không tự ý xoá, đã báo người dùng.
// - Statikk Shiv: làm HAI BƯỚC theo chỉ đạo người dùng — xem ghi chú tại chỗ.
// - Wit's End: desc EN/VI đang để literal "?" ở chỗ sát thương phép cộng thêm
//   (lỗi scrape có từ trước, không phải do bản vá này). Thay bằng dãy mới
//   30/30/55/75/95/115 mà patch note cho.
// - Hellfire Hatchet: patch ghi "Base AD: Removed". statLine "400 20%" chỉ còn
//   2 token (Máu + Hút Máu Toàn Phần) → xoá hẳn badge `ad` khỏi statBadges,
//   đồng thời sửa health 150 → 400 cho khớp statLine.
//
// SKIP thật sự (xác nhận không làm):
// - Death's Defiance / Hullcrusher / Sniper's Focus ("Kính Nhắm Thiện Xạ"):
//   patch ghi gỡ khỏi game, nhưng cả ba đã `visible: false` sẵn trong DB — 2
//   món đầu do bản 18.1af/18.1ah, món thứ ba do là item tham khảo mùa 17.
//   Không có gì để ghi.
// - Bronze for Life, Build-a-Bud, Buried Treasures II, Forged in Strength,
//   Slightly Magical: không tồn tại trong codex Set 18 (bể Nâng Cấp scrape chỉ
//   có bản III của Buried Treasures). Chỉ lên patch report.
// - 43 Nâng Cấp bị loại bỏ: đều là Nâng Cấp mùa cũ, không có dòng nào trong
//   set18_augments để ẩn đi.
// - Twisted Fate / Milio: tướng Mùa 17, không thuộc codex Set 18.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Augments, set18Items } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

type TextEdit = [string, string];
type StatBadge = { stat: string; value: string };

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

function diffLine(label: string, from: string | null, to: string | null) {
  if (from === to) return;
  console.log(`    ${label}: ${JSON.stringify(from)} -> ${JSON.stringify(to)}`);
}

async function updateAugment(
  id: string,
  edits: {
    description?: TextEdit[];
    descriptionVi?: TextEdit[];
    /** Thay nguyên chuỗi, có assert giá trị hiện tại. */
    setDescription?: [string, string];
    setDescriptionVi?: [string, string];
    nameVi?: [string, string];
  },
) {
  const [row] = await db.select().from(set18Augments).where(eq(set18Augments.id, id));
  if (!row) throw new Error(`Augment không tìm thấy: ${id}`);

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  let nameVi = row.nameVi;

  for (const [from, to] of edits.description ?? [])
    description = replaceExact(description, from, to, `${id}/description`);
  for (const [from, to] of edits.descriptionVi ?? [])
    descriptionVi = replaceExact(descriptionVi, from, to, `${id}/descriptionVi`);

  if (edits.setDescription) {
    const [from, to] = edits.setDescription;
    if (description !== from)
      throw new Error(`[${id}/description] hiện tại ${JSON.stringify(description)} không khớp "from"`);
    description = to;
  }
  if (edits.setDescriptionVi) {
    const [from, to] = edits.setDescriptionVi;
    if (descriptionVi !== from)
      throw new Error(`[${id}/descriptionVi] hiện tại ${JSON.stringify(descriptionVi)} không khớp "from"`);
    descriptionVi = to;
  }
  if (edits.nameVi) {
    const [from, to] = edits.nameVi;
    if (nameVi !== from) throw new Error(`[${id}/nameVi] hiện tại (${nameVi}) không khớp "from" (${from})`);
    nameVi = to;
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] augment ${id} (${row.nameVi})`);
    diffLine('nameVi', row.nameVi, nameVi);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    return;
  }
  await db
    .update(set18Augments)
    .set({ nameVi, description, descriptionVi, updatedAt: new Date() })
    .where(eq(set18Augments.id, id));
  console.log(`✓ augment ${id}`);
}

async function updateItem(
  name: string,
  edits: {
    description?: TextEdit[];
    descriptionVi?: TextEdit[];
    /** Thay nguyên chuỗi, có assert giá trị hiện tại. */
    setDescriptionVi?: [string, string];
    /** Thay nguyên chuỗi statLine, có assert giá trị hiện tại. */
    statLine?: [string, string];
    /** Thay nguyên mảng statBadges, có assert JSON hiện tại. */
    statBadges?: { from: StatBadge[]; to: StatBadge[] };
  },
) {
  const [row] = await db.select().from(set18Items).where(eq(set18Items.name, name));
  if (!row) throw new Error(`Item không tìm thấy: ${name}`);

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  let statLine = row.statLine;
  let statBadges = row.statBadges;

  for (const [from, to] of edits.description ?? [])
    description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of edits.descriptionVi ?? [])
    descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);

  if (edits.setDescriptionVi) {
    const [from, to] = edits.setDescriptionVi;
    if (descriptionVi !== from)
      throw new Error(`[${name}/descriptionVi] hiện tại ${JSON.stringify(descriptionVi)} không khớp "from"`);
    descriptionVi = to;
  }
  if (edits.statLine) {
    const [from, to] = edits.statLine;
    if (statLine !== from)
      throw new Error(`[${name}/statLine] hiện tại ${JSON.stringify(statLine)} không khớp "from" ${JSON.stringify(from)}`);
    statLine = to;
  }
  if (edits.statBadges) {
    const cur = JSON.stringify(row.statBadges);
    const expected = JSON.stringify(edits.statBadges.from);
    if (cur !== expected)
      throw new Error(`[${name}/statBadges] hiện tại ${cur} không khớp "from" ${expected}`);
    statBadges = edits.statBadges.to;
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] item ${name} (${row.nameVi})`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    diffLine('statLine', row.statLine, statLine);
    diffLine('statBadges', JSON.stringify(row.statBadges), JSON.stringify(statBadges));
    return;
  }
  await db
    .update(set18Items)
    .set({ description, descriptionVi, statLine, statBadges, updatedAt: new Date() })
    .where(eq(set18Items.name, name));
  console.log(`✓ item ${name}`);
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN — không ghi DB ===\n' : '=== GHI DB THẬT ===\n');

  // ── Nâng Cấp ────────────────────────────────────────────────────

  // Backline Blueprint / Frontline Foundation: patch đổi tooltip từ
  // "last-listed trait" sang "class". Bản EN trong DB đã là "matches their
  // class", chỉ bản VI còn "tộc/hệ cuối cùng".
  await updateAugment('augment:da_backlineblueprint', {
    descriptionVi: [['tộc/hệ cuối cùng của tướng đó', 'tộc/hệ (class) của tướng đó']],
  });
  await updateAugment('augment:da_frontlinefoundation', {
    descriptionVi: [['tộc/hệ cuối cùng của tướng đó', 'tộc/hệ (class) của tướng đó']],
  });

  // Birthday Reunion: bản EN đã đúng ("a random item component"), bản VI dịch
  // sai thành "1 Găng Đạo Tặc" (nhầm sang Band of Thieves).
  await updateAugment('augment:da_birthdayreunion', {
    descriptionVi: [['Khi đạt Cấp 6, nhận 1 Găng Đạo Tặc.', 'Khi đạt Cấp 6, nhận 1 trang bị thành phần ngẫu nhiên.']],
  });

  // Challenger's Grace: đổi tên từ Precision and Grace. name (EN) trong DB đã
  // đổi rồi, nameVi vẫn giữ tên cũ.
  await updateAugment('augment:da_challengersgrace', {
    nameVi: ['Chuẩn Xác và Uyển Chuyển', 'Ân Huệ Thách Đấu'],
  });

  // Healing Orbs I/II: hồi máu ngay lập tức + chọn đồng minh % Máu thấp nhất
  // trong 3 ô quanh mục tiêu thay vì đồng minh gần nhất.
  await updateAugment('augment:da_healingorbsi', {
    setDescription: [
      'When an enemy dies, a nearby ally is healed for 250 Health.',
      'When an enemy dies, instantly heal the lowest Health % ally within 3 hexes of the target for 250 Health. Defaults to the nearest ally if no one is within 3 hexes.',
    ],
    setDescriptionVi: [
      'Khi một kẻ địch bị hạ gục, tướng đồng minh gần nhất được hồi lại 250 máu.',
      'Khi một kẻ địch bị hạ gục, hồi ngay 250 Máu cho đồng minh có % Máu thấp nhất trong phạm vi 3 ô quanh mục tiêu. Mặc định chọn đồng minh gần nhất nếu không có ai trong 3 ô.',
    ],
  });
  await updateAugment('augment:da_healingorbsii', {
    setDescription: [
      'When an enemy dies, a nearby ally is healed for 575 Health.',
      'When an enemy dies, instantly heal the lowest Health % ally within 3 hexes of the target for 575 Health. Defaults to the nearest ally if no one is within 3 hexes.',
    ],
    setDescriptionVi: [
      'Khi một kẻ địch bị hạ gục, tướng đồng minh gần nhất được hồi lại 575 máu.',
      'Khi một kẻ địch bị hạ gục, hồi ngay 575 Máu cho đồng minh có % Máu thấp nhất trong phạm vi 3 ô quanh mục tiêu. Mặc định chọn đồng minh gần nhất nếu không có ai trong 3 ô.',
    ],
  });

  // Luxury Subscription: anchor lệch (patch 7 ⇒ 3, DB đang 5) — ghi đè theo
  // "to". Xem ghi chú đầu file.
  await updateAugment('augment:da_luxurysubscription', {
    description: [['champion, and 5 gold', 'champion, and 3 gold']],
    descriptionVi: [['2 sao và 5 vàng', '2 sao và 3 vàng']],
  });

  // ── Trang Bị Ánh Sáng ───────────────────────────────────────────

  // Radiant Hand of Justice: SMCK/SMPT 30 ⇒ 35. Bản EN đã 35%, bản VI còn 30%.
  await updateItem('Radiant Hand of Justice', {
    descriptionVi: [
      ['• 30% Sức Mạnh Công Kích và 30% Sức Mạnh Phép Thuật.', '• 35% Sức Mạnh Công Kích và 35% Sức Mạnh Phép Thuật.'],
    ],
  });

  // ── Tạo Tác quay trở lại ────────────────────────────────────────

  // Forbidden Idol: số liệu đã đúng, nhưng descriptionVi còn nguyên tiếng Anh.
  await updateItem('Forbidden Idol', {
    setDescriptionVi: [
      'Shields have 40% of their value converted to max Health instead.',
      '40% giá trị lá chắn sẽ được chuyển sang Máu tối đa.',
    ],
  });

  // Manazane: statLine "15% 15% 1" đã đúng theo patch (15% SMCK, 15% SMPT,
  // 1 Hồi Năng Lượng) nhưng statBadges còn theo bản scrape cũ.
  await updateItem('Manazane', {
    statBadges: {
      from: [
        { stat: 'ad', value: '15%' },
        { stat: 'ap', value: '10' },
        { stat: 'as', value: '10%' },
      ],
      to: [
        { stat: 'ad', value: '15%' },
        { stat: 'ap', value: '15%' },
        { stat: 'manaregen', value: '1' },
      ],
    },
  });

  // ── Điều chỉnh Tạo Tác ──────────────────────────────────────────

  // Blighting Jewel: SMPT cơ bản 60% ⇒ 30%, và dọn luôn 2 chỗ lệch scrape mà
  // người dùng đã duyệt xử lý (26/08/2026):
  //  - statLine "35% 4" -> "30% 4": token đầu là SMPT, đang lệch cả "from"(60)
  //    lẫn "to"(30) của patch note. Đưa về 30 cho khớp statBadges — để lệch thì
  //    DB tự mâu thuẫn, và statLine là nguồn fallback khi thiếu statBadges nên
  //    sai ở đây sẽ hiện ra UI. Token "4" giữ nguyên (khớp "4 Năng Lượng" ở mô
  //    tả).
  //  - Xoá badge manaregen "2%": đây là scrape nhầm từ giá trị CŨ "Mana gained
  //    at 0 MR: 2" — vốn là hiệu ứng trong mô tả (nay đã là 4), KHÔNG phải chỉ
  //    số hồi năng lượng của trang bị. Patch note liệt kê đúng 1 chỉ số cho
  //    món này là Base AP, nên sau khi xoá chỉ còn badge `ap`.
  await updateItem('Blighting Jewel', {
    statLine: ['35% 4', '30% 4'],
    statBadges: {
      from: [
        { stat: 'ap', value: '60' },
        { stat: 'manaregen', value: '2%' },
      ],
      to: [{ stat: 'ap', value: '30' }],
    },
  });

  // Fishbones: bản EN đã có "Gain +2 Attack Range", bản VI thiếu hẳn câu này.
  await updateItem('Fishbones', {
    setDescriptionVi: [
      'Đòn đánh của chủ sở hữu sẽ nhắm tới những kẻ địch ngẫu nhiên.',
      'Đòn đánh của chủ sở hữu sẽ nhắm tới những kẻ địch ngẫu nhiên. Tăng thêm +2 Tầm Đánh.',
    ],
  });

  // Hellfire Hatchet: Máu cơ bản 150 ⇒ 400, SMCK cơ bản bị loại bỏ.
  await updateItem('Hellfire Hatchet', {
    statBadges: {
      from: [
        { stat: 'ad', value: '20%' },
        { stat: 'health', value: '150' },
        { stat: 'omnivamp', value: '20%' },
      ],
      to: [
        { stat: 'health', value: '400' },
        { stat: 'omnivamp', value: '20%' },
      ],
    },
  });

  // Rapid Firecannon: Tốc Độ Đánh 65% ⇒ 55% (statLine đã 55%).
  await updateItem('Rapid Firecannon', {
    statBadges: {
      from: [
        { stat: 'as', value: '65%' },
        { stat: 'damageamp', value: '5%' },
      ],
      to: [
        { stat: 'as', value: '55%' },
        { stat: 'damageamp', value: '5%' },
      ],
    },
  });

  // Silvermere Dawn: thêm 30% Hút Máu Toàn Phần, SMCK 140% ⇒ 125%, kháng
  // 80 ⇒ 30. statLine "125% 30 30 30%" khớp đúng bộ 4 badge mới.
  await updateItem('Silvermere Dawn', {
    statBadges: {
      from: [
        { stat: 'ad', value: '140%' },
        { stat: 'armor', value: '80' },
        { stat: 'mr', value: '80' },
      ],
      to: [
        { stat: 'ad', value: '125%' },
        { stat: 'armor', value: '30' },
        { stat: 'mr', value: '30' },
        { stat: 'omnivamp', value: '30%' },
      ],
    },
  });

  // Statikk Shiv: người dùng chỉ đạo làm HAI BƯỚC rõ ràng thay vì ghi đè thẳng.
  // DB đang ghi "20 + 50%" nhưng patch note ghi "from" là "30 + 50%" — base 20
  // là sai lệch scrape có sẵn từ trước, không phải giá trị live hợp lệ.
  //   Bước 1: sửa DB về đúng giá trị TRƯỚC bản vá  → "30 + 50%"
  //   Bước 2: áp bản vá 18.1                        → "15 + 35%"
  // Làm 2 bước để log dry-run thể hiện đúng lịch sử số liệu, và để lần sau đọc
  // lại không tưởng nhầm rằng DB từng đúng ở mức 20.
  // Tốc Độ Đánh 50% ⇒ 40%. Số kẻ địch bị nảy trúng đã là 6 từ trước.
  await updateItem('Statikk Shiv', {
    description: [
      // bước 1: 20 -> 30 (đưa DB về khớp "from" của patch note)
      ["deals 20 + 50% of the holder's Ability Power", "deals 30 + 50% of the holder's Ability Power"],
      // bước 2: 30 + 50% -> 15 + 35% (áp bản vá)
      ["deals 30 + 50% of the holder's Ability Power", "deals 15 + 35% of the holder's Ability Power"],
    ],
    descriptionVi: [
      ['gây thêm sát thương phép bằng 20 + 50% Sức Mạnh Phép Thuật', 'gây thêm sát thương phép bằng 30 + 50% Sức Mạnh Phép Thuật'],
      ['gây thêm sát thương phép bằng 30 + 50% Sức Mạnh Phép Thuật', 'gây thêm sát thương phép bằng 15 + 35% Sức Mạnh Phép Thuật'],
    ],
    statBadges: {
      from: [
        { stat: 'as', value: '50%' },
        { stat: 'ap', value: '15' },
      ],
      to: [
        { stat: 'as', value: '40%' },
        { stat: 'ap', value: '15' },
      ],
    },
  });

  // Talisman of Ascension: hiệu ứng MỚI "12 Hồi Năng Lượng" — bản EN đã có,
  // bản VI thiếu.
  await updateItem('Talisman of Ascension', {
    setDescriptionVi: [
      'Sau 22 giây, tăng 100% Máu tối đa và 120% Khuếch Đại Sát Thương cho đến hết giao tranh.',
      'Sau 22 giây, tăng 100% Máu tối đa, 12 Hồi Năng Lượng và 120% Khuếch Đại Sát Thương cho đến hết giao tranh.',
    ],
  });

  // Titanic Hydra: % SMCK cơ bản thành sát thương cộng thêm 6% ⇒ 2%.
  // (Phần "2% Máu tối đa" là khái niệm khác, giữ nguyên.)
  await updateItem('Titanic Hydra', {
    description: [['plus 6% of their Attack Damage', 'plus 2% of their Attack Damage']],
    descriptionVi: [['+ 6% Sức Mạnh Công Kích', '+ 2% Sức Mạnh Công Kích']],
  });

  // Wit's End: Máu 400 ⇒ 300; sát thương phép cộng thêm đang là literal "?"
  // trong DB (lỗi scrape cũ) — điền dãy mới theo patch note.
  await updateItem("Wit's End", {
    description: [['Attacks deal ? bonus magic damage.', 'Attacks deal 30/30/55/75/95/115 bonus magic damage.']],
    descriptionVi: [['Đòn đánh gây thêm ? sát thương phép.', 'Đòn đánh gây thêm 30/30/55/75/95/115 sát thương phép.']],
    statBadges: {
      from: [
        { stat: 'as', value: '25%' },
        { stat: 'armor', value: '20' },
        { stat: 'mr', value: '20' },
        { stat: 'health', value: '400' },
      ],
      to: [
        { stat: 'as', value: '25%' },
        { stat: 'armor', value: '20' },
        { stat: 'mr', value: '20' },
        { stat: 'health', value: '300' },
      ],
    },
  });

  console.log(DRY_RUN ? '\n=== DRY RUN xong — chưa ghi gì ===' : '\n=== Đã ghi DB xong ===');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
