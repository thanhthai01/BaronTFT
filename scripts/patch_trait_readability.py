"""One-off, session 2026-07-31 (second follow-up to sync_trait_text_and_colors.py):

The 15 traits with no breakpointDetails[].bullet fall back to their full
description text as one paragraph. For several of them that paragraph is
either genuinely hard to read (dense stat lines, long enumerated lists jammed
into one sentence) or has real localization bugs. This is a hand-curated
content pass, not something derivable by a generic rule — same spirit as
apply_trait_bullets_vi.py's per-trait TRANSLATIONS dict.

Per trait:

- Fae, Rival: both have their embedded "(N) ..." breakpoint lines cleanly
  1:1 with breakpointDetails (2 breakpoints each, text already separated by
  those markers) but were skipped by apply_trait_bullets_vi.py as "too messy
  to translate reliably." Their raw per-breakpoint text is not messy though —
  just never split out — so this script splits it into breakpointDetails[].bullet
  (plain text, no {N} placeholders/icons, so BulletText renders it verbatim)
  and shortens the paragraph to the non-breakpoint intro. Solar's embedded
  numbers (3/5/8) are a 3-star-count sub-scale unrelated to its own single
  breakpoint (3), so it's left as a plain paragraph — there's no 1:1 mapping
  to color-code against.

- Attuned, Greenfather: move a trailing crammed reference list (5 moon
  phases; 3 hex-tile bonus tiers) out of the paragraph into `infoChips`,
  rendered as a separate chip row. Greenfather's paragraph also drops the
  "Hạt Giống: – / 5" live-match-only counter (meaningless in a static page —
  same reasoning as the trailing "?" strip in sync_trait_text_and_colors.py),
  and its source `tooltips` array has 5 hex types but 2 (Hoa/Flower, Đá/Rocks)
  have empty Vietnamese values ("Hoa: //") — data/metatft_set18_vi.json's own
  desc_full already silently drops those 2, so infoChips only surfaces the 3
  complete ones rather than showing broken "//" text.

- Bounty Seeker (Draven): `desc_full` concatenates 11 Nhiệm Vụ/Phần Thưởng
  pairs with no separator between pairs, and pairs 5-6 are corrupted — the
  Vietnamese renderer swapped their reward text and dropped a number
  ("Phần Thưởng: vàng" with no amount). Cross-referenced against
  desc_full_en (complete, unambiguous) to rebuild all 11 pairs correctly:
  mission 5 (deal 35000 damage) rewards 1 B.F. Sword, mission 6 (deal 10000
  in one combat) rewards 15 gold — matching data/metatft_set18_lookup_vi_vn.json's
  extras.traitTooltips curveTable (DamageAmountHard_GoldReward: 15,
  DamageAmountSingleCombat_NumBFSwordReward: 1). Moved into a `bounties`
  list; the paragraph keeps only the 3-sentence rule explanation. Also
  flagged `wide: true` and moved to the end of the traits array so its much
  taller card gets its own full-width row instead of pairing awkwardly with
  a short card next to it (see the matching Set18Codex.tsx/.module.css edit
  for the grid-column + reorder).

Primal is a known remaining gap, deliberately NOT touched here: its
desc_full is missing 2 of its 4 "Blessing" sub-effects entirely (present in
neither language) and has one unresolved template token
(@TFTTrait.TFTEvent5YR_Preserver.1:Duration@). Fixing it needs the same kind
of lookup archaeology this script did for Bounty Seeker, not a formatting
pass — left for a dedicated future session (see the project memory note).
"""
import json
from pathlib import Path

ROOT = Path(__file__).parent
CODEX_PATH = ROOT / "src" / "content" / "set18-codex.ts"

FAE_INTRO = (
    "Sát thương, hồi máu và tạo lá chắn của đội bạn sẽ thu hút các Pix.\n\n"
    "Mỗi Pix sẽ tăng Sức Mạnh Công Kích và Sức Mạnh Phép Thuật cho các tướng "
    "Tiên Linh, và sau khi họ tụt xuống dưới 50% Máu, họ sẽ hồi máu với mỗi Pix."
)
FAE_BULLETS = {
    "2": "5% và 2% Hồi Máu.",
    "4": "8% và 4% Hồi Máu. Sau khi thu hút 7 Pix, bạn sẽ bắt đầu thu hút Pix Hoàng Kim, những Pix Hoàng Kim này sẽ cho vàng.",
}

RIVAL_INTRO = ""
RIVAL_BULLETS = {
    "1": "Chỉ kích hoạt khi triển khai 1 tướng Khắc Tinh trên sân.\n\nTướng Khắc Tinh thu thập điểm hạ gục, nhận 3 điểm nếu họ tham gia hạ gục một tướng Khắc Tinh khác.",
    "2": "Các tướng Khắc Tinh có thể được triển khai cùng nhau",
}

ATTUNED_DESC = (
    "Alune mạnh nhất của bạn sẽ chuyển sang một pha mặt trăng mới sau mỗi lần "
    "thi triển. Khi mặt trăng ở pha bán nguyệt hoặc khuyết hơn, đội của bạn "
    "nhận 7% Chống Chịu. Khi ở những pha còn lại, đội của bạn nhận 7% Khuếch "
    "Đại Sát Thương."
)
ATTUNED_CHIPS = [
    "Trăng Non 7%", "Trăng Lưỡi Liềm 7%", "Bán Nguyệt 7%", "Trăng Khuyết 7%", "Trăng Tròn 7%",
]

