// Giai đoạn 2 nối dài: 2 chỗ bị rút gọn về 1 số thay vì mảng 3 sao, phát hiện
// khi đối chiếu tftips.app/vi lúc vá dấu "?" (không phải dấu "?" nên không
// nằm trong đợt trước, người dùng xác nhận vá luôn hôm nay).
//
// Hỗ trợ --dry-run — LUÔN chạy trước khi ghi thật.
//
// Nguồn: tftips.app/vi (đã verify công thức hiển thị 3 sao khớp mẫu khác
// trong DB, xem các đợt trước cùng ngày).
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  return text.split(oldStr).join(newStr);
}

function diffLine(label: string, from: unknown, to: unknown) {
  const a = JSON.stringify(from);
  const b = JSON.stringify(to);
  if (a === b) return;
  console.log(`    ${label}: ${a} -> ${b}`);
}

async function updateChampion(id: string, mutate: (r: { ability: string; abilityVi: string; forms: any[] }) => { ability: string; abilityVi: string; forms: any[] }) {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.id, id));
  if (!row) throw new Error(`Champion không tìm thấy: ${id}`);
  const before = { ability: row.ability, abilityVi: row.abilityVi, forms: (row.forms as any[]) ?? [] };
  const result = mutate(before);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] champion ${id}`);
    diffLine('ability', before.ability, result.ability);
    diffLine('abilityVi', before.abilityVi, result.abilityVi);
    result.forms.forEach((f, i) => diffLine(`forms[${i}].abilityHtmlVi`, before.forms[i]?.abilityHtmlVi, f.abilityHtmlVi));
    return;
  }

  await db.update(set18Champions).set({ ability: result.ability, abilityVi: result.abilityVi, forms: result.forms, updatedAt: new Date() }).where(eq(set18Champions.id, id));
  console.log(`✓ champion ${id}`);
}

async function main() {
  // ═══════════════ Amumu: stun gốc rút gọn về 1 số (thật ra là 1/1/6) ═══════════════

  await updateChampion('champion:tft18_amumu', (r) => ({
    ability: replaceExact(r.ability, 'Stun them for 1 seconds', 'Stun them for 1/1/6 seconds', 'Amumu/ability'),
    abilityVi: replaceExact(r.abilityVi, 'Làm Choáng chúng trong 1 giây, tăng lên', 'Làm Choáng chúng trong 1/1/6 giây, tăng lên', 'Amumu/abilityVi'),
    forms: r.forms.map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(
        f.abilityHtmlVi,
        'Làm Choáng chúng trong <span class="s18-value">1</span> giây,',
        'Làm Choáng chúng trong <span class="s18-value">1/1/6</span> giây,',
        'Amumu/forms/abilityHtmlVi',
      ),
    })),
  }));

  // ═══════════════ Ivern: Khuếch Đại Sát Thương rút gọn về 1 số (thật ra là 10%/15%/100%) ═══════════════

  await updateChampion('champion:tft18_ivern', (r) => ({
    ability: replaceExact(r.ability, '10% Damage Amp for 6 seconds', '10%/15%/100% Damage Amp for 6 seconds', 'Ivern/ability'),
    abilityVi: replaceExact(r.abilityVi, '10% Khuếch Đại Sát Thương trong 6 giây', '10%/15%/100% Khuếch Đại Sát Thương trong 6 giây', 'Ivern/abilityVi'),
    forms: r.forms.map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(
        f.abilityHtmlVi,
        '<span class="s18-value s18-style-colorStat">10%</span> Khuếch Đại Sát Thương',
        '<span class="s18-value s18-style-colorStat">10%/15%/100%</span> Khuếch Đại Sát Thương',
        'Ivern/forms/abilityHtmlVi',
      ),
    })),
  }));
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
