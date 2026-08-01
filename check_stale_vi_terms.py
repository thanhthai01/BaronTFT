"""Guard: fail if any pre-official Vietnamese term is still in the site source.

Run after apply_riot_official_vi.py, or any time set18 content is regenerated.
Each left-hand term was replaced by Riot's official wording; if one reappears it
means content was regenerated from the PBE lookup and the wording pass was lost.
"""

from __future__ import annotations

import json
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
    # House style, deliberately NOT Riot's spelling (the article writes "Hỏa Ngục").
    # "Linh hỏa" is exempt by decision -- see apply_vi_house_style.py.
    "Hỏa Ngục": "Hoả Ngục",
    "Cây có thể lên đến": "Các cây trở thành",
    "vật hiến tế không chết": "vật tế không bị tiêu diệt",
}

CHAMPS = ROOT / "src/content/set18/set18-champions.ts"


def untranslated_champions() -> list[str]:
    """Champions whose `abilityVi` is still the raw English `ability` string.

    Every champion keeps its English text in `ability` on purpose; the bug is
    when `abilityVi` is byte-identical to it, which means the card renders in
    English. Kha'Zix was the only one; this catches a regression.
    """
    text = CHAMPS.read_text(encoding="utf-8")
    start = text.index("= [") + 2
    end = text.index("];", start) + 1
    champs = json.loads(text[start:end])
    return [
        c["name"]
        for c in champs
        if c.get("abilityVi") and c["abilityVi"] == c.get("ability")
    ]


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

    untranslated = untranslated_champions()

    if not hits and not untranslated:
        print(f"CLEAN — none of the {len(STALE)} stale terms remain in src/")
        print("CLEAN — every champion has a translated abilityVi")
        return 0

    if hits:
        print("Stale Vietnamese terms found:", file=sys.stderr)
        for rel, old, new, n in hits:
            print(f"  {n}x  {old!r} -> should be {new!r}  ({rel})", file=sys.stderr)
    if untranslated:
        print("Champions with an untranslated abilityVi:", file=sys.stderr)
        for name in untranslated:
            print(f"  {name}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
