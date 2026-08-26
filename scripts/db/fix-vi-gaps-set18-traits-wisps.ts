// Fix một lần: bịt các lỗ hổng bản dịch tiếng Việt còn sót trong
// set18_traits và set18_wisps. KHÔNG liên quan bản vá 18.1 — đây là lỗ hổng dữ
// liệu có sẵn từ các lần scrape trước, phát hiện khi rà soát theo yêu cầu
// "hoàn thiện bản dịch cho toàn bộ set18_champions / set18_traits /
// set18_wisps" (26/08/2026).
//
// Hỗ trợ --dry-run (log before/after, không ghi DB).
//
// KẾT QUẢ RÀ SOÁT TOÀN BỘ 3 BẢNG:
//
// set18_champions (65 dòng): KHÔNG có lỗ hổng nào. Đã soát `abilityVi`,
//   `abilityNameVi`, và `forms[].abilityHtmlVi` của cả 6 tướng nhiều dạng —
//   không dòng nào còn nguyên tiếng Anh hay trùng khít bản EN. Không cần ghi gì.
//
// set18_traits (36 dòng): 3 tộc hệ có `description`/`descriptionVi` rỗng —
//   Executioner (Đao Phủ), Riftbeast (Quái Rừng), Rival (Khắc Tinh). Đây KHÔNG
//   phải lỗi dịch: trong dữ liệu game gốc (metatft_set18_lookup_*.json) cả ba
//   đều có `desc: null`, phần chú giải nằm ở `postTierDesc` — tương ứng cột
//   `note` của bảng này. Xử lý theo từng trường hợp bên dưới.
//
// set18_wisps (177 dòng): 5 lỗ hổng, xử lý bên dưới.
//
// NGUỒN DỮ LIỆU: Set18/data/metatft_set18_lookup_vi_vn.json (bản dịch chính
// thức của Riot, trích từ client) và Set18/data/metatft_set18_wisps.json.
//
// ⚠️ CẢNH BÁO ĐÃ ÁP DỤNG: `metatft_set18_wisps.json` bị LỆCH HÀNG tên tiếng
// Anh (xem [[project_wisp_en_name_misalignment]]) — vd hàng có
// `name_en: "Bear's Visit"` lại mang `name_vi: "Bậc Thầy Thuật Sư"`. Mọi lần
// tra cứu bên dưới đều khớp theo `name_vi` ↔ `nameVi`, KHÔNG theo tên tiếng
// Anh. Nếu tra theo `name_en` thì 12/15 mục sẽ gắn nhầm nội dung.
//
// KHÔNG LÀM ĐƯỢC (thiếu nguồn, cố ý bỏ qua — không tự bịa):
// - Riftbeast (Quái Rừng): `postTierDesc` trong dữ liệu game là placeholder
//   chưa resolve `{Set18.Trait.Riftbeast.ShopTooltip}` — không có câu chú giải
//   thật để điền. Để trống, không tự viết.
// - 12 Tinh Linh còn thiếu `blossomUpgradeDescriptionVi` (Nguyên Phân, Hổ Đến
//   Thăm, Thêm bốn, Quầy Đồ Lạ, Tung Xu Liên Hoàn, Thương Nhân Du Hành, Hạt
//   Giống Hoa Sinh Mệnh, Hạt Cây Vỏ Đá, Ba Chúng Tôi, Ngựa Ghé Thăm, Rùa Ghé
//   Thăm, Hero Of Prophecy): tra theo `name_vi` trong nguồn thì
//   `blossom_upgrade_description_vi` đều là `null` — nguồn không có nội dung,
//   không phải chưa dịch. Chỉ 3 mục có nội dung thật, đã làm bên dưới.
// - Beggar's Wisp `appearsVi` vẫn là "Xuất hiện: chưa có dữ liệu": Tinh Linh
//   này do bản PBE 18.1ah tạo tay từ ảnh Truexy, không tồn tại trong
//   metatft_set18_wisps.json (đã dò cả 176 dòng) — không có mốc xuất hiện để
//   điền.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Traits, set18Wisps } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

type TraitBreakpoint = Record<string, unknown> & {
  threshold: string;
  bullet?: Record<string, unknown> & { textVi?: string };
};

function diffLine(label: string, from: string | null, to: string | null) {
  if (from === to) return;
  console.log(`    ${label}: ${JSON.stringify(from)} -> ${JSON.stringify(to)}`);
}

