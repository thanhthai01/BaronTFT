// Thêm statBadges cho 21 dòng Emblem (20 tên khác nhau, Flora Fatalis có 2
// id) — dữ liệu soát tay từ tooltip thật trên datatft.com/database#item
// (DOM scrape qua Playwright, không suy đoán từ statLine): mỗi badge lấy
// trực tiếp icon+giá trị hiển thị (armor.png/mr.png/hp.png/ad.png/ap.png/
// as.png/crit.png/critmult.png/manaregen.png) rồi map sang key stat đã dùng
// sẵn trong DB.
//
// Ghi chú riêng 2 trường hợp:
// - Executioner Emblem: critmult.png (Crit Damage) không có key riêng trong
//   DB hiện tại — map tạm sang "damageamp" (key generic đã dùng cho các hiệu
//   ứng %damage amp khác như Giant Slayer/Rapid Firecannon), người dùng đã
//   xác nhận dùng tạm cho tới khi có key critdmg riêng.
// - Flora Fatalis Emblem có 2 id: da_18_emblemflorafatalis (bản thường,
//   HP+250 + ManaRegen+2) và da_18_emblemflorafatalisaugment (bản chỉ nhận
//   từ augment "Consuming Flora", mô tả nói rõ "nhận 0 Hồi Năng Lượng" — xác
//   nhận qua patch entry pbe0804-bugfix-florafatalisemblem + augment DB text
//   khớp nhau) — bản augment CHỈ ghi health:250, không ghi manaregen vì giá
//   trị 0 không được ghi badge theo quy ước hiện tại.
import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Items } from '../../src/db/schema';

const updates: { id: string; statBadges: { stat: string; value: string }[] }[] = [
  { id: 'item:da_18_emblemblossom', statBadges: [{ stat: 'health', value: '250' }, { stat: 'ad', value: '10%' }, { stat: 'ap', value: '10%' }] },
  { id: 'item:da_18_emblemlunar', statBadges: [{ stat: 'as', value: '20%' }, { stat: 'manaregen', value: '3' }] },
  { id: 'item:da_18_emblemsprykin', statBadges: [{ stat: 'as', value: '10%' }, { stat: 'armor', value: '20' }, { stat: 'mr', value: '20' }] },
  { id: 'item:da_18_emblemfae', statBadges: [{ stat: 'health', value: '250' }, { stat: 'ad', value: '15%' }, { stat: 'ap', value: '15%' }] },
  { id: 'item:da_18_embleminferno', statBadges: [{ stat: 'as', value: '40%' }] },
  { id: 'item:da_18_emblemelderwood', statBadges: [{ stat: 'as', value: '25%' }, { stat: 'armor', value: '35' }, { stat: 'mr', value: '35' }] },
  { id: 'item:da_18_emblemblackthorn', statBadges: [{ stat: 'health', value: '250' }, { stat: 'ad', value: '15%' }, { stat: 'ap', value: '15%' }] },
  { id: 'item:da_18_emblemprimal', statBadges: [{ stat: 'as', value: '15%' }, { stat: 'health', value: '250' }, { stat: 'critchance', value: '20%' }] },
  { id: 'item:da_18_emblemexecutioner', statBadges: [{ stat: 'critchance', value: '35%' }, { stat: 'damageamp', value: '15%' }] },
  { id: 'item:da_18_emblembrawler', statBadges: [{ stat: 'health', value: '250' }] },
  { id: 'item:da_18_embleminvoker', statBadges: [{ stat: 'manaregen', value: '3' }] },
  { id: 'item:da_18_emblemrapidfire', statBadges: [{ stat: 'as', value: '20%' }] },
  { id: 'item:da_18_emblemspellweaver', statBadges: [{ stat: 'ap', value: '25%' }] },
  { id: 'item:da_18_emblemvanguard', statBadges: [{ stat: 'armor', value: '30' }, { stat: 'mr', value: '30' }] },
  { id: 'item:da_18_emblemhunter', statBadges: [{ stat: 'ad', value: '30%' }] },
  { id: 'item:da_18_emblemslayer', statBadges: [{ stat: 'ad', value: '15%' }, { stat: 'ap', value: '15%' }, { stat: 'armor', value: '20' }, { stat: 'mr', value: '20' }] },
  { id: 'item:da_18_emblemcoven', statBadges: [{ stat: 'health', value: '150' }] },
  { id: 'item:da_18_emblemflorafatalis', statBadges: [{ stat: 'health', value: '250' }, { stat: 'manaregen', value: '2' }] },
  { id: 'item:da_18_emblemflorafatalisaugment', statBadges: [{ stat: 'health', value: '250' }] },
  { id: 'item:da_18_emblemdefender', statBadges: [{ stat: 'armor', value: '30' }, { stat: 'mr', value: '30' }] },
  { id: 'item:da_18_emblemjuggernaut', statBadges: [{ stat: 'health', value: '400' }] },
];

async function main() {
  let updated = 0;
  let skipped = 0;
  for (const u of updates) {
    const result = await db
      .update(set18Items)
      .set({ statBadges: u.statBadges })
      .where(and(eq(set18Items.id, u.id), isNull(set18Items.statBadges)))
      .returning({ id: set18Items.id });
    if (result.length) {
      updated++;
      console.log(`✓ ${u.id}`);
    } else {
      skipped++;
      console.log(`- ${u.id} bỏ qua (không tìm thấy hoặc đã có statBadges)`);
    }
  }
  console.log(`\nTổng: ${updated} cập nhật, ${skipped} bỏ qua.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
