"""One-off, session 2026-07-31 (follow-up to apply_web_enrichment.py in Set18/):

Set18/data/metatft_set18_vi.json's trait `desc`/`desc_full` were fixed on
2026-07-30 (apply_web_enrichment.py resolved template placeholders and filled
2 traits, Rival and Solar, that were completely empty). Website/src/content/
set18-codex.ts's set18Traits[].description/descriptionVi were generated
BEFORE that fix and never re-synced, so the live site still shows the stale,
broken text — e.g. Riftbeast's mốc 7 line lost its stat labels entirely
("+ + + +" instead of "+6 Giáp +6 Kháng Phép..."), and Solar's paragraph
degenerates into an untranslated flavor-text fragment.

This script:

1. Re-syncs description/descriptionVi from Set18/data, matched by name_en
   (apiName has no direct equivalent in the website schema).
   - For the 21 traits with full breakpointDetails[].bullet coverage (all-or-
     nothing per trait — verified before writing this script), the paragraph
     would just restate the bullets, so only the non-breakpoint intro (the
     text before the first "(N)" marker) is kept; if desc starts directly
     with a breakpoint marker (Executioner, Riftbeast) that intro is empty
     and the paragraph is dropped by the component (see the matching
     Set18Codex.tsx edit — empty string renders nothing).
   - For the 15 traits with no bullets at all, the full desc_full/
     desc_full_en is kept since it's the only content shown.
   - Trailing placeholder lines that only make sense in a live match (e.g.
     Greenfather's "Hạt Giống: ? / 5") are dropped — a bare "?" doesn't mean
     anything in a static reference page.

2. Overrides breakpointDetails[].color to the site's own established
   Prismatic purple (#6838ff, same as set18Augments' rarity="Prismatic")
   wherever style === 'chromatic'. MetaTFT's raw colour for that style is
   #f9fdfe — near-white, effectively invisible against the site's --ivory
   (#FAF9F5) background. Breakpoint thresholds/styles themselves were cross-
   checked against Set18/data's traits[].effects[] for all 36 traits first
   (see /tmp/breakpoint_compare.txt from that pass) and already match, so
   nothing else in breakpointDetails needs touching.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
CODEX_PATH = ROOT / "src" / "content" / "set18-codex.ts"
SOURCE_PATH = ROOT.parent / "Set18" / "data" / "metatft_set18_vi.json"

CHROMATIC_COLOR = "#6838ff"


def intro_only(desc):
    """Text before the first '(N)' breakpoint marker; '' if desc starts with one."""
    if not desc:
        return ""
    if re.match(r"^\(\d+\)", desc.strip()):
        return ""
    return desc


def strip_trailing_dynamic_lines(text):
    if not text:
        return text
    lines = text.split("\n")
    while lines and (lines[-1].rstrip().endswith("?") or lines[-1].rstrip().endswith(":")):
        lines.pop()
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines)


def main():
    source = json.loads(SOURCE_PATH.read_text(encoding="utf-8"))
    src_by_name_en = {t["name_en"]: t for t in source["traits"]}

    text = CODEX_PATH.read_text(encoding="utf-8")
    lines = text.split("\n")
    array_line_idx = next(i for i, l in enumerate(lines) if l.startswith("export const set18Traits"))
    line = lines[array_line_idx]
    prefix = "export const set18Traits: Set18Trait[] = "
    assert line.startswith(prefix) and line.endswith(";")
    traits = json.loads(line[len(prefix):-1])

    resynced, colors_fixed, missing = [], [], []
    for trait in traits:
        raw = src_by_name_en.get(trait["name"])
        if raw is None:
            missing.append(trait["name"])
            continue

        has_bullets = any(bp.get("bullet") for bp in trait["breakpointDetails"])
        if has_bullets:
            new_vi = intro_only(raw.get("desc", ""))
            new_en = intro_only(raw.get("desc_en", ""))
        else:
            new_vi = strip_trailing_dynamic_lines(raw.get("desc_full") or raw.get("desc") or "")
            new_en = strip_trailing_dynamic_lines(raw.get("desc_full_en") or raw.get("desc_en") or "")

        if new_vi != trait["descriptionVi"] or new_en != trait["description"]:
            trait["descriptionVi"] = new_vi
            trait["description"] = new_en
            resynced.append(trait["name"])

        for bp in trait["breakpointDetails"]:
            if bp["style"] == "chromatic" and bp["color"] != CHROMATIC_COLOR:
                bp["color"] = CHROMATIC_COLOR
                colors_fixed.append(f"{trait['name']}:{bp['threshold']}")

    if missing:
        raise SystemExit(f"{len(missing)} traits had no Set18/data match: {missing}")

    lines[array_line_idx] = prefix + json.dumps(traits, ensure_ascii=False) + ";"
    new_text = "\n".join(lines)

    backup_path = CODEX_PATH.with_name(CODEX_PATH.name + ".bak_20260731e")
    backup_path.write_text(text, encoding="utf-8")
    CODEX_PATH.write_text(new_text, encoding="utf-8")

    print(f"Backed up to {backup_path.name}")
    print(f"Resynced description/descriptionVi for {len(resynced)} traits: {resynced}")
    print(f"Fixed chromatic breakpoint color for: {colors_fixed}")


if __name__ == "__main__":
    main()
