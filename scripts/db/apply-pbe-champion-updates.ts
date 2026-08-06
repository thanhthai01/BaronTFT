// DONE — KHÔNG CHẠY LẠI. Migration một lần cho bản PBE 06/08/2026, giữ làm hồ
// sơ lịch sử. Chạy lại sẽ throw ngay vì các chuỗi "cũ" tìm kiếm đã không còn
// tồn tại (đã thay bằng số mới). Nếu cần vá thêm số liệu tướng cho bản vá
// khác, viết script mới theo đúng khuôn (replaceExact + throw khi không khớp).
//
// Cập nhật DB Set18 (champions/traits/augments) theo số liệu THẬT của PBE
// 06/08/2026 — không phải patch-notes (đã làm ở apply-patch-draft.ts), mà là
// chính bảng dữ liệu tướng/tộc/nâng cấp hiển thị trên /mua-18. Người dùng xác
// nhận số liệu ảnh PBE là chính xác/mới nhất; nhiều field hiện tại trong DB đã
// cũ hơn cả "from" trong ảnh (codex stale), nên ở đây thay THẲNG bằng field
// hiện có bằng giá trị "to" xác nhận, không dựa vào so khớp "from".
//
// Cách làm an toàn: mỗi phép thay là str.replace(oldExact, newExact) trên
// đúng field, với oldExact lấy verbatim từ dữ liệu hiện tại (đã dump và soát
// tay), không suy đoán. Nếu oldExact không khớp, script throw ngay — không âm
// thầm bỏ qua.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits, set18Augments } from '../../src/db/schema';

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

async function updateChampion(name: string, edits: (ability: string) => string, editsVi: (abilityVi: string) => string, editsHtml?: (html: string) => string, statsPatch?: Record<string, unknown>) {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, name));
  if (!row) throw new Error(`Champion không tìm thấy: ${name}`);
  const newAbility = edits(row.ability);
  const newAbilityVi = editsVi(row.abilityVi);
  const newForms = row.forms
    ? (row.forms as any[]).map((f) => (editsHtml ? { ...f, abilityHtmlVi: editsHtml(f.abilityHtmlVi) } : f))
    : row.forms;
  const newStats = statsPatch ? { ...(row.stats as object), ...statsPatch } : row.stats;
  await db
    .update(set18Champions)
    .set({ ability: newAbility, abilityVi: newAbilityVi, forms: newForms, stats: newStats, updatedAt: new Date() })
    .where(eq(set18Champions.name, name));
  console.log(`✓ champion ${name}`);
}