GREENFATHER_DESC = (
    "Nhận 1 hạt giống khi Ivern mạnh nhất của bạn thi triển, cộng thêm 3 mỗi "
    "giao tranh. Ivern dùng 5 hạt giống để nuôi lớn 1 ô trên bàn đấu của bạn, "
    "trao hiệu ứng cộng thêm cho đơn vị đứng trên ô đó."
)
GREENFATHER_CHIPS = ["Nấm: 8%/12%/200%", "Cây: 6%/12%/200%", "Nước: 2/3/30"]

BOUNTY_SEEKER_DESC = (
    "Chọn một nhiệm vụ. Draven mạnh nhất của bạn có thể hoàn thành nhiệm vụ "
    "săn thưởng để nhận phần thưởng tương ứng. Sau khi hoàn thành một nhiệm "
    "vụ săn thưởng, hãy chọn nhiệm vụ tiếp theo."
)
BOUNTY_SEEKER_BOUNTIES = [
    ("Draven tung đòn đánh 50 lần.", "1 tướng 5 vàng ngẫu nhiên"),
    ("Draven tung chiêu 5 lần.", "2 tướng 4 vàng ngẫu nhiên"),
    ("Draven tung chiêu 8 lần.", "10 lượt đổi cửa hàng"),
    ("Draven gây 8000 sát thương.", "7 vàng"),
    ("Draven gây 35000 sát thương.", "1 Kiếm B.F."),
    ("Draven gây tối thiểu 10000 sát thương trong một giao tranh người chơi.", "15 vàng"),
    ("Draven có được 6 mạng hạ gục.", "12 vàng"),
    ("Draven có được 15 hạ gục.", "1 trang bị hoàn chỉnh ngẫu nhiên"),
    ("Draven gây nhiều sát thương nhất đội của bạn trong giao tranh.", "2 lượt đổi cửa hàng"),
    ("Draven sống sót qua 3 giao tranh người chơi.", "2 trang bị thành phần ngẫu nhiên"),
    ("Draven tham gia hạ gục 14 lần.", "10 XP"),
]


def apply_plain_bullets(trait, intro, bullets_by_threshold):
    trait["descriptionVi"] = intro
    # {descriptionVi || description} in Set18Codex.tsx falls back to the
    # English field when VI is "" — clear it too so the paragraph actually
    # disappears instead of surfacing stale English full-text underneath
    # the new Vietnamese bullets (caught via visual check, see PR notes).
    if not intro:
        trait["description"] = ""
    for bp in trait["breakpointDetails"]:
        text = bullets_by_threshold.get(bp["threshold"])
        if text:
            bp["bullet"] = {"textVi": text, "values": []}


def main():
    text = CODEX_PATH.read_text(encoding="utf-8")
    lines = text.split("\n")
    array_line_idx = next(i for i, l in enumerate(lines) if l.startswith("export const set18Traits"))
    line = lines[array_line_idx]
    prefix = "export const set18Traits: Set18Trait[] = "
    assert line.startswith(prefix) and line.endswith(";")
    traits = json.loads(line[len(prefix):-1])

    by_name = {t["name"]: t for t in traits}

    apply_plain_bullets(by_name["Fae"], FAE_INTRO, FAE_BULLETS)
    apply_plain_bullets(by_name["Rival"], RIVAL_INTRO, RIVAL_BULLETS)

    by_name["Attuned"]["descriptionVi"] = ATTUNED_DESC
    by_name["Attuned"]["infoChips"] = ATTUNED_CHIPS

    by_name["Greenfather"]["descriptionVi"] = GREENFATHER_DESC
    by_name["Greenfather"]["infoChips"] = GREENFATHER_CHIPS

    bounty_seeker = by_name["Bounty Seeker"]
    bounty_seeker["descriptionVi"] = BOUNTY_SEEKER_DESC
    bounty_seeker["bounties"] = [{"mission": m, "reward": r} for m, r in BOUNTY_SEEKER_BOUNTIES]
    bounty_seeker["wide"] = True

    # Move Bounty Seeker to the end of the Unique group (end of the traits
    # array, since Unique is the last-rendered type) so its full-width card
    # doesn't leave a gap next to a short neighbor mid-grid.
    traits = [t for t in traits if t["name"] != "Bounty Seeker"] + [bounty_seeker]

    lines[array_line_idx] = prefix + json.dumps(traits, ensure_ascii=False) + ";"
    new_text = "\n".join(lines)

    backup_path = CODEX_PATH.with_name(CODEX_PATH.name + ".bak_20260731g")
    backup_path.write_text(text, encoding="utf-8")
    CODEX_PATH.write_text(new_text, encoding="utf-8")
    print(f"Backed up to {backup_path.name}")
    print("Patched: Fae, Rival (bullets), Attuned, Greenfather (infoChips), Bounty Seeker (bounties + wide, moved to end)")


if __name__ == "__main__":
    main()
