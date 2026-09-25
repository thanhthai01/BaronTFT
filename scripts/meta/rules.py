"""Quy tắc xếp loại đội hình dùng chung cho gen_meta_comps.py và meta_snapshot.py compare.

Nguyên tắc (sau 2 vòng phản biện, xem skill tft-meta-update):
- Ký hiệu (verdict) chỉ nói SỨC MẠNH HIỆN TẠI. Biến động (vừa tụt/mạnh lên) là nhãn riêng, không
  trộn vào ký hiệu — trước đây ✕ vừa nghĩa "yếu sẵn" vừa nghĩa "vừa tụt".
- Thay ngưỡng cứng "≥ 1.000 trận" bằng độ tin cậy thống kê: một đội chỉ là ★ khi chắc chắn tốt hơn
  mức hoà lobby (4,50) sau khi trừ sai số, nên ngưỡng tự nới/siết theo cỡ mẫu và theo rank.
- "Bị tranh" tính theo CARRY chính (cộng mọi cụm dùng cùng carry cầm đồ), vì hai biến thể của cùng
  một carry vẫn giành nhau tướng đó.
"""
import math

LOBBY_AVG = 4.50        # hạng TB của cả lobby — mọi lát rank đều đúng bằng 4,50 theo định nghĩa
SD_PLACE = 2.29         # độ lệch chuẩn thứ hạng 1–8 (phân phối đều)

META_MAX_AVG = 4.40     # ★ cần hạng TB ≤ 4,40 …
CONFIDENCE_Z = 2.0      # … và cận trên (avg + 2 sai số) vẫn < 4,50
VIABLE_MAX_AVG = 4.65   # ○ tới mức này; tệ hơn là ✕
PREDICTED_MAX_AVG = 4.45
THIN_SAMPLE = 1000      # dưới mức này `prediction` (theo bản vá) được phép ghi đè ký hiệu

FALLING_DROP = 0.15     # nhãn "Vừa tụt": tệ đi ≥ 0,15 hạng và vượt nhiễu
TREND_STEP = 0.05       # mũi tên ▲▼

LOBBY_OPPONENTS = 7
CONTESTED_PICK = 10.0   # ≥ 10% ≈ trung bình 0,7 đối thủ/ván, ~52% ván có ≥ 1 người cùng carry
HOLDER_SHARE = 0.5      # tướng cầm đồ chính: ≥ 50% lượt build của tướng cầm đồ nhiều nhất cụm
HOLD_TOP4 = 54.0        # "Giữ điểm": Top 4 ≥ 54% và chắc chắn > 50%
CEILING_WIN = 18.0      # "Ăn top 1": Top 1 ≥ 18% và chắc chắn > 12,5%


def place_se(n):
    return SD_PLACE / math.sqrt(n) if n > 0 else float('inf')


def prop_se(p_pct, n):
    p = p_pct / 100
    return math.sqrt(p * (1 - p) / n) * 100 if n > 0 else float('inf')


def significant_change(old, new):
    """Hạng TB đổi vượt 2 sai số chuẩn gộp của hai mẫu."""
    if not old['n'] or not new['n']:
        return False
    se = SD_PLACE * math.sqrt(1 / old['n'] + 1 / new['n'])
    return abs(new['avg'] - old['avg']) >= CONFIDENCE_Z * se


def verdict(s, prediction=None):
    """★ meta · ◆ predicted · ○ viable · ✕ avoid — chỉ dựa trên số liệu hiện tại (+ dự đoán bản vá)."""
    n, avg = s['n'], s['avg']
    confident = avg + CONFIDENCE_Z * place_se(n) < LOBBY_AVG
    if prediction and n < THIN_SAMPLE:
        if prediction.get('direction') == 'up':
            return 'predicted'
        if prediction.get('direction') == 'down':
            return 'viable' if avg <= VIABLE_MAX_AVG else 'avoid'
    if avg <= META_MAX_AVG:
        return 'meta' if confident else 'predicted'  # số tốt nhưng mẫu chưa đủ để chắc
    if avg <= PREDICTED_MAX_AVG and n < THIN_SAMPLE:
        return 'predicted'
    if avg <= VIABLE_MAX_AVG:
        return 'viable'
    return 'avoid'


def trend(new_avg, old_avg):
    delta = new_avg - old_avg
    return 'up' if delta <= -TREND_STEP else 'down' if delta >= TREND_STEP else 'flat'


def falling(old, new):
    return bool(old) and new['avg'] - old['avg'] >= FALLING_DROP and significant_change(old, new)


def shapes(s):
    out = []
    if s['top4'] >= HOLD_TOP4 and s['top4'] - 50 > CONFIDENCE_Z * prop_se(s['top4'], s['n']):
        out.append('hold')
    if s['win'] >= CEILING_WIN and s['win'] - 12.5 > CONFIDENCE_Z * prop_se(s['win'], s['n']):
        out.append('ceiling')
    return out


def item_holders(info, share=HOLDER_SHARE):
    """Tướng cầm đồ chính của một cụm (loại carry phụ để nhãn "Bị tranh" không bị thổi phồng)."""
    totals = {}
    for b in info.get('builds', []):
        totals[b['unit']] = totals.get(b['unit'], 0) + b['count']
    if not totals:
        return set()
    top = max(totals.values())
    return {u for u, c in totals.items() if c >= share * top}


def carry_contest_pick(carry_api, own_cluster, catalog, stats):
    """% đội hình có carry này cầm đồ: cụm của đội + mọi cụm khác mà carry đó là tướng cầm đồ chính."""
    total = stats.get(own_cluster, {}).get('pick', 0.0)
    for c, info in catalog.items():
        if c != own_cluster and c in stats and carry_api in item_holders(info):
            total += stats[c]['pick']
    return total


def expected_opponents(pick_pct):
    return LOBBY_OPPONENTS * pick_pct / 100
