# Patch TFT18.1ae — PBE Big Balance Pass (8/14/2026)

**Nguồn:** https://x.com/TheTruexy/status/2088342541288755224 (đăng 2:10 AM · Aug 15, 2026 giờ đăng bài trên X — nội dung tự ghi ngày "(8/14)")
**Phiên bản dự kiến:** PBE 14/08/2026 (18.1ae) — kế tiếp trực tiếp sau 18.1ad (12/08/2026); không có bản vá ngày 13/08 (Truexy tự xác nhận nghỉ 1 ngày để dồn cho patch lớn này).
**Quy ước mũi tên:** ▲ xanh = buff, ▼ đỏ = nerf, theo đúng ảnh gốc Truexy — đã đối chiếu tay 2 điểm mờ với người dùng (xem ghi chú Champions/Traits bên dưới).

Tóm tắt của Truexy: patch lớn, dự kiến chỉ còn 1-2 đợt nữa trước khi khoá bản đầu tiên (lock in first patch). Mục tiêu giảm độ phân cực ở vài dây reroll được Wisp tempo đẩy mạnh. Kèm thêm bugfix Blackthorn (Damage Amp sai + sacrifice value cập nhật trễ — tạo ra bug "Rengar Blackthorn"), Lux đổi hình dạng sai lúc combat, Death's Defiance gây dư sát thương cho người mang.

---

## Champions

### 1 Cost
| Tướng | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Akali | `champion:tft18_akali` | AP Form Spell Damage: 155/235/385/650 → 140/210/340/585 | Nerf |
| Camille | `champion:tft18_camille` | Shield: 60/85/160 → 60/90/200 | Buff |
| Kobuko | `champion:tft18_kobuko` | Heal: 265/315/435 → 265/315/460 | Buff |
| Rakan | `champion:tft18_rakan` | Mana: 20/90 → 35/105; Shield: 250/300/375 → 270/320/415 | Nerf |
| Varus | `champion:tft18_varus` | Spell Damage: 350/525/840 AD → 385/580/925 AD | Buff |

### 2 Cost
| Tướng | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Teemo | `champion:tft18_teemo` | Large Shroom Damage: 150/225/350 → 135/200/310 AP | Nerf |
| Warwick | `champion:tft18_warwick` | Spell Stacking Attack Speed: 25% → 20% | Nerf |
| Yunara | `champion:tft18_yunara` | Spell Damage: 170/255/415 → 155/230/350 AD | Nerf |

### 3 Cost
| Tướng | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Azir | `champion:tft18_azir` | Spell Damage: 50/75/120 → 46/69/110 AP | Nerf |
| Master Yi | `champion:tft18_masteryi` | AD Form AD: 67 → 65; AP Form Magic On-Hit Damage: 145/220/350 → 140/210/335 AP | **Nerf** (người dùng xác nhận cả 2 dòng đều nerf, đính chính suy đoán ban đầu) |
| Raptor (Truexy gọi "Mama Beak" — xem [[project_set18_champion_patchnote_aliases]]) | `champion:tft18_raptor` | Mana: 30/70 → 20/60 | Buff |
| Kha'Zix | `champion:tft18_khazix` | AS: 0.8 → 0.85 | Buff |
| Tristana | `champion:tft18_tristana` | Base Spell Damage: 200/300/480 → 160/240/385 AD | Nerf |

### 4 Cost
| Tướng | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Aphelios | `champion:tft18_aphelios` | Base Number of Swipes: 6 → 5; Bonus AS% Required for +1 Swipe: 35% → 20% | Buff (đổi hẳn build hướng Rageblade — xem caption) |
| Ezreal | `champion:tft18_ezreal` | Small Cast Damage: 225/340 → 235/355 AD | Buff |
| Sivir | `champion:tft18_sivir` | Spell Damage: 180/270 → 190/285 AD | Buff |
| Zyra | `champion:tft18_zyra` | Spell Damage: 35/52 → 37/55 AP | Buff |
| Lillia | `champion:tft18_lillia` | Heal: 280/360 → 300/400 AP | Buff |

