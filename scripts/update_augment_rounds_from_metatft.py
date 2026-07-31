"""One-off: propagate augment rounds/round_variants (added to
Set18/data/metatft_set18_vi.json by Set18/enrich_augment_rounds.py) into
Website/src/content/set18-codex.ts.

set18Augments entries have no apiName, and name_en collides for a handful of
augments (tier I/II/III variants sharing a display name, e.g. "Beast
Within"), so entries are matched by the icon filename instead — the codex's
local icon path (/set18/assets/auguments/<file>.png) shares the same
filename as the source's images.icon CDN URL, and that filename is unique
per apiName even when names collide.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
CODEX_PATH = ROOT / "src" / "content" / "set18-codex.ts"
SOURCE_PATH = ROOT.parent / "Set18" / "data" / "metatft_set18_vi.json"


def icon_filename(url_or_path):
    return url_or_path.rsplit("/", 1)[-1].lower()


def main():
    source = json.loads(SOURCE_PATH.read_text(encoding="utf-8"))
    rounds_by_icon = {
        icon_filename(a["images"]["icon"]): (a["rounds"], a["round_variants"])
        for a in source["augments"]
    }

    text = CODEX_PATH.read_text(encoding="utf-8")
    lines = text.split("\n")

    array_line_idx = next(
        i for i, l in enumerate(lines) if l.startswith("export const set18Augments")
    )
    line = lines[array_line_idx]
    prefix = "export const set18Augments: Set18Augment[] = "
    assert line.startswith(prefix) and line.endswith(";")
    augments = json.loads(line[len(prefix):-1])

    missing = []
    for aug in augments:
        key = icon_filename(aug["icon"])
        info = rounds_by_icon.get(key)
        if info is None:
            missing.append(aug["icon"])
            continue
        aug["rounds"], aug["roundVariants"] = info

    if missing:
        raise SystemExit(f"{len(missing)} website augments had no round match: {missing}")

    lines[array_line_idx] = prefix + json.dumps(augments, ensure_ascii=False) + ";"

    type_block_old = (
        "/** Nguồn: data/metatft_set18_vi.json (261 nâng cấp). Không có dữ liệu \"xuất hiện ở\n"
        " * stage nào\" trong dữ liệu cào về — không hiển thị field đó thay vì đoán sai. */\n"
        "export type Set18Augment = {\n"
        "  name: string;\n"
        "  nameVi: string;\n"
        "  rarity: 'Silver' | 'Gold' | 'Prismatic';\n"
        "  rarityColor: string;\n"
        "  category: string;\n"
        "  categoryVi: string;\n"
        "  description: string;\n"
        "  descriptionVi: string;\n"
        "  icon: string;\n"
        "  associatedTraits: string[];\n"
        "};"
    )
    type_block_new = (
        "/** Nguồn: data/metatft_set18_vi.json (261 nâng cấp). `rounds`/`roundVariants`\n"
        " * lấy từ metatft.com/new-set (vòng đấu augment này có thể xuất hiện, vd\n"
        " * [\"3-2\", \"4-2\"] / [\"Mid\", \"Late\"]) — xem Set18/enrich_augment_rounds.py. */\n"
        "export type Set18Augment = {\n"
        "  name: string;\n"
        "  nameVi: string;\n"
        "  rarity: 'Silver' | 'Gold' | 'Prismatic';\n"
        "  rarityColor: string;\n"
        "  category: string;\n"
        "  categoryVi: string;\n"
        "  description: string;\n"
        "  descriptionVi: string;\n"
        "  icon: string;\n"
        "  associatedTraits: string[];\n"
        "  rounds: string[];\n"
        "  roundVariants: string[];\n"
        "};"
    )

    new_text = "\n".join(lines)
    if type_block_old not in new_text:
        raise SystemExit("Set18Augment type block not found verbatim — refusing to guess-replace")
    new_text = new_text.replace(type_block_old, type_block_new)

    backup_path = CODEX_PATH.with_name(CODEX_PATH.name + ".bak_20260731d")
    backup_path.write_text(text, encoding="utf-8")
    CODEX_PATH.write_text(new_text, encoding="utf-8")

    print(f"Backed up to {backup_path.name}")
    print(f"Updated {len(augments)} augments with rounds/roundVariants")


if __name__ == "__main__":
    main()
