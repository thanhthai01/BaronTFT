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
import collections
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

# --- Chuẩn hoá thuật ngữ trong mô tả kỹ năng ---------------------------------
# Mỗi cặp dưới đây là "dạng thiểu số -> dạng đa số" đo được trên chính 65 tướng,
# không phải cách viết do mình nghĩ ra:
#   Nội Tại: 25 / Nội tại: 3 / Thụ động: 3      Kích Hoạt: 21 / Kích hoạt: 3 / Tích cực: 3
#   sát thương phép 60 / sát thương phép thuật 3  Máu tối đa 12 / Sức khỏe tối đa 2
#   Thiêu Đốt 8 / Bỏng 2                          Bùa <màu> 5 / Buff <màu> 3
TERM_FIXES: list[tuple[str, str]] = [
    ("Thụ động:", "Nội Tại:"),
    ("Nội tại:", "Nội Tại:"),
    ("Tích cực:", "Kích Hoạt:"),
    ("Kích hoạt:", "Kích Hoạt:"),
    ("sát thương phép thuật", "sát thương phép"),
    ("Sức khỏe tối đa", "Máu tối đa"),
    ("Sức khỏe", "Máu"),
    ("Bỏng", "Thiêu Đốt"),
    ("vật phẩm", "trang bị"),
    ("Kháng chịu", "Kháng Chịu"),
    # "deal damage" bị dịch thành "xử lý" (LeBlanc, Ashe)
    ("xử lý ", "gây "),
    # Nhãn bùa của Quái Rừng: 5 con dùng "Bùa", 3 con dùng "Buff"
    ("Buff Tím:", "Bùa Tím:"),
    ("Buff Xanh Lá:", "Bùa Xanh Lá:"),
    ("Bùa đỏ:", "Bùa Đỏ:"),
    # Krug: bản tiếng Anh là "Slate Buff" (xám đá). Bản tiếng Việt để nguyên
    # "Beige" — vừa chưa dịch vừa sai màu. "Xám Đá" để phân biệt với "Bùa Xám"
    # của Murkwolf (Grey Buff). Đây là chữ mình chọn, Riot không có bản đúng.
    ("Hiệu ứng Beige Buff:", "Bùa Xám Đá:"),
    # Dịch máy sai nghĩa hẳn — đối chiếu từng câu với bản tiếng Anh:
    # Ashe   "physical damage"        -> "thiệt hại vật chất"
    ("thiệt hại vật chất", "sát thương vật lý"),
    # Krug   "split into two Kruglettes" -> "tách thành hai chai Kruglette"
    #        (Kruglette là Quái Đá Nhỏ theo chính danh sách tướng của trang)
    ("chai Kruglette", "Quái Đá Nhỏ"),
    # Teemo  "mushrooms that deal X damage" -> "nấm dùng để ĐIỀU TRỊ X sát thương"
    ("dùng để điều trị ", "gây "),
    # Scuttlecrab "Burrow underground" -> "Chui xuống dị thần"
    ("Chui xuống dị thần", "Chui xuống lòng đất"),
    # LeBlanc dư dấu ba chấm giữa câu: "sẽ có...10% Cơ hội"
    ("sẽ có...", "sẽ có "),
    # Omnivamp: thuật ngữ chính thức trong bài viết của Riot
    ("Omnivamp", "Hút Máu Toàn Phần"),
    ("Cơ hội", "cơ hội"),
]

# --- Viết lại câu bị dịch máy hỏng nghĩa -------------------------------------
# Ba tướng dưới đây không sửa được bằng thay từ: câu tiếng Việt đã vỡ cấu trúc
# (vế thừa, dấu gạch ngang lạc, mệnh đề đảo lộn). Bản dưới là mình viết lại, đối
# chiếu từng vế với bản tiếng Anh trong lookup; MỌI <span> số được giữ nguyên
# vị trí và nội dung, chỉ đổi phần chữ xung quanh.
V = '<span class="s18-value">'
VP = '<span class="s18-value s18-style-colorPhysical">'
VM = '<span class="s18-value s18-style-colorMagic">'
IAD = '<span class="s18-icon s18-icon-icon_ad"></span>'
IAP = '<span class="s18-icon s18-icon-icon_ap"></span>'

