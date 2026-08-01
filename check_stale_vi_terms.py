"""Guard: fail if any pre-official Vietnamese term is still in the site source.

Run after apply_riot_official_vi.py, or any time set18 content is regenerated.
Each left-hand term was replaced by Riot's official wording; if one reappears it
means content was regenerated from the PBE lookup and the wording pass was lost.
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

STALE = {
    "Kỳ Quái": "Gai Đen",
    "Kẻ Săn Tiền Thưởng": "Săn Thưởng",
    "Người Bảo Vệ Rừng Sâu": "Hộ Vệ Rừng",
    "Suy Nhược": "Vết Thương Sâu",
    "Dấu Alpha": "Dấu Ấn Đầu Đàn",
    "Quả Cầu Linh Hồn": "Tinh Linh Cầu",
    "Chim Biến Dị": "Chim Mẹ",
    "Mạo Hiểm": "Rủi Ro",
    "Vàng/Kinh Nghiệm": "Vàng/XP",
    "Người cưỡi": "Kỵ Sĩ",
    "quy mô đội tối đa": "số lượng tướng tối đa",
    "khả năng của BFF": "hiệu ứng của LXKL",
    "Hoả Ngục": "Hỏa Ngục",
    "Cây có thể lên đến": "Các cây trở thành",
    "vật hiến tế không chết": "vật tế không bị tiêu diệt",
}


def main() -> int:
    hits = []
    for path in sorted((ROOT / "src").rglob("*")):
        if not path.is_file() or path.suffix not in (".ts", ".tsx"):
            continue
        text = path.read_text(encoding="utf-8")
        rel = path.relative_to(ROOT).as_posix()
        for old, new in STALE.items():
            n = text.count(old)
            if n:
                hits.append((rel, old, new, n))

    if not hits:
        print(f"CLEAN — none of the {len(STALE)} stale terms remain in src/")
        return 0

    print("Stale Vietnamese terms found:", file=sys.stderr)
    for rel, old, new, n in hits:
        print(f"  {n}x  {old!r} -> should be {new!r}  ({rel})", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
