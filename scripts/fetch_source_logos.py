"""Tải logo (favicon) của các nguồn học ngoài về public/sources/ cho trang /nguon-hoc.

Tải về máy chứ không nhúng thẳng URL của họ, cũng không dùng dịch vụ favicon bên thứ ba
(kiểu google s2): tránh phụ thuộc trang ngoài còn sống hay không, tránh gửi referrer của
người đọc sang bên thứ ba, và giữ tốc độ tải ổn định.

URL nguồn lấy từ thẻ <link rel="icon"> / <link rel="apple-touch-icon"> của chính trang đó,
đọc ngày 2026-08-01 — ưu tiên bản PNG to nhất; hai trang chỉ có .ico thì script tự đổi
sang PNG bằng Pillow. Tất cả chuẩn hoá về 64x64 (hiển thị ~28px, dư cho màn retina).

Chạy lại khi thêm nguồn mới hoặc khi một logo đổi: python scripts/fetch_source_logos.py

Phụ thuộc: Pillow (PIL).
"""

import io
import urllib.request
from pathlib import Path

from PIL import Image

WEBSITE = Path(__file__).resolve().parent.parent
OUT_DIR = WEBSITE / "public" / "sources"
SIZE = 64

# key phải khớp `logo` trong src/content/learning-sources.ts
LOGOS = {
    "riot": "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/dd3cb71804eae400eb69fa6560254878beb1417f-2105x2190.png?accountingTag=TFT",
    "tftflow": "https://tftflow.com/wp-content/uploads/cropped-TFTFlow-Favicon-Two-Colors-192x192.png",
    "tftacademy": "https://tftacademy.com/apple-touch-icon.png",
    "metatft": "https://www.metatft.com/myicon3.ico",
    "tacticstools": "https://tactics.tools/android-chrome-192x192.png",
    "datatft": "https://www.datatft.com/assets/favicon-JvcPL-z8.ico",
    "lolchess": "https://cdn.dak.gg/tft/images2/favicon/android-icon-192x192.png",
}

UA = "Mozilla/5.0 (compatible; BaronTFT-logo-fetch/1.0)"


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    failures = []

    for key, url in LOGOS.items():
        try:
            raw = fetch(url)
            source = Image.open(io.BytesIO(raw))
            source_format = source.format or "?"
            source_size = source.size
            # .ico chứa nhiều kích thước trong một file — chọn bản lớn nhất rồi mới thu
            # xuống, thu từ bản 16px lên sẽ vỡ.
            if source_format == "ICO":
                source.size = max(source.info.get("sizes", [source.size]))
                source_size = source.size
            image = source.convert("RGBA").resize((SIZE, SIZE), Image.LANCZOS)
            target = OUT_DIR / f"{key}.png"
            image.save(target, "PNG", optimize=True)
            print(
                f"  {key:14s} {source_format:4s} {source_size[0]}x{source_size[1]:<5d}"
                f" -> {target.relative_to(WEBSITE)} ({target.stat().st_size} B)"
            )
        except Exception as exc:  # noqa: BLE001
            failures.append(f"{key}: {type(exc).__name__}: {exc}")

    if failures:
        raise SystemExit("Tai that bai:\n  " + "\n  ".join(failures))

    # Logo gần trắng sẽ chìm trên nền sáng của thẻ — báo để đặt logoOnDark: true trong
    # src/content/learning-sources.ts thay vì để nó vô hình mà không ai biết.
    for key in LOGOS:
        image = Image.open(OUT_DIR / f"{key}.png").convert("RGBA")
        pixels = image.load()
        visible = [
            0.2126 * pixels[x, y][0] + 0.7152 * pixels[x, y][1] + 0.0722 * pixels[x, y][2]
            for y in range(image.height)
            for x in range(image.width)
            if pixels[x, y][3] > 40
        ]
        if visible and sum(visible) / len(visible) > 190:
            print(f"  ! {key}: logo gan nhu trang — dat logoOnDark: true cho nguon nay")

    print(f"Xong {len(LOGOS)} logo -> {OUT_DIR.relative_to(WEBSITE)}")


if __name__ == "__main__":
    main()
