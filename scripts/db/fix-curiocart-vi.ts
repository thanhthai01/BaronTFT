// Fix một lần: wisp "Curio Cart" (id wisp:curio-cart) đang thiếu bản dịch —
// nameVi và descriptionVi bị copy y nguyên tiếng Anh thay vì dịch. Phát hiện
// khi rà lại trang /patch (07/08/2026). Không liên quan tới bản vá 18.1aa,
// đây là lỗ hổng dữ liệu có sẵn từ trước.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Wisps } from '../../src/db/schema';

async function main() {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, 'Curio Cart'));
  if (!row) throw new Error('Wisp không tìm thấy: Curio Cart');
  if (row.nameVi !== 'Curio Cart') throw new Error(`Curio Cart nameVi hiện tại ("${row.nameVi}") không phải bản chưa dịch — kiểm tra lại trước khi ghi đè`);
  if (row.descriptionVi !== 'Open an item store. Items cost 0 to 14 gold.') {
    throw new Error(`Curio Cart descriptionVi hiện tại ("${row.descriptionVi}") không khớp bản gốc chưa dịch mong đợi`);
  }

  await db
    .update(set18Wisps)
    .set({
      nameVi: 'Quầy Đồ Lạ',
      descriptionVi: 'Mở một cửa hàng trang bị. Trang bị có giá từ 0 đến 14 vàng.',
      updatedAt: new Date(),
    })
    .where(eq(set18Wisps.name, 'Curio Cart'));

  console.log('✓ wisp Curio Cart (nameVi, descriptionVi)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
