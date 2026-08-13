# 12 lõi nâng cấp cần soát tay — vntft.com vs DB

Đối chiếu bản dịch vntft.com/loi-nang-cap với `set18_augments` hiện có trong DB.
Cả 12 augment dưới đây bị agent dịch thuật đánh dấu `needs_manual_review` vì phát hiện
**lệch cơ chế** (không chỉ lệch số liệu), nên `description_vi` **hiện vẫn giữ nguyên bản DB
gốc**, chưa áp dụng gì từ vntft. Bạn xem và quyết định: giữ nguyên DB / dùng bản vntft /
merge tay theo cách khác.

---

## 1. Một Hai Ba (One Two Three)

- **id**: `augment:da_18_onestwosthree`
- **Độ hiếm**: Silver

**DB hiện tại (giữ nguyên):** *chốt theo db*
> Nhận 1 tướng 1 vàng, 1 tướng 2 vàng và 1 tướng 3 vàng.

**vntft.com (bị từ chối áp dụng):**
> Nhận 2 tướng 1-vàng, 2 tướng 2-vàng và 1 tướng 3-vàng.

**Lý do cần soát tay:**
vntft ghi số lượng tướng khác hẳn db (2/2/1 so với 1/1/1 của db), không phải chỉ lệch số liệu do lỗi thời mà có thể là cấu trúc augment khác — không đủ tin cậy để suy đoán cách khớp, giữ nguyên db.

---

## 2. Tất Tay Bậc Đồng II (Bronze For Life II) — ✅ ĐÃ KIỂM TRA LẠI, XÁC NHẬN GIỮ DB

- **id**: `augment:da_bronzeforlifeii`
- **Độ hiếm**: Prismatic

**DB hiện tại (giữ nguyên):** *chốt theo db*
> Đội của bạn nhận 2% Khuếch Đại Sát Thương và 4 Giáp & Kháng Phép cho mỗi tộc/hệ bậc Đồng.

**vntft.com (bị từ chối áp dụng):** *đây có lẽ là mô tả của một augment khác, bạn có thể kiểm tra lại*
> Đội của bạn nhận 2.5% Khuếch Đại Sát Thương và 4 Giáp & Kháng Phép với mỗi tộc/hệ bậc Đồng. Nhận 1 Vương Miện Chiến Thuật. Lá Chắn, Áo Choàng và Vương Miện Chiến Thuật sẽ cho chủ sở hữu thêm 20% Tốc Độ Đánh, 25% Sức Mạnh Công Kích và 30% Sức Mạnh Phép Thuật.

**Lý do cần soát tay:**
vntft mô tả thêm cơ chế Vương Miện Chiến Thuật/Lá Chắn/Áo Choàng hoàn toàn không có trong db — có thể là dữ liệu của phiên bản/patch khác, không đủ tin cậy để gộp nên giữ nguyên db.

**Kết quả kiểm tra lại (2026-08-14):** đúng như bạn nghi ngờ — đây là **lỗi parser của tôi**, không phải augment khác thật. Trang vntft.com có link "xem chi tiết" sau đoạn mô tả của "Tất Tay Bậc Đồng II", khiến regex trích xuất nuốt luôn nội dung của augment kế tiếp trong danh sách ("Lên Ngôi Vương" — trùng khớp chính xác với đoạn "Vương Miện Chiến Thuật..." bị lẫn vào). Đã sửa parser, tách đúng lại 2 augment riêng biệt. Augment "Lên Ngôi Vương" (`augment:da_coronation`) đã được cập nhật bản dịch đúng theo vntft ở dòng update riêng. Với "Tất Tay Bậc Đồng II", giữ nguyên bản DB là quyết định đúng.

---

## 3. Cấy Ghép Siêu Công Nghệ II (Cybernetic Implants II)

- **id**: `augment:da_cyberneticimplants_gold`
- **Độ hiếm**: Gold

