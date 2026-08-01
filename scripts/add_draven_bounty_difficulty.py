"""Gắn độ khó (standard/hard) cho 11 nhiệm vụ săn thưởng của Draven trong
src/content/set18/set18-traits.ts.

Nguồn: https://www.metatft.com/tables/draven-bounties (đọc 2026-08-01). Trang đó là
bảng duy nhất công bố phân loại độ khó của bounty; dữ liệu này KHÔNG có trong
Set18/data/metatft_set18_vi.json lẫn bản scrape lookup — trait Kẻ Săn Tiền Thưởng ở
đó chỉ có chuỗi mô tả dính liền 11 cặp nhiệm vụ/phần thưởng, không kèm độ khó.

Trang cũng nói rõ cơ chế rút: hai pool tách biệt, không có trọng số, nên mọi nhiệm vụ
trong cùng pool có xác suất bằng nhau — 1/7 với pool Tiêu chuẩn, 1/4 với pool Khó.
Con số đó được hiển thị trên web nên để luôn ở đây cho khỏi lạc nguồn.

Script IDEMPOTENT: chạy lại bao nhiêu lần cũng ra cùng kết quả, vì nó gán thẳng
difficulty theo bảng tra dưới đây chứ không biến đổi dựa trên trạng thái hiện có.
(Chủ ý làm khác 2 script one-off cạnh bên — xem cảnh báo đầu file của chúng.)

Chạy từ Website/: python scripts/add_draven_bounty_difficulty.py
"""

import json
import re
from pathlib import Path

WEBSITE = Path(__file__).resolve().parent.parent
TRAITS_PATH = WEBSITE / "src" / "content" / "set18" / "set18-traits.ts"
DECL = "export const set18Traits: Set18Trait[] = "

# Khoá bằng nguyên văn tiếng Việt của `mission`. Nếu dữ liệu trait được sinh lại với
# câu chữ khác, script sẽ dừng ở phần kiểm tra bên dưới thay vì gán thiếu im lặng.
DIFFICULTY_BY_MISSION = {
    "Draven tung đòn đánh 50 lần.": "standard",
    "Draven tung chiêu 5 lần.": "standard",
    "Draven gây 8000 sát thương.": "standard",
    "Draven gây tối thiểu 10000 sát thương trong một giao tranh người chơi.": "standard",
    "Draven có được 6 mạng hạ gục.": "standard",
    "Draven gây nhiều sát thương nhất đội của bạn trong giao tranh.": "standard",
    "Draven tham gia hạ gục 14 lần.": "standard",
    "Draven tung chiêu 8 lần.": "hard",
    "Draven gây 35000 sát thương.": "hard",
    "Draven có được 15 hạ gục.": "hard",
    "Draven sống sót qua 3 giao tranh người chơi.": "hard",
}


def main() -> None:
    text = TRAITS_PATH.read_text(encoding="utf-8")
    lines = text.split("\n")
    idx = next(i for i, line in enumerate(lines) if line.startswith(DECL))
    payload = lines[idx][len(DECL) :]
    if not payload.endswith(";"):
        raise SystemExit("Dong set18Traits khong ket thuc bang ';' — dung lai de khoi doan mo")
    traits = json.loads(payload[:-1])

    trait = next((t for t in traits if t["name"] == "Bounty Seeker"), None)
    if trait is None or not trait.get("bounties"):
        raise SystemExit("Khong tim thay trait 'Bounty Seeker' hoac trait khong co bounties")

    missions = [b["mission"] for b in trait["bounties"]]
    unknown = [m for m in missions if m not in DIFFICULTY_BY_MISSION]
    unused = [m for m in DIFFICULTY_BY_MISSION if m not in missions]
    if unknown or unused:
        raise SystemExit(
            "Bang tra do kho khong con khop du lieu trait.\n"
            f"  Nhiem vu chua co do kho: {unknown}\n"
            f"  Muc thua trong bang tra:  {unused}"
        )

    for bounty in trait["bounties"]:
        bounty["difficulty"] = DIFFICULTY_BY_MISSION[bounty["mission"]]

    # Pool Khó xuống dưới: đọc từ dễ đến khó tự nhiên hơn, và giữ thứ tự gốc
    # của MetaTFT bên trong mỗi pool.
    trait["bounties"].sort(key=lambda b: b["difficulty"] == "hard")

    lines[idx] = DECL + json.dumps(traits, ensure_ascii=False) + ";"
    TRAITS_PATH.write_text("\n".join(lines), encoding="utf-8")

    counts = {"standard": 0, "hard": 0}
    for bounty in trait["bounties"]:
        counts[bounty["difficulty"]] += 1
    print(f"Gan do kho cho {len(trait['bounties'])} nhiem vu cua Draven -> {TRAITS_PATH.relative_to(WEBSITE)}")
    print(f"  Tieu chuan: {counts['standard']} (moi cai 1/{counts['standard']})")
    print(f"  Kho:        {counts['hard']} (moi cai 1/{counts['hard']})")


if __name__ == "__main__":
    main()