async function updateTrait(
  id: string,
  edits: {
    /** Assert giá trị hiện tại rồi set. `null` ở vế "from" = đang trống. */
    note?: [string | null, string];
    /** Thay chuỗi trong breakpointDetails[].bullet.textVi ở MỌI mốc có chứa nó. */
    breakpointTextVi?: [string, string];
  },
) {
  const [row] = await db.select().from(set18Traits).where(eq(set18Traits.id, id));
  if (!row) throw new Error(`Trait không tìm thấy: ${id}`);

  let note = row.note;
  let breakpointDetails = row.breakpointDetails as TraitBreakpoint[];

  if (edits.note) {
    const [from, to] = edits.note;
    const cur = note ?? null;
    if (cur !== from) throw new Error(`[${id}/note] hiện tại ${JSON.stringify(cur)} không khớp "from" ${JSON.stringify(from)}`);
    note = to;
  }

  if (edits.breakpointTextVi) {
    const [from, to] = edits.breakpointTextVi;
    const next = JSON.parse(JSON.stringify(breakpointDetails)) as TraitBreakpoint[];
    let hits = 0;
    for (const bp of next) {
      const text = bp.bullet?.textVi;
      if (typeof text !== 'string' || !text.includes(from)) continue;
      bp.bullet!.textVi = text.split(from).join(to);
      hits += 1;
    }
    if (hits === 0) throw new Error(`[${id}/breakpointDetails] không mốc nào chứa ${JSON.stringify(from)}`);
    breakpointDetails = next;
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] trait ${id} (${row.vi})`);
    diffLine('note', row.note, note);
    diffLine('breakpointDetails', JSON.stringify(row.breakpointDetails), JSON.stringify(breakpointDetails));
    return;
  }
  await db.update(set18Traits).set({ note, breakpointDetails, updatedAt: new Date() }).where(eq(set18Traits.id, id));
  console.log(`✓ trait ${id}`);
}

/** Khớp theo `name` (khoá chính thực tế của bảng) nhưng MỌI nội dung điền vào
 *  đều tra từ nguồn theo `name_vi` — xem cảnh báo lệch hàng ở đầu file. */
async function updateWisp(
  name: string,
  edits: {
    nameVi?: [string, string];
    descriptionVi?: [string, string];
    blossomUpgradeDescriptionVi?: [string | null, string];
  },
) {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
  if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);

  let nameVi = row.nameVi;
  let descriptionVi = row.descriptionVi;
  let blossom = row.blossomUpgradeDescriptionVi;

  if (edits.nameVi) {
    const [from, to] = edits.nameVi;
    if (nameVi !== from) throw new Error(`[${name}/nameVi] hiện tại ${JSON.stringify(nameVi)} không khớp "from"`);
    nameVi = to;
  }
  if (edits.descriptionVi) {
    const [from, to] = edits.descriptionVi;
    if (descriptionVi !== from) throw new Error(`[${name}/descriptionVi] hiện tại ${JSON.stringify(descriptionVi)} không khớp "from"`);
    descriptionVi = to;
  }
  if (edits.blossomUpgradeDescriptionVi) {
    const [from, to] = edits.blossomUpgradeDescriptionVi;
    const cur = blossom ?? null;
    if (cur !== from) throw new Error(`[${name}/blossomUpgradeDescriptionVi] hiện tại ${JSON.stringify(cur)} không khớp "from"`);
    blossom = to;
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] wisp ${name} (${row.nameVi})`);
    diffLine('nameVi', row.nameVi, nameVi);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    diffLine('blossomUpgradeDescriptionVi', row.blossomUpgradeDescriptionVi, blossom);
    return;
  }
  await db
    .update(set18Wisps)
    .set({ nameVi, descriptionVi, blossomUpgradeDescriptionVi: blossom, updatedAt: new Date() })
    .where(eq(set18Wisps.name, name));
  console.log(`✓ wisp ${name}`);
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN — không ghi DB ===\n' : '=== GHI DB THẬT ===\n');

  // ── Tộc Hệ ──────────────────────────────────────────────────────

  // Đao Phủ (Executioner): DB đang dùng "Chính Xác" cho keyword Precision,
  // nhưng bản dịch chính thức của Riot là "Chuẩn Xác" — xác nhận ở 2 nguồn
  // độc lập: (1) metatft_set18_lookup_vi_vn.json postTierDesc, (2) chính patch
  // note 18.1 ("Chuẩn Xác và Uyển Chuyển đã được đổi tên thành Ân Huệ Thách
  // Đấu ... do 'Chuẩn Xác' cũng là một từ khóa dùng cho cơ chế kỹ năng gây chí
  // mạng"). Toàn bộ phần còn lại của codex đã dùng "Chuẩn Xác" (30 chỗ trong
  // augments/champions/items/wisps) — chỉ Đao Phủ còn lệch (2 chỗ).
  // Câu note lấy nguyên văn bản VI chính thức, không tự diễn đạt lại.
  await updateTrait('trait:executioner', {
    note: [
      'Chính Xác: sát thương kỹ năng có thể chí mạng, cộng thêm 10% Sát Thương Chí Mạng.',
      'Chuẩn Xác: Sát thương kỹ năng có thể chí mạng. Chỉ số Chuẩn Xác cộng thêm tăng 10% Sát Thương Chí Mạng.',
    ],
    breakpointTextVi: ['Chính Xác', 'Chuẩn Xác'],
  });

  // Khắc Tinh (Rival): `note` đang trống. Dữ liệu game có postTierDesc
  // "<Rules>Only applies to your strongest Rival.</>" — bản VI chính thức:
  // "Chỉ áp dụng cho tướng Khắc Tinh mạnh nhất của bạn."
  await updateTrait('trait:rival', {
    note: [null, 'Chỉ áp dụng cho tướng Khắc Tinh mạnh nhất của bạn.'],
  });

  // ── Tinh Linh ───────────────────────────────────────────────────

  // 3 Tinh Linh có `blossomUpgradeCost` nhưng thiếu mô tả nâng cấp Hoa Linh.
  // Nội dung lấy nguyên văn từ metatft_set18_wisps.json, tra theo `name_vi`
  // (KHÔNG theo name_en — nguồn lệch hàng). Đã đối chiếu ngữ nghĩa từng câu
  // với tên Tinh Linh để chắc chắn không gắn nhầm hàng.
  await updateWisp('Idle Craftsman', {
    blossomUpgradeDescriptionVi: [
      null,
      'Một trang bị thành phần trên hàng chờ của bạn sẽ biến thành trang bị hoàn chỉnh được ghép từ nó.',
    ],
  });
  await updateWisp('Propagate', {
    blossomUpgradeDescriptionVi: [null, 'Nhận 1 bản sao của tướng đồng minh đầu tiên bị hạ gục.'],
  });
  await updateWisp('Phantom Emblem', {
    blossomUpgradeDescriptionVi: [null, 'Nhận 1 Ấn tạm thời cho tộc/hệ kích hoạt cao nhất của bạn.'],
  });

  // Hero Of Prophecy: Riot CHƯA dịch — bản vi_vn của chính Riot vẫn trả về
  // nguyên văn tiếng Anh (1 trong đúng 2 charm chưa được localize trên tổng số
  // 370). Dịch tay theo tiền lệ Curio Cart → "Quầy Đồ Lạ"
  // (scripts/db/fix-curiocart-vi.ts, 07/08/2026), giữ nguyên sắc thái "MÃI
  // MÃI" viết hoa của bản gốc.
  await updateWisp('Hero Of Prophecy', {
    nameVi: ['Hero Of Prophecy', 'Anh Hùng Tiên Tri'],
    descriptionVi: [
      'Gain a 5-cost champion. Gain them again each round FOREVER.',
      'Nhận 1 tướng 5 vàng. Nhận lại tướng đó mỗi vòng đấu MÃI MÃI.',
    ],
  });

  // Beggar's Wisp: tạo tay ở bản PBE 18.1ah, `nameVi` khi đó cố ý giữ nguyên
  // tên gốc vì chưa có bản dịch chính thức. Vẫn không có trong nguồn metatft,
  // và bản vá live 18.1 cũng không nhắc tới. Dịch tay theo cùng tiền lệ.
  await updateWisp("Beggar's Wisp", {
    nameVi: ["Beggar's Wisp", 'Tinh Linh Hành Khất'],
  });

  console.log(DRY_RUN ? '\n=== DRY RUN xong — chưa ghi gì ===' : '\n=== Đã ghi DB xong ===');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
