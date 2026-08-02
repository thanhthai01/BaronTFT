"""Áp lại toàn bộ các bản vá nội dung Set 18 bằng một lệnh.

VÌ SAO CẦN
----------
`src/content/set18/*.ts` là file GENERATED. Loạt sửa bản dịch và sửa lỗi dữ liệu
nằm trực tiếp trong đó, nên chạy lại generator sẽ ghi đè và mất sạch — mà trang
vẫn build được, không có gì báo lỗi.

Chốt chặn là `tests/unit/set18-content.test.ts`: nó chạy trong `pnpm test` nên
mất fix là đỏ ngay. Script này là bước KHÔI PHỤC khi test đỏ.

    python apply_all_set18_fixes.py     # áp lại tất cả
    python apply_all_set18_fixes.py --check   # chỉ xem còn gì phải áp

THỨ TỰ
------
Ba script chạy theo thứ tự liệt kê bên dưới, nhưng thứ tự GIỮA CHÚNG không quan
trọng — đã kiểm bằng thực nghiệm: đảo apply_riot_official_vi và
apply_vi_house_style cho ra kết quả byte-identical. Thứ tự thật sự quan trọng
nằm BÊN TRONG apply_set18_content_fixes.py (chuẩn hoá thuật ngữ phải chạy trước
phần viết lại câu) và đã được khoá trong chính file đó.

Cả ba đều idempotent: chạy lại trên cây đã áp rồi thì báo "không có gì để sửa"
chứ không hỏng.
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

STEPS = [
    ("apply_riot_official_vi.py", "thuật ngữ theo bài viết chính thức của Riot"),
    ("apply_vi_house_style.py", "quyết định riêng của trang (Hoả Ngục, Kha'Zix)"),
    ("apply_set18_content_fixes.py", "vá chỗ dữ liệu game hỏng thật"),
]

GUARD = "check_stale_vi_terms.py"


def run(script: str, extra: list[str]) -> tuple[int, str]:
    proc = subprocess.run(
        [sys.executable, str(ROOT / script), *extra],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        cwd=ROOT,
    )
    return proc.returncode, (proc.stdout or "") + (proc.stderr or "")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true", help="chỉ báo cáo, không ghi gì")
    args = ap.parse_args()
    extra = ["--check"] if args.check else []

    failed = []
    for script, what in STEPS:
        if not (ROOT / script).exists():
            print(f"THIẾU {script}", file=sys.stderr)
            failed.append(script)
            continue
        print(f"\n=== {script} — {what}")
        code, out = run(script, extra)
        print("\n".join("  " + line for line in out.strip().splitlines()) or "  (im lặng)")
        if code != 0:
            failed.append(script)

    # Chốt chặn chạy cuối, và luôn chạy kể cả ở chế độ --check.
    print(f"\n=== {GUARD}")
    code, out = run(GUARD, [])
    print("\n".join("  " + line for line in out.strip().splitlines()) or "  (im lặng)")
    if code != 0:
        failed.append(GUARD)

    if failed:
        print(f"\nCHƯA XONG — lỗi ở: {', '.join(failed)}", file=sys.stderr)
        return 1

    print("\nXong. Chạy `pnpm test` để chốt lại bằng tests/unit/set18-content.test.ts.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
