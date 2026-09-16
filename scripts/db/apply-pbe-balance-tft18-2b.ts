// Migration một lần cho bản LIVE 18.2b (micropatch @TFT, live 15/09/2026).
// Nguồn: Website/pbe-notes/Patch_TFT18.2b-live-micropatch.md — đối chiếu chéo
// Hotspawn.com + tftips.app/en/patches/18.2b, không có ảnh gốc Riot.
//
// Hỗ trợ --dry-run (log before/after, không ghi DB) — LUÔN chạy trước khi ghi
// thật, xem [[feedback_patch_update_mismatched_anchors_and_dryrun]].
//
// Quyết định của người dùng khi anchor không khớp trực tiếp (KHÔNG ghi vào
// note của PatchEntry vì note hiển thị công khai trên /patch):
// - Camille: patch chỉ công bố TỔNG sát thương mới (150/225/375), không công
//   bố lại hệ số AD/AP tách riêng trong calcs. DB lưu breakdown
//   "150/225/385×AD + 10/15/25×AP = 160/240/410". Theo quyết định người dùng:
//   giữ nguyên phần AP (10/15/25, Riot không nhắc tới), suy ra hệ số AD mới
//   bằng phép trừ số học từ tổng đã xác nhận: 140/210/350 (140+10=150,
//   210+15=225, 350+25=375).
// - Brambleback: DB mô hình hóa Armor Ignore là MỘT hằng số duy nhất "30%"
//   (không tách theo mốc sao), khác hẳn cách tftips mô tả 3 mốc riêng
//   (45/45/85 -> 45/45/90). Người dùng xác nhận trực tiếp giá trị 90% ở mốc
//   3 sao và chọn dùng con số đó cho hằng số duy nhất trong DB, chấp nhận
//   rằng field này không phân biệt theo sao.
// - Maokai: chuỗi hiển thị `mana` TOP-LEVEL ghi "30 / 90" (khớp "from" patch
//   note) trong khi `stats.mana`/`forms[0].mana` đã SẴN [40,100] (khớp "to")
//   — drift nội bộ có từ trước, không phải do bản vá này. Theo quyết định
//   người dùng: chỉ sửa chuỗi top-level "30 / 90" -> "30 / 100" để đồng bộ,
//   KHÔNG đụng `stats`/`forms` vì đã đúng sẵn.
//
// KHÔNG sync (patch-report-only), theo quyết định người dùng — xem
// Patch_TFT18.2b-live-micropatch.md để biết lý do đầy đủ:
// - LeBlanc: DB chỉ lưu "10%" phẳng, không có mảng 3 mốc sao cho tỉ lệ bản sao.
// - Ashe: breakdown DB (25/38/200×AD + 1 flat = 30/46/220) không khớp đơn vị
//   với patch note (5/8 AD ⇒ 9/14 AD) hay tftips — không suy ra được.
// - Expected Unexpectedness: augment hoàn toàn chưa tồn tại trong DB.
// - Nesting Dolls: chỉ "tạm thời vô hiệu hóa, có thể bật lại" — người dùng từ
//   chối đụng field `visible` vì chưa rõ đúng ngữ nghĩa pool-status.
// - Polymorph/Minor/Major Polymorph: điều kiện thời gian hoàn toàn mới, DB
//   không có field tương ứng.
// - Hệ thống (XP mỗi cấp): không có bảng DB nào lưu giá trị này.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

type ChampionStats = Record<string, unknown> & {
  health?: number[];
  attackDamage?: number[];
  armor?: number;
  magicResist?: number;
};
type ChampionCalc = Record<string, unknown> & { id: string; terms: string; total: string };
type ChampionForm = Record<string, unknown> & {
  label?: string;
  mana?: string;
  abilityHtmlVi: string;
  stats?: ChampionStats;
  calcs?: ChampionCalc[];
};
type TraitBounty = { mission: string; reward: string; difficulty: string };

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

type TextEdit = [string, string];

