// DONE — KHÔNG CHẠY LẠI. Migration một lần, giữ làm hồ sơ lịch sử.
//
// Dịch nốt 2 augment PBE đã có record trong set18_augments nhưng
// nameVi/descriptionVi vẫn để nguyên tiếng Anh (chưa ai dịch).
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Augments } from '../../src/db/schema';

async function translateExisting(name: string, nameVi: string, descriptionVi: string) {
  const [row] = await db.select().from(set18Augments).where(eq(set18Augments.name, name));
  if (!row) throw new Error(`Augment không tìm thấy: ${name}`);
  await db.update(set18Augments).set({ nameVi, descriptionVi, updatedAt: new Date() }).where(eq(set18Augments.name, name));
  console.log(`✓ dịch augment ${name}`);
}

/** "Sun and Moon" có 2 record trùng `name` (bản 3-2 và bản "+" 4-2), phân biệt
 * nhau bằng `icon` chứ không phải `name` — update theo tên sẽ ghi đè cả 2 bằng
 * cùng 1 bản dịch, sai hẳn nội dung của bản kia. Phải khớp theo icon. */
async function translateByIcon(icon: string, nameVi: string, descriptionVi: string) {
  const [row] = await db.select().from(set18Augments).where(eq(set18Augments.icon, icon));
  if (!row) throw new Error(`Augment không tìm thấy theo icon: ${icon}`);
  await db.update(set18Augments).set({ nameVi, descriptionVi, updatedAt: new Date() }).where(eq(set18Augments.icon, icon));
  console.log(`✓ dịch augment (icon ${icon})`);
}

async function main() {
  await translateExisting(
    'Jungle Pathing',
    'Đường Mòn Rừng',
    'Nhận 1 Pebbles, 1 Cinderling, 1 Scuttle Crab và 1 Murkwolf. Mỗi khi lên cấp, nhận thêm 1 Quái Rừng mới và 2 vàng.',
  );

  // Bản 3-2 (thường): tặng Leona/Kayle/Diana chưa lên sao.
  await translateByIcon(
    '/set18/assets/auguments/da_18_lunartraitaugment.png',
    'Mặt Trời và Mặt Trăng',
    'Tướng hệ Mặt Trăng của bạn nhận 100 Máu và 8% Khuếch Đại Sát Thương cho mỗi tướng hệ Mặt Trời khác nhau đang ra sân. Nhận 1 Leona, 1 Kayle và 1 Diana.',
  );
  // Bản "+" 4-2 (patch note đang nhắc tới): tặng Leona 2 sao, Kayle, Aphelios.
  await translateByIcon(
    '/set18/assets/auguments/da_18_lunartraitaugmentplus.png',
    'Mặt Trời và Mặt Trăng+',
    'Tướng hệ Mặt Trăng của bạn nhận 100 Máu và 8% Khuếch Đại Sát Thương cho mỗi tướng hệ Mặt Trời khác nhau đang ra sân. Nhận 1 Leona 2 sao, 1 Kayle và 1 Aphelios.',
  );

  console.log('\n✓ Xong.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