**DB hiện tại (giữ nguyên):** *chốt theo db*
> Tướng có sở hữu trang bị nhận 100 Máu và 15% Sức Mạnh Công Kích.

**vntft.com (bị từ chối áp dụng):**
> Đồng minh nhận 100 Máu và 15% Sức Mạnh Công Kích. Nhận 1 Kiếm B.F.

**Lý do cần soát tay:**
vntft mô tả phạm vi hiệu ứng khác (toàn bộ đồng minh thay vì chỉ tướng có trang bị) và có thêm cơ chế "Nhận 1 Kiếm B.F." không có trong db — nghi ngờ là dữ liệu phiên bản khác, giữ nguyên db.

---

## 4. Cuộc Viễn Chinh (Expedition)

- **id**: `augment:da_expedition`
- **Độ hiếm**: Silver

**DB hiện tại (giữ nguyên):** *đúng vậy, các bản cập nhật trên pbe đã thay đổi nâng cấp này, hiện tại theo db là chuẩn*
> Khi bắt đầu giao tranh, mất đi vị tướng ở ô ngoài cùng bên phải hàng dự bị. Sau khi tổng giá tướng mất đi theo cách này là 33 vàng, nhận một phần thưởng mạnh mẽ. Nhận ngay 2 tướng 5 vàng, 1 nâng cấp masterwork và 1 component anvil (bugfix — trước đó trả sai loot).

**vntft.com (bị từ chối áp dụng):**
> Khi bắt đầu giao tranh, mất đi vị tướng ở ô ngoài cùng bên phải hàng dự bị. Sau khi tổng giá tướng mất đi theo cách này là 33 vàng, nhận một phần thưởng mạnh mẽ. Nhận ngay 1 tướng 3 vàng.

**Lý do cần soát tay:**
Phần thưởng cuối cùng khác biệt về loại phần thưởng chứ không chỉ số liệu: DB ghi "2 tướng 5 vàng, 1 nâng cấp masterwork và 1 component anvil (bugfix)", vntft ghi "1 tướng 3 vàng". Không rõ đây có phải cùng một vị trí số liệu hay là mô tả phần thưởng đã đổi hẳn qua patch/bugfix, nên giữ nguyên bản DB để tránh sai lệch cơ chế.

---

## 5. Thép Mạ Vàng (Gilded Steel)

- **id**: `augment:da_gildedsteel`
- **Độ hiếm**: Gold

**DB hiện tại (giữ nguyên):** *chốt theo db*
> Nhận 2 tướng 5 vàng. Nếu bạn triển khai ít nhất 1 tướng 5 vàng, các tướng từ 1 đến 4 vàng của bạn nhận được 8% Chống Chịu.
>
> Tactician's Crown K.O. Đại Chiến Anh Hùng, 2025

**vntft.com (bị từ chối áp dụng):**
> Nhận 3 tướng 5 vàng không phải Đỡ Đòn. Nếu bạn sử dụng tướng 5 vàng, các tướng từ 1 đến 4 vàng của bạn nhận được 8% Chống Chịu.

**Lý do cần soát tay:**
vntft ghi "3 tướng 5 vàng không phải Đỡ Đòn" trong khi DB ghi "2 tướng 5 vàng" không kèm điều kiện loại trừ tộc Đỡ Đòn — vừa lệch số lượng vừa có thể lệch cơ chế (giới hạn tộc hệ), không đủ chắc chắn để gộp nên giữ nguyên bản DB.

---

## 6. Sống Vội (Hustler)

- **id**: `augment:da_hustler`
- **Độ hiếm**: Gold

**DB hiện tại (giữ nguyên):** *chốt theo db*
> Bạn không còn lợi tức, nhưng sẽ nhận 3 vàng khi bắt đầu mỗi vòng giao tranh người chơi. Nhận ngay 3 vàng.
>
> Lợi tức là lượng vàng bạn nhận được thêm từ mỗi 10 vàng bạn giữ lại.

