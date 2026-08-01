"""Sửa nội dung Set 18 mà dữ liệu nguồn của Riot/MetaTFT dựng sai.

Khác với apply_riot_official_vi.py (đổi thuật ngữ) và apply_vi_house_style.py
(quyết định riêng của trang), script này vá những chỗ dữ liệu game **hỏng thật**:
chuỗi bị rụng chữ, token chưa resolve, nhãn dính liền không xuống hàng.

Mọi con số dùng ở đây đều lấy từ `curveValues` trong lookup đang chạy
(`Set18/data/metatft_set18_lookup_vi_vn.json`), đối chiếu với bản tiếng Anh —
không lấy từ bài viết tiền-PBE của Riot.

--- 1. Nguyên Sinh: 2/4 Phước Lành bị rụng + 1 token chưa resolve ---
Mô tả tiếng Việt của Riot trỏ tới TÊN HÀNG CŨ trong bảng số, còn bảng số đã đổi
sang tên mới, nên renderer không resolve được và bỏ luôn cả câu:

    Phước Lành       desc trỏ tới                     curveValues thật có
    Của Gấu          TigerExecuteThreshold            BearExecuteThreshold      = 0.15
    Của Phượng Hoàng DragonTakedownsPerComponent      PhoenixTakedownsPerComponent = 16
    Của Hổ           HorseDelay/HorseAttackSpeed*     TigerDelay/TigerAttackSpeed* = 6 / 1.3 / 1.15
    Của Rùa          @TFTTrait...Preserver.1:Duration@ TurtlePeriod              = 4

Bản tiếng Anh trỏ đúng hàng nên hiện đủ. Đây là lỗi bản địa hoá của Riot: khi
đổi tên linh vật (Tiger->Bear, Dragon->Phoenix, Horse->Tiger) chuỗi tiếng Việt
không được cập nhật theo. Số dưới đây lấy từ curveValues, đối chiếu desc_full_en.

--- 2. Mặt Trời: dồn cả bảng thưởng vào một đoạn ---
--- 3. Thiên Thực: trait ẩn, mốc "0" và "0 tướng" vô nghĩa ---
Điều kiện kích hoạt suy ra từ câu flavor trong bản tiếng Anh của Mặt Trời:
"When the sun shines on heroes three and three..." = 3 Mặt Trời + 3 Mặt Trăng.

--- 4. Đao Phủ: câu giải nghĩa "Chính Xác" nằm lẫn trong bullet mốc 4 ---
--- 5. Kỹ năng tướng: nhãn khối dính liền câu trước ---
Template của Riot thiếu `\\r\\n\\r\\n` trước một số nhãn `<bright>`/`<dim>`.
Murkwolf có, Gromp/Teemo/... không có, nên chữ dính vào nhau.

--- 6. Teemo: chữ dịch máy còn sót ---
Lookup hiện tại đã ghi đúng "Máu linh thú" và "Lượt roll"; bản trên trang là từ
nguồn cũ ("Sức khỏe Chiến thuật gia", "Quay lại" — dịch sai của Reroll).

Cách dùng:
    python apply_set18_content_fixes.py --check
    python apply_set18_content_fixes.py
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TRAITS = ROOT / "src/content/set18/set18-traits.ts"
CHAMPS = ROOT / "src/content/set18/set18-champions.ts"

# ---------------------------------------------------------------- kỹ năng tướng

BR = "<br><br>"

# Nhãn khối cần xuống hàng. Khoá theo (tên tướng, chuỗi HTML ngay trước nhãn) để
# không đụng nhầm nhãn mở đầu mô tả.
LABEL_BREAKS: list[tuple[str, str]] = [
    # Quái Rừng — Gromp là con duy nhất trong tộc còn thiếu (đã đối chiếu cả 7 con)
    ('Gromp', '<span class="s18-style-dim">Bộ Chuyển Đổi </span>'),
    ('Gromp', '<span class="s18-style-bright">Buff Tím:</span>'),
    ('Gromp', '<span class="s18-style-dim">Bộ Thích Ứng </span>'),
    # Các tướng khác cùng lỗi. Chú ý 3 con dưới có dấu cách thừa TRONG nhãn
    # ("<...> Tích cực:") — dấu cách đó do template gốc, giữ nguyên khi khớp.
    ('LeBlanc', '<span class="s18-style-bright"> Tích cực:</span>'),
    ('Scuttlecrab', '<span class="s18-style-bright">Kích hoạt:</span>'),
    ('Krug', '<span class="s18-style-bright"> Tích cực:</span>'),
    ('Amumu', '<span class="s18-style-bright">Kích hoạt:</span>'),
    ('Morgana', '<span class="s18-style-bright"> Tích cực:</span>'),
]

# Teemo: 3 nhãn nấm — xuống hàng, tô đúng màu, và sửa chữ dịch máy.
SHROOM = [
    ("Màu đỏ", "shroomRed"),
    ("Màu xanh lá", "shroomGreen"),
    ("Màu vàng", "shroomYellow"),
]
TEEMO_WORDS = [
    ("Sức khỏe Chiến thuật gia", "Máu Linh Thú"),
    ("Quay lại", "Lượt đổi"),
]

# ---------------------------------------------------------------------- trait

PRIMAL_DESC = "Chọn 1 trong 4 Phước Lành Nguyên Sinh."
PRIMAL_SUB = {
    "title": "4 Phước Lành",
    "items": [
        {"label": "Gấu", "text": "Sát thương Nguyên Sinh hành quyết kẻ địch dưới 15% Máu."},
        {
            "label": "Phượng Hoàng",
            "text": "Mỗi 16 lần tướng Nguyên Sinh tham gia hạ gục, nhận 1 trang bị thành phần. Tối đa 4.",
        },
        {
            "label": "Hổ",
            "text": "Sau 6 giây, tướng Nguyên Sinh nhận 30% Tốc Độ Đánh và đội của bạn nhận 15% Tốc Độ Đánh.",
        },
        {"label": "Rùa", "text": "Đội của bạn hồi 4% Máu tối đa sau mỗi 4 giây."},
    ],
}

SOLAR_DESC = (
    "Tướng của bạn nhận lá chắn bằng 5% Máu tối đa và gây 7% sát thương phép cộng thêm. "
    "Cả hai hiệu ứng tăng thêm 2.5% với mỗi tướng 3 sao khác nhau."
)
SOLAR_SUB = {
    "title": "Thưởng thêm theo số tướng 3 sao khác nhau",
    "items": [
        # Bản tiếng Việt rụng mất tên chỉ số, chỉ còn "Nhận 25% và 15".
        # Bản tiếng Anh giữ icon: "(i:scaleAS) and (i:scaleArmor)(i:scaleMR)".
        {"label": "3", "text": "Nhận 25% Tốc Độ Đánh và 15 Giáp/Kháng Phép."},
        {"label": "5", "text": "Chuyển 50% sát thương phép cộng thêm thành sát thương chuẩn."},
        {"label": "8", "text": "Tướng 3 sao của bạn thăng hoa thành 4 sao trong giao tranh."},
    ],
}

ECLIPSE_ACTIVATION = "Trait ẩn — tự kích hoạt khi đội hình có đủ 3 Mặt Trời và 3 Mặt Trăng."

EXECUTIONER_BULLET_OLD = (
    "Sát thương chảy máu tăng lên {0}. Chính Xác: sát thương kỹ năng có thể chí mạng, "
    "cộng thêm 10% Sát Thương Chí Mạng"
)
EXECUTIONER_BULLET_NEW = "Sát thương chảy máu tăng lên {0}"
EXECUTIONER_NOTE = (
    "Chính Xác: sát thương kỹ năng có thể chí mạng, cộng thêm 10% Sát Thương Chí Mạng."
)


def load_array(path: Path) -> tuple[str, int, int, list]:
    text = path.read_text(encoding="utf-8")
    start = text.index("= [") + 2
    end = text.index("];", start) + 1
    return text, start, end, json.loads(text[start:end])


def dump_array(path: Path, text: str, start: int, end: int, data: list) -> str:
    return text[:start] + json.dumps(data, ensure_ascii=False) + text[end:]


def fix_champions(problems: list[str], report: list[str]) -> str | None:
    text, start, end, champs = load_array(CHAMPS)
    by_name = {c["name"]: c for c in champs}
    changed = 0

    for name, marker in LABEL_BREAKS:
        champ = by_name.get(name)
        if not champ:
            problems.append(f"champion không tồn tại: {name}")
            continue
        hit = 0
        for form in champ.get("forms") or []:
            html = form.get("abilityHtmlVi") or ""
            if marker not in html:
                continue
            if BR + marker in html:  # đã có sẵn
                continue
            form["abilityHtmlVi"] = html.replace(marker, BR + marker)
            hit += 1
        if hit:
            report.append(f"  xuống hàng  {name:12} {re.sub(r'<[^>]+>', '', marker).strip()}")
            changed += hit

    teemo = by_name.get("Teemo")
    if not teemo:
        problems.append("không tìm thấy Teemo")
    else:
        shrooms = words = 0
        for form in teemo.get("forms") or []:
            html = form.get("abilityHtmlVi") or ""
            for label, cls in SHROOM:
                old = f'<span class="s18-style-bright"> {label}:</span>'
                new = f'{BR}<span class="s18-shroom {cls}">{label}:</span> '
                if old in html:
                    html = html.replace(old, new)
                    shrooms += 1
            for old, new in TEEMO_WORDS:
                if old in html:
                    html = html.replace(old, new)
                    words += 1
            form["abilityHtmlVi"] = html
        # abilityVi (bản chữ trần) phải khớp phần chữ của HTML
        for old, new in TEEMO_WORDS:
            if old in (teemo.get("abilityVi") or ""):
                teemo["abilityVi"] = teemo["abilityVi"].replace(old, new)
                words += 1
        if shrooms or words:
            report.append(f"  Teemo        {shrooms} nhãn nấm + {words} cụm từ dịch máy")
            changed += shrooms + words

    if not changed:
        return None
    return dump_array(CHAMPS, text, start, end, champs)


def fix_traits(problems: list[str], report: list[str]) -> str | None:
    text, start, end, traits = load_array(TRAITS)
    by_name = {t["name"]: t for t in traits}
    changed = 0

    primal = by_name.get("Primal")
    if primal and "@TFTTrait" in (primal.get("descriptionVi") or ""):
        primal["descriptionVi"] = PRIMAL_DESC
        primal["subEffects"] = PRIMAL_SUB
        report.append("  Nguyên Sinh  bỏ token chưa resolve, dựng lại đủ 4 Phước Lành")
        changed += 1

    solar = by_name.get("Solar")
    if solar and solar.get("descriptionVi", "").startswith("(3)"):
        solar["descriptionVi"] = SOLAR_DESC
        solar["subEffects"] = SOLAR_SUB
        report.append("  Mặt Trời     tách bảng thưởng 3/5/8, bỏ tiền tố '(3)' trùng chip mốc")
        changed += 1

    eclipse = by_name.get("Eclipse")
    if eclipse and not eclipse.get("activation"):
        eclipse["activation"] = ECLIPSE_ACTIVATION
        report.append("  Thiên Thực   thêm điều kiện kích hoạt, bỏ chip mốc '0'")
        changed += 1

    execu = by_name.get("Executioner")
    if execu:
        for bp in execu.get("breakpointDetails") or []:
            bullet = bp.get("bullet")
            if bullet and bullet.get("textVi") == EXECUTIONER_BULLET_OLD:
                bullet["textVi"] = EXECUTIONER_BULLET_NEW
                execu["note"] = EXECUTIONER_NOTE
                report.append("  Đao Phủ      tách câu giải nghĩa 'Chính Xác' thành dòng nghiêng")
                changed += 1

    if not changed:
        return None
    return dump_array(TRAITS, text, start, end, traits)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true", help="chỉ báo cáo, không ghi")
    args = ap.parse_args()

    problems: list[str] = []
    report: list[str] = []
    champ_text = fix_champions(problems, report)
    trait_text = fix_traits(problems, report)

    for line in report:
        print(line)
    if not report:
        print("  (không có gì để sửa — đã áp dụng trước đó)")

    if problems:
        print("\nPROBLEMS:", file=sys.stderr)
        for p in problems:
            print("  " + p, file=sys.stderr)
        return 1

    if args.check:
        print("\n--check: không ghi gì")
        return 0

    if champ_text:
        CHAMPS.write_text(champ_text, encoding="utf-8")
        print(f"wrote {CHAMPS.relative_to(ROOT).as_posix()}")
    if trait_text:
        TRAITS.write_text(trait_text, encoding="utf-8")
        print(f"wrote {TRAITS.relative_to(ROOT).as_posix()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
