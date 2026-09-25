// Sinh bởi MetaPlaybook/18.3b/gen_meta_comps.py từ số liệu MetaTFT — không sửa tay.
// Mỗi đội có số liệu riêng cho từng mức rank; xếp loại/nhãn đã tính sẵn theo ngưỡng trong script.

export type MetaCompDamage = 'AP' | 'AD';
/** meta = mạnh, số liệu xác nhận · predicted = dự đoán mạnh · viable = chơi được · avoid = tránh */
export type MetaCompVerdict = 'meta' | 'predicted' | 'viable' | 'avoid';
export type MetaCompTrend = 'up' | 'down' | 'flat';
/** hold = Giữ điểm (Top 4 ≥ 54%) · ceiling = Ăn top 1 (Top 1 ≥ 18%) */
export type MetaCompShape = 'hold' | 'ceiling';
export type MetaCompRankKey = 'emerald' | 'diamond' | 'master';

export type MetaCompChampion = { name: string; cost: number; image: string };
export type MetaCompItem = { name: string; icon: string };

export type MetaCompRankStats = {
  n: number;
  avg: number;
  top4: number;
  win: number;
  /** % đội hình ở mức rank này chơi đội đó. */
  pick: number;
  /** avg cùng mức rank ở bản vá trước. */
  prevAvg: number;
  verdict: MetaCompVerdict;
  /** So avg bản trước: up = tốt lên ≥ 0,05 hạng, down = tệ đi ≥ 0,05 hạng. */
  trend: MetaCompTrend;
  /** Tỉ lệ chọn ≥ 7% — dễ bị tranh tướng. */
  contested: boolean;
  shapes: MetaCompShape[];
};

export type MetaComp = {
  id: string;
  name: string;
  damage: MetaCompDamage;
  /** Giá vàng của carry chính — dùng làm hàng của ma trận. */
  cost: number;
  playstyle: string;
  carries: (MetaCompChampion & { items: MetaCompItem[] })[];
  units: MetaCompChampion[];
  ranks: Record<MetaCompRankKey, MetaCompRankStats>;
  note: string;
};

export const metaCompsSnapshot = {
  patch: '18.3b',
  previousPatch: '18.3',
  updatedVi: '25/09/2026',
  source: 'MetaTFT',
  defaultRank: 'emerald' as MetaCompRankKey,
  ranks: [{"key": "emerald", "label": "Lục Bảo+", "sampleSize": 462360}, {"key": "diamond", "label": "Kim Cương+", "sampleSize": 174864}, {"key": "master", "label": "Cao Thủ+", "sampleSize": 58832}] as { key: MetaCompRankKey; label: string; sampleSize: number }[],
  thresholds: { contestedPick: 7, holdTop4: 54, ceilingWin: 18 },
};

