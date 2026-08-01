"""Nguồn duy nhất cho bảng nhiệm vụ săn thưởng của Draven — ghi vào CẢ HAI nơi:

  1. Set18/data/metatft_set18_vi.json  → traits[Bounty Seeker].bounties (song ngữ + độ khó)
  2. Website/src/content/set18/set18-traits.ts → bounties[].difficulty

Vì sao cần bảng nhúng trong file này:

* Độ khó không có trong dữ liệu game. Nguồn duy nhất công bố là bảng
  https://www.metatft.com/tables/draven-bounties (đọc 2026-08-01). Trang đó cũng nói rõ
  cơ chế rút: hai pool tách biệt, KHÔNG có trọng số, nên mọi nhiệm vụ trong cùng pool có
  xác suất bằng nhau — 1/7 với Tiêu chuẩn, 1/4 với Khó.

* Trong metatft_set18_vi.json, trait này chỉ có `desc_full`/`desc_full_en`: 11 cặp
  nhiệm vụ/phần thưởng nối dính liền không dấu phân cách, không tách máy được tin cậy
  (xem Website/scripts/patch_trait_readability.py — nó đã phải dò chéo desc_full_en với
  curveTable trong lookup thô để dựng lại đúng cặp, vì desc_full có 2 cặp bị hoán phần
  thưởng và rơi mất một con số). Bản tiếng Việt đã hiệu đính nằm ở set18-traits.ts, nên
  script lấy ngược từ đó làm chuẩn cho phần tiếng Việt thay vì parse lại chuỗi hỏng.

`desc_full`/`desc_full_en` gốc được giữ nguyên — script chỉ THÊM field `bounties`, không
sửa chuỗi thô, để còn đối chiếu được với nguồn.

Script IDEMPOTENT: gán thẳng theo bảng tra dưới đây, không biến đổi dựa trên trạng thái
hiện có, nên chạy lại bao nhiêu lần cũng ra cùng kết quả. (Chủ ý khác 2 script one-off
cạnh bên — xem cảnh báo đầu file của chúng.)

Chạy từ Website/: python scripts/add_draven_bounty_difficulty.py
"""

import json
from pathlib import Path

WEBSITE = Path(__file__).resolve().parent.parent


def find_set18() -> Path:
    """Set18/ nằm cạnh Website/ ở cây chính, nhưng khi script chạy trong git worktree
    (.claude/worktrees/<tên>/) thì WEBSITE.parent là thư mục worktrees chứ không phải
    thư mục gốc nữa. Đi ngược lên cho tới khi thấy một thư mục cạnh mình tên Set18 có
    chứa data/ — đúng ở cả hai trường hợp."""
    for base in [WEBSITE, *WEBSITE.parents]:
        candidate = base.parent / "Set18"
        if (candidate / "data").is_dir():
            return candidate
    raise SystemExit("Khong tim thay Set18/data khi di nguoc len tu " + str(WEBSITE))


SET18 = find_set18()
TRAITS_PATH = WEBSITE / "src" / "content" / "set18" / "set18-traits.ts"
CODEX_VI_PATH = SET18 / "data" / "metatft_set18_vi.json"
DECL = "export const set18Traits: Set18Trait[] = "
TRAIT_EN = "Bounty Seeker"

# Nguyên văn bảng MetaTFT (cột Bounty gộp mission+reward, cột Difficulty), kèm câu tiếng
# Việt tương ứng dùng làm khoá ghép với set18-traits.ts. Nếu dữ liệu trait được sinh lại
# với câu chữ khác, script dừng ở phần kiểm tra bên dưới thay vì gán thiếu im lặng.
BOUNTIES = [
    # --- pool Tiêu chuẩn (7 nhiệm vụ, mỗi cái 1/7) ---
    ("standard", "Draven attacks 50 times.", "1 random 5-cost champion", "Draven tung đòn đánh 50 lần."),
    ("standard", "Draven casts 5 times.", "2 random 4-cost champions", "Draven tung chiêu 5 lần."),
    ("standard", "Draven deals 8000 damage.", "7 gold", "Draven gây 8000 sát thương."),
    ("standard", "Draven deals at least 10000 damage in one player combat.", "15 gold",
     "Draven gây tối thiểu 10000 sát thương trong một giao tranh người chơi."),
    ("standard", "Draven gets 6 kills.", "12 gold", "Draven có được 6 mạng hạ gục."),
    ("standard", "Draven deals the most damage on your team in combat.", "2 shop rerolls",
     "Draven gây nhiều sát thương nhất đội của bạn trong giao tranh."),
    ("standard", "Draven gets 14 takedowns.", "10 XP", "Draven tham gia hạ gục 14 lần."),
    # --- pool Khó (4 nhiệm vụ, mỗi cái 1/4) ---
    ("hard", "Draven casts 8 times.", "10 shop rerolls", "Draven tung chiêu 8 lần."),
    ("hard", "Draven deals 35000 damage.", "1 B.F. Sword", "Draven gây 35000 sát thương."),
    ("hard", "Draven gets 15 kills.", "1 random completed item", "Draven có được 15 hạ gục."),
    ("hard", "Draven survives 3 player combats.", "2 random components", "Draven sống sót qua 3 giao tranh người chơi."),
]

