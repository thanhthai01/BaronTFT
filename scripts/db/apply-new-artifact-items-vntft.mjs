// Thêm 23 item Artifact mới tìm được trên vnTFT (trang-bi-tao-tac-tft), chưa
// có trong set18_items. Nguồn chỉ có tiếng Việt (không có tên/mô tả tiếng
// Anh) — name = nameVi tạm thời, giống quy ước Forbidden Idol khi DB chưa
// dịch (chỉ đảo chiều: ở đây thiếu bản Anh thay vì thiếu bản Việt).
//
// 8 item xác nhận "DTCL mùa 18" trên trang chi tiết -> visible=true, season=18.
// 15 item còn lại trang chi tiết ghi rõ "DTCL mùa 17" -> visible=false,
// season=17 (giữ lại làm dữ liệu tham khảo, ẩn khỏi UI vì không xác nhận có
// thật trong Set 18).
//
// id/apiName là TỰ ĐẶT (không phải apiName thật của Riot — không có nguồn
// xác nhận), dùng tiền tố "vntft_" để phân biệt rõ với item chính thức.
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

function slugify(s) {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const items = [
  // ── Mùa 18 xác nhận ──────────────────────────────────────────────
  {
    nameVi: 'Kiếm Thuật Của Yasuo', slug: 'kiem-thuat-cua-yasuo', season: 18, visible: true,
    descriptionVi: 'Cứ mỗi 3.5 giây, đòn đánh tiếp theo của bạn sẽ tấn công hai lần.',
    statBadges: [{ stat: 'ad', value: '30%' }, { stat: 'as', value: '10%' }],
  },
  {
    nameVi: 'Lồng Đèn Của Thresh', slug: 'long-den-cua-thresh', season: 18, visible: true,
    descriptionVi: 'Sau 6 giây giao tranh, kéo tướng dự bị ngoài cùng bên trái vào bàn đấu. Khi tướng đó còn sống, 20% sát thương mà chủ sở hữu phải chịu sẽ được chuyển hướng sang họ.\n\nTộc/hệ của tướng được ném vào sân đấu sẽ không kích hoạt.',
    statBadges: [{ stat: 'health', value: '400' }, { stat: 'armor', value: '25' }, { stat: 'mr', value: '25' }],
  },
  {
    nameVi: 'Ám Ảnh Của Varus', slug: 'am-anh-cua-varus', season: 18, visible: true,
    descriptionVi: 'Bắt đầu giao tranh: Tướng Đỡ Đòn mạnh nhất của bạn trở thành Tri Kỷ. Với mỗi giây họ còn sống, chủ sở hữu nhận thêm 3% Sức Mạnh Công Kích và Sức Mạnh Phép Thuật cộng dồn.\n\nTri Kỷ hồi lại 20% lượng sát thương mà chủ sở hữu gây ra.',
    statBadges: [{ stat: 'damageamp', value: '15%' }],
  },
  {
    nameVi: 'Phép Màu Của Soraka', slug: 'phep-mau-cua-soraka', season: 18, visible: true,
    descriptionVi: 'Trong 2 lần đầu tiên chủ sở hữu tụt xuống dưới 50% Máu, một Phép Màu sẽ xảy ra, hồi phục cho họ 20% Máu tối đa.\n\nNếu chủ sở hữu sống sót sau giao tranh người chơi, nhận 1 Máu người chơi cho mỗi Phép Màu trong giao tranh này.',
    statBadges: [{ stat: 'health', value: '100' }, { stat: 'dura', value: '10%' }],
  },
  {
    nameVi: 'Kiên Nhẫn Của Ekko', slug: 'kien-nhan-cua-ekko', season: 18, visible: true,
    descriptionVi: 'Tổng sát thương kỹ năng tăng thêm 45%, nhưng sẽ được gây ra trong 2 giây thay vì ngay lập tức.',
    statBadges: [{ stat: 'ap', value: '25' }, { stat: 'ad', value: '25%' }],
  },
  {
    nameVi: 'Hào Quang Của Ahri', slug: 'hao-quang-cua-ahri', season: 18, visible: true,
    descriptionVi: 'Chủ sở hữu được 3 cầu hỏa hồ ly bay quanh. Mỗi quả cầu gây 55 (AP) sát thương phép và quỹ đạo sẽ mở rộng để chạm tới mục tiêu hiện tại của chủ sở hữu.\n\nVới mỗi 20 Năng Lượng mà chủ sở hữu tiêu hao, hỏa hồ ly di chuyển nhanh hơn 5% cho đến hết giao tranh.',
    statBadges: [{ stat: 'ap', value: '20' }, { stat: 'manaregen', value: '4' }],
  },
  {
    // Thiếu mô tả cơ chế thật (trang vnTFT chỉ có câu thoại) — ghi rõ để không
    // hiểu nhầm đây là description đầy đủ.
    nameVi: 'Thăng Hoa Rực Rỡ Của Kayle', slug: 'thang-hoa-cua-kayle', season: 18, visible: true,
    descriptionVi: '[Chưa có mô tả cơ chế đầy đủ từ nguồn — vnTFT chỉ ghi câu thoại "Hãy chiêm ngưỡng, ngọn lửa của chính nghĩa!", cần bổ sung sau]',
    statBadges: [{ stat: 'ap', value: '50' }, { stat: 'ad', value: '50%' }, { stat: 'as', value: '30%' }],
  },
  {
    nameVi: 'Dị Thường', slug: 'di-thuong', season: 18, visible: true,
    descriptionVi: 'Tiến hóa chủ sở hữu, ban một hiệu ứng dựa trên vai trò của họ.\n\nĐỡ Đòn: Nhận 1000 máu và tăng kích thước.\nXạ Thủ: Nhận 50% Tốc Độ Đánh. Khi tung chiêu, đẩy lùi mục tiêu nếu kẻ đó ở trong phạm vi 3 ô.\nĐấu Sĩ/Sát Thủ: Nhận 25 Sức Mạnh Phép Thuật & 25% Sức Mạnh Công Kích. Nhân ba hiệu ứng này khi còn dưới 85% Máu.\nThuật Sư: Với mỗi 70 Năng Lượng đã tiêu hao, ném ra một cầu lửa rộng 2 ô, gây sát thương chuẩn bằng 6% Máu tối đa và Thiêu Đốt trong 5 giây.\nĐặc Thù: Nhận 6 ngôi sao quay quanh vị tướng này. Mỗi ngôi sao gây 80 sát thương phép và quỹ đạo sẽ mở rộng để chạm tới mục tiêu hiện tại của tướng.',
    statBadges: null,
  },
  // ── Mùa 17 (trang chi tiết vnTFT xác nhận), ẩn khỏi UI Set 18 ────────
  {
    nameVi: 'Trực Giác Của Evelynn', slug: 'truc-giac-cua-evelynn', season: 17, visible: false,
    descriptionVi: 'Khi đổi mục tiêu, dịch chuyển tới mục tiêu tiếp theo. Các đòn đánh và kỹ năng sẽ hành quyết mục tiêu của chủ sở hữu khi chúng còn dưới 12% Máu.\n\nHạ gục sẽ cho chủ sở hữu 50% Tốc Độ Đánh, giảm dần trong 3 giây.',
    statBadges: [{ stat: 'ap', value: '10' }, { stat: 'ad', value: '10%' }, { stat: 'as', value: '40%' }, { stat: 'omnivamp', value: '15%' }],
  },
  {
    nameVi: 'Trượng Darkin', slug: 'truong-darkin', season: 17, visible: false,
    descriptionVi: 'Chủ sở hữu nhận thêm tộc/hệ Darkin.\n\nVới mỗi 20 Năng Lượng đã tiêu hao, tung ra một sợi xích vào các kẻ địch gần mục tiêu hiện tại, gây 50 sát thương phép.\n\nSát thương tăng theo Giai Đoạn',
    statBadges: [{ stat: 'ap', value: '40' }, { stat: 'manaregen', value: '2' }],
  },
  {
    nameVi: 'Lưỡi Hái Darkin', slug: 'luoi-hai-darkin', season: 17, visible: false,
    descriptionVi: 'Chủ sở hữu nhận thêm tộc/hệ Darkin.\n\nMỗi 4 giây, chém vào các kẻ địch liền kề, gây 200% Sức Mạnh Công Kích Cơ Bản dưới dạng sát thương vật lý. Khi tham gia hạ gục hoặc khi chủ sở hữu lướt đi, chém lần nữa.\n\nLướt - Hồi Chiêu: 1.5 giây',
    statBadges: [{ stat: 'health', value: '250' }, { stat: 'ad', value: '25%' }],
  },
  {
    nameVi: 'Khiên Darkin', slug: 'khien-darkin', season: 17, visible: false,
    descriptionVi: 'Chủ sở hữu nhận thêm tộc/hệ Darkin.\n\nMỗi giây, gây sát thương phép tương đương 1% Máu tối đa của chủ sở hữu lên các kẻ địch trong phạm vi 2 ô. Khi có đơn vị hy sinh trong phạm vi đó, hồi lại 2% Máu tối đa.',
    statBadges: [{ stat: 'health', value: '200' }, { stat: 'armor', value: '25' }, { stat: 'mr', value: '25' }],
  },
  {
    nameVi: 'Cung Darkin', slug: 'cung-darkin', season: 17, visible: false,
    descriptionVi: 'Chủ sở hữu nhận thêm tộc/hệ Darkin.\n\nMỗi 10 đòn đánh, bắn ra một mũi tên đi xuyên qua mục tiêu hiện tại, gây 500% Sức Mạnh Công Kích Cơ Bản dưới dạng sát thương vật lý, giảm đi 33% với mỗi kẻ địch trúng đòn.',
    statBadges: [{ stat: 'ad', value: '10%' }, { stat: 'as', value: '25%' }],
  },
  {
    nameVi: 'Bóng Phân Thân', slug: 'bong-phan-than', season: 17, visible: false,
    descriptionVi: 'Triệu hồi một phân thân sao chép các trang bị của chủ sở hữu. Phân thân sẽ có 70% Máu tối đa và gây 40% sát thương.',
    statBadges: [{ stat: 'as', value: '10%' }, { stat: 'armor', value: '10' }, { stat: 'mr', value: '10' }],
  },
  {
    nameVi: 'Kính Nhắm Thiện Xạ', slug: 'kinh-nham-thien-xa', season: 17, visible: false,
    descriptionVi: 'Nhận 40% Khuếch Đại Sát Thương lên các mục tiêu cách xa từ 4 ô trở lên.',
    statBadges: [{ stat: 'ad', value: '25%' }, { stat: 'ap', value: '25' }, { stat: 'as', value: '20%' }],
  },
  {
    nameVi: 'Gươm Biến Ảnh', slug: 'guom-bien-anh', season: 17, visible: false,
    descriptionVi: 'Bắt đầu giao tranh: Dịch chuyển chủ sở hữu đến ô đối xứng trên bàn đấu của đối thủ. Sau 8 giây, chủ sở hữu sẽ trở lại vị trí ban đầu.',
    statBadges: [{ stat: 'ad', value: '40%' }, { stat: 'armor', value: '40' }, { stat: 'mr', value: '40' }, { stat: 'critchance', value: '20%' }],
  },
  {
    nameVi: 'Bùa Đầu Lâu', slug: 'bua-dau-lau', season: 17, visible: false,
    descriptionVi: 'Bắt đầu giao tranh: Phóng lửa vào mục tiêu hiện tại, gây sát thương phép tương đương 40% Máu tối đa của kẻ đó. Lặp lại hiệu ứng này mỗi 13 giây.',
    statBadges: [{ stat: 'ap', value: '30' }, { stat: 'damageamp', value: '25%' }],
  },
  {
    nameVi: 'Móng Vuốt Ám Muội', slug: 'mong-vuot-am-muoi', season: 17, visible: false,
    descriptionVi: 'Sau khi hạ gục mục tiêu, loại bỏ hiệu ứng bất lợi và lướt tới mục tiêu xa nhất trong vòng 4 ô. Hai đòn đánh chí mạng tiếp theo gây thêm 50% Sát Thương Chí Mạng.',
    statBadges: [{ stat: 'health', value: '200' }, { stat: 'ad', value: '35%' }, { stat: 'critchance', value: '45%' }],
  },
  {
    nameVi: 'Dây Chuyền Tự Lực', slug: 'day-chuyen-tu-luc', season: 17, visible: false,
    descriptionVi: 'Chủ sở hữu tăng 2% tổng Năng Lượng mỗi khi bị trúng một đòn đánh.\n\nMỗi lần thi triển kỹ năng hồi 20% Máu tối đa của chủ sở hữu trong 3 giây.',
    statBadges: [{ stat: 'health', value: '150' }],
  },
  {
    nameVi: 'Áo Choàng Diệt Vong', slug: 'ao-choang-diet-vong', season: 17, visible: false,
    descriptionVi: 'Mỗi khi Lá Chắn của chủ sở hữu bị phá, gây sát thương phép bằng 150% giá trị ban đầu của Lá Chắn đó lên kẻ địch gần nhất.',
    statBadges: [{ stat: 'health', value: '350' }, { stat: 'armor', value: '40' }],
  },
  {
    nameVi: 'Gương Lừa Gạt', slug: 'guong-lua-gat', season: 17, visible: false,
    descriptionVi: 'Triệu hồi 1 bản sao với 70% Máu Cơ Bản và +10% Năng Lượng tối đa. Bạn không thể lắp trang bị cho tướng nhân bản.',
    statBadges: [{ stat: 'armor', value: '10' }, { stat: 'mr', value: '10' }, { stat: 'as', value: '10%' }, { stat: 'critchance', value: '15%' }],
  },
  {
    nameVi: 'Áo Choàng Mờ Ám', slug: 'ao-choang-mo-am', season: 17, visible: false,
    descriptionVi: 'Một lần mỗi giao tranh, khi còn 60% Máu, chủ sở hữu phân thân thành 3 bản sao với 33% Máu tối đa.\n\nDuy Nhất - chỉ 1 mỗi tướng',
    statBadges: [{ stat: 'health', value: '100' }, { stat: 'as', value: '15%' }],
    unique: true,
  },
  {
    nameVi: 'Vương Miện Demacia', slug: 'vuong-mien-demacia', season: 17, visible: false,
    descriptionVi: 'Nếu tướng mang nó là tướng Đỡ Đòn, hồi lại 3 - 21% Máu tối đa mỗi 2 giây (tùy theo giai đoạn). Nếu không, nhận 10%AD Sức Mạnh Công Kích và Sức Mạnh Phép Thuật mỗi 2 giây.\n\nNếu chủ sở hữu trang bị này hy sinh, bạn lập tức thua giao tranh.\n\nBạn có thể gỡ bỏ trang bị này bằng cách chuyển chủ sở hữu về hàng dự bị.',
    statBadges: [{ stat: 'health', value: '300' }, { stat: 'as', value: '30%' }],
  },
];

let inserted = 0;
for (const item of items) {
  const id = `item:vntft_${item.slug}`;
  const apiName = `VNTFT_Artifact_${item.slug.replace(/-/g, '_')}`; // KHÔNG phải apiName thật của Riot
  const icon = `/set18/assets/items/full/vntft_${item.slug}.png`;

  const [existing] = await sql`select id from set18_items where id = ${id}`;
  if (existing) {
    console.log(`- Bỏ qua (đã tồn tại): ${item.nameVi}`);
    continue;
  }

  await sql`
    insert into set18_items (
      id, api_name, name, name_vi, category, description, description_vi,
      icon, stat_line, composition_api, "unique", stat_badges, visible, season
    ) values (
      ${id}, ${apiName}, ${item.nameVi}, ${item.nameVi}, 'Artifact',
      ${item.descriptionVi}, ${item.descriptionVi}, ${icon}, null, '[]'::jsonb,
      ${item.unique ?? false}, ${item.statBadges ? JSON.stringify(item.statBadges) : null}::jsonb,
      ${item.visible}, ${item.season}
    )
  `;
  console.log(`✓ ${item.nameVi} (season=${item.season}, visible=${item.visible})`);
  inserted++;
}

console.log(`\nHoàn tất: ${inserted} item mới đã tạo.`);
