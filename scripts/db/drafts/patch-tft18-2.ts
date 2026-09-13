// Draft bản vá LIVE 18.2 — bản cập nhật CHÍNH đầu tiên sau khi Đại Ngàn Kỳ Bí
// lên máy chủ phát hành (18.1). Nội dung/số liệu đã soạn và duyệt trong
// Website/pbe-notes/Patch_TFT18.2-Live-main.md. File này chỉ chuyển nội dung
// đó thành PatchReport để áp vào DB (pnpm db:apply-patch) rồi pull ra
// patch-notes.generated.ts (pnpm db:pull).
//
// Nguồn: patch note chính thức Riot, bản EN + VI đối chiếu song song — khớp
// 100%, không có lỗi dịch (khác 18.1 launch từng lệch giây/vàng).
//
// Phạm vi cố ý KHÔNG đưa vào entries (xem mục "Sửa lỗi đáng chú ý" của .md):
// - ~20 mục sửa lỗi nhỏ (VFX/tooltip/UI hiển thị) không có giá trị tra cứu,
//   chỉ 2 mục "bật lại tính năng" (Double Trouble, Hullcrusher) được giữ.
// - 39 vật phẩm trang trí chuyển đổi trong 18.2: không phải gameplay.
// - ~15 mục cải thiện hiệu năng/ổn định PC+Mobile: không có số liệu before/after.
//
// Tinh Linh: theo quyết định người dùng, gộp hiển thị theo 4 nhóm
// (Combat/Economy/Shop/Other) thay vì 1 entry/Tinh Linh — vẫn giữ đủ giá
// cũ-mới của từng Tinh Linh trong changes[] để tra cứu được, entityId đầy đủ
// nằm trong file .md nếu cần đối chiếu codex.
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  "id": "patch-tft18-2",
  "version": "Live 09/09/2026 (18.2)",
  "title": "Bản cập nhật chính đầu tiên của Đại Ngàn Kỳ Bí",
  "author": "Baron TFT (dịch)",
  "source": {
    "label": "Riot Games — patch note chính thức 18.2",
    "url": "https://teamfighttactics.leagueoflegends.com/vi-vn/news/game-updates/teamfight-tactics-patch-18-2/"
  },
  "entitySet": 18,
  "dateVi": "09/09/2026",
  "summaryVi": "Bản cập nhật CHÍNH đầu tiên sau khi Đại Ngàn Kỳ Bí lên máy chủ phát hành, tập trung buff các đội hình chưa nổi được dưới cái bóng của reroll và Ahri. Giảm gold cần lên cấp 8/9/10 và giảm giá gần như toàn bộ Tinh Linh Giao Tranh để người chơi rủng rỉnh vàng hơn ở late game. Cân bằng lớn cho Gai Đen, Tiên Linh, Thợ Săn, Hỏa Ngục (buff) và Liên Kích, Mặt Trời (nerf); gần như toàn bộ tướng 5 vàng được buff. Huyết Kiếm và Bàn Tay Công Lý được tăng sức mạnh để cạnh tranh với Áo Choàng Bóng Tối (nay bị nerf và kích hoạt sớm hơn). Nâng Cấp nhận một đợt cân bằng lớn: nerf mạnh Thực Vật Hấp Thụ, buff lớn Tà Thuật, nhiều Nâng Cấp giờ giới hạn 1 người/sảnh để tránh giành giật ngay đầu trận.",
  "summaryOrigin": "official",
  "entries": [
    {
      "id": "live182-mech-xpperlevel",
      "category": "mechanic",
      "kind": "buff",
      "name": "XP mỗi cấp",
      "changes": [
        {
          "label": "Cấp 7 → 8",
          "from": "60",
          "to": "56"
        },
        {
          "label": "Cấp 8 → 9",
          "from": "68",
          "to": "64"
        },
        {
          "label": "Cấp 9 → 10",
          "from": "68",
          "to": "64"
        }
      ]
    },
    {
      "id": "live182-trait-blackthorn",
      "entityId": "trait:eldritch",
      "category": "trait",
      "kind": "buff",
      "name": "Blackthorn",
      "changes": [
        {
          "label": "Máu",
          "from": "175/300/550",
          "to": "175/350/600"
        },
        {
          "label": "Đỡ Đòn Hiến Tế - Chống Chịu",
          "from": "15",
          "to": "12"
        },
        {
          "label": "SMCK Hiến Tế - Tốc Độ Đánh Cơ Bản",
          "from": "12%",
          "to": "14%"
        },
        {
          "label": "SMPT Hiến Tế - Hồi Năng Lượng Cơ Bản",
          "from": "1.7",
          "to": "2"
        }
      ]
    },
    {
      "id": "live182-trait-fae",
      "entityId": "trait:fae",
      "category": "trait",
      "kind": "buff",
      "name": "Fae",
      "changes": [
        {
          "label": "Mốc Pix Hoàng Kim 1",
          "from": "200.000",
          "to": "170.000"
        },
        {
          "label": "Mốc Pix Hoàng Kim 2",
          "from": "250.000",
          "to": "200.000"
        },
        {
          "label": "Mốc Pix Hoàng Kim 3",
          "from": "330.000",
          "to": "300.000"
        },
        {
          "label": "Mốc Pix Hoàng Kim 4",
          "from": "420.000",
          "to": "400.000"
        },
        {
          "label": "Mốc Pix Hoàng Kim 5",
          "from": "510.000",
          "to": "500.000"
        },
        {
          "label": "Mốc Pix Hoàng Kim 6",
          "from": "610.000",
          "to": "600.000"
        }
      ]
    },
    {
      "id": "live182-trait-hunter",
      "entityId": "trait:hunter",
      "category": "trait",
      "kind": "buff",
      "name": "Hunter",
      "changes": [
        {
          "label": "Thời gian tác dụng nhắm mục tiêu cho Khuếch Đại Sát Thương",
          "from": "4 giây",
          "to": "3 giây"
        }
      ]
    },
    {
      "id": "live182-trait-inferno",
      "entityId": "trait:inferno",
      "category": "trait",
      "kind": "buff",
      "name": "Inferno",
      "changes": [
        {
          "label": "Thiêu Đốt",
          "from": "1/1/3/3.5%",
          "to": "1/1/3.5/4.5%"
        }
      ]
    },
    {
      "id": "live182-trait-rapidfire",
      "entityId": "trait:rapidfire",
      "category": "trait",
      "kind": "nerf",
      "name": "Rapidfire",
      "changes": [
        {
          "label": "Tốc Độ Đánh mỗi đòn đánh",
          "from": "3/5/9/15%",
          "to": "3/5/8/12%"
        }
      ]
    },
    {
      "id": "live182-trait-solar",
      "entityId": "trait:solar",
      "category": "trait",
      "kind": "nerf",
      "name": "Solar",
      "note": "Buff đầu trận, nerf tổng thể",
      "changes": [
        {
          "label": "Sát Thương Phép Cộng Thêm Ban Đầu",
          "from": "7%",
          "to": "8%"
        },
        {
          "label": "Tăng Thưởng mỗi tướng 3 sao",
          "from": "1.5%",
          "to": "1%"
        },
        {
          "label": "Tốc Độ Đánh Cộng Thêm khi có 3 tướng 3 sao",
          "from": "18%",
          "to": "15%"
        },
        {
          "label": "Giáp và Kháng Phép khi có 3 tướng 3 sao",
          "from": "15",
          "to": "12"
        }
      ]
    },
    {
      "id": "live182-champ-akali",
      "entityId": "champion:tft18_akali",
      "category": "champion",
      "kind": "buff",
      "name": "Akali",
      "cost": 1,
      "changes": [
        {
          "label": "Dạng SMCK - Năng Lượng",
          "from": "0/30",
          "to": "0/25"
        }
      ]
    },
    {
      "id": "live182-champ-leona",
      "entityId": "champion:tft18_leona",
      "category": "champion",
      "kind": "buff",
      "name": "Leona",
      "cost": 1,
      "changes": [
        {
          "label": "Năng Lượng",
          "from": "40/100",
          "to": "30/90"
        },
        {
          "label": "Chống Chịu Giảm Dần",
          "from": "60/70/80/100",
          "to": "60/80/100/130"
        }
      ]
    },
    {
      "id": "live182-champ-varus",
      "entityId": "champion:tft18_varus",
      "category": "champion",
      "kind": "buff",
      "name": "Varus",
      "cost": 1,
      "changes": [
        {
          "label": "Sát Thương Kỹ Năng",
          "from": "385/580/925/1530 AD",
          "to": "415/625/1000/1700 AD"
        }
      ]
    },
    {
      "id": "live182-champ-veigar",
      "entityId": "champion:tft18_veigar",
      "category": "champion",
      "kind": "mechanic",
      "name": "Veigar",
      "cost": 1,
      "note": "Sửa lỗi hiển thị, không đổi số thực tế",
      "changes": [
        {
          "label": "SMPT Mỗi Mạng Hạ Gục (hiển thị)",
          "from": "1.5%",
          "to": "3%"
        }
      ]
    },
    {
      "id": "live182-champ-leblanc",
      "entityId": "champion:tft18_leblanc",
      "category": "champion",
      "kind": "rework",
      "name": "LeBlanc",
      "cost": 2,
      "note": "Chuyển sức mạnh từ nhân bản sang sát thương chiêu",
      "changes": [
        {
          "label": "Sát Thương Kỹ Năng",
          "from": "250/375/565/955 AP",
          "to": "260/390/615/1045 AP"
        },
        {
          "label": "Sát Thương Diện Rộng",
          "from": "85/130/190/325 AP",
          "to": "100/150/230 AP"
        }
      ]
    },
    {
      "id": "live182-champ-kayle",
      "entityId": "champion:tft18_kayle",
      "category": "champion",
      "kind": "buff",
      "name": "Kayle",
      "cost": 2,
      "changes": [
        {
          "label": "Sát Thương Phép Trên Đòn Đánh",
          "from": "56/84/95 AP",
          "to": "62/92/105 AP"
        },
        {
          "label": "Sát Thương Sóng Năng Lượng",
          "from": "40/40/40/50 AP",
          "to": "35/35/35/45 AP"
        }
      ]
    },
    {
      "id": "live182-champ-shen",
      "entityId": "champion:tft18_shen",
      "category": "champion",
      "kind": "buff",
      "name": "Shen",
      "cost": 2,
      "changes": [
        {
          "label": "Lá Chắn",
          "from": "325/400/500/600 AP",
          "to": "350/430/550/700 AP"
        }
      ]
    },
    {
      "id": "live182-champ-warwick",
      "entityId": "champion:tft18_warwick",
      "category": "champion",
      "kind": "buff",
      "name": "Warwick",
      "cost": 2,
      "changes": [
        {
          "label": "SMCK",
          "from": "40",
          "to": "45"
        }
      ]
    },
    {
      "id": "live182-champ-yunara",
      "entityId": "champion:tft18_yunara",
      "category": "champion",
      "kind": "buff",
      "name": "Yunara",
      "cost": 2,
      "changes": [
        {
          "label": "Sát Thương Kỹ Năng",
          "from": "150/225/335/570 AD",
          "to": "160/240/370/630 AD"
        }
      ]
    },
    {
      "id": "live182-champ-azir",
      "entityId": "champion:tft18_azir",
      "category": "champion",
      "kind": "buff",
      "name": "Azir",
      "cost": 3,
      "changes": [
        {
          "label": "Lính Cát - Sát Thương Kỹ Năng",
          "from": "40/60/96/165 AP",
          "to": "43/65/103/175 AP"
        }
      ]
    },
    {
      "id": "live182-champ-diana",
      "entityId": "champion:tft18_diana",
      "category": "champion",
      "kind": "buff",
      "name": "Diana",
      "cost": 3,
      "changes": [
        {
          "label": "Sát Thương Kỹ Năng Mỗi Quả Cầu",
          "from": "70/105/170 AP",
          "to": "75/115/180 AP"
        },
        {
          "label": "Lá Chắn",
          "from": "150/275/400",
          "to": "150/275/500"
        }
      ]
    },
    {
      "id": "live182-champ-khazix",
      "entityId": "champion:tft18_khazix",
      "category": "champion",
      "kind": "buff",
      "name": "Kha'Zix",
      "cost": 3,
      "changes": [
        {
          "label": "SMCK Cơ Bản",
          "from": "30",
          "to": "40"
        }
      ]
    },
    {
      "id": "live182-champ-raptor",
      "entityId": "champion:tft18_raptor",
      "category": "champion",
      "kind": "buff",
      "name": "Mama Beak",
      "cost": 3,
      "note": "Tên trong patch note: Mama Beak / Chim Mẹ",
      "changes": [
        {
          "label": "SMCK Cơ Bản",
          "from": "50",
          "to": "55"
        },
        {
          "label": "Sát Thương Kỹ Năng",
          "from": "20/30/48 AD",
          "to": "22/33/48 AD"
        }
      ]
    },
    {
      "id": "live182-champ-masteryi",
      "entityId": "champion:tft18_masteryi",
      "category": "champion",
      "kind": "nerf",
      "name": "Master Yi",
      "cost": 3,
      "changes": [
        {
          "label": "Dạng SMCK - SMCK Cơ Bản",
          "from": "65",
          "to": "60"
        },
        {
          "label": "Dạng SMPT - Sát Thương Kỹ Năng",
          "from": "140/210/335 AP",
          "to": "125/190/285 AP"
        }
      ]
    },
    {
      "id": "live182-champ-rengar",
      "entityId": "champion:tft18_rengar",
      "category": "champion",
      "kind": "nerf",
      "name": "Rengar",
      "cost": 3,
      "changes": [
        {
          "label": "Tốc Độ Đánh Cơ Bản",
          "from": "0.8",
          "to": "0.75"
        }
      ]
    },
    {
      "id": "live182-champ-ahri",
      "entityId": "champion:tft18_ahri",
      "category": "champion",
      "kind": "buff",
      "name": "Ahri",
      "cost": 4,
      "changes": [
        {
          "label": "Sát Thương Kỹ Năng",
          "from": "425/640 AP",
          "to": "455/685 AP"
        },
        {
          "label": "Sát Thương Kỹ Năng giảm dần Mỗi Ô",
          "from": "20%",
          "to": "21%"
        }
      ]
    },
    {
      "id": "live182-champ-ancientsentinel",
      "entityId": "champion:tft18_ancientsentinel",
      "category": "champion",
      "kind": "nerf",
      "name": "Sentinel",
      "cost": 4,
      "note": "Sửa lỗi nhắm mục tiêu: giờ nhắm hàng đông nhất, không bắt buộc gồm mục tiêu hiện tại",
      "changes": [
        {
          "label": "Lá Chắn Kỹ Năng",
          "from": "400/500 AP",
          "to": "350/450 AP"
        }
      ]
    },
    {
      "id": "live182-champ-brambleback",
      "entityId": "champion:tft18_brambleback",
      "category": "champion",
      "kind": "rework",
      "name": "Brambleback",
      "cost": 4,
      "note": "Nerf nhẹ 1-2★, buff mạnh 3★",
      "changes": [
        {
          "label": "SMCK Cơ Bản",
          "from": "115",
          "to": "120"
        },
        {
          "label": "Bỏ Qua Giáp Cơ Bản",
          "from": "10%",
          "to": "15%"
        },
        {
          "label": "Sát Thương Nhảy",
          "from": "170/255 AD",
          "to": "155/235 AD"
        },
        {
          "label": "Bỏ Qua Giáp (3★)",
          "from": "10 + 50% AP",
          "to": "10 + 70% AP"
        },
        {
          "label": "Sát Thương Nhảy (3★)",
          "from": "600% AD",
          "to": "1000% AD"
        },
        {
          "label": "SMCK Kỹ Năng Cộng Thêm (3★)",
          "from": "280%",
          "to": "300%"
        }
      ]
    },
    {
      "id": "live182-champ-ezreal",
      "entityId": "champion:tft18_ezreal",
      "category": "champion",
      "kind": "buff",
      "name": "Ezreal",
      "cost": 4,
      "changes": [
        {
          "label": "Sát Thương Kỹ Năng Chính",
          "from": "235/355 AD",
          "to": "250/375 AD"
        }
      ]
    },
    {
      "id": "live182-champ-nidalee",
      "entityId": "champion:tft18_nidalee",
      "category": "champion",
      "kind": "buff",
      "name": "Nidalee",
      "cost": 4,
      "changes": [
        {
          "label": "Dạng SMPT - Sức Mạnh Công Kích Cường Hóa",
          "from": "285/425 AP",
          "to": "300/450 AP"
        },
        {
          "label": "Dạng SMCK - Sát Thương Kỹ Năng (3★)",
          "from": "2500% AD",
          "to": "3000% AD"
        }
      ]
    },
    {
      "id": "live182-champ-zyra",
      "entityId": "champion:tft18_zyra",
      "category": "champion",
      "kind": "nerf",
      "name": "Zyra",
      "cost": 4,
      "changes": [
        {
          "label": "Sát Thương Kỹ Năng",
          "from": "37/55 AP",
          "to": "35/53 AP"
        }
      ]
    },
    {
      "id": "live182-champ-ashe",
      "entityId": "champion:tft18_ashe",
      "category": "champion",
      "kind": "buff",
      "name": "Ashe",
      "cost": 5,
      "note": "Sửa lỗi: không còn đôi khi nhắm nhầm hàng kẻ địch",
      "changes": [
        {
          "label": "Sát Thương Mũi Tên",
          "from": "440/660 AD",
          "to": "465/700 AD"
        }
      ]
    },
    {
      "id": "live182-champ-ivern",
      "entityId": "champion:tft18_ivern",
      "category": "champion",
      "kind": "buff",
      "name": "Ivern",
      "cost": 5,
      "changes": [
        {
          "label": "Số Ô Bắt Đầu",
          "from": "2",
          "to": "3"
        },
        {
          "label": "Lá Chắn",
          "from": "165/300 AP",
          "to": "185/350 AP"
        },
        {
          "label": "Sát Thương Kỹ Năng",
          "from": "140/210 AP",
          "to": "155/235 AP"
        }
      ]
    },
    {
      "id": "live182-champ-kennen",
      "entityId": "champion:tft18_kennen",
      "category": "champion",
      "kind": "mechanic",
      "name": "Kennen",
      "cost": 5,
      "note": "Cải thiện AI nhắm mục tiêu nhóm kẻ địch cho Bão Lửa, không có số liệu"
    },
    {
      "id": "live182-champ-lux",
      "entityId": "champion:tft18_lux",
      "category": "champion",
      "kind": "buff",
      "name": "Lux",
      "cost": 5,
      "changes": [
        {
          "label": "Sát Thương Kỹ Năng",
          "from": "355/550 AP",
          "to": "375/565 AP"
        },
        {
          "label": "Sát Thương Laser (3★)",
          "from": "5000 AP",
          "to": "6500 AP"
        }
      ]
    },
    {
      "id": "live182-champ-maokai",
      "entityId": "champion:tft18_maokai",
      "category": "champion",
      "kind": "buff",
      "name": "Maokai",
      "cost": 5,
      "changes": [
        {
          "label": "Năng Lượng",
          "from": "40/100",
          "to": "30/90"
        }
      ]
    },
    {
      "id": "live182-champ-taric",
      "entityId": "champion:tft18_taric",
      "category": "champion",
      "kind": "buff",
      "name": "Taric",
      "cost": 5,
      "changes": [
        {
          "label": "Lá Chắn Nội Tại",
          "from": "175/350 + 10% Máu tối đa",
          "to": "100/225 + 15% Máu tối đa"
        },
        {
          "label": "Hồi Máu Kích Hoạt",
          "from": "200/300 AP",
          "to": "250/375 AP"
        }
      ]
    },
    {
      "id": "live182-champ-gnar",
      "entityId": "champion:tft18_gnar",
      "category": "champion",
      "kind": "buff",
      "name": "Gnar",
      "cost": 5,
      "changes": [
        {
          "label": "Nộ Mỗi Đòn Đánh (3★)",
          "from": "5",
          "to": "20"
        },
        {
          "label": "Giảm Chống Chịu (3★)",
          "from": "100",
          "to": "250"
        },
        {
          "label": "Máu Cộng Thêm (3★)",
          "from": "10000",
          "to": "15000"
        }
      ]
    },
    {
      "id": "live182-item-bloodthirster",
      "category": "item",
      "kind": "buff",
      "name": "Huyết Kiếm (Bloodthirster)",
      "changes": [
        {
          "label": "Máu Kích Hoạt",
          "from": "40%",
          "to": "50%"
        },
        {
          "label": "SMCK/SMPT",
          "from": "15%",
          "to": "18%"
        },
        {
          "label": "Lá Chắn",
          "from": "25% Máu tối đa",
          "to": "30% Máu tối đa"
        }
      ]
    },
    {
      "id": "live182-item-edgeofnight",
      "category": "item",
      "kind": "nerf",
      "name": "Áo Choàng Bóng Tối (Edge of Night)",
      "changes": [
        {
          "label": "Máu Kích Hoạt",
          "from": "60%",
          "to": "40%"
        },
        {
          "label": "Hồi Máu Đã Mất",
          "from": "20%",
          "to": "15%"
        }
      ]
    },
    {
      "id": "live182-item-handofjustice",
      "category": "item",
      "kind": "buff",
      "name": "Bàn Tay Công Lý (Hand Of Justice)",
      "changes": [
        {
          "label": "SMCK/SMPT Cơ Bản",
          "from": "15%",
          "to": "18%"
        },
        {
          "label": "Hút Máu Toàn Phần Cơ Bản",
          "from": "12%",
          "to": "15%"
        }
      ]
    },
    {
      "id": "live182-item-radiantbloodthirster",
      "category": "item",
      "kind": "buff",
      "name": "Huyết Kiếm Ánh Sáng (Radiant Bloodthirster)",
      "changes": [
        {
          "label": "Máu Kích Hoạt",
          "from": "40%",
          "to": "50%"
        },
        {
          "label": "SMCK/SMPT",
          "from": "30%",
          "to": "40%"
        },
        {
          "label": "Lá Chắn",
          "from": "50% Máu tối đa",
          "to": "60% Máu tối đa"
        }
      ]
    },
    {
      "id": "live182-item-radiantedgeofnight",
      "category": "item",
      "kind": "nerf",
      "name": "Áo Choàng Bóng Tối Ánh Sáng (Radiant Edge of Night)",
      "changes": [
        {
          "label": "Máu Kích Hoạt",
          "from": "60%",
          "to": "40%"
        }
      ]
    },
    {
      "id": "live182-item-radianthandofjustice",
      "category": "item",
      "kind": "buff",
      "name": "Bàn Tay Công Lý Ánh Sáng (Radiant Hand of Justice)",
      "changes": [
        {
          "label": "Hút Máu Toàn Phần Cơ Bản",
          "from": "24%",
          "to": "30%"
        }
      ]
    },
    {
      "id": "live182-artifact-blightingjewel",
      "category": "item",
      "kind": "nerf",
      "name": "Đá Hắc Hóa (Blighting Jewel)",
      "changes": [
        {
          "label": "Giảm Kháng Phép",
          "from": "4",
          "to": "3"
        }
      ]
    },
    {
      "id": "live182-artifact-flickerblades",
      "category": "item",
      "kind": "nerf",
      "name": "Đao Chớp Navori (Flickerblades)",
      "changes": [
        {
          "label": "Tốc Độ Đánh Mỗi Đòn Đánh",
          "from": "5%",
          "to": "4%"
        }
      ]
    },
    {
      "id": "live182-artifact-forbiddenidol",
      "category": "item",
      "kind": "buff",
      "name": "Dị Vật Tai Ương (Forbidden Idol)",
      "changes": [
        {
          "label": "Máu",
          "from": "400",
          "to": "500"
        }
      ]
    },
    {
      "id": "live182-artifact-ludenstempest",
      "category": "item",
      "kind": "buff",
      "name": "Bão Tố Luden (Luden's Tempest)",
      "changes": [
        {
          "label": "Sát Thương Cố Định Khi Hạ Gục",
          "from": "100",
          "to": "130"
        }
      ]
    },
    {
      "id": "live182-artifact-silvermeredawn",
      "category": "item",
      "kind": "buff",
      "name": "Chùy Bạch Ngân (Silvermere Dawn)",
      "changes": [
        {
          "label": "SMCK",
          "from": "125%",
          "to": "150%"
        }
      ]
    },
    {
      "id": "live182-artifact-witsend",
      "category": "item",
      "kind": "nerf",
      "name": "Đao Tím (Wit's End)",
      "changes": [
        {
          "label": "Sát Thương Trên Đòn Đánh (giai đoạn 2-5)",
          "from": "30/55/75/95/115",
          "to": "25/45/65/85/100"
        }
      ]
    },
    {
      "id": "live182-emblem-brawler",
      "category": "item",
      "kind": "nerf",
      "name": "Ấn Đấu Sĩ (Brawler Emblem)",
      "changes": [
        {
          "label": "Máu",
          "from": "250",
          "to": "150"
        }
      ]
    },
    {
      "id": "live182-emblem-fae",
      "category": "item",
      "kind": "nerf",
      "name": "Ấn Tiên Linh (Fae Emblem)",
      "changes": [
        {
          "label": "Máu",
          "from": "250",
          "to": "200"
        },
        {
          "label": "SMCK/SMPT",
          "from": "15%",
          "to": "10%"
        }
      ]
    },
    {
      "id": "live182-emblem-hunter",
      "category": "item",
      "kind": "nerf",
      "name": "Ấn Thợ Săn (Hunter Emblem)",
      "changes": [
        {
          "label": "SMCK Cơ Bản",
          "from": "30%",
          "to": "25%"
        }
      ]
    },
    {
      "id": "live182-emblem-invoker",
      "category": "item",
      "kind": "nerf",
      "name": "Ấn Thuật Sĩ (Invoker Emblem)",
      "changes": [
        {
          "label": "SMPT Mỗi Năng Lượng Tiêu Hao",
          "from": "10%",
          "to": "8%"
        }
      ]
    },
    {
      "id": "live182-emblem-juggernaut",
      "category": "item",
      "kind": "nerf",
      "name": "Ấn Dũng Sĩ (Juggernaut Emblem)",
      "changes": [
        {
          "label": "Máu",
          "from": "350",
          "to": "250"
        }
      ]
    },
    {
      "id": "live182-emblem-primal",
      "category": "item",
      "kind": "buff",
      "name": "Ấn Nguyên Sinh (Primal Emblem)",
      "changes": [
        {
          "label": "Tốc Độ Đánh",
          "from": "25%",
          "to": "35%"
        }
      ]
    },
    {
      "id": "live182-emblem-sprykin",
      "category": "item",
      "kind": "nerf",
      "name": "Ấn Tinh Nghịch (Sprykin Emblem)",
      "changes": [
        {
          "label": "Tốc Độ Đánh Cộng Thêm của Kỵ Sĩ",
          "from": "30%",
          "to": "20%"
        },
        {
          "label": "Chống Chịu Cơ Bản",
          "from": "20",
          "to": "15"
        },
        {
          "label": "Chống Chịu Bổ Sung của Kỵ Sĩ",
          "from": "20",
          "to": "15"
        }
      ]
    },
    {
      "id": "live182-emblem-vanguard",
      "category": "item",
      "kind": "nerf",
      "name": "Ấn Tiên Phong (Vanguard Emblem)",
      "changes": [
        {
          "label": "Giáp/Kháng Phép",
          "from": "30",
          "to": "25"
        }
      ]
    },
    {
      "id": "live182-augment-baronslair",
      "entityId": "augment:da_baronslair",
      "category": "augment",
      "kind": "nerf",
      "name": "Baron's Lair",
      "changes": [
        {
          "label": "Chỉ số nhận được",
          "from": "5%",
          "to": "4%"
        }
      ]
    },
    {
      "id": "live182-augment-capitalgainsii",
      "entityId": "augment:da_capitalgainsii",
      "category": "augment",
      "kind": "buff",
      "name": "Capital Gains II",
      "changes": [
        {
          "label": "Vàng Khởi Đầu",
          "from": "2",
          "to": "3"
        }
      ]
    },
    {
      "id": "live182-augment-cursedcrown",
      "entityId": "augment:da_cursedcrown",
      "category": "augment",
      "kind": "nerf",
      "name": "Cursed Crown",
      "changes": [
        {
          "label": "Chống Chịu cộng thêm",
          "from": "4%",
          "to": "0 (loại bỏ)"
        }
      ]
    },
    {
      "id": "live182-augment-consumingflora",
      "entityId": "augment:da_18_florafatalisaugment",
      "category": "augment",
      "kind": "nerf",
      "name": "Consuming Flora",
      "note": "Áp dụng cho cả 3 mốc Sớm/Giữa/Muộn",
      "changes": [
        {
          "label": "Hiệu Quả Tộc/Hệ",
          "from": "200%",
          "to": "150%"
        },
        {
          "label": "Giới hạn",
          "from": "Không giới hạn",
          "to": "Chỉ 1 người chơi/sảnh"
        }
      ]
    },
    {
      "id": "live182-augment-covenacolyte",
      "entityId": "augment:da_18_coventraitaugment",
      "category": "augment",
      "kind": "mechanic",
      "name": "Coven Acolyte",
      "changes": [
        {
          "label": "Giới hạn",
          "from": "Không giới hạn",
          "to": "Chỉ 1 người chơi/sảnh, loại trừ lẫn nhau với Tà Thuật"
        }
      ]
    },
    {
      "id": "live182-augment-darkritual",
      "entityId": "augment:da_18_coventraitaugment_loottoap",
      "category": "augment",
      "kind": "buff",
      "name": "Dark Ritual",
      "changes": [
        {
          "label": "SMPT mốc rút thưởng 1",
          "from": "5",
          "to": "7"
        },
        {
          "label": "SMPT mốc rút thưởng 2",
          "from": "12",
          "to": "15"
        },
        {
          "label": "SMPT mốc rút thưởng 3",
          "from": "40",
          "to": "50"
        },
        {
          "label": "SMPT mốc rút thưởng 4",
          "from": "60",
          "to": "75"
        },
        {
          "label": "SMPT mốc rút thưởng 5",
          "from": "100",
          "to": "125"
        },
        {
          "label": "SMPT mốc rút thưởng 6",
          "from": "175",
          "to": "200"
        },
        {
          "label": "SMPT mốc rút thưởng 7",
          "from": "250",
          "to": "300"
        },
        {
          "label": "Giới hạn",
          "from": "Không giới hạn",
          "to": "Chỉ 1 người chơi/sảnh, loại trừ lẫn nhau với Tín Đồ Tiên Hắc Ám"
        }
      ]
    },
    {
      "id": "live182-augment-dummify",
      "entityId": "augment:da_dummify",
      "category": "augment",
      "kind": "buff",
      "name": "Dummify",
      "changes": [
        {
          "label": "Máu mỗi vòng",
          "from": "1000",
          "to": "1150"
        }
      ]
    },
    {
      "id": "live182-augment-goinglong",
      "entityId": "augment:da_goinglong",
      "category": "augment",
      "kind": "nerf",
      "name": "Going Long",
      "changes": [
        {
          "label": "Điều kiện nhận XP",
          "from": "Sau mọi giao tranh",
          "to": "Chỉ sau Giao Tranh Người Chơi"
        }
      ]
    },
    {
      "id": "live182-augment-golddestinyplus",
      "entityId": "augment:da_golddestinyplus",
      "category": "augment",
      "kind": "nerf",
      "name": "Gold Destiny+",
      "changes": [
        {
          "label": "Vàng",
          "from": "6",
          "to": "5"
        }
      ]
    },
    {
      "id": "live182-augment-goldendragon",
      "entityId": "augment:da_thegoldendragon",
      "category": "augment",
      "kind": "nerf",
      "name": "The Golden Dragon",
      "changes": [
        {
          "label": "Chống Chịu",
          "from": "20%",
          "to": "15%"
        }
      ]
    },
    {
      "id": "live182-augment-holdtheline",
      "entityId": "augment:da_holdtheline",
      "category": "augment",
      "kind": "buff",
      "name": "Hold the Line",
      "changes": [
        {
          "label": "SMPT nhận được",
          "from": "9%",
          "to": "10"
        },
        {
          "label": "SMCK nhận được",
          "from": "8%",
          "to": "9"
        }
      ]
    },
    {
      "id": "live182-augment-investmentstrategyii",
      "entityId": "augment:da_investmentstrategy",
      "category": "augment",
      "kind": "buff",
      "name": "Investment Strategy II",
      "changes": [
        {
          "label": "Máu nhận được",
          "from": "9",
          "to": "10"
        }
      ]
    },
    {
      "id": "live182-augment-magicroll",
      "entityId": "augment:da_magicroll",
      "category": "augment",
      "kind": "mechanic",
      "name": "Magic Roll",
      "note": "Sửa lỗi phần thưởng tướng cho ít vàng hơn dự kiến"
    },
    {
      "id": "live182-augment-prismaticdestinyplus",
      "entityId": "augment:da_prismaticdestinyplus",
      "category": "augment",
      "kind": "nerf",
      "name": "Prismatic Destiny Plus",
      "changes": [
        {
          "label": "Vàng",
          "from": "10",
          "to": "7"
        }
      ]
    },
    {
      "id": "live182-augment-shimmerscaleessence",
      "entityId": "augment:da_shimmerscaleessence",
      "category": "augment",
      "kind": "nerf",
      "name": "Shimmerscale Essence",
      "changes": [
        {
          "label": "Số vòng trì hoãn",
          "from": "7",
          "to": "8"
        }
      ]
    },
    {
      "id": "live182-augment-spreadingroots",
      "entityId": "augment:da_spreadingroots",
      "category": "augment",
      "kind": "rework",
      "name": "Spreading Roots",
      "changes": [
        {
          "label": "Ấn nhận được",
          "from": "2 Ấn (kèm Vàng khởi đầu)",
          "to": "1 Ấn ngay + 1 Ấn sau 3 vòng, không còn Vàng khởi đầu"
        }
      ]
    },
    {
      "id": "live182-augment-spreadingrootsplus",
      "entityId": "augment:da_spreadingrootsplus",
      "category": "augment",
      "kind": "nerf",
      "name": "Spreading Roots+",
      "changes": [
        {
          "label": "Búa rèn (reforger)",
          "from": "Có",
          "to": "Không còn"
        }
      ]
    },
    {
      "id": "live182-augment-traitladder",
      "entityId": "augment:da_traitladder",
      "category": "augment",
      "kind": "rework",
      "name": "Trait Ladder",
      "changes": [
        {
          "label": "Giới hạn",
          "from": "Không giới hạn",
          "to": "Chỉ 1 người chơi/sảnh"
        },
        {
          "label": "Mốc 10 tộc/hệ",
          "from": "(không có)",
          "to": "18 Vàng"
        },
        {
          "label": "Mốc 11 tộc/hệ",
          "from": "(không có)",
          "to": "Trang Bị Linh Thú"
        }
      ]
    },
    {
      "id": "live182-augment-traittreeplus",
      "entityId": "augment:da_thetraittreeplus",
      "category": "augment",
      "kind": "mechanic",
      "name": "The Trait Tree+",
      "changes": [
        {
          "label": "Tương thích với Nồi Nấu Ăn",
          "from": "Có thể cùng chọn",
          "to": "Loại trừ lẫn nhau"
        }
      ]
    },
    {
      "id": "live182-augment-unrivaled",
      "entityId": "augment:da_18_rivalsaugment",
      "category": "augment",
      "kind": "nerf",
      "name": "Unrivaled",
      "note": "Áp dụng cho cả 2 bậc",
      "changes": [
        {
          "label": "Năng Lượng nhận được từ Kha'Zix cho Rengar",
          "from": "70%",
          "to": "50%"
        },
        {
          "label": "Hồi Máu nhận được từ Rengar cho Kha'Zix",
          "from": "50%",
          "to": "25%"
        }
      ]
    },
    {
      "id": "live182-wisp-combat",
      "category": "wisp",
      "kind": "buff",
      "name": "Tinh Linh Giao Tranh — giảm giá hàng loạt",
      "note": "31 Tinh Linh Giao Tranh giảm giá 1-2 vàng; Combust còn giảm Sát thương theo Máu tối đa 15%→12%; Borrowed Gear đổi cơ chế cho trang bị vào đầu giao tranh",
      "changes": [
        {
          "label": "Lá Chắn (Barrier)",
          "from": "4v",
          "to": "3v"
        },
        {
          "label": "Ngôi Sao Hàng Sau (Backrow Star)",
          "from": "3v",
          "to": "1v"
        },
        {
          "label": "Mưa Đai Lưng (Bunch-o'-Belts)",
          "from": "2v",
          "to": "1v"
        },
        {
          "label": "Nổ Cảm Tử (Combust)",
          "from": "5v",
          "to": "3v"
        },
        {
          "label": "Mưa Như Trút (Downpour)",
          "from": "3v",
          "to": "2v"
        },
        {
          "label": "Trừng Trị (Infliction)",
          "from": "6v",
          "to": "4v"
        },
        {
          "label": "Khối Chắn Cùn (Ironwood)",
          "from": "3v",
          "to": "2v"
        },
        {
          "label": "Lớn Muộn (Late Bloomer)",
          "from": "6v",
          "to": "4v"
        },
        {
          "label": "Bão Sét (Lightning Storm)",
          "from": "5v",
          "to": "3v"
        },
        {
          "label": "Sét Đánh (Lightning Strike)",
          "from": "2v",
          "to": "1v"
        },
        {
          "label": "Lửa Rừng Già (Blaze)",
          "from": "5v",
          "to": "3v"
        },
        {
          "label": "Linh Thú Cường Tráng (Fellowship)",
          "from": "4v",
          "to": "3v"
        },
        {
          "label": "Hầm Nhừ (Giant's Aura)",
          "from": "5v",
          "to": "3v"
        },
        {
          "label": "Siêu Hùng Giáng Thế (Hero's Entrance)",
          "from": "4v",
          "to": "2v"
        },
        {
          "label": "Ngôi Sao Khách Mời (Hireling)",
          "from": "5v",
          "to": "2v"
        },
        {
          "label": "Tâm Sắt (Iron Core)",
          "from": "2v",
          "to": "1v"
        },
        {
          "label": "Cuồng Nộ Sát Nhân (Killing Frenzy)",
          "from": "3v",
          "to": "2v"
        },
        {
          "label": "Ác Giả Ác Báo (Killer's Regret)",
          "from": "2v",
          "to": "1v"
        },
        {
          "label": "Bậc Thầy Thuật Sư (Mana-Rich Soil)",
          "from": "3v",
          "to": "2v"
        },
        {
          "label": "Lá Chắn Thù Hận (Petrify Shields)",
          "from": "2v",
          "to": "1v"
        },
        {
          "label": "Hạt Cây Vỏ Đá (Potted Stonebark)",
          "from": "2v/1v",
          "to": "1v/0v"
        },
        {
          "label": "Hạt Giống Hoa Sinh Mệnh (Potted Lifebloom)",
          "from": "2v/1v",
          "to": "1v/0v"
        },
        {
          "label": "Ấn Ma Mị (Phantom Emblem)",
          "from": "3v",
          "to": "2v"
        },
        {
          "label": "Ánh Sáng Hóa (Radiantize)",
          "from": "4v",
          "to": "3v"
        },
        {
          "label": "Sức Mạnh Báo Thù (Revenge)",
          "from": "3v",
          "to": "2v"
        },
        {
          "label": "Áo Choàng Cô Độc (Solitude's Cloak)",
          "from": "3v",
          "to": "2v"
        },
        {
          "label": "Đứng Một Mình (Stand Alone)",
          "from": "3v",
          "to": "2v"
        },
        {
          "label": "Siêu Chí Mạng (Supercritical)",
          "from": "3v",
          "to": "2v"
        },
        {
          "label": "Cung Thủ Ngọn Cây (Treetop Archers)",
          "from": "5v",
          "to": "3v"
        },
        {
          "label": "Động Đất (Tremors)",
          "from": "4v",
          "to": "3v"
        },
        {
          "label": "Linh Hồn Yordle (Yordle Spirit)",
          "from": "3v",
          "to": "2v"
        }
      ]
    },
    {
      "id": "live182-wisp-economy",
      "category": "wisp",
      "kind": "buff",
      "name": "Tinh Linh Kinh Tế — giảm giá",
      "note": "Móc Túi còn tăng Tỉ Lệ Vàng 15%→20%",
      "changes": [
        {
          "label": "Móc Túi (Cutpurse)",
          "from": "3v",
          "to": "2v"
        },
        {
          "label": "Thua Có Lời (Good Loss)",
          "from": "5v",
          "to": "4v"
        },
        {
          "label": "Hoàn Tất Phi Vụ (Payday)",
          "from": "4v",
          "to": "3v"
        },
        {
          "label": "Học Chậm (Slow Study)",
          "from": "4v",
          "to": "2v"
        }
      ]
    },
    {
      "id": "live182-wisp-shop",
      "category": "wisp",
      "kind": "buff",
      "name": "Tinh Linh Cửa Hàng — giảm giá, Chuột Nhắt Lan Tràn bị gỡ bỏ",
      "changes": [
        {
          "label": "Chỉ 5 Vàng (All Fives)",
          "from": "10v",
          "to": "8v"
        },
        {
          "label": "Chỉ 4 Vàng (All Fours)",
          "from": "4v",
          "to": "3v"
        },
        {
          "label": "Ngôi Làng Vùng Biên (Border Village)",
          "from": "6v/4v",
          "to": "3v/2v"
        },
        {
          "label": "Chuột Nhắt Lan Tràn (Field of Mice)",
          "from": "Có trong game",
          "to": "Đã loại bỏ hoàn toàn"
        },
        {
          "label": "Bàn Nóng (Flash Fire)",
          "from": "2v",
          "to": "1v"
        },
        {
          "label": "Chơi Đường Giữa (Middle Path)",
          "from": "6v/4v",
          "to": "4v/3v"
        },
        {
          "label": "Càng Đông Càng Vui (Roly-Polys)",
          "from": "4v",
          "to": "3v"
        },
        {
          "label": "Tổ Đội Tìm Kiếm (Search Party)",
          "from": "3v/1v",
          "to": "1v/0v"
        },
        {
          "label": "Thị Trấn Khởi Động (Starting Town)",
          "from": "3v/2v",
          "to": "2v/1v"
        }
      ]
    },
    {
      "id": "live182-wisp-other",
      "category": "wisp",
      "kind": "buff",
      "name": "Tinh Linh Khác — giảm giá",
      "changes": [
        {
          "label": "Chế Tạo Thuốc (Potioncraft)",
          "from": "3v",
          "to": "2v"
        },
        {
          "label": "Smurf (Smurfing)",
          "from": "7v/6v",
          "to": "6v/5v"
        }
      ]
    },
    {
      "id": "live182-mech-doubletrouble",
      "category": "mechanic",
      "kind": "mechanic",
      "name": "Double Trouble",
      "changes": [
        {
          "label": "Trạng thái",
          "from": "Bị vô hiệu hóa",
          "to": "Đã bật lại (re-enabled)"
        }
      ]
    },
    {
      "id": "live182-mech-hullcrusher",
      "category": "mechanic",
      "kind": "mechanic",
      "name": "Hullcrusher (Tạo Tác)",
      "changes": [
        {
          "label": "Máu khi tướng triệu hồi trong combat",
          "from": "Không giữ (bị vô hiệu hóa)",
          "to": "Giữ nguyên (đã bật lại)"
        }
      ]
    }
  ]
};

export default report;
