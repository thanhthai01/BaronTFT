"""Vietnamese house-style decisions that are ours, not Riot's.

Kept separate from apply_riot_official_vi.py on purpose. That script defers to
Riot's official article; this one records places where we knowingly diverge from
it, or where the article simply has nothing to say. Mixing the two would make it
impossible to tell "Riot says so" from "we decided so".

1. Hỏa Ngục -> Hoả Ngục
   Riot's article writes "Hỏa Ngục" (tone mark on o). We standardise on the
   older "Hoả Ngục" (tone mark on a). This is a deliberate divergence.
   Scope note: the site also has 47x "Linh hỏa" in the new style, including a
   nav heading. Left untouched by explicit decision -- the spelling carries no
   difference in meaning and rewriting a nav title is not worth the churn. So
   both styles coexist on the site; that is intended, not an oversight.

2. Kha'Zix's ability text
   He was the ONLY champion of 65 whose `abilityVi` was still the raw English
   string (`abilityVi == ability`), so his card rendered in English. Riot's
   overview article never covers him, so there is no official wording to lift --
   this is a fresh translation written to match the site's existing house style:
     - "Nhảy tới kẻ địch ... trong phạm vi N ô"  (Rengar, Murkwolf)
     - "sát thương phép"                          (Karma, Leona)
     - "liền kề"                                  (Rek'Sai)
     - "Năng Lượng"                               (Pebbles, Ancient Sentinel)
     - "thay vào đó"                              (Riot's article, Blackthorn)
   Numbers (3, 190/285/450, 230/345/555, 10) are carried over untouched, and the
   `abilityHtmlVi` keeps the exact span/icon markup of the English original.

Usage:
    python apply_vi_house_style.py --check
    python apply_vi_house_style.py
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# -- 1. Tone-mark style -------------------------------------------------------
INFERNO = [
    ("src/content/set18-effects.ts", 9),
    ("src/content/set18/set18-augments.ts", 1),
    ("src/content/set18/set18-champions.ts", 2),
    ("src/content/set18/set18-entity-index.ts", 1),
    ("src/content/set18/set18-traits.ts", 4),
    ("src/content/set18/set18-wisps.ts", 5),
]

# -- 2. Kha'Zix ---------------------------------------------------------------
KHAZIX_EN = (
    "Leap to the farthest enemy within 3 Hexes, dealing 190/285/450 magic damage. "
    "If they have no adjacent allies, deal 230/345/555 magic damage instead and "
    "gain 10 mana."
)
KHAZIX_VI = (
    "Nhảy tới kẻ địch xa nhất trong phạm vi 3 ô, gây 190/285/450 sát thương phép. "
    "Nếu mục tiêu không có đồng minh liền kề, thay vào đó gây 230/345/555 sát thương "
    "phép và nhận 10 Năng Lượng."
)

VALUE = '<span class="s18-value">{}</span>'
MAGIC = (
    '<span class="s18-value s18-style-colorMagic">'
    '<span class="s18-icon s18-icon-icon_ap"></span>{}</span>'
)

KHAZIX_HTML_EN = (
    f"Leap to the farthest enemy within {VALUE.format(3)} Hexes, dealing "
    f"{MAGIC.format('190/285/450')} magic damage. If they have no adjacent allies, "
    f"deal {MAGIC.format('230/345/555')} magic damage instead and gain "
    f"{VALUE.format(10)} mana."
)
KHAZIX_HTML_VI = (
    f"Nhảy tới kẻ địch xa nhất trong phạm vi {VALUE.format(3)} ô, gây "
    f"{MAGIC.format('190/285/450')} sát thương phép. Nếu mục tiêu không có đồng minh "
    f"liền kề, thay vào đó gây {MAGIC.format('230/345/555')} sát thương phép và nhận "
    f"{VALUE.format(10)} Năng Lượng."
)

CHAMPS = "src/content/set18/set18-champions.ts"

NUM_RE = re.compile(r"\d+(?:[./]\d+)*")


def numbers(s: str) -> list[str]:
    return NUM_RE.findall(re.sub(r'<[^>]+>', "", s))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true", help="report only, write nothing")
    args = ap.parse_args()

    # The translation must not invent or drop a number.
    for en, vi in ((KHAZIX_EN, KHAZIX_VI), (KHAZIX_HTML_EN, KHAZIX_HTML_VI)):
        if numbers(en) != numbers(vi):
            raise SystemExit(
                f"Kha'Zix numbers differ:\n  en {numbers(en)}\n  vi {numbers(vi)}"
            )

    cache: dict[str, str] = {}
    problems: list[str] = []
    skipped = 0

    def edit(rel: str, old: str, new: str, expected: int, label: str, marker: str | None = None) -> None:
        # Re-runnable: this script exists to be replayed after the generated
        # set18 content files are rebuilt, which may only clobber some of them.
        #
        # `marker` là dấu hiệu "đã áp dụng rồi", dùng khi `new` có kèm phần khoá
        # JSON (`"abilityVi":"..."`): apply_set18_content_fixes.py ghi lại file
        # bằng json.dumps nên kiểu ngăn cách có thể đổi, làm `new` trượt dù nội
        # dung đã đúng. Dò theo riêng phần nội dung thì không phụ thuộc định dạng.
        nonlocal skipped
        if rel not in cache:
            cache[rel] = (ROOT / rel).read_text(encoding="utf-8")
        found = cache[rel].count(old)
        if found == expected:
            cache[rel] = cache[rel].replace(old, new)
            print(f"  {found}x  {label}  ({rel})")
        elif found == 0 and cache[rel].count(marker if marker is not None else new) >= expected:
            skipped += 1
        else:
            problems.append(f"{rel}: {label}: expected {expected}x, found {found}")

    print("1. Hỏa Ngục -> Hoả Ngục")
    for rel, n in INFERNO:
        edit(rel, "Hỏa Ngục", "Hoả Ngục", n, "Hỏa Ngục -> Hoả Ngục")

    print("\n2. Kha'Zix ability -> Vietnamese")
    # abilityVi and forms[].abilityHtmlVi only. `ability` (the English source
    # field, kept for reference) is deliberately left in English.
    edit(CHAMPS, f'"abilityVi":"{KHAZIX_EN}"', f'"abilityVi":"{KHAZIX_VI}"', 1, "abilityVi", marker=KHAZIX_VI)
    # The file stores this JSON minified, so the HTML's own quotes appear escaped.
    esc = lambda s: s.replace('"', '\\"')
    edit(
        CHAMPS,
        f'"abilityHtmlVi":"{esc(KHAZIX_HTML_EN)}"',
        f'"abilityHtmlVi":"{esc(KHAZIX_HTML_VI)}"',
        1,
        "abilityHtmlVi",
        marker=esc(KHAZIX_HTML_VI),
    )

    if skipped:
        print(f"\n({skipped} replacements already in place, skipped)")

    if problems:
        print("\nPROBLEMS:", file=sys.stderr)
        for p in problems:
            print("  " + p, file=sys.stderr)
        return 1

    if args.check:
        print("\n--check: nothing written")
        return 0

    for rel, text in cache.items():
        (ROOT / rel).write_text(text, encoding="utf-8")
        print(f"wrote {rel}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