async function main() {
  // ── Camille ──────────────────────────────────────────────────────
  await updateChampion(
    'Camille',
    (a) => replaceExact(a, '170/255/385 physical damage and gain 60 Shield', '160/240/390 physical damage and gain 60/85/135 Shield', 'Camille/ability'),
    (a) => replaceExact(a, '170/255/385 sát thương vật lý và nhận 60 Lá Chắn', '160/240/390 sát thương vật lý và nhận 60/85/135 Lá Chắn', 'Camille/abilityVi'),
    (h) => replaceExact(h, '170/255/385</span> sát thương vật lý và nhận <span class="s18-value s18-style-colorStat">60</span> Lá Chắn', '160/240/390</span> sát thương vật lý và nhận <span class="s18-value s18-style-colorStat">60/85/135</span> Lá Chắn', 'Camille/html'),
  );

  // ── Kobuko ───────────────────────────────────────────────────────
  await updateChampion(
    'Kobuko',
    (a) => replaceExact(a, 'Restore 299/349/349 Health', 'Restore 265/315/430 Health', 'Kobuko/ability'),
    (a) => replaceExact(a, 'Hồi lại 299/349/349 Máu', 'Hồi lại 265/315/430 Máu', 'Kobuko/abilityVi'),
    (h) => replaceExact(h, '299/349/349</span> Máu', '265/315/430</span> Máu', 'Kobuko/html'),
  );

  // ── Ornn (Forge Power threshold — hiện là placeholder "?") ─────────
  await updateChampion(
    'Ornn',
    (a) => replaceExact(a, '(Forge Power: ? / ?)', '(Forge Power: 90000/220000/400000)', 'Ornn/ability'),
    (a) => replaceExact(a, '(Sức Mạnh Lò Rèn: ? / )', '(Sức Mạnh Lò Rèn: 90000/220000/400000)', 'Ornn/abilityVi'),
    (h) => replaceExact(
      h,
      '<span class="s18-style-Rules">(Sức Mạnh Lò Rèn: </span><span class="s18-value s18-style-Rules">?</span><span class="s18-style-Rules"> / </span><span class="s18-style-Rules">)</span>',
      '<span class="s18-style-Rules">(Sức Mạnh Lò Rèn: </span><span class="s18-value s18-style-Rules">90000/220000/400000</span><span class="s18-style-Rules">)</span>',
      'Ornn/html',
    ),
  );

  // ── Pebbles ──────────────────────────────────────────────────────
  await updateChampion(
    'Pebbles',
    (a) => replaceExact(a, 'deal 160/240/360 magic damage to them', 'deal 150/225/340 magic damage to them', 'Pebbles/ability'),
    (a) => replaceExact(a, 'gây 160/240/360 sát thương phép', 'gây 150/225/340 sát thương phép', 'Pebbles/abilityVi'),
    (h) => replaceExact(h, '160/240/360</span> sát thương phép và giảm', '150/225/340</span> sát thương phép và giảm', 'Pebbles/html'),
  );

  // ── Rek'Sai ──────────────────────────────────────────────────────
  await updateChampion(
    "Rek'Sai",
    (a) => replaceExact(a, 'Restore 16/19/22 Health each second', 'Restore 10/14/20 Health each second', "Rek'Sai/ability"),
    (a) => replaceExact(a, 'Hồi 16/19/22 Máu mỗi giây', 'Hồi 10/14/20 Máu mỗi giây', "Rek'Sai/abilityVi"),
    (h) => replaceExact(h, '16/19/22</span> Máu mỗi giây', '10/14/20</span> Máu mỗi giây', "Rek'Sai/html"),
  );

  // ── Gromp (2 forms: AP mặc định, AD) ───────────────────────────────
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'Gromp'));
    if (!row) throw new Error('Gromp không tìm thấy');
    let ability = row.ability;
    let abilityVi = row.abilityVi;
    ability = replaceExact(ability, 'dealing 250/375/565 magic damage', 'dealing 225/340/535 magic damage', 'Gromp/ability(AP primary)');
    ability = replaceExact(ability, 'take 100/240/360 magic damage', 'take 145/220/345 magic damage', 'Gromp/ability(AP aoe)');
    abilityVi = replaceExact(abilityVi, 'gây 250/375/565 sát thương phép', 'gây 225/340/535 sát thương phép', 'Gromp/abilityVi(AP primary)');
    abilityVi = replaceExact(abilityVi, 'chịu 100/240/360 sát thương phép', 'chịu 145/220/345 sát thương phép', 'Gromp/abilityVi(AP aoe)');
    const forms = (row.forms as any[]).map((f) => {
      let html = f.abilityHtmlVi as string;
      if (f.label === 'AP') {
        html = replaceExact(html, '250/375/565</span> sát thương phép', '225/340/535</span> sát thương phép', 'Gromp/AP-form html primary');
        html = replaceExact(html, '100/240/360</span> sát thương phép', '145/220/345</span> sát thương phép', 'Gromp/AP-form html aoe');
      } else if (f.label === 'AD') {
        html = replaceExact(html, '370/555/835</span> sát thương vật lý', '305/460/725</span> sát thương vật lý', 'Gromp/AD-form html primary');
        html = replaceExact(html, '110/165/250</span> sát thương vật lý', '100/150/240</span> sát thương vật lý', 'Gromp/AD-form html aoe');
      }
      return { ...f, abilityHtmlVi: html };
    });
    await db.update(set18Champions).set({ ability, abilityVi, forms, updatedAt: new Date() }).where(eq(set18Champions.name, 'Gromp'));
    console.log('✓ champion Gromp (2 forms)');
  }

  // ── Sejuani ──────────────────────────────────────────────────────
  await updateChampion(
    'Sejuani',
    (a) => replaceExact(a, 'dealing 40/60/90 magic damage and strike in a line, dealing 70/105/160', 'dealing 90/135/205 magic damage and strike in a line, dealing 120/180/270', 'Sejuani/ability'),
    (a) => replaceExact(a, 'gây 40/60/90 sát thương phép và tấn công theo một đường thẳng, gây 70/105/160', 'gây 90/135/205 sát thương phép và tấn công theo một đường thẳng, gây 120/180/270', 'Sejuani/abilityVi'),
    (h) => {
      let s = replaceExact(h, '40/60/90</span> sát thương phép', '90/135/205</span> sát thương phép', 'Sejuani/html cone');
      s = replaceExact(s, '70/105/160</span> sát thương phép', '120/180/270</span> sát thương phép', 'Sejuani/html line');
      return s;
    },
  );

  // ── Warwick ──────────────────────────────────────────────────────
  await updateChampion(
    'Warwick',
    (a) => replaceExact(a, 'dealing 180/270/405 physical damage', 'dealing 200/300/450 physical damage', 'Warwick/ability'),
    (a) => replaceExact(a, 'gây 180/270/405 sát thương vật lý', 'gây 200/300/450 sát thương vật lý', 'Warwick/abilityVi'),
    (h) => replaceExact(h, '180/270/405</span> sát thương vật lý', '200/300/450</span> sát thương vật lý', 'Warwick/html'),
  );

  // ── Azir ─────────────────────────────────────────────────────────
  await updateChampion(
    'Azir',
    (a) => replaceExact(a, 'deal 48/72/115 magic damage per attack', 'deal 50/75/120 magic damage per attack', 'Azir/ability'),
    (a) => replaceExact(a, 'gây 48/72/115 sát thương phép mỗi đòn đánh', 'gây 50/75/120 sát thương phép mỗi đòn đánh', 'Azir/abilityVi'),
    (h) => replaceExact(h, '48/72/115</span> sát thương phép mỗi đòn đánh', '50/75/120</span> sát thương phép mỗi đòn đánh', 'Azir/html'),
  );

  // ── Diana (rework: 6 luồng đạn, khiên hết suy giảm) ─────────────────
  await updateChampion(
    'Diana',
    (a) =>
      replaceExact(
        a,
        'Gain 150/225/300 shield for 2 seconds and send out a moonlight orb to the closest 3 enemies, dealing 125/190/300 magic damage.',
        'Gain 150/225/300 shield for 2 seconds (no longer decays over time) and fire 6 moonlight orbs split between enemies within 2 hexes, dealing 65/100/155/270 magic damage each.',
        'Diana/ability',
      ),
    (a) =>
      replaceExact(
        a,
        'Nhận 150/225/300 lá chắn trong 2 giây và phóng ra một cầu ánh trăng về phía 3 kẻ địch gần nhất, gây 125/190/300 sát thương phép.',
        'Nhận 150/225/300 lá chắn trong 2 giây (không còn suy giảm theo thời gian) và bắn 6 luồng cầu ánh trăng, chia đều cho các kẻ địch trong phạm vi 2 ô, mỗi luồng gây 65/100/155/270 sát thương phép.',
        'Diana/abilityVi',
      ),
    (h) =>
      replaceExact(
        h,
        'Nhận <span class="s18-value s18-style-colorStat">150/225/300</span> lá chắn trong <span class="s18-value">2</span> giây và phóng ra một cầu ánh trăng về phía <span class="s18-value">3</span> kẻ địch gần nhất, gây <span class="s18-value s18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>125/190/300</span> sát thương phép. ',
        'Nhận <span class="s18-value s18-style-colorStat">150/225/300</span> lá chắn trong <span class="s18-value">2</span> giây (không còn suy giảm theo thời gian) và bắn <span class="s18-value">6</span> luồng cầu ánh trăng, chia đều cho các kẻ địch trong phạm vi <span class="s18-value">2</span> ô, mỗi luồng gây <span class="s18-value s18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>65/100/155/270</span> sát thương phép.',
        'Diana/html',
      ),
  );

  // ── Fiddlesticks ─────────────────────────────────────────────────
  await updateChampion(
    'Fiddlesticks',
    (a) => replaceExact(a, 'healing for 425/500/850 Health', 'healing for 395/470/790 Health', 'Fiddlesticks/ability'),
    (a) => replaceExact(a, 'hồi phục 425/500/850 Máu', 'hồi phục 395/470/790 Máu', 'Fiddlesticks/abilityVi'),
    (h) => replaceExact(h, '425/500/850</span> Máu', '395/470/790</span> Máu', 'Fiddlesticks/html'),
  );

  // ── Hecarim ──────────────────────────────────────────────────────
  await updateChampion(
    'Hecarim',
    (a) => replaceExact(a, 'restore 375/475/700 Health', 'restore 400/500/720 Health', 'Hecarim/ability'),
    (a) => replaceExact(a, 'hồi phục 375/475/700 Máu', 'hồi phục 400/500/720 Máu', 'Hecarim/abilityVi'),
    (h) => replaceExact(h, '375/475/700</span> Máu', '400/500/720</span> Máu', 'Hecarim/html'),
  );

  // ── Kha'Zix ──────────────────────────────────────────────────────
  await updateChampion(
    "Kha'Zix",
    (a) =>
      replaceExact(
        a,
        'dealing 190/285/450 magic damage. If they have no adjacent allies, deal 230/345/555 magic damage instead',
        'dealing 240/360/540 magic damage. If they have no adjacent allies, deal 290/435/650 magic damage instead',
        "Kha'Zix/ability",
      ),
    (a) =>
      replaceExact(
        a,
        'gây 190/285/450 sát thương phép. Nếu mục tiêu không có đồng minh liền kề, thay vào đó gây 230/345/555 sát thương phép',
        'gây 240/360/540 sát thương phép. Nếu mục tiêu không có đồng minh liền kề, thay vào đó gây 290/435/650 sát thương phép',
        "Kha'Zix/abilityVi",
      ),
    (h) => {
      let s = replaceExact(h, '190/285/450</span> sát thương phép', '240/360/540</span> sát thương phép', "Kha'Zix/html base");
      s = replaceExact(s, '230/345/555</span> sát thương phép', '290/435/650</span> sát thương phép', "Kha'Zix/html isolated");
      return s;
    },
  );

  // ── Krug ─────────────────────────────────────────────────────────
  // Chỉ "Spell Bonus HP" (175/225/350) khớp trực tiếp với ability text.
  // 3 thay đổi còn lại (Alpha Mark Shield, Kruglette HP Ratio, Kruglette Flat
  // Bonus) không xuất hiện dạng số trực tiếp nào trong ability/abilityVi —
  // 224/264/334 Health của Kruglette là giá trị ĐÃ TÍNH (ratio × máu cha +
  // flat), không phải field Kruglette Flat Bonus thô — không đủ căn cứ để
  // suy ngược, nên KHÔNG đụng vào, để nguyên chờ nguồn xác nhận khác.
  await updateChampion(
    'Krug',
    (a) => replaceExact(a, 'Gain 175/225/350 max Health', 'Gain 175/225/325 max Health', 'Krug/ability'),
    (a) => replaceExact(a, 'Nhận được 175/225/350 Hồi máu tối đa', 'Nhận được 175/225/325 Hồi máu tối đa', 'Krug/abilityVi'),
    (h) => replaceExact(h, '175/225/350</span> Máu tối đa', '175/225/325</span> Máu tối đa', 'Krug/html'),
  );

  // ── Master Yi (dạng AP — On-Hit Magic Damage) ───────────────────────
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'Master Yi'));
    if (!row) throw new Error('Master Yi không tìm thấy');
    const forms = (row.forms as any[]).map((f) => {
      if (f.label !== 'AP') return f;
      const html = replaceExact(f.abilityHtmlVi as string, '155/235/375</span> sát thương phép cộng thêm', '145/220/350</span> sát thương phép cộng thêm', 'MasterYi/AP-form html');
      return { ...f, abilityHtmlVi: html };
    });
    await db.update(set18Champions).set({ forms, updatedAt: new Date() }).where(eq(set18Champions.name, 'Master Yi'));
    console.log('✓ champion Master Yi (form AP)');
  }

  // ── Rengar ───────────────────────────────────────────────────────
  // abilityVi thiếu hẳn vế "increased to up to X" (chỉ có trong ability tiếng
  // Anh) — lỗ hổng dịch có sẵn từ trước, không phải lỗi bản vá này, không tự
  // thêm câu mới vào tiếng Việt.
  await updateChampion(
    'Rengar',
    (a) => replaceExact(a, 'dealing 295/445/710 physical damage. Then heal for 80, increased to up to 180', 'dealing 270/405/650 physical damage. Then heal for 70, increased to up to 150', 'Rengar/ability'),
    (a) => replaceExact(a, 'gây 295/445/710 sát thương vật lý. Sau đó hồi máu bằng 80 lượng Máu đã mất', 'gây 270/405/650 sát thương vật lý. Sau đó hồi máu bằng 70 lượng Máu đã mất', 'Rengar/abilityVi'),
    (h) => {
      let s = replaceExact(h, '295/445/710</span> sát thương vật lý', '270/405/650</span> sát thương vật lý', 'Rengar/html dmg');
      s = replaceExact(s, 'hồi máu bằng <span class="s18-value s18-style-colorHealth"><span class="s18-icon s18-icon-icon_ap"></span>80</span> lượng Máu', 'hồi máu bằng <span class="s18-value s18-style-colorHealth"><span class="s18-icon s18-icon-icon_ap"></span>70</span> lượng Máu', 'Rengar/html heal');
      return s;
    },
  );

  // ── Vi ───────────────────────────────────────────────────────────
  await updateChampion(
    'Vi',
    (a) => replaceExact(a, 'restoring 200/250/350 Health', 'restoring 225/300/400 Health', 'Vi/ability'),
    (a) => replaceExact(a, 'hồi lại 200/250/350 Máu', 'hồi lại 225/300/400 Máu', 'Vi/abilityVi'),
    (h) => replaceExact(h, '200/250/350</span> Máu', '225/300/400</span> Máu', 'Vi/html'),
  );

  // ── Amumu ────────────────────────────────────────────────────────
  await updateChampion(
    'Amumu',
    (a) => replaceExact(a, 'restore 31.68/31.8/33.6 Health', 'restore 29.04/29.15/30.8 Health', 'Amumu/ability'),
    (a) => replaceExact(a, 'hồi phục 31.68/31.8/33.6 Máu', 'hồi phục 29.04/29.15/30.8 Máu', 'Amumu/abilityVi'),
    (h) => replaceExact(h, '31.68/31.8/33.6</span> Máu', '29.04/29.15/30.8</span> Máu', 'Amumu/html'),
  );

  // ── Lillia ───────────────────────────────────────────────────────
  await updateChampion(
    'Lillia',
    (a) => replaceExact(a, 'Restore 250/325/600 Health', 'Restore 280/360/600 Health', 'Lillia/ability'),
    (a) => replaceExact(a, 'Hồi lại 250/325/600 Máu', 'Hồi lại 280/360/600 Máu', 'Lillia/abilityVi'),
    (h) => replaceExact(h, '250/325/600</span> Máu', '280/360/600</span> Máu', 'Lillia/html'),
  );

  // ── Nidalee (form AD: swipe/heal; form AP: empowered/3rd attack) ────
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'Nidalee'));
    if (!row) throw new Error('Nidalee không tìm thấy');
    const forms = (row.forms as any[]).map((f) => {
      let html = f.abilityHtmlVi as string;
      if (f.label === 'AD') {
        html = replaceExact(html, '190/285/2500</span> sát thương vật lý', '215/325/2500</span> sát thương vật lý', 'Nidalee/AD html swipe');
        html = replaceExact(html, '250/350/2000</span> Máu', '275/400/2000</span> Máu', 'Nidalee/AD html heal');
      } else if (f.label === 'AP') {
        html = replaceExact(html, '135/205/2000</span> sát thương phép', '160/240/2000</span> sát thương phép', 'Nidalee/AP html empowered');
        html = replaceExact(html, '250/375/3000</span> sát thương phép', '300/450/3000</span> sát thương phép', 'Nidalee/AP html third-attack');
      }
      return { ...f, abilityHtmlVi: html };
    });
    await db.update(set18Champions).set({ forms, updatedAt: new Date() }).where(eq(set18Champions.name, 'Nidalee'));
    console.log('✓ champion Nidalee (2 forms)');
  }

  // ── Sivir ────────────────────────────────────────────────────────
  await updateChampion(
    'Sivir',
    (a) => replaceExact(a, 'deals 170/255/1150 physical damage', 'deals 165/250/1150 physical damage', 'Sivir/ability'),
    (a) => replaceExact(a, 'gây 170/255/1150 sát thương vật lý', 'gây 165/250/1150 sát thương vật lý', 'Sivir/abilityVi'),
    (h) => replaceExact(h, '170/255/1150</span> sát thương vật lý', '165/250/1150</span> sát thương vật lý', 'Sivir/html'),
  );

  // ── Zyra ─────────────────────────────────────────────────────────
  await updateChampion(
    'Zyra',
    (a) => replaceExact(a, 'Each attack deals 33/50/225 magic damage', 'Each attack deals 35/52/225 magic damage', 'Zyra/ability'),
    (a) => replaceExact(a, 'Mỗi đòn đánh gây 33/50/225 sát thương phép', 'Mỗi đòn đánh gây 35/52/225 sát thương phép', 'Zyra/abilityVi'),
    (h) => replaceExact(h, '33/50/225</span> sát thương phép', '35/52/225</span> sát thương phép', 'Zyra/html'),
  );

  // ── Ashe (stats.mana đã khớp 30/80, cập nhật sang 30/90) ───────────
  await updateChampion('Ashe', (a) => a, (a) => a, undefined, { mana: [30, 90] });

  // ── Draven (stats.attackDamage[0] 40 → 48) ─────────────────────────
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'Draven'));
    if (!row) throw new Error('Draven không tìm thấy');
    const stats = row.stats as any;
    if (stats.attackDamage[0] !== 40) throw new Error(`Draven attackDamage[0] hiện là ${stats.attackDamage[0]}, không phải 40 — kiểm tra lại`);
    stats.attackDamage[0] = 48;
    await db.update(set18Champions).set({ stats, updatedAt: new Date() }).where(eq(set18Champions.name, 'Draven'));
    console.log('✓ champion Draven (stats.attackDamage)');
  }

  // ── The Elder Dragon ─────────────────────────────────────────────
  await updateChampion(
    'The Elder Dragon',
    (a) => replaceExact(a, 'dealing 260/390/7200 physical damage', 'dealing 200/300/7200 physical damage', 'ElderDragon/ability'),
    (a) => replaceExact(a, 'gây 260/390/7200 sát thương vật lý', 'gây 200/300/7200 sát thương vật lý', 'ElderDragon/abilityVi'),
    (h) => replaceExact(h, '260/390/7200</span> sát thương vật lý', '200/300/7200</span> sát thương vật lý', 'ElderDragon/html'),
  );

  // ── Lux (Spell Damage — dạng mặc định + 9 dạng biến thể khác) ───────
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'Lux'));
    if (!row) throw new Error('Lux không tìm thấy');
    const ability = replaceExact(row.ability, 'deals 370/580/5000 magic damage', 'deals 330/520/5000 magic damage', 'Lux/ability');
    const abilityVi = replaceExact(row.abilityVi, 'gây 370/580/5000 sát thương phép', 'gây 330/520/5000 sát thương phép', 'Lux/abilityVi');
    const forms = (row.forms as any[]).map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(f.abilityHtmlVi as string, '370/580/5000</span> sát thương phép', '330/520/5000</span> sát thương phép', `Lux/html(${f.label})`),
    }));
    await db.update(set18Champions).set({ ability, abilityVi, forms, updatedAt: new Date() }).where(eq(set18Champions.name, 'Lux'));
    console.log('✓ champion Lux (mặc định + tất cả dạng)');
  }

  // ── Maokai (stats.health đang [0,0,0] — điền theo tỉ lệ 1×/1.8×/3.24× chuẩn) ──
  await updateChampion('Maokai', (a) => a, (a) => a, undefined, { health: [1100, 1980, 3564] });

  // ── Taric ────────────────────────────────────────────────────────
  await updateChampion(
    'Taric',
    (a) => replaceExact(a, 'granting 406/656/11300 Shield', 'granting 200/400/11300 Shield', 'Taric/ability'),
    (a) => replaceExact(a, 'tạo 406/656/11300 Lá Chắn', 'tạo 200/400/11300 Lá Chắn', 'Taric/abilityVi'),
    (h) => replaceExact(h, '406/656/11300</span> Lá Chắn', '200/400/11300</span> Lá Chắn', 'Taric/html'),
  );

  console.log('\n✓ Xong toàn bộ 28 tướng.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