async function updateChampion(
  id: string,
  opts: {
    text?: TextEdit[];
    /** Chỉ áp cho ability (EN) — dùng khi câu EN/VI khác cấu trúc, không chỉ khác số. */
    textEn?: TextEdit[];
    /** Chỉ áp cho abilityVi + forms[].abilityHtmlVi. */
    textVi?: TextEdit[];
    mana?: [string, string];
    calcEdits?: { calcId: string; terms?: TextEdit; total?: TextEdit }[];
  },
) {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.id, id));
  if (!row) throw new Error(`Champion không tìm thấy: ${id}`);

  let ability = row.ability;
  let abilityVi = row.abilityVi;
  let mana = row.mana;
  let forms = row.forms ? (JSON.parse(JSON.stringify(row.forms)) as ChampionForm[]) : null;

  for (const [from, to] of opts.text ?? []) {
    ability = replaceExact(ability, from, to, `${id}/ability`);
    abilityVi = replaceExact(abilityVi, from, to, `${id}/abilityVi`);
  }
  for (const [from, to] of opts.textEn ?? []) ability = replaceExact(ability, from, to, `${id}/ability`);
  for (const [from, to] of opts.textVi ?? []) abilityVi = replaceExact(abilityVi, from, to, `${id}/abilityVi`);

  if (opts.mana) {
    const [from, to] = opts.mana;
    if (mana !== from) throw new Error(`[${id}/mana] hiện tại (${mana}) không khớp "from" (${from})`);
    mana = to;
  }

  if (forms) {
    forms = forms.map((f: ChampionForm) => {
      const next = { ...f };
      for (const [from, to] of [...(opts.text ?? []), ...(opts.textVi ?? [])]) {
        next.abilityHtmlVi = replaceExact(next.abilityHtmlVi, from, to, `${id}/forms[${f.label}]/abilityHtmlVi`);
      }
      if (next.calcs && (opts.calcEdits ?? []).length) {
        next.calcs = next.calcs.map((cc: ChampionCalc) => {
          const edit = (opts.calcEdits ?? []).find((e) => e.calcId === cc.id);
          if (!edit) return cc;
          const out = { ...cc };
          if (edit.terms) out.terms = replaceExact(out.terms, edit.terms[0], edit.terms[1], `${id}/calcs[${cc.id}]/terms`);
          if (edit.total) out.total = replaceExact(out.total, edit.total[0], edit.total[1], `${id}/calcs[${cc.id}]/total`);
          return out;
        });
      }
      return next;
    });
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] champion ${id}`);
    diffLine('ability', row.ability, ability);
    diffLine('abilityVi', row.abilityVi, abilityVi);
    diffLine('mana', row.mana, mana);
    const beforeForms = (row.forms as ChampionForm[] | null) ?? [];
    (forms ?? []).forEach((f: ChampionForm, i: number) => {
      const b = beforeForms[i] ?? {};
      diffLine(`forms[${i}:${f.label}].abilityHtmlVi`, b.abilityHtmlVi ?? '', f.abilityHtmlVi ?? '');
      if (JSON.stringify(b.calcs) !== JSON.stringify(f.calcs)) {
        console.log(`    forms[${i}:${f.label}].calcs: ${JSON.stringify(b.calcs)}\n      -> ${JSON.stringify(f.calcs)}`);
      }
    });
    return;
  }

  await db.update(set18Champions).set({ ability, abilityVi, mana, forms, updatedAt: new Date() }).where(eq(set18Champions.id, id));
  console.log(`✓ champion ${id}`);
}

/** Sửa mission/reward trong `bounties[]` (mảng object tiếng Việt) theo khớp
 *  chính xác `mission` hiện tại — khác `updateTraitDescription` vốn chỉ xử lý
 *  chuỗi phẳng `description`/`descriptionVi`. */
async function updateTraitBounty(
  name: string,
  edits: { matchMission: string; newMission?: string; newReward?: string }[],
) {
  const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, name));
  if (!row) throw new Error(`Trait không tìm thấy: ${name}`);
  const bounties = JSON.parse(JSON.stringify(row.bounties)) as TraitBounty[];

  const diffs: string[] = [];
  for (const edit of edits) {
    const b = bounties.find((x) => x.mission === edit.matchMission);
    if (!b) throw new Error(`[${name}/bounties] không tìm thấy mission: ${JSON.stringify(edit.matchMission)}`);
    if (edit.newMission) {
      diffs.push(`mission: ${JSON.stringify(b.mission)} -> ${JSON.stringify(edit.newMission)}`);
      b.mission = edit.newMission;
    }
    if (edit.newReward) {
      diffs.push(`reward (${edit.matchMission}): ${JSON.stringify(b.reward)} -> ${JSON.stringify(edit.newReward)}`);
      b.reward = edit.newReward;
    }
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] trait ${name} (bounties)`);
    diffs.forEach((d) => console.log(`    ${d}`));
    return;
  }
  await db.update(set18Traits).set({ bounties, updatedAt: new Date() }).where(eq(set18Traits.name, name));
  console.log(`✓ trait ${name} (bounties, ${edits.length} mục)`);
}