**vntft.com (bị từ chối áp dụng):**
> Bạn sẽ nhận 2 vàng và 2 XP thay vì lợi tức khi bắt đầu mỗi vòng giao tranh người chơi. Nhận ngay 1 vàng. Lợi tức là lượng vàng bạn nhận được thêm từ mỗi 10 vàng bạn giữ lại.

**Lý do cần soát tay:**
vntft mô tả cơ chế khác hẳn (nhận 2 vàng + 2 XP thay vì lợi tức, và số vàng nhận ngay là 1) — không rõ có phải cùng phiên bản augment với DB (thay lợi tức bằng 3 vàng mỗi vòng, không nhắc XP) hay không, nên giữ nguyên bản DB.

---

## 7. Khảm Bảo Thạch I (Jeweled Lotus I)

- **id**: `augment:da_jeweledlotus_i`
- **Độ hiếm**: Gold

**DB hiện tại (giữ nguyên):** *chốt theo db*
> Đội của bạn nhận 10% Tỉ Lệ Chí Mạng và Chuẩn Xác
>
> Chuẩn Xác: Sát thương kỹ năng có thể chí mạng. Chỉ số Chuẩn Xác cộng thêm tăng 10% Sát Thương Chí Mạng.

**vntft.com (bị từ chối áp dụng):**
> Đội của bạn nhận 20% Tỉ Lệ Chí Mạng và các Kỹ Năng của họ có thể chí mạng.

**Lý do cần soát tay:**
vntft mô tả cơ chế khác (20% Tỉ Lệ Chí Mạng, không có chỉ số/khái niệm Chuẩn Xác, chỉ nói "Kỹ Năng có thể chí mạng") — có thể là bản mô tả cũ trước khi có cơ chế Chuẩn Xác, số liệu chênh lệch quá lớn để đối chiếu tin cậy, nên giữ nguyên bản DB.

---

## 8. Song Vệ (Twin Guardians)

- **id**: `augment:da_lineup`
- **Độ hiếm**: Silver

**DB hiện tại (giữ nguyên):** *chốt theo db*
> Đội của bạn nhận 2 Giáp và Kháng Phép với mỗi đồng minh bắt đầu giao tranh ở 2 hàng đầu.

**vntft.com (bị từ chối áp dụng):**
> Nếu bạn có đúng 2 đồng minh ở hàng đầu, tăng cho họ 40 Giáp và 40 Kháng Phép.

**Lý do cần soát tay:**
vntft mô tả cơ chế khác hẳn (chỉ có hiệu lực khi có đúng 2 đồng minh hàng đầu, cộng thẳng 40/40) trong khi DB mô tả cộng dồn theo từng đồng minh — không rõ có phải cùng phiên bản/augment, nên giữ nguyên bản DB.

---

## 9. Đội Hình Tối Ưu (Max Build)

- **id**: `augment:da_maxbuild`
- **Độ hiếm**: Gold

**DB hiện tại (giữ nguyên):** *chốt theo db*
> Nhận 10 lượt đổi Cửa Hàng miễn phí. Khi bạn đạt cấp 9, nhận 3 lượt làm mới Cửa Hàng miễn phí và 1 Máy Sao Chép Tướng
>
> Giải Vô Địch Thiên Hà, 2020

**vntft.com (bị từ chối áp dụng):**
> Nhận 1 Máy Sao Chép Tướng và 5 lượt đổi Cửa Hàng miễn phí. Tại Giai Đoạn 6-1, nhận một lần nữa. Giải Vô Địch Thiên Hà, 2020

**Lý do cần soát tay:**
vntft mô tả cơ chế khác (nhận Máy Sao Chép Tướng ngay từ đầu cùng 5 lượt đổi, lặp lại ở Giai Đoạn 6-1) trong khi DB mô tả 10 lượt đổi ngay + máy sao chép chỉ đến khi đạt cấp 9 — chênh lệch cơ chế lớn, giữ nguyên bản DB.

---

## 10. Kiên Nhẫn Học Tập (Patience Is A Virtue)