export const metaComps: MetaComp[] = [
  {
    "id": "veigar-thuat-su",
    "name": "Veigar Thuật Sư",
    "damage": "AP",
    "cost": 1,
    "playstyle": "Reroll cấp 5",
    "carries": [
      {
        "name": "Veigar",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_veigar.jpg",
        "items": [
          {
            "name": "Ấn Thực Vật",
            "icon": "/set18/assets/items/full/da_18_emblemflorafatalis.png"
          },
          {
            "name": "Bùa Xanh",
            "icon": "/set18/assets/items/full/da_bluebuff.png"
          },
          {
            "name": "Găng Bảo Thạch",
            "icon": "/set18/assets/items/full/da_jeweledgauntlet.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Ornn",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_ornn.png"
      },
      {
        "name": "Rek'Sai",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_reksai.jpg"
      },
      {
        "name": "Veigar",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_veigar.jpg"
      },
      {
        "name": "Alistar",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_alistar.jpg"
      },
      {
        "name": "LeBlanc",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_leblanc.jpg"
      },
      {
        "name": "Cassiopeia",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_cassiopeia.jpg"
      },
      {
        "name": "Fiddlesticks",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_fiddlesticks.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 25265,
        "avg": 4.21,
        "top4": 55.8,
        "win": 15.3,
        "pick": 5.5,
        "prevAvg": 4.16,
        "verdict": "meta",
        "trend": "down",
        "contested": false,
        "shapes": [
          "hold"
        ]
      },
      "diamond": {
        "n": 10286,
        "avg": 4.16,
        "top4": 56.7,
        "win": 16.3,
        "pick": 5.9,
        "prevAvg": 4.13,
        "verdict": "meta",
        "trend": "flat",
        "contested": false,
        "shapes": [
          "hold"
        ]
      },
      "master": {
        "n": 3583,
        "avg": 4.19,
        "top4": 55.6,
        "win": 16.9,
        "pick": 6.1,
        "prevAvg": 4.07,
        "verdict": "meta",
        "trend": "down",
        "contested": false,
        "shapes": [
          "hold"
        ]
      }
    },
    "note": "Ổn định ở mọi rank. Không bị đụng ở 18.3b."
  },
  {
    "id": "elise-tien-hac-am",
    "name": "Elise Tiên Hắc Ám",
    "damage": "AP",
    "cost": 2,
    "playstyle": "Reroll cấp 6",
    "carries": [
      {
        "name": "Elise",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_elise.png",
        "items": [
          {
            "name": "Thú Tượng Thạch Giáp",
            "icon": "/set18/assets/items/full/da_gargoylestoneplate.png"
          },
          {
            "name": "Cuồng Đao Guinsoo",
            "icon": "/set18/assets/items/full/da_guinsoosrageblade.png"
          },
          {
            "name": "Quyền Năng Khổng Lồ",
            "icon": "/set18/assets/items/full/da_titansresolve.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Elise",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_elise.png"
      },
      {
        "name": "Cassiopeia",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_cassiopeia.jpg"
      },
      {
        "name": "Diana",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_diana.jpg"
      },
      {
        "name": "Hecarim",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_hecarim.jpg"
      },
      {
        "name": "Kog'Maw",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_kogmaw.jpg"
      },
      {
        "name": "Ancient Sentinel",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ancientsentinel.jpg"
      },
      {
        "name": "Morgana",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_morgana.jpg"
      },
      {
        "name": "Alune",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_alune.png"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 10530,
        "avg": 5.48,
        "top4": 31.2,
        "win": 9.3,
        "pick": 2.3,
        "prevAvg": 4.98,
        "verdict": "avoid",
        "trend": "down",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 2556,
        "avg": 5.46,
        "top4": 32.6,
        "win": 10.3,
        "pick": 1.5,
        "prevAvg": 4.69,
        "verdict": "avoid",
        "trend": "down",
        "contested": false,
        "shapes": []
      },
      "master": {
        "n": 553,
        "avg": 5.11,
        "top4": 40.0,
        "win": 12.7,
        "pick": 0.9,
        "prevAvg": 4.46,
        "verdict": "avoid",
        "trend": "down",
        "contested": false,
        "shapes": []
      }
    },
    "note": "Nâng Cấp Tà Thuật của Tiên Hắc Ám bị tắt ở 18.3b, đội mất nguồn sức mạnh chính."
  },
  {
    "id": "khazix-hecarim",
    "name": "Kha'Zix Hecarim",
    "damage": "AP",
    "cost": 3,
    "playstyle": "Reroll cấp 7",
    "carries": [
      {
        "name": "Kha'Zix",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_khazix.png",
        "items": [
          {
            "name": "Áo Choàng Bóng Tối",
            "icon": "/set18/assets/items/full/da_edgeofnight.png"
          },
          {
            "name": "Bàn Tay Công Lý",
            "icon": "/set18/assets/items/full/da_handofjustice.png"
          },
          {
            "name": "Mũ Phù Thủy Rabadon",
            "icon": "/set18/assets/items/full/da_rabadonsdeathcap.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Ornn",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_ornn.png"
      },
      {
        "name": "Diana",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_diana.jpg"
      },
      {
        "name": "Fiddlesticks",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_fiddlesticks.jpg"
      },
      {
        "name": "Hecarim",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_hecarim.jpg"
      },
      {
        "name": "Kha'Zix",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_khazix.png"
      },
      {
        "name": "Ezreal",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ezreal.jpg"
      },
      {
        "name": "Soraka",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_soraka.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 15521,
        "avg": 4.43,
        "top4": 51.5,
        "win": 12.6,
        "pick": 3.4,
        "prevAvg": 4.27,
        "verdict": "viable",
        "trend": "down",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 5727,
        "avg": 4.4,
        "top4": 52.1,
        "win": 13.5,
        "pick": 3.3,
        "prevAvg": 4.2,
        "verdict": "meta",
        "trend": "down",
        "contested": false,
        "shapes": []
      },
      "master": {
        "n": 1806,
        "avg": 4.3,
        "top4": 54.2,
        "win": 15.0,
        "pick": 3.1,
        "prevAvg": 4.12,
        "verdict": "meta",
        "trend": "down",
        "contested": false,
        "shapes": [
          "hold"
        ]
      }
    },
    "note": "Kha'Zix bị giảm sát thương ở 18.3b. Vẫn mạnh ở Cao Thủ+, nhưng ở Lục Bảo – Kim Cương chỉ còn mức chơi được."
  },
  {
    "id": "cassiopeia-ve-quan",
    "name": "Cassiopeia Vệ Quân",
    "damage": "AP",
    "cost": 3,
    "playstyle": "Reroll cấp 7",
    "carries": [
      {
        "name": "Cassiopeia",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_cassiopeia.jpg",
        "items": [
          {
            "name": "Quyền Trượng Thiên Thần",
            "icon": "/set18/assets/items/full/da_archangelsstaff.png"
          },
          {
            "name": "Quyền Trượng Thiên Thần",
            "icon": "/set18/assets/items/full/da_archangelsstaff.png"
          },
          {
            "name": "Kiếm Súng Hextech",
            "icon": "/set18/assets/items/full/da_hextechgunblade.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Leona",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_leona.jpg"
      },
      {
        "name": "Ornn",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_ornn.png"
      },
      {
        "name": "Shen",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_shen.jpg"
      },
      {
        "name": "Cassiopeia",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_cassiopeia.jpg"
      },
      {
        "name": "Fiddlesticks",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_fiddlesticks.jpg"
      },
      {
        "name": "Rammus",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_rammus.jpg"
      },
      {
        "name": "Lillia",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_lillia.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 10007,
        "avg": 4.39,
        "top4": 52.2,
        "win": 9.5,
        "pick": 2.2,
        "prevAvg": 4.49,
        "verdict": "meta",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 3518,
        "avg": 4.42,
        "top4": 51.0,
        "win": 10.1,
        "pick": 2.0,
        "prevAvg": 4.55,
        "verdict": "viable",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "master": {
        "n": 1086,
        "avg": 4.44,
        "top4": 50.0,
        "win": 10.3,
        "pick": 1.8,
        "prevAvg": 4.6,
        "verdict": "viable",
        "trend": "up",
        "contested": false,
        "shapes": []
      }
    },
    "note": "Mạnh lên nhờ bớt người chơi Kha'Zix. Chung Ornn, Fiddlesticks và đồ AP với Kha'Zix."
  },
  {
    "id": "azir-dao-phu",
    "name": "Azir Đao Phủ",
    "damage": "AP",
    "cost": 3,
    "playstyle": "Reroll cấp 7",
    "carries": [
      {
        "name": "Azir",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_azir.jpg",
        "items": [
          {
            "name": "Kiếm Súng Hextech",
            "icon": "/set18/assets/items/full/da_hextechgunblade.png"
          },
          {
            "name": "Mũ Phù Thủy Rabadon",
            "icon": "/set18/assets/items/full/da_rabadonsdeathcap.png"
          },
          {
            "name": "Mũ Phù Thủy Rabadon",
            "icon": "/set18/assets/items/full/da_rabadonsdeathcap.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Rek'Sai",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_reksai.jpg"
      },
      {
        "name": "Yorick",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_yorick.jpg"
      },
      {
        "name": "Yunara",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_yunara.jpg"
      },
      {
        "name": "Azir",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_azir.jpg"
      },
      {
        "name": "Kha'Zix",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_khazix.png"
      },
      {
        "name": "Vi",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_vi.png"
      },
      {
        "name": "Sett",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_sett.png"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 18082,
        "avg": 4.58,
        "top4": 49.2,
        "win": 9.9,
        "pick": 3.9,
        "prevAvg": 4.49,
        "verdict": "viable",
        "trend": "down",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 6471,
        "avg": 4.73,
        "top4": 46.2,
        "win": 9.3,
        "pick": 3.7,
        "prevAvg": 4.56,
        "verdict": "avoid",
        "trend": "down",
        "contested": false,
        "shapes": []
      },
      "master": {
        "n": 1981,
        "avg": 4.8,
        "top4": 44.6,
        "win": 9.5,
        "pick": 3.4,
        "prevAvg": 4.62,
        "verdict": "avoid",
        "trend": "down",
        "contested": false,
        "shapes": []
      }
    },
    "note": "Dính cả nerf Kha'Zix lẫn Gai Đen, rơi khỏi nhóm mạnh."
  },
  {
    "id": "zyra-dung-si",
    "name": "Zyra Dũng Sĩ",
    "damage": "AP",
    "cost": 4,
    "playstyle": "Fast 8",
    "carries": [
      {
        "name": "Zyra",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_zyra.jpg",
        "items": [
          {
            "name": "Quyền Trượng Thiên Thần",
            "icon": "/set18/assets/items/full/da_archangelsstaff.png"
          },
          {
            "name": "Quyền Trượng Thiên Thần",
            "icon": "/set18/assets/items/full/da_archangelsstaff.png"
          },
          {
            "name": "Kiếm Súng Hextech",
            "icon": "/set18/assets/items/full/da_hextechgunblade.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Yorick",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_yorick.jpg"
      },
      {
        "name": "Scuttlecrab",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_scuttlecrab.jpg"
      },
      {
        "name": "Sejuani",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_sejuani.png"
      },
      {
        "name": "Vi",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_vi.png"
      },
      {
        "name": "Amumu",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_amumu.jpg"
      },
      {
        "name": "Sivir",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_sivir.jpg"
      },
      {
        "name": "Zyra",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_zyra.jpg"
      },
      {
        "name": "Ashe",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_ashe.jpg"
      },
      {
        "name": "Maokai",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_maokai.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 13941,
        "avg": 4.33,
        "top4": 52.8,
        "win": 14.1,
        "pick": 3.0,
        "prevAvg": 4.32,
        "verdict": "meta",
        "trend": "flat",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 5725,
        "avg": 4.33,
        "top4": 52.9,
        "win": 13.4,
        "pick": 3.3,
        "prevAvg": 4.34,
        "verdict": "meta",
        "trend": "flat",
        "contested": false,
        "shapes": []
      },
      "master": {
        "n": 2029,
        "avg": 4.29,
        "top4": 53.4,
        "win": 13.7,
        "pick": 3.4,
        "prevAvg": 4.35,
        "verdict": "meta",
        "trend": "up",
        "contested": false,
        "shapes": []
      }
    },
    "note": "Lên cấp 9 có thể đổi sang Ashe cùng khung Dũng Sĩ."
  },
  {
    "id": "ahri-thuat-si",
    "name": "Ahri Thuật Sĩ",
    "damage": "AP",
    "cost": 4,
    "playstyle": "Fast 8",
    "carries": [
      {
        "name": "Ahri",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ahri.jpg",
        "items": [
          {
            "name": "Ấn Thuật Sĩ",
            "icon": "/set18/assets/items/full/da_18_embleminvoker.png"
          },
          {
            "name": "Găng Bảo Thạch",
            "icon": "/set18/assets/items/full/da_jeweledgauntlet.png"
          },
          {
            "name": "Mũ Phù Thủy Rabadon",
            "icon": "/set18/assets/items/full/da_rabadonsdeathcap.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Karma",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_karma.jpg"
      },
      {
        "name": "Pebbles",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_pebbles.jpg"
      },
      {
        "name": "Krug",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_krug.jpg"
      },
      {
        "name": "Ahri",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ahri.jpg"
      },
      {
        "name": "Ancient Sentinel",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ancientsentinel.jpg"
      },
      {
        "name": "Morgana",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_morgana.jpg"
      },
      {
        "name": "Sett",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_sett.png"
      },
      {
        "name": "Taric",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_taric.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 29473,
        "avg": 4.33,
        "top4": 53.9,
        "win": 11.3,
        "pick": 6.4,
        "prevAvg": 4.38,
        "verdict": "meta",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 13759,
        "avg": 4.37,
        "top4": 53.5,
        "win": 10.9,
        "pick": 7.9,
        "prevAvg": 4.42,
        "verdict": "meta",
        "trend": "up",
        "contested": true,
        "shapes": []
      },
      "master": {
        "n": 5131,
        "avg": 4.42,
        "top4": 52.6,
        "win": 10.3,
        "pick": 8.7,
        "prevAvg": 4.48,
        "verdict": "viable",
        "trend": "up",
        "contested": true,
        "shapes": []
      }
    },
    "note": "Ổn định, dùng chung khung Thuật Sĩ với Morgana + Alune."
  },
  {
    "id": "malphite-dao-phu",
    "name": "Malphite Đao Phủ",
    "damage": "AP",
    "cost": 4,
    "playstyle": "Fast 8",
    "carries": [
      {
        "name": "Zyra",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_zyra.jpg",
        "items": [
          {
            "name": "Ấn Đao Phủ",
            "icon": "/set18/assets/items/full/da_18_emblemexecutioner.png"
          },
          {
            "name": "Ngọn Giáo Shojin",
            "icon": "/set18/assets/items/full/da_spearofshojin.png"
          },
          {
            "name": "Trượng Hư Vô",
            "icon": "/set18/assets/items/full/da_voidstaff.png"
          }
        ]
      },
      {
        "name": "Malphite",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_malphite.jpg",
        "items": [
          {
            "name": "Vương Miện Hoàng Gia",
            "icon": "/set18/assets/items/full/da_crownguard.png"
          },
          {
            "name": "Thú Tượng Thạch Giáp",
            "icon": "/set18/assets/items/full/da_gargoylestoneplate.png"
          },
          {
            "name": "Giáp Máu Warmog",
            "icon": "/set18/assets/items/full/da_warmogsarmor.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Yorick",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_yorick.jpg"
      },
      {
        "name": "Azir",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_azir.jpg"
      },
      {
        "name": "Fiddlesticks",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_fiddlesticks.jpg"
      },
      {
        "name": "Amumu",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_amumu.jpg"
      },
      {
        "name": "Malphite",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_malphite.jpg"
      },
      {
        "name": "Soraka",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_soraka.jpg"
      },
      {
        "name": "Zyra",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_zyra.jpg"
      },
      {
        "name": "Kennen",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_kennen.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 29285,
        "avg": 4.37,
        "top4": 53.1,
        "win": 10.4,
        "pick": 6.3,
        "prevAvg": 4.46,
        "verdict": "meta",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 13655,
        "avg": 4.41,
        "top4": 52.3,
        "win": 10.2,
        "pick": 7.8,
        "prevAvg": 4.52,
        "verdict": "viable",
        "trend": "up",
        "contested": true,
        "shapes": []
      },
      "master": {
        "n": 5335,
        "avg": 4.45,
        "top4": 51.3,
        "win": 9.8,
        "pick": 9.1,
        "prevAvg": 4.6,
        "verdict": "viable",
        "trend": "up",
        "contested": true,
        "shapes": []
      }
    },
    "note": "Mạnh lên ở 18.3b. Zyra cầm Ấn Đao Phủ gây sát thương, Malphite chống chịu."
  },
  {
    "id": "morgana-alune-thuat-si",
    "name": "Morgana + Alune Thuật Sĩ",
    "damage": "AP",
    "cost": 5,
    "playstyle": "Fast 9",
    "carries": [
      {
        "name": "Alune",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_alune.png",
        "items": [
          {
            "name": "Găng Bảo Thạch",
            "icon": "/set18/assets/items/full/da_jeweledgauntlet.png"
          },
          {
            "name": "Nanh Nashor",
            "icon": "/set18/assets/items/full/da_nashorstooth.png"
          },
          {
            "name": "Ngọn Giáo Shojin",
            "icon": "/set18/assets/items/full/da_spearofshojin.png"
          }
        ]
      },
      {
        "name": "Morgana",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_morgana.jpg",
        "items": [
          {
            "name": "Áo Choàng Bóng Tối",
            "icon": "/set18/assets/items/full/da_edgeofnight.png"
          },
          {
            "name": "Quỷ Thư Morello",
            "icon": "/set18/assets/items/full/da_morellonomicon.png"
          },
          {
            "name": "Trượng Hư Vô",
            "icon": "/set18/assets/items/full/da_voidstaff.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Elise",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_elise.png"
      },
      {
        "name": "Cassiopeia",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_cassiopeia.jpg"
      },
      {
        "name": "Diana",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_diana.jpg"
      },
      {
        "name": "Ancient Sentinel",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ancientsentinel.jpg"
      },
      {
        "name": "Morgana",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_morgana.jpg"
      },
      {
        "name": "Alune",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_alune.png"
      },
      {
        "name": "Taric",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_taric.jpg"
      },
      {
        "name": "The Elder Dragon",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_elderdragon.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 8574,
        "avg": 4.09,
        "top4": 56.5,
        "win": 20.4,
        "pick": 1.9,
        "prevAvg": 4.22,
        "verdict": "meta",
        "trend": "up",
        "contested": false,
        "shapes": [
          "hold",
          "ceiling"
        ]
      },
      "diamond": {
        "n": 2314,
        "avg": 4.23,
        "top4": 54.0,
        "win": 18.9,
        "pick": 1.3,
        "prevAvg": 4.33,
        "verdict": "meta",
        "trend": "up",
        "contested": false,
        "shapes": [
          "hold",
          "ceiling"
        ]
      },
      "master": {
        "n": 504,
        "avg": 4.36,
        "top4": 51.2,
        "win": 20.4,
        "pick": 0.9,
        "prevAvg": 4.41,
        "verdict": "predicted",
        "trend": "up",
        "contested": false,
        "shapes": [
          "ceiling"
        ]
      }
    },
    "note": "Đội tốt nhất ở Lục Bảo+. Ít người chơi ở Cao Thủ nên mẫu ở đó nhỏ."
  },
  {
    "id": "warwick-sat-thu",
    "name": "Warwick + Sói",
    "damage": "AD",
    "cost": 2,
    "playstyle": "Reroll cấp 6",
    "carries": [
      {
        "name": "Warwick",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_warwick.jpg",
        "items": [
          {
            "name": "Ngọn Giáo Shojin",
            "icon": "/set18/assets/items/full/da_spearofshojin.png"
          },
          {
            "name": "Móng Vuốt Sterak",
            "icon": "/set18/assets/items/full/da_steraksgage.png"
          },
          {
            "name": "Quyền Năng Khổng Lồ",
            "icon": "/set18/assets/items/full/da_titansresolve.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Rek'Sai",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_reksai.jpg"
      },
      {
        "name": "Murkwolf",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_murkwolf.png"
      },
      {
        "name": "Warwick",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_warwick.jpg"
      },
      {
        "name": "Azir",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_azir.jpg"
      },
      {
        "name": "Diana",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_diana.jpg"
      },
      {
        "name": "Krug",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_krug.jpg"
      },
      {
        "name": "Brambleback",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_brambleback.png"
      },
      {
        "name": "Malphite",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_malphite.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 7168,
        "avg": 4.53,
        "top4": 51.8,
        "win": 5.1,
        "pick": 1.6,
        "prevAvg": 4.63,
        "verdict": "viable",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 2383,
        "avg": 4.58,
        "top4": 50.7,
        "win": 4.3,
        "pick": 1.4,
        "prevAvg": 4.68,
        "verdict": "viable",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "master": {
        "n": 702,
        "avg": 4.62,
        "top4": 50.3,
        "win": 4.7,
        "pick": 1.2,
        "prevAvg": 4.72,
        "verdict": "viable",
        "trend": "up",
        "contested": false,
        "shapes": []
      }
    },
    "note": "Đội 2 vàng khá nhất hiện tại, nhưng chưa đủ mạnh để leo rank ổn định."
  },
  {
    "id": "rengar-hoa-linh",
    "name": "Rengar Hoa Linh",
    "damage": "AD",
    "cost": 3,
    "playstyle": "Reroll cấp 7",
    "carries": [
      {
        "name": "Rengar",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_rengar.jpg",
        "items": [
          {
            "name": "Áo Choàng Bóng Tối",
            "icon": "/set18/assets/items/full/da_edgeofnight.png"
          },
          {
            "name": "Cuồng Đao Guinsoo",
            "icon": "/set18/assets/items/full/da_guinsoosrageblade.png"
          },
          {
            "name": "Quyền Năng Khổng Lồ",
            "icon": "/set18/assets/items/full/da_titansresolve.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Yorick",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_yorick.jpg"
      },
      {
        "name": "Krug",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_krug.jpg"
      },
      {
        "name": "Master Yi",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_masteryi.jpg"
      },
      {
        "name": "Rengar",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_rengar.jpg"
      },
      {
        "name": "Vi",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_vi.png"
      },
      {
        "name": "Nidalee",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_nidalee.png"
      },
      {
        "name": "Sett",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_sett.png"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 4728,
        "avg": 4.38,
        "top4": 52.7,
        "win": 10.9,
        "pick": 1.0,
        "prevAvg": 4.43,
        "verdict": "meta",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 1615,
        "avg": 4.36,
        "top4": 52.6,
        "win": 10.8,
        "pick": 0.9,
        "prevAvg": 4.42,
        "verdict": "meta",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "master": {
        "n": 513,
        "avg": 4.41,
        "top4": 50.5,
        "win": 10.9,
        "pick": 0.9,
        "prevAvg": 4.47,
        "verdict": "predicted",
        "trend": "up",
        "contested": false,
        "shapes": []
      }
    },
    "note": "Đội AD reroll tốt nhất, ổn định ở mọi rank. Đổi được sang Master Yi cùng khung."
  },
  {
    "id": "master-yi-thich-ung",
    "name": "Master Yi Thích Ứng",
    "damage": "AD",
    "cost": 3,
    "playstyle": "Reroll cấp 7",
    "carries": [
      {
        "name": "Master Yi",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_masteryi.jpg",
        "items": [
          {
            "name": "Ấn Đấu Sĩ",
            "icon": "/set18/assets/items/full/da_18_emblembrawler.png"
          },
          {
            "name": "Áo Choàng Bóng Tối",
            "icon": "/set18/assets/items/full/da_edgeofnight.png"
          },
          {
            "name": "Cuồng Đao Guinsoo",
            "icon": "/set18/assets/items/full/da_guinsoosrageblade.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Yorick",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_yorick.jpg"
      },
      {
        "name": "Kog'Maw",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_kogmaw.jpg"
      },
      {
        "name": "Krug",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_krug.jpg"
      },
      {
        "name": "Master Yi",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_masteryi.jpg"
      },
      {
        "name": "Vi",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_vi.png"
      },
      {
        "name": "Nidalee",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_nidalee.png"
      },
      {
        "name": "Sett",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_sett.png"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 3015,
        "avg": 4.39,
        "top4": 53.9,
        "win": 7.2,
        "pick": 0.7,
        "prevAvg": 4.42,
        "verdict": "meta",
        "trend": "flat",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 1111,
        "avg": 4.38,
        "top4": 54.3,
        "win": 8.6,
        "pick": 0.6,
        "prevAvg": 4.42,
        "verdict": "meta",
        "trend": "flat",
        "contested": false,
        "shapes": [
          "hold"
        ]
      },
      "master": {
        "n": 352,
        "avg": 4.34,
        "top4": 53.1,
        "win": 10.2,
        "pick": 0.6,
        "prevAvg": 4.42,
        "verdict": "predicted",
        "trend": "up",
        "contested": false,
        "shapes": []
      }
    },
    "note": "Cùng khung với Rengar (Sett, Yorick, Krug, Nidalee, Vi)."
  },
  {
    "id": "aphelios-mat-trang",
    "name": "Aphelios Mặt Trăng",
    "damage": "AD",
    "cost": 4,
    "playstyle": "Fast 8",
    "carries": [
      {
        "name": "Aphelios",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_aphelios.jpg",
        "items": [
          {
            "name": "Kiếm Tử Thần",
            "icon": "/set18/assets/items/full/da_deathblade.png"
          },
          {
            "name": "Cuồng Đao Guinsoo",
            "icon": "/set18/assets/items/full/da_guinsoosrageblade.png"
          },
          {
            "name": "Thịnh Nộ Thủy Quái",
            "icon": "/set18/assets/items/full/da_krakensfury.png"
          }
        ]
      },
      {
        "name": "Nidalee",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_nidalee.png",
        "items": [
          {
            "name": "Vô Cực Kiếm",
            "icon": "/set18/assets/items/full/da_infinityedge.png"
          },
          {
            "name": "Ngọn Giáo Shojin",
            "icon": "/set18/assets/items/full/da_spearofshojin.png"
          },
          {
            "name": "Móng Vuốt Sterak",
            "icon": "/set18/assets/items/full/da_steraksgage.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Varus",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_varus.jpg"
      },
      {
        "name": "Diana",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_diana.jpg"
      },
      {
        "name": "Kog'Maw",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_kogmaw.jpg"
      },
      {
        "name": "Vi",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_vi.png"
      },
      {
        "name": "Amumu",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_amumu.jpg"
      },
      {
        "name": "Ancient Sentinel",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ancientsentinel.jpg"
      },
      {
        "name": "Aphelios",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_aphelios.jpg"
      },
      {
        "name": "Nidalee",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_nidalee.png"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 35164,
        "avg": 4.2,
        "top4": 57.9,
        "win": 8.1,
        "pick": 7.6,
        "prevAvg": 4.26,
        "verdict": "meta",
        "trend": "up",
        "contested": true,
        "shapes": [
          "hold"
        ]
      },
      "diamond": {
        "n": 14956,
        "avg": 4.31,
        "top4": 55.8,
        "win": 7.3,
        "pick": 8.6,
        "prevAvg": 4.36,
        "verdict": "meta",
        "trend": "up",
        "contested": true,
        "shapes": [
          "hold"
        ]
      },
      "master": {
        "n": 5169,
        "avg": 4.39,
        "top4": 53.7,
        "win": 7.3,
        "pick": 8.8,
        "prevAvg": 4.44,
        "verdict": "meta",
        "trend": "up",
        "contested": true,
        "shapes": []
      }
    },
    "note": "Giữ top 4 rất tốt, ít khi top 1."
  },
  {
    "id": "aphelios-lien-kich",
    "name": "Aphelios Liên Kích",
    "damage": "AD",
    "cost": 4,
    "playstyle": "Fast 8",
    "carries": [
      {
        "name": "Aphelios",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_aphelios.jpg",
        "items": [
          {
            "name": "Vô Cực Kiếm",
            "icon": "/set18/assets/items/full/da_infinityedge.png"
          },
          {
            "name": "Thịnh Nộ Thủy Quái",
            "icon": "/set18/assets/items/full/da_krakensfury.png"
          },
          {
            "name": "Chùy Đoản Côn",
            "icon": "/set18/assets/items/full/da_strikersflail.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Rakan",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_rakan.jpg"
      },
      {
        "name": "Varus",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_varus.jpg"
      },
      {
        "name": "Xayah",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_xayah.jpg"
      },
      {
        "name": "Raptor",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_raptor.jpg"
      },
      {
        "name": "Amumu",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_amumu.jpg"
      },
      {
        "name": "Ancient Sentinel",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ancientsentinel.jpg"
      },
      {
        "name": "Aphelios",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_aphelios.jpg"
      },
      {
        "name": "Brambleback",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_brambleback.png"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 3832,
        "avg": 4.3,
        "top4": 55.0,
        "win": 9.2,
        "pick": 0.8,
        "prevAvg": 4.4,
        "verdict": "meta",
        "trend": "up",
        "contested": false,
        "shapes": [
          "hold"
        ]
      },
      "diamond": {
        "n": 1892,
        "avg": 4.36,
        "top4": 53.5,
        "win": 8.5,
        "pick": 1.1,
        "prevAvg": 4.44,
        "verdict": "meta",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "master": {
        "n": 750,
        "avg": 4.44,
        "top4": 51.6,
        "win": 8.3,
        "pick": 1.3,
        "prevAvg": 4.51,
        "verdict": "predicted",
        "trend": "up",
        "contested": false,
        "shapes": []
      }
    },
    "note": "Biến thể của Aphelios, ít người chơi hơn bản Mặt Trăng."
  },
  {
    "id": "brambleback-sat-thu",
    "name": "Brambleback Tàn Phá",
    "damage": "AD",
    "cost": 4,
    "playstyle": "Cấp 8",
    "carries": [
      {
        "name": "Brambleback",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_brambleback.png",
        "items": [
          {
            "name": "Áo Choàng Bóng Tối",
            "icon": "/set18/assets/items/full/da_edgeofnight.png"
          },
          {
            "name": "Bàn Tay Công Lý",
            "icon": "/set18/assets/items/full/da_handofjustice.png"
          },
          {
            "name": "Áo Choàng Thủy Ngân",
            "icon": "/set18/assets/items/full/da_quicksilver.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Akali",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_akali.jpg"
      },
      {
        "name": "Murkwolf",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_murkwolf.png"
      },
      {
        "name": "Warwick",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_warwick.jpg"
      },
      {
        "name": "Diana",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_diana.jpg"
      },
      {
        "name": "Ancient Sentinel",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ancientsentinel.jpg"
      },
      {
        "name": "Brambleback",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_brambleback.png"
      },
      {
        "name": "Malphite",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_malphite.jpg"
      },
      {
        "name": "Nidalee",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_nidalee.png"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 535,
        "avg": 4.58,
        "top4": 48.2,
        "win": 6.7,
        "pick": 0.1,
        "prevAvg": 4.66,
        "verdict": "predicted",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 160,
        "avg": 4.41,
        "top4": 50.6,
        "win": 9.4,
        "pick": 0.1,
        "prevAvg": 4.49,
        "verdict": "predicted",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "master": {
        "n": 58,
        "avg": 4.26,
        "top4": 51.7,
        "win": 10.3,
        "pick": 0.1,
        "prevAvg": 4.57,
        "verdict": "predicted",
        "trend": "up",
        "contested": false,
        "shapes": []
      }
    },
    "note": "Brambleback được buff tốc độ tung chiêu ở 18.3b. Số trận còn rất ít, chỉ nên thử."
  },
  {
    "id": "ezreal-dao-phu",
    "name": "Ezreal Đao Phủ",
    "damage": "AD",
    "cost": 4,
    "playstyle": "Fast 8",
    "carries": [
      {
        "name": "Ezreal",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ezreal.jpg",
        "items": [
          {
            "name": "Kiếm Tử Thần",
            "icon": "/set18/assets/items/full/da_deathblade.png"
          },
          {
            "name": "Cung Xanh",
            "icon": "/set18/assets/items/full/da_lastwhisper.png"
          },
          {
            "name": "Ngọn Giáo Shojin",
            "icon": "/set18/assets/items/full/da_spearofshojin.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Ornn",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_ornn.png"
      },
      {
        "name": "Alistar",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_alistar.jpg"
      },
      {
        "name": "Yunara",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_yunara.jpg"
      },
      {
        "name": "Fiddlesticks",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_fiddlesticks.jpg"
      },
      {
        "name": "Ahri",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ahri.jpg"
      },
      {
        "name": "Ezreal",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ezreal.jpg"
      },
      {
        "name": "Sett",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_sett.png"
      },
      {
        "name": "Soraka",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_soraka.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 5339,
        "avg": 4.42,
        "top4": 52.4,
        "win": 9.2,
        "pick": 1.2,
        "prevAvg": 4.45,
        "verdict": "viable",
        "trend": "flat",
        "contested": false,
        "shapes": []
      },
      "diamond": {
        "n": 2322,
        "avg": 4.48,
        "top4": 51.2,
        "win": 8.4,
        "pick": 1.3,
        "prevAvg": 4.54,
        "verdict": "viable",
        "trend": "up",
        "contested": false,
        "shapes": []
      },
      "master": {
        "n": 894,
        "avg": 4.54,
        "top4": 50.7,
        "win": 8.4,
        "pick": 1.5,
        "prevAvg": 4.63,
        "verdict": "viable",
        "trend": "up",
        "contested": false,
        "shapes": []
      }
    },
    "note": "Mạnh lên ở 18.3b."
  },
  {
    "id": "ashe-dung-si",
    "name": "Ashe Dũng Sĩ",
    "damage": "AD",
    "cost": 5,
    "playstyle": "Fast 9",
    "carries": [
      {
        "name": "Ashe",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_ashe.jpg",
        "items": [
          {
            "name": "Cung Xanh",
            "icon": "/set18/assets/items/full/da_lastwhisper.png"
          },
          {
            "name": "Bùa Đỏ",
            "icon": "/set18/assets/items/full/da_redbuff.png"
          },
          {
            "name": "Ngọn Giáo Shojin",
            "icon": "/set18/assets/items/full/da_spearofshojin.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Rakan",
        "cost": 1,
        "image": "/set18/assets/champions/full/tft18_rakan.jpg"
      },
      {
        "name": "Vi",
        "cost": 3,
        "image": "/set18/assets/champions/full/tft18_vi.png"
      },
      {
        "name": "Amumu",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_amumu.jpg"
      },
      {
        "name": "Sivir",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_sivir.jpg"
      },
      {
        "name": "Ashe",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_ashe.jpg"
      },
      {
        "name": "Ivern",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_ivern.jpg"
      },
      {
        "name": "Kennen",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_kennen.jpg"
      },
      {
        "name": "Maokai",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_maokai.jpg"
      },
      {
        "name": "Taric",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_taric.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 21041,
        "avg": 4.35,
        "top4": 50.9,
        "win": 19.9,
        "pick": 4.6,
        "prevAvg": 4.3,
        "verdict": "meta",
        "trend": "down",
        "contested": false,
        "shapes": [
          "ceiling"
        ]
      },
      "diamond": {
        "n": 7344,
        "avg": 4.38,
        "top4": 50.2,
        "win": 19.9,
        "pick": 4.2,
        "prevAvg": 4.34,
        "verdict": "meta",
        "trend": "flat",
        "contested": false,
        "shapes": [
          "ceiling"
        ]
      },
      "master": {
        "n": 2230,
        "avg": 4.34,
        "top4": 51.2,
        "win": 20.1,
        "pick": 3.8,
        "prevAvg": 4.33,
        "verdict": "meta",
        "trend": "flat",
        "contested": false,
        "shapes": [
          "ceiling"
        ]
      }
    },
    "note": "Ít bị tranh hơn Elder Dragon, dùng chung hàng huyền thoại."
  },
  {
    "id": "elder-dragon",
    "name": "Elder Dragon",
    "damage": "AD",
    "cost": 5,
    "playstyle": "Fast 9",
    "carries": [
      {
        "name": "The Elder Dragon",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_elderdragon.jpg",
        "items": [
          {
            "name": "Vô Cực Kiếm",
            "icon": "/set18/assets/items/full/da_infinityedge.png"
          },
          {
            "name": "Móng Vuốt Sterak",
            "icon": "/set18/assets/items/full/da_steraksgage.png"
          },
          {
            "name": "Chùy Đoản Côn",
            "icon": "/set18/assets/items/full/da_strikersflail.png"
          }
        ]
      },
      {
        "name": "Draven",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_draven.jpg",
        "items": [
          {
            "name": "Kiếm Tử Thần",
            "icon": "/set18/assets/items/full/da_deathblade.png"
          },
          {
            "name": "Cuồng Đao Guinsoo",
            "icon": "/set18/assets/items/full/da_guinsoosrageblade.png"
          },
          {
            "name": "Thịnh Nộ Thủy Quái",
            "icon": "/set18/assets/items/full/da_krakensfury.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Amumu",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_amumu.jpg"
      },
      {
        "name": "Ancient Sentinel",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ancientsentinel.jpg"
      },
      {
        "name": "Draven",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_draven.jpg"
      },
      {
        "name": "Ivern",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_ivern.jpg"
      },
      {
        "name": "Kennen",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_kennen.jpg"
      },
      {
        "name": "Maokai",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_maokai.jpg"
      },
      {
        "name": "Taric",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_taric.jpg"
      },
      {
        "name": "The Elder Dragon",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_elderdragon.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 52619,
        "avg": 4.44,
        "top4": 49.8,
        "win": 20.1,
        "pick": 11.4,
        "prevAvg": 4.46,
        "verdict": "viable",
        "trend": "flat",
        "contested": true,
        "shapes": [
          "ceiling"
        ]
      },
      "diamond": {
        "n": 19785,
        "avg": 4.41,
        "top4": 50.1,
        "win": 21.0,
        "pick": 11.3,
        "prevAvg": 4.42,
        "verdict": "viable",
        "trend": "flat",
        "contested": true,
        "shapes": [
          "ceiling"
        ]
      },
      "master": {
        "n": 6363,
        "avg": 4.37,
        "top4": 50.6,
        "win": 21.5,
        "pick": 10.8,
        "prevAvg": 4.35,
        "verdict": "meta",
        "trend": "flat",
        "contested": true,
        "shapes": [
          "ceiling"
        ]
      }
    },
    "note": "Đội bị tranh nhiều nhất meta. Chung hàng huyền thoại với Ashe."
  },
  {
    "id": "draven-than-rung",
    "name": "Draven Thần Rừng",
    "damage": "AD",
    "cost": 5,
    "playstyle": "Fast 9",
    "carries": [
      {
        "name": "Draven",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_draven.jpg",
        "items": [
          {
            "name": "Ấn Đao Phủ",
            "icon": "/set18/assets/items/full/da_18_emblemexecutioner.png"
          },
          {
            "name": "Cuồng Đao Guinsoo",
            "icon": "/set18/assets/items/full/da_guinsoosrageblade.png"
          },
          {
            "name": "Thịnh Nộ Thủy Quái",
            "icon": "/set18/assets/items/full/da_krakensfury.png"
          }
        ]
      },
      {
        "name": "Ezreal",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ezreal.jpg",
        "items": [
          {
            "name": "Cung Xanh",
            "icon": "/set18/assets/items/full/da_lastwhisper.png"
          },
          {
            "name": "Ngọn Giáo Shojin",
            "icon": "/set18/assets/items/full/da_spearofshojin.png"
          },
          {
            "name": "Chùy Đoản Côn",
            "icon": "/set18/assets/items/full/da_strikersflail.png"
          }
        ]
      }
    ],
    "units": [
      {
        "name": "Alistar",
        "cost": 2,
        "image": "/set18/assets/champions/full/tft18_alistar.jpg"
      },
      {
        "name": "Amumu",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_amumu.jpg"
      },
      {
        "name": "Ezreal",
        "cost": 4,
        "image": "/set18/assets/champions/full/tft18_ezreal.jpg"
      },
      {
        "name": "Draven",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_draven.jpg"
      },
      {
        "name": "Gnar",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_gnar.jpg"
      },
      {
        "name": "Ivern",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_ivern.jpg"
      },
      {
        "name": "Kennen",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_kennen.jpg"
      },
      {
        "name": "Maokai",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_maokai.jpg"
      },
      {
        "name": "Taric",
        "cost": 5,
        "image": "/set18/assets/champions/full/tft18_taric.jpg"
      }
    ],
    "ranks": {
      "emerald": {
        "n": 22948,
        "avg": 4.39,
        "top4": 49.8,
        "win": 19.1,
        "pick": 5.0,
        "prevAvg": 4.39,
        "verdict": "meta",
        "trend": "flat",
        "contested": false,
        "shapes": [
          "ceiling"
        ]
      },
      "diamond": {
        "n": 7500,
        "avg": 4.41,
        "top4": 49.7,
        "win": 18.9,
        "pick": 4.3,
        "prevAvg": 4.4,
        "verdict": "viable",
        "trend": "flat",
        "contested": false,
        "shapes": [
          "ceiling"
        ]
      },
      "master": {
        "n": 2077,
        "avg": 4.37,
        "top4": 49.9,
        "win": 19.8,
        "pick": 3.5,
        "prevAvg": 4.35,
        "verdict": "meta",
        "trend": "flat",
        "contested": false,
        "shapes": [
          "ceiling"
        ]
      }
    },
    "note": "Chung hàng huyền thoại với Ashe và Elder Dragon."
  }
];