### 5 Cost
| Tướng | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Alune | `champion:tft18_alune` | Moon Damage: 2200/3400 → 2350/3600 AP | Buff |
| The Elder Dragon | `champion:tft18_elderdragon` | Spell Damage: 250/375 → 265/400 AD | Buff |

---

## Traits

| Tộc hệ | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Adaptor | `trait:adaptor` | AD/AP: 20/30/55% → 20/30/50% | Nerf |
| Blackthorn | `trait:eldritch` | 4 Piece Enhanced Effect: 25% → 30%; 6 Piece Enhanced Effect: 50% → 60%; 6 Piece Teamwide Health: 500 → 550 | Buff |
| Defender | `trait:defender` | Resists: 25/55/110 → 25/60/120 | **Buff** (người dùng xác nhận mũi tên xanh rõ ràng, đính chính suy đoán ban đầu) |
| Elderwood | `trait:elderwood` | Protector Enrage Heal Ratio: 10% → 12% | Buff |
| Executioner | `trait:executioner` | 4 Executioner Bonus Bleed: 50% → 40% | Nerf |
| Invoker | `trait:invoker` | Selfish Mana Regen: 2/3/5/8 → 3/4/6/9 | Buff |
| Primal | `trait:primal` | Phoenix takedowns per component: 14 → 15; Bear Execute threshold: 15% → 12% | Nerf |
| Riftbeast | `trait:riftbeast` | 7 Riftbeast AD/AP/AS: 5% → 6% | Buff |

---

## Wisps

| Wisp | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Radiantize | `wisp:radiantize` | Upgrade Delay: 10/7 seconds → 8/5 seconds | Nerf (delay ngắn hơn = nâng cấp nhanh hơn — cần xác nhận đây là buff hay nerf theo hướng game logic, ảnh chỉ có ▼ đỏ nên giữ nerf theo ký hiệu gốc dù trực giác có thể ngược; ghi rõ để soát lại khi vào draft) |
| Solar Gift | `wisp:solar-gift` | Cost: 5/2g → 6/4g | Nerf (đắt hơn) |

---

## Augments

### Nhóm 1
| Augment | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Build a Bud | *(không tìm thấy trong `set18-entity-index.ts` — augment/wisp mới, chưa có trong DB codex)* | Initial Gold: 3g → 6g | Buff |
| Bronze For Life | `augment:da_bronzeforlifei` **hoặc** `augment:da_bronzeforlifeii` (DB có 2 tier "Bronze For Life I/II", ảnh Truexy chỉ ghi chung "Bronze for Life" — cần soát ảnh gốc xem đúng số liệu 2%→2.5% thuộc tier nào trước khi ghi draft) | Damage Amp: 2% → 2.5% | Buff |
| Component Quest | `augment:da_componentquest` | Gold: 8 → 5 | Nerf |
| Double Trouble | `augment:da_doubletrouble` | AD/AP: 30% → 25%; Resists: 30% → 25% | Nerf |
| Flame On! | `augment:da_18_infernotraitaugment` | Attack Speed: 40% → 55% | Buff |
| Fourcing (DB ghi "FOURcing") | `augment:da_18_fourcing` | Health Per Item: 95 → 120 | Buff |
| It's Me, Baby | `augment:da_itsmebaby` | Takedowns per gold: 4 → 5 | Nerf |
| Nesting Dolls | `augment:da_nestingdolls` (base tier — DB còn có bản `+`/`++` cùng tên "Nesting Dolls", cần soát đúng tier khi vào draft) | Health: 50% → 60% | Buff |
| Shopping Spree | `augment:da_shoppingspree` | Initial gold: 2 → 6 | Buff |
| Small Furry Friend | `augment:da_smallfurryfriend` | Effectiveness: 50% → 35% | Nerf |