- **id**: `augment:da_patienceisavirtue`
- **Độ hiếm**: Silver

**DB hiện tại (giữ nguyên):** *chốt theo db*
> Mỗi vòng đấu, nhận 2 lượt đổi miễn phí nếu bạn không mua tướng ở vòng đấu trước.

**vntft.com (bị từ chối áp dụng):**
> Sau khi giao chiến với người chơi, nhận thêm 2 XP nếu bạn thắng hoặc 3 XP nếu bạn thua.

**Lý do cần soát tay:**
vntft mô tả một cơ chế hoàn toàn khác (nhận thêm XP sau giao tranh) không liên quan gì đến lượt đổi Cửa Hàng trong DB — có thể dữ liệu vntft sai/lỗi thời hoàn toàn cho augment này, giữ nguyên bản DB.

---

## 11. Kim Long (The Golden Dragon) — ✅ ĐÃ ÁP DỤNG

- **id**: `augment:da_thegoldendragon`
- **Độ hiếm**: Gold

**Trước (placeholder chưa resolve):**
> Nhận 1 Giáp Đại Hãn. Các tướng mang Giáp Đại Hãn chiếm 2 vị trí trong đội hình nhưng nhận thêm @BonusHealth@ Máu và @DurabilityPct\*100@% Chống Chịu.

**vntft.com:**
> Nhận 1 Giáp Đại Hãn. Các tướng mang Giáp Đại Hãn chiếm 2 vị trí trong đội hình nhưng nhận thêm 500 Máu và 20% Chống Chịu. Giáp Đại Hãn này mang lại vàng và tăng sức mạnh chiến đấu. Giải Vô Địch Thế Giới Rồng, 2022

**Đã ghi vào DB (áp dụng theo yêu cầu "chốt theo mô tả này", nhưng sửa số Máu):**
> Nhận 1 Giáp Đại Hãn. Các tướng mang Giáp Đại Hãn chiếm 2 vị trí trong đội hình nhưng nhận thêm 700 Máu và 20% Chống Chịu. Giáp Đại Hãn này mang lại vàng và tăng sức mạnh chiến đấu.
>
> Giải Vô Địch Thế Giới Rồng, 2022

**Ghi chú:** trường `description` (tiếng Anh) trong DB thực ra không hề chứa placeholder — nó đã có số liệu thật ("700 Health and 20% Durability"), chỉ riêng `description_vi` bị bỏ sót lúc dịch nên còn placeholder `@BonusHealth@`/`@DurabilityPct*100@`. vntft ghi 500 Máu là sai lệch so với nguồn gốc tiếng Anh (700) — đã dùng cấu trúc câu của vntft nhưng thay đúng số 700 theo nguồn gốc, được xác nhận qua câu hỏi lại vào 2026-08-14.

---

## 12. Chờ Đợi Xứng Đáng (Worth the Wait)

- **id**: `augment:da_worththewait`
- **Độ hiếm**: Gold

**DB hiện tại (giữ nguyên):** *chốt theo db*
> Nhận 1 tướng 1 vàng ngẫu nhiên. Nhận 1 bản sao nữa của tướng đó khi bắt đầu mỗi vòng đấu cho đến hết trận.

**vntft.com (bị từ chối áp dụng):**
> Nhận 1 tướng 1 vàng ngẫu nhiên. Sau 2 vòng đấu, nhận 1 bản sao của tướng đó khi bắt đầu mỗi vòng đấu cho đến hết trận.

**Lý do cần soát tay:**
vntft_description thêm cơ chế "Sau 2 vòng đấu" trước khi bản sao bắt đầu xuất hiện, trong khi db_description_vi mô tả hiệu ứng có ngay từ vòng đầu (không có độ trễ). Không rõ đây là augment đã đổi cơ chế theo patch hay vntft có thông tin ngoài — giữ nguyên db, cần người kiểm tra lại patch note gốc trước khi thêm mốc thời gian trễ.