BY_MISSION_VI = {vi: (difficulty, en, reward_en) for difficulty, en, reward_en, vi in BOUNTIES}


def load_website_traits() -> tuple[list, list, int]:
    text = TRAITS_PATH.read_text(encoding="utf-8")
    lines = text.split("\n")
    idx = next(i for i, line in enumerate(lines) if line.startswith(DECL))
    payload = lines[idx][len(DECL) :]
    if not payload.endswith(";"):
        raise SystemExit("Dong set18Traits khong ket thuc bang ';' — dung lai de khoi doan mo")
    return json.loads(payload[:-1]), lines, idx


def main() -> None:
    traits, lines, idx = load_website_traits()
    trait = next((t for t in traits if t["name"] == TRAIT_EN), None)
    if trait is None or not trait.get("bounties"):
        raise SystemExit(f"Khong tim thay trait '{TRAIT_EN}' hoac trait khong co bounties trong set18-traits.ts")

    missions = [b["mission"] for b in trait["bounties"]]
    unknown = [m for m in missions if m not in BY_MISSION_VI]
    unused = [m for m in BY_MISSION_VI if m not in missions]
    if unknown or unused:
        raise SystemExit(
            "Bang tra khong con khop du lieu trait.\n"
            f"  Nhiem vu chua co trong bang: {unknown}\n"
            f"  Muc thua trong bang tra:     {unused}"
        )

    # --- 1. website: gan difficulty, dua pool Kho xuong duoi ---
    for bounty in trait["bounties"]:
        bounty["difficulty"] = BY_MISSION_VI[bounty["mission"]][0]
    trait["bounties"].sort(key=lambda b: b["difficulty"] == "hard")
    lines[idx] = DECL + json.dumps(traits, ensure_ascii=False) + ";"
    TRAITS_PATH.write_text("\n".join(lines), encoding="utf-8")

    # --- 2. Set18/data: them mang bounties song ngu vao trait ---
    reward_vi_by_mission = {b["mission"]: b["reward"] for b in trait["bounties"]}
    codex = json.loads(CODEX_VI_PATH.read_text(encoding="utf-8"))
    codex_trait = next((t for t in codex["traits"] if t.get("name_en") == TRAIT_EN), None)
    if codex_trait is None:
        raise SystemExit(f"Khong tim thay trait '{TRAIT_EN}' trong {CODEX_VI_PATH.name}")

    codex_trait["bounties"] = [
        {
            "difficulty": difficulty,
            "mission": mission_vi,
            "mission_en": mission_en,
            "reward": reward_vi_by_mission[mission_vi],
            "reward_en": reward_en,
        }
        for difficulty, mission_en, reward_en, mission_vi in BOUNTIES
    ]
    codex_trait["bounties_source"] = "https://www.metatft.com/tables/draven-bounties"
    codex_trait["bounties_note"] = (
        "Hai pool rút tách biệt và không có trọng số: mọi nhiệm vụ trong cùng pool có xác "
        "suất bằng nhau (1/7 với standard, 1/4 với hard)."
    )
    # indent=2 + ensure_ascii=False tái tạo đúng từng byte định dạng gốc của file (kiểm
    # chứng bằng round-trip trên bản .bak). Ghi một dòng sẽ làm file 46k dòng này thành
    # 1 dòng — không đọc và không diff được nữa.
    CODEX_VI_PATH.write_text(json.dumps(codex, indent=2, ensure_ascii=False), encoding="utf-8")

    counts = {"standard": 0, "hard": 0}
    for difficulty, *_ in BOUNTIES:
        counts[difficulty] += 1
    print(f"{len(BOUNTIES)} nhiem vu — tieu chuan {counts['standard']} (1/{counts['standard']}), "
          f"kho {counts['hard']} (1/{counts['hard']})")
    print(f"  -> {TRAITS_PATH.relative_to(WEBSITE)} (difficulty)")
    print(f"  -> {CODEX_VI_PATH.relative_to(SET18.parent)} (bounties song ngu)")


if __name__ == "__main__":
    main()