async function updateTraitDescription(name: string, edits: { description?: TextEdit[] }) {
  const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, name));
  if (!row) throw new Error(`Trait không tìm thấy: ${name}`);
  let description = row.description;
  for (const [from, to] of edits.description ?? []) description = replaceExact(description, from, to, `${name}/description`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] trait ${name} (description EN)`);
    diffLine('description', row.description, description);
    return;
  }
  await db.update(set18Traits).set({ description, updatedAt: new Date() }).where(eq(set18Traits.name, name));
  console.log(`✓ trait ${name} (description EN)`);
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN — không ghi DB ===\n' : '=== GHI DB THẬT ===\n');

  // ── Tướng ───────────────────────────────────────────────────────
  // Camille: tổng đã xác nhận 150/225/375. Hệ số AD suy ra 140/210/350 (giữ
  // nguyên phần AP 10/15/25), xem quyết định ở đầu file.
  await updateChampion('champion:tft18_camille', {
    text: [['160/240/410', '150/225/375']],
    calcEdits: [
      {
        calcId: 'camille:mac-inh:calc-1',
        terms: ['150/225/385', '140/210/350'],
      },
    ],
  });

  await updateChampion('champion:tft18_teemo', { text: [['60/90/135', '55/82/130']] });

  // Brambleback: DB chỉ có 1 hằng số Armor Ignore (không phân biệt sao) —
  // người dùng xác nhận đổi thẳng sang 90%. Dùng số trần "30%" (không kèm
  // "Armor"/"Giáp") vì abilityHtmlVi bọc span quanh riêng con số, cụm cả câu
  // sẽ không khớp HTML; "30%" là token duy nhất trong toàn bộ ability text.
  await updateChampion('champion:tft18_brambleback', {
    textEn: [['ignore 30% Armor', 'ignore 90% Armor']],
    textVi: [['30%', '90%']],
    calcEdits: [{ calcId: 'brambleback:mac-inh:calc-1', total: ['30%', '90%'] }],
  });

  // Maokai: chỉ sửa chuỗi hiển thị mana top-level bị lệch có sẵn từ trước —
  // stats/forms đã đúng 100 rồi, không đụng.
  await updateChampion('champion:tft18_maokai', { mana: ['30 / 90', '30 / 100'] });

  // ── Tộc Hệ ──────────────────────────────────────────────────────
  // Bounty Seeker (Draven): 5 mục đổi số, cả bản VI (bounties[]) lẫn EN
  // (description phẳng).
  await updateTraitBounty('Bounty Seeker', [
    { matchMission: 'Draven có được 6 mạng hạ gục.', newMission: 'Draven có được 8 mạng hạ gục.' },
    { matchMission: 'Draven tung chiêu 5 lần.', newMission: 'Draven tung chiêu 6 lần.' },
    { matchMission: 'Draven tung đòn đánh 50 lần.', newMission: 'Draven tung đòn đánh 60 lần.' },
    { matchMission: 'Draven gây 8000 sát thương.', newMission: 'Draven gây 10000 sát thương.' },
    { matchMission: 'Draven tung chiêu 8 lần.', newReward: '6 lượt đổi cửa hàng' },
  ]);
  await updateTraitDescription('Bounty Seeker', {
    description: [
      ['Draven attacks 50 times', 'Draven attacks 60 times'],
      ['Draven casts 5 times', 'Draven casts 6 times'],
      ['Reward: 10 shop rerolls', 'Reward: 6 shop rerolls'],
      ['Draven deals 8000 damage', 'Draven deals 10000 damage'],
      ['Draven gets 6 kills', 'Draven gets 8 kills'],
    ],
  });

  console.log(DRY_RUN ? '\n=== DRY RUN xong — chưa ghi gì ===' : '\n=== Đã ghi DB xong ===');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