### Nhóm 2
| Augment | entityId | Thay đổi | Hướng |
|---|---|---|---|
| The Tower | `augment:da_thetower` | Tower Health: 1000/1000/1400/2200/2800 → 450/450/700/1250/1600 | Nerf mạnh |
| Trait Ladder | `augment:da_traitladder` | 2 Trait: 1 Reforger → 1 Reforger + 1g; 3 Trait: 2g → 3g; 4 Trait: 4g → 6g; 6 Trait: 9g → 10g; 6 Trait: 2x 3-costs + 2g → 3x 3-costs; 7 Trait: Component Anvil + 5g → Component Anvil + 8g | Buff (nhiều mốc rẻ hơn) |
| Verticality III | `augment:da_verticalityiii` | Stats: 3% → 3.5% | Buff |

---

## Bug Fixes (category `mechanic`, không có entityId)

- Death's Defiance không còn gây thêm sát thương cho người mang.
- Rolling Bones chỉ cấp reroll đúng khi hạ gục tướng (trước đó có lỗi cấp sai điều kiện).
- Blackthorn cập nhật đúng giá trị hiến tế ở giai đoạn chuẩn bị kế tiếp nếu tướng tạm thời (như Training Dummy từ Wisp) bị hiến tế.
- Blackthorn không còn cấp Damage Amp trong các trường hợp không nên cấp.
  - Kết hợp 2 lỗi trên tạo ra vấn đề "Rengar Blackthorn".
- Heart of Steel không còn thỉnh thoảng lỗi không cộng dồn.
- Heart of Steel không còn cộng dồn khi tướng đang ở băng ghế dự bị.
- Lucky Gloves không còn cấp dư 1 Sparring Glove ở lượt sau.
- Hiệu ứng nổ xanh không còn thỉnh thoảng bị kẹt lặp lại trên bàn đấu suốt cả trận.
- Rengar không còn lỗi thiếu vàng khi đạt mốc hạ gục nếu vượt qua đúng mốc đó (vd hạ gục Rival khác trước).
- Lux không còn đổi hình dạng sai giữa combat, hoặc khi tướng khác biến hình.

---

## Việc cần soát trước khi vào draft (Bước 2)

1. **Build a Bud** — không có trong `set18-entity-index.ts`/`set18-augments.ts`, có thể là augment hoàn toàn mới của patch này. Cần xác nhận: augment mới thật hay do đặt tên khác trong DB (đã grep toàn bộ `src/content/set18/` không thấy "Bud"/"Fourcing" nào khác ngoài kết quả trên). đây là nâng cấp mới, tôi sẽ bổ sung thêm thông tin sau
2. **Bronze For Life** — DB có 2 tier (I bậc Gold, II bậc Prismatic). Ảnh gốc `image2.png` chỉ ghi "Bronze for Life" không rõ số La Mã — cần xem lại ảnh gốc để xác định đúng tier trước khi ghi entry DB. (kiểm tra lại 2 bậc có chỉ số nào hiện tại đang là 2% thì chính là lõi đó)
3. **Nesting Dolls** — DB có 3 bản trùng tên hiển thị "Nesting Dolls" (base/+/++, khác `id`). Ảnh gốc cũng chỉ ghi "Nesting Dolls" chung — cần đối chiếu icon/rarity trong ảnh gốc hoặc hỏi lại nguồn để xác định đúng tier. (kiểm tra lại chỉ số ,lõi nào đang có 50% thì đúng là bản đó)
4. **Radiantize** — số liệu giảm (10/7 → 8/5 giây) nhưng đây là "Upgrade Delay" nên về mặt gameplay là buff (nâng cấp nhanh hơn); tuy nhiên ảnh gốc dùng ký hiệu ▼ đỏ (nerf) theo quy ước chung của Riot cho balance change, không phải theo hướng lợi/hại cho người chơi. Giữ nguyên hướng nerf theo ký hiệu ảnh, ghi chú lại để không tự suy diễn ngược. - đồng ý

Các mục Champions/Traits phần lớn đã có entityId rõ ràng, sẵn sàng cho Bước 2. Riêng 4 điểm trên cần bạn xác nhận/xem lại ảnh gốc `tft18-1ae-images/image2.png` trước khi mình soạn PatchReport draft.