REWRITES: list[tuple[str, str, str]] = [
    # Ashe — EN: "Fire an arrow through the longest line of enemies that deals X
    # physical damage, reduced by Y per enemy hit (minimum Z). The arrow leaves a
    # trail for N seconds that deals A + B% max Health physical damage per second
    # to enemies within and C% Slows them."
    # Bản cũ mở đầu bằng một vế thừa ("...có khả năng gây sát thương.") rồi lặp
    # lại "gây sát thương" ở giữa câu, và "xé toạc một khe nứt" là dịch sai của
    # "leaves a trail".
    (
        "Ashe",
        'Bắn một mũi tên vào kẻ địch ở xa nhất có khả năng gây sát thương. ' + VP + IAD
        + '260/400/1000</span> sát thương vật lý, giảm thiểu bởi ' + V + '40%</span>'
        + ' mỗi kẻ địch trúng đòn (tối thiểu) ' + V + '20%</span> Mũi tên xé toạc một khe nứt cho '
        + V + '4</span> giây gây ' + VP + IAD + IAP + '30/46/220</span> +'
        + '<span class="s18-value s18-style-colorPhysical">2%</span>'
        + ' Mục tiêu là lượng máu tối đa gây sát thương vật lý mỗi giây và ' + V + '20</span> %',
        'Bắn một mũi tên xuyên qua hàng kẻ địch dài nhất, gây ' + VP + IAD
        + '260/400/1000</span> sát thương vật lý, giảm ' + V + '40%</span>'
        + ' mỗi kẻ địch trúng đòn (tối thiểu ' + V + '20%</span>). Mũi tên để lại một vệt trong '
        + V + '4</span> giây, gây ' + VP + IAD + IAP + '30/46/220</span> + '
        + '<span class="s18-value s18-style-colorPhysical">2%</span>'
        + ' Máu tối đa mỗi giây lên kẻ địch đứng trong vệt và ' + V + '20</span>%',
    ),
    # Morgana — EN: "Curse N nearby enemies ... Then, spawn a H Hex withering zone
    # for the same duration that deals D magic damage per second. Cursed enemies
    # take E more damage."
    # "sinh ra 2 - Gây hiệu ứng làm suy yếu vùng ảnh hưởng" là câu vỡ: số 2 là bán
    # kính ô của vùng, không phải số lượng.
    (
        "Morgana",
        'Lời nguyền ' + V + '3</span> kẻ thù gần đó và sinh ra ' + V + '2</span>'
        + ' - Gây hiệu ứng làm suy yếu vùng ảnh hưởng trong 4 giây, gây sát thương. '
        + VM + IAP + '40/60/500</span> mỗi giây. Kẻ thù bị nguyền rủa mất '
        + VM + IAP + '18/27/240</span> Sát thương mỗi lời nguyền càng cao.',
        'Nguyền rủa ' + V + '3</span> kẻ địch gần đó, rồi tạo vùng héo úa bán kính '
        + V + '2</span> ô trong 4 giây, gây ' + VM + IAP + '40/60/500</span>'
        + ' sát thương phép mỗi giây. Kẻ địch bị nguyền rủa chịu thêm '
        + VM + IAP + '18/27/240</span> sát thương.',
    ),
    # Krug — EN: "Slate Buff: On death, Krug and Kruglettes Shield allies for X
    # max Health." Bản cũ kết câu bằng "trong một khoảng thời gian nhất định."
    # rồi bỏ lửng "10% Máu tối đa" thành câu riêng, và còn sót "Kruglettes".
    (
        "Krug",
        ' Hồi máu tối đa, sau đó lao vào mục tiêu, gây sát thương. '
        + '<span class="s18-value s18-style-colorPhysical">'
        + '<span class="s18-icon s18-icon-icon_ad"></span>'
        + '<span class="s18-icon s18-icon-icon_health"></span>245/310/445</span> sát thương.'
        + ' Hiệu ứng Beige Buff: Khi chết, Krug và Kruglettes tạo khiên bảo vệ cho đồng minh'
        + ' trong một khoảng thời gian nhất định.' + V + '10%</span> Sức khỏe tối đa.',
        ' Máu tối đa, sau đó lao vào mục tiêu, gây '
        + '<span class="s18-value s18-style-colorPhysical">'
        + '<span class="s18-icon s18-icon-icon_ad"></span>'
        + '<span class="s18-icon s18-icon-icon_health"></span>245/310/445</span> sát thương.'
        + '<br><br><span class="s18-style-bright">Bùa Xám Đá:</span> Khi chết, Krug và Quái Đá Nhỏ'
        + ' tạo lá chắn cho đồng minh bằng ' + V + '10%</span> Máu tối đa.',
    ),
]


# --- Thiếu dấu cách quanh số ---------------------------------------------------
# Template của Riot nối thẳng <TFTCurveTable/> vào chữ liền trước hoặc liền sau,
# nên ra "lên3 kẻ thù", "224/264/334Sức khỏe", "giảm đi20% mỗi ô".
GLUE_BEFORE = re.compile(r'([0-9A-Za-zÀ-ỹ)\]"”%])(<span class="s18-(?:value|icon))')
GLUE_AFTER = re.compile(r"(</span>)([A-Za-zÀ-ỹ])")


def fix_spacing(html: str) -> tuple[str, int]:
    out, n = GLUE_BEFORE.subn(r"\1 \2",html)
    out, n2 = GLUE_AFTER.subn(r"\1 \2",out)
    return out, n + n2


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

    # Viết lại câu vỡ cấu trúc (chạy TRƯỚC phần thay từ để khớp nguyên văn).
    for name, old, new in REWRITES:
        champ = by_name.get(name)
        if not champ:
            problems.append(f"champion không tồn tại: {name}")
            continue
        hit = 0
        for form in champ.get("forms") or []:
            html = form.get("abilityHtmlVi") or ""
            if old in html:
                form["abilityHtmlVi"] = html.replace(old, new)
                hit += 1
        if hit:
            report.append(f"  viết lại    {name}")
            changed += hit

    # Chuẩn hoá thuật ngữ + chèn dấu cách thiếu, áp cho toàn bộ 65 tướng.
    terms = collections.Counter()
    spaces = collections.Counter()
    for champ in champs:
        for form in champ.get("forms") or []:
            html = form.get("abilityHtmlVi") or ""
            for old, new in TERM_FIXES:
                if old in html:
                    terms[f"{old} -> {new}"] += html.count(old)
                    html = html.replace(old, new)
            html, n = fix_spacing(html)
            if n:
                spaces[champ["name"]] += n
            form["abilityHtmlVi"] = html
        plain = champ.get("abilityVi") or ""
        for old, new in TERM_FIXES:
            if old in plain:
                plain = plain.replace(old, new)
        champ["abilityVi"] = plain

    for label, n in terms.most_common():
        report.append(f"  thuật ngữ   {n:3}x  {label}")
        changed += n
    if spaces:
        report.append(
            f"  dấu cách    {sum(spaces.values())} chỗ / {len(spaces)} tướng "
            f"({', '.join(list(spaces)[:5])}…)"
        )
        changed += sum(spaces.values())

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
