// DONE — KHÔNG CHẠY LẠI. Migration một lần, giữ làm hồ sơ lịch sử.
//
// 3 patch_entries augment không hiện icon/tên dịch dù set18_augments
// ĐÃ có record đầy đủ (đã dịch sẵn). Lý do: PatchBoard chỉ tra theo tên khi
// entry không có entityId, mà `name` giữa 2 bảng lệch case/chính tả:
//   patch_entries.name          set18_augments.name (đã đúng, có sẵn từ trước)
//   "Call to Chaos"          vs "Call To Chaos"
//   "Patience is a Virtue"   vs "Patience Is A Virtue"
//   "Slightly Magical Roll"  vs "Slightly Magic Roll"
// Sửa gốc: gắn entityId cho đúng 3 dòng patch_entries này, giống cách Jungle
// Pathing/Sun and Moon/Nesting Dolls đã làm — tra theo entityId luôn ưu tiên
// hơn tra theo tên nên không còn phụ thuộc chuỗi khớp tuyệt đối.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { patchEntries } from '../../src/db/schema';

async function link(entryId: string, entityId: string) {
  const [row] = await db.select().from(patchEntries).where(eq(patchEntries.id, entryId));
  if (!row) throw new Error(`patch_entries không tìm thấy: ${entryId}`);
  await db.update(patchEntries).set({ entityId }).where(eq(patchEntries.id, entryId));
  console.log(`✓ ${entryId} -> ${entityId}`);
}

async function main() {
  await link('pbe0805-aug-calltochaos', 'augment:da_calltochaos');
  await link('pbe0805-aug-patienceisavirtue', 'augment:da_patienceisavirtue');
  await link('pbe0804-aug-slightlymagicalroll', 'augment:da_slightlymagicroll');
  console.log('\n✓ Xong — chạy `pnpm db:pull` để đồng bộ lại patch-notes.generated.ts.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
