// DONE — KHÔNG CHẠY LẠI. Migration một lần, giữ làm hồ sơ lịch sử.
//
// Thêm augment "Small Furry Friend" — hoàn toàn thiếu record trong
// set18_augments (không có ở MetaTFT/tactics.tools/lolchess.gg, chỉ tồn tại
// ở PBE). Dữ liệu (độ hiếm Vàng, mốc 2-1/3-2/4-2, tộc Sprykin, mô tả) do
// người dùng tự tìm và cung cấp trực tiếp qua ảnh chụp. Icon tải từ
// cdn.metatft.com/file/metatft/augments/t_augmenticon_sprykinaugment.png
// (do người dùng cung cấp link) rồi tô màu lại theo đúng thuật toán Gold +
// glow đã dùng cho 261 icon augment còn lại (xem
// Set18/recolor_augment_icons.py và memory project_metatft_tier_color_system) —
// icon CDN gốc là silhouette hồng/xanh chưa tô màu, không tô lại sẽ lệch hẳn
// phong cách các icon khác trên site.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Augments } from '../../src/db/schema';
import { patchEntries } from '../../src/db/schema';

async function main() {
  const id = 'augment:da_smallfurryfriend';
  const [existing] = await db.select().from(set18Augments).where(eq(set18Augments.id, id));
  if (!existing) {
    await db.insert(set18Augments).values({
      id,
      name: 'Small Furry Friend',
      nameVi: 'Bạn Lông Nhỏ',
      rarity: 'Gold',
      rarityColor: '#a18e21',
      category: 'Trait',
      categoryVi: 'Tộc/Hệ',
      description:
        'While Sprykin is active, gain a second BFF summon that is 50% as powerful. Gain a Teemo, a Veigar, and a Kobuko.',
      descriptionVi:
        'Khi Tinh Nghịch (Sprykin) đang kích hoạt, nhận thêm 1 lượt triệu hồi BFF thứ hai với sức mạnh bằng 50%. Nhận 1 Teemo, 1 Veigar và 1 Kobuko.',
      icon: '/set18/assets/auguments/da_smallfurryfriend.png',
      associatedTraits: [],
      rounds: ['2-1', '3-2', '4-2'],
      roundVariants: ['Early', 'Mid', 'Late'],
    });
    console.log('✓ thêm augment Small Furry Friend');
  } else {
    console.log('- augment:da_smallfurryfriend đã tồn tại, bỏ qua insert.');
  }

  // Gắn entityId cho patch_entries đang tham chiếu (tránh phụ thuộc khớp tên
  // tuyệt đối, giống 3 augment PBE khác đã sửa trước đó).
  const [entry] = await db.select().from(patchEntries).where(eq(patchEntries.id, 'pbe0806-aug-smallfurryfriend'));
  if (entry) {
    await db.update(patchEntries).set({ entityId: id }).where(eq(patchEntries.id, 'pbe0806-aug-smallfurryfriend'));
    console.log('✓ gắn entityId cho pbe0806-aug-smallfurryfriend');
  } else {
    console.log('- patch_entries pbe0806-aug-smallfurryfriend không tìm thấy, bỏ qua.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
