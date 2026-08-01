"""Apply Riot's official Set 18 Vietnamese wording to the website content.

Source of authority
-------------------
Riot's own VI launch article, mirrored into the Set18 workspace as
`Set18/data/riot_set18_official_glossary.json` and merged into
`Set18/data/metatft_set18_vi.json` under `riot_official`:

    https://teamfighttactics.leagueoflegends.com/vi-vn/news/game-updates/enchanted-wilds-overview/

TEXT ONLY. NO NUMBERS.
----------------------
The article predates PBE and its numbers are already stale (it says Riftbeast (10)
is `+1 maximum team size`; the shipped value is `+2`). So this script touches
wording and nothing else. That is safe by construction here: trait breakpoints
store prose in `bullet.textVi` and values in a separate `bullet.values[]` array,
so rewriting `textVi` cannot move a number. Every `{0}`-style placeholder is
preserved, and the script asserts that the placeholder set is identical before
and after each rewrite.

Two kinds of change
-------------------
1. Official term mismatches — the site uses a word Riot's article doesn't
   (Kỳ Quái -> Gai Đen, Dấu Alpha -> Dấu Ấn Đầu Đàn, ...).
2. Internal inconsistencies the article settles — e.g. Inferno's description says
   `Vết Thương Sâu` but its (7) bullet said `Suy Nhược` for the same keyword;
   Sprykin's description says `Kỵ Sĩ`/`LXKL` but its bullets said `Người cưỡi`/`BFF`.

Pure style preferences are deliberately left alone.

Usage:
    python apply_riot_official_vi.py --check    # report, change nothing
    python apply_riot_official_vi.py
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PLACEHOLDER_RE = re.compile(r"\{\d+\}")

# (path, old, new, expected_count). expected_count pins the blast radius: if the
# generated content shifts under us, the run aborts instead of half-applying.
Repl = tuple[str, str, str, int]

GLOBAL_TERMS: list[Repl] = [
    # -- Trait name: Blackthorn. Article: "GAI ĐEN (2|4|6)". ------------------
    # Covers the trait's `vi`, its descriptionVi, the entity index, the Lux
    # Blackthorn form label, augment copy and the hand-written effects prose.
    ("src/content/set18/set18-traits.ts", "Kỳ Quái", "Gai Đen", 3),
    ("src/content/set18/set18-entity-index.ts", "Kỳ Quái", "Gai Đen", 1),
    ("src/content/set18/set18-champions.ts", "Kỳ Quái", "Gai Đen", 2),
    ("src/content/set18/set18-augments.ts", "Kỳ Quái", "Gai Đen", 1),
    ("src/content/set18-effects.ts", "Kỳ Quái", "Gai Đen", 8),
    # -- Trait name: Bounty Seeker. Article: "Săn Thưởng". -------------------
    ("src/content/set18/set18-traits.ts", "Kẻ Săn Tiền Thưởng", "Săn Thưởng", 1),
    ("src/content/set18/set18-entity-index.ts", "Kẻ Săn Tiền Thưởng", "Săn Thưởng", 1),
    ("src/content/set18/set18-types.ts", "Kẻ Săn Tiền Thưởng", "Săn Thưởng", 2),
    ("src/components/features/season-18/Set18Codex.tsx", "Kẻ Săn Tiền Thưởng", "Săn Thưởng", 1),
    # -- Ahri's ability. Article: "Tinh Linh Cầu" (ties it to Tinh Linh). ----
    ("src/content/set18/set18-champions.ts", "Quả Cầu Linh Hồn", "Tinh Linh Cầu", 2),
    # -- Unit name inside Summoner's trait copy. Article: "Chim Mẹ". ---------
    ("src/content/set18/set18-traits.ts", "Chim Biến Dị", "Chim Mẹ", 1),
    # -- Wisp categories. Article names all 7; three were off. ---------------
    ('"categoryVi": "Khác"', '"categoryVi": "Khác"', '"categoryVi": "Hỗn Hợp"', 0),  # placeholder, see below
]

# The wisp category rewrite is scoped to the categoryVi field so it can't touch
# an augment/trait "Khác" elsewhere in the same file.
WISP_CATEGORIES: list[Repl] = [
    ("src/content/set18/set18-wisps.ts", '"categoryVi": "Khác"', '"categoryVi": "Hỗn Hợp"', 23),
    ("src/content/set18/set18-wisps.ts", '"categoryVi": "Mạo Hiểm"', '"categoryVi": "Rủi Ro"', 18),
    (
        "src/content/set18/set18-wisps.ts",
        '"categoryVi": "Vàng/Kinh Nghiệm"',
        '"categoryVi": "Vàng/XP"',
        12,
    ),
]

# Breakpoint prose. Left side must match the current `textVi` exactly; the
# placeholder set is verified identical on both sides.
BULLETS: list[Repl] = [
    # Riftbeast — "Dấu Alpha"/"Buff" are not Riot's words; article says
    # "Dấu Ấn Đầu Đàn" and "Bùa Lợi độc nhất".
    (
        "src/content/set18/set18-traits.ts",
        "Dùng Dấu Alpha để trao Buff riêng cho 1 Quái Rừng",
        "Dùng Dấu Ấn Đầu Đàn để trao Bùa Lợi độc nhất cho 1 tướng Quái Rừng",
        1,
    ),
    # "trận" -> "giao tranh", matching this trait's own (7) bullet and the article.
    (
        "src/content/set18/set18-traits.ts",
        "Cứ mỗi {0} trận, cửa hàng tiếp theo tràn ngập Quái Rừng",
        "Cứ mỗi {0} giao tranh, cửa hàng tiếp theo của bạn sẽ tràn ngập tướng Quái Rừng",
        1,
    ),
    (
        "src/content/set18/set18-traits.ts",
        "Khi giao tranh bắt đầu và mỗi 5 giây, Quái Rừng lớn lên, nhận",
        "Khi bắt đầu giao tranh và mỗi 5 giây, tướng Quái Rừng tăng trưởng và nhận thêm",
        1,
    ),
    # Article: "+1 số lượng tướng tối đa". The word only — {0} keeps the live 2.
    (
        "src/content/set18/set18-traits.ts",
        "+{0} quy mô đội tối đa",
        "+{0} số lượng tướng tối đa",
        1,
    ),
    # Elderwood — article: "và Hộ Vệ Rừng".
    (
        "src/content/set18/set18-traits.ts",
        "và Người Bảo Vệ Rừng Sâu",
        "và Hộ Vệ Rừng",
        1,
    ),
    # "có thể lên đến N sao" reads as optional; the plants star up automatically.
    # Article: "Các cây trở thành 2 sao" / "3 sao".
    (
        "src/content/set18/set18-traits.ts",
        "Cây có thể lên đến 2 sao",
        "Các cây trở thành 2 sao",
        1,
    ),
    (
        "src/content/set18/set18-traits.ts",
        "Cây có thể lên đến 3 sao.",
        "Các cây trở thành 3 sao.",
        1,
    ),
    # Sprykin — the trait's own description already says "Kỵ Sĩ" and "LXKL";
    # the bullets said "Người cưỡi" and "BFF". Article uses Kỵ Sĩ / LXKL.
    (
        "src/content/set18/set18-traits.ts",
        "Người cưỡi nhận {0} và {1}",
        "Kỵ Sĩ nhận {0} và {1}",
        1,
    ),
    (
        "src/content/set18/set18-traits.ts",
        "{0} {1}, và {2} khả năng của BFF áp dụng cho cả đội",
        "{0} {1}, và {2} hiệu ứng của LXKL áp dụng cho đội của bạn",
        1,
    ),
    (
        "src/content/set18/set18-traits.ts",
        "{0} {1}, và {2} khả năng của BFF áp dụng cho tướng Tinh Nghịch. "
        "Đòn đánh và khả năng của BFF thay đổi tuỳ Người cưỡi cận chiến hay đánh xa",
        "{0} {1}, và {2} hiệu ứng của LXKL áp dụng cho các tướng Tinh Nghịch của bạn. "
        "Đòn đánh và hiệu ứng của LXKL thay đổi tuỳ Kỵ Sĩ cận chiến hay đánh xa",
        1,
    ),
    # Inferno — "Hoả Ngục" is a stray spelling of this trait's own "Hỏa Ngục";
    # "Sau khi chiến đấu" -> article's "Sau giao tranh".
    (
        "src/content/set18/set18-traits.ts",
        "Sau khi chiến đấu, {0} ô cửa hàng không có tướng Hoả Ngục sẽ bốc cháy, "
        "nâng tướng đó lên 1 bậc",
        "Sau giao tranh, {0} ô cửa hàng không có tướng Hỏa Ngục sẽ bốc cháy, "
        "đổi thành tướng cao hơn 1 bậc",
        1,
    ),
    # Article: "(5) Bốc cháy 2 ô cửa hàng" / "(7) Bốc cháy 4 ô cửa hàng".
    (
        "src/content/set18/set18-traits.ts",
        "Đốt {0} ô cửa hàng, {1}% Thiêu Đốt. Thiêu Đốt: gây sát thương chuẩn theo "
        "% Máu tối đa mục tiêu mỗi giây. Suy Nhược: giảm khả năng hồi máu",
        "Bốc cháy {0} ô cửa hàng, {1}% Thiêu Đốt. Thiêu Đốt: gây sát thương chuẩn "
        "mỗi giây theo Máu tối đa của mục tiêu. Vết Thương Sâu: giảm hồi máu nhận được",
        1,
    ),
    (
        "src/content/set18/set18-traits.ts",
        "Đốt {0} ô cửa hàng, {1}% Thiêu Đốt",
        "Bốc cháy {0} ô cửa hàng, {1}% Thiêu Đốt",
        1,
    ),
    # Blackthorn — article: "Hiệu ứng thưởng mạnh hơn 25%" and
    # "Vật tế không bị tiêu diệt. Thay vào đó, nó nhận ...".
    (
        "src/content/set18/set18-traits.ts",
        "{0}; phần thưởng mạnh hơn {1}",
        "{0}; hiệu ứng thưởng mạnh hơn {1}",
        1,
    ),
    (
        "src/content/set18/set18-traits.ts",
        "{0}; vật hiến tế không chết, còn nhận thêm:",
        "{0}; vật tế không bị tiêu diệt, thay vào đó nhận thêm:",
        1,
    ),
    # The same phrase, hand-written a second time in the effects copy.
    # Numbers in that sentence are left exactly as they are.
    (
        "src/content/set18-effects.ts",
        "Từ mốc (6), vật hiến tế không chết.",
        "Từ mốc (6), vật tế không bị tiêu diệt.",
        1,
    ),
    (
        "src/content/set18-effects.ts",
        "Các mốc thấp hơn cho Dấu Alpha (3), cửa hàng tràn Quái Rừng (5) "
        "và buff lớn dần mỗi 5 giây (7).",
        "Các mốc thấp hơn cho Dấu Ấn Đầu Đàn (3), cửa hàng tràn Quái Rừng (5) "
        "và bùa lợi lớn dần mỗi 5 giây (7).",
        1,
    ),
]

# -- Wisp = Tinh Linh ---------------------------------------------------------
# The site called the mechanic "Linh hỏa" everywhere in its own copy, while the
# imported Riot descriptions inside the very same pages already said "Tinh Linh"
# (27x). Riot's article settles it: the mechanic is Tinh Linh throughout.
#
# Riot writes it capitalised as a game term, so the 7 lowercase mid-sentence
# uses become "Tinh Linh" too — matching the 27 that were already correct.
#
# The URL slug `linh-hoa` (`?section=linh-hoa`, `id="linh-hoa"`) is deliberately
# NOT renamed: it is an ASCII identifier, not display text, and changing it would
# break any shared or bookmarked link. It is diacritic-free so none of the
# patterns below can touch it.
# (path, occurrences to rename, occurrences that legitimately survive)
WISP_RENAME: list[tuple[str, int, int]] = [
    ("src/content/set18-effects.ts", 47, 0),
    ("src/components/features/season-18/Set18Codex.tsx", 11, 0),
    ("src/components/features/patch/PatchBoard.tsx", 5, 0),
    ("src/content/patch-notes.ts", 5, 0),
    ("src/components/features/patch/PatchBoard.module.css", 4, 0),
    ("src/components/features/season-18/Set18Codex.module.css", 3, 0),
    # 2 survive on purpose: 'linh hỏa' is kept as a legacy search keyword (plus
    # the comment explaining why), so people who knew the old name still find it.
    ("src/content/search-actions.ts", 3, 2),
    ("src/content/set18/set18-meta.ts", 2, 0),
    ("src/app/page.tsx", 1, 0),
    ("src/content/set18/set18-types.ts", 1, 0),
]

# Order matters: the longer Inferno (7) bullet must be rewritten before the
# shorter (5) one, otherwise the (5) pattern would match inside it first.
ALL: list[Repl] = (
    [r for r in GLOBAL_TERMS if r[3] > 0] + WISP_CATEGORIES + BULLETS
)


def house_normalised(s: str) -> str:
    """Fold spellings that apply_vi_house_style.py later overrides.

    The passes are layered: this script writes Riot's wording, then the house
    style pass flips "Hỏa Ngục" to "Hoả Ngục". So when re-running on an
    already-processed tree, a Riot target string won't be found verbatim — the
    house pass has since rewritten it. Fold both spellings before deciding
    whether a replacement is already in place.
    """
    return s.replace("Hoả Ngục", "Hỏa Ngục")


def check_placeholders(old: str, new: str) -> None:
    a, b = PLACEHOLDER_RE.findall(old), PLACEHOLDER_RE.findall(new)
    if a != b:
        raise SystemExit(
            f"placeholder set changed — a number would move.\n  old {a}: {old}\n  new {b}: {new}"
        )


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true", help="report only, write nothing")
    args = ap.parse_args()

    cache: dict[str, str] = {}
    problems, applied, already = [], [], []

    for rel, old, new, expected in ALL:
        check_placeholders(old, new)
        path = ROOT / rel
        if rel not in cache:
            cache[rel] = path.read_text(encoding="utf-8")
        found = cache[rel].count(old)
        if found == expected:
            cache[rel] = cache[rel].replace(old, new)
            applied.append((rel, old, new, found))
        elif found == 0 and house_normalised(cache[rel]).count(house_normalised(new)) >= expected:
            # Already applied — the point of this script is to be re-runnable
            # after the set18 content files are regenerated, and a regeneration
            # may only clobber some of them.
            already.append((rel, new))
        else:
            problems.append(f"{rel}: expected {expected}x {old!r}, found {found}")

    # Wisp -> Tinh Linh. Case-insensitive on the first letter only, always
    # producing the capitalised game term.
    wisp_re = re.compile(r"[Ll]inh hỏa")
    wisp_total = 0
    for rel, expected, keep in WISP_RENAME:
        if rel not in cache:
            cache[rel] = (ROOT / rel).read_text(encoding="utf-8")
        found = len(wisp_re.findall(cache[rel]))
        if found == expected + keep:
            # Rename only the leading `expected` hits, leaving the deliberate
            # legacy mentions in place.
            cache[rel] = wisp_re.sub("Tinh Linh", cache[rel], count=expected)
            wisp_total += expected
        elif found == keep and "Tinh Linh" in cache[rel]:
            already.append((rel, "Tinh Linh"))
        else:
            problems.append(
                f"{rel}: expected {expected + keep}x 'Linh hỏa', found {found}"
            )

    for rel, old, new, n in applied:
        print(f"  {n}x  {old[:58]:60} -> {new[:58]}")
    if wisp_total:
        print(f"  {wisp_total}x  {'Linh hỏa':60} -> Tinh Linh")
    if already:
        print(f"  ({len(already)} replacements already in place, skipped)")
    print(f"\n{len(applied)} replacements across {len({r for r, *_ in applied})} files")

    if problems:
        print("\nPROBLEMS:", file=sys.stderr)
        for p in problems:
            print("  " + p, file=sys.stderr)
        return 1

    if args.check:
        print("--check: nothing written")
        return 0

    for rel, text in cache.items():
        (ROOT / rel).write_text(text, encoding="utf-8")
        print(f"wrote {rel}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
