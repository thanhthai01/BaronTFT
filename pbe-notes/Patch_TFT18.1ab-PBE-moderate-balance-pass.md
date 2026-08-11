# Patch TFT18.1ab (PBE) — Moderate pass on balance (nháp, chưa duyệt)

> **Tên file tạm thời:** chưa rõ số patch chính thức theo Liquipedia (kiểu `Patch_TFT18.1`). Đặt tiếp theo 18.1aa (07/08) nên tạm gọi 18.1ab.

**Nguồn:** [@TheTruexy trên X](https://x.com/TheTruexy/status/2086843790518829102) — dev chính thức PBE.
**Thời điểm:** August 10th, 2026 - 12:00 PDT — "TheTruexy Patch Notes — Moderate pass on balance".

Truexy note kèm theo: bản vá cân bằng tương đối lớn hôm nay (8/10, gần trưa PT). Vẫn đang xử lý báo cáo lỗi nhưng theo lịch riêng, khác lịch cân bằng. Meta PBE hiện đang xoay quanh vài chiến lược chính: tướng 5 vàng (nhiều hơn bình thường trên PBE), Blossom, Artifacts, và 6 Blackthorn. Đội ngũ chủ động muốn tồn tại một số win-condition có điều kiện, miễn là đủ hiếm — nên đợt này tập trung thu hẹp khoảng cách sức mạnh giữa tướng 4 vàng và 5 vàng, giữ 4 vàng và reroll vẫn là chiến lược nền tảng công bằng. 6 Blackthorn là một thử nghiệm hợp lý, nhưng cơ chế "nhân đôi" hiệu ứng tộc hệ khiến mốc 6 quá mạnh — nerf trực tiếp sẽ ảnh hưởng luôn tính khả thi của mốc 2/4, nên đội đang làm lại (reshape) tộc hệ này, chưa sẵn sàng ra mắt đợt này, đang để ý theo dõi tiếp. Bản thân tướng của Blossom không phải outlier cực đoan — thứ khiến đội hình mạnh là khả năng tạo econ ổn định và đạt full cap nhanh ở Stage 4/5, nên đợt này chủ yếu nhắm vào các Blossom Charm, tập trung vào những charm tạo tài nguyên sớm vượt trội so với đội hình khác. Sau đợt này, trọng tâm cân bằng trong tuần sẽ là hoàn thiện chi tiết trước khi Launch: cân bằng giai đoạn đầu ván, biên độ cao/thấp của Artifact, và các chase condition.

Chú thích: ▲ = buff, ▼ = nerf, không có mũi tên = rework/cơ chế/bugfix.

---

## Balance

### Champions

#### 1 Cost

- **Akali**
  - ▼ AP Spell Damage: 170/255/385 AP → 155/235/385 AP
  - ▲ AD Spell Damage: 145/220/325 AD → 145/220/345 AD
- **Camille**
  - ▲ Shield: 60/85/135 → 60/85/160
  - ▲ Spell Damage: 160/240/390 AD → 160/240/410 AD
- **Leona**
  - ▲ Resist Duration: 10s → 12s
- **Ornn**
  - ▼ Shield: 400/480/600 AP → 400/460/550 AP
  - ▼ 2nd Artifact Threshold: 220,000 sát thương nhận → 235,000 sát thương nhận

#### 2 Cost

- **Murkwolf**
  - ▲ Alpha Mark Bonus Crit: 25-50% → 25-75%
- **Gromp**
  - ▲ Alpha Mark AD hoặc AP: 25% → 30%
- **Yunara**
  - ▼ Ability Damage: 170/255/450 AD → 170/255/415 AD

#### 3 Cost

- **Hecarim**
  - ▼ Heal: 400/500/720 AP → 375/475/685 AP
- **Kog'Maw**
  - ▼ AP Spell Damage: 170/255/450 AP → 160/240/415 AP
  - ▼ AD Spell Damage: 155/235/400 AD → 145/220/375 AD
- **Rengar**
  - ▼ Spell Damage: 270/405/650 AD → 255/385/615 AD

#### 4 Cost

- **Aphelios**
  - ▼ Bonus AS Per Extra Attack: 45% → 35%
  - **Ghi chú:** ảnh gốc đánh dấu mũi tên ▲ cho dòng này nhưng số liệu giảm — xác nhận nguồn đánh dấu nhầm hướng, đây thực sự là nerf. Lên DB với `kind: "nerf"`.
- **Brambleback**
  - ▲ Spell Armor Ignore: 20% → 30%
- **Lillia**
  - ▲ Mana: 50/150 → 40/140
- **Morgana**
  - ▲ Curse DoT: 18/27 → 22/33
- **Nidalee**
  - ▲ AD Spell Damage: 215/325 AD → 225/340 AD

#### 5 Cost

- **Ashe**
  - ▲ Spell Damage: 400/600 AD → 440/660 AD
- **Kennen** (nerf tổng thể)
  - ▼ Dash Damage: 50/75 AP → 80/120 AP
  - ▼ Spell Damage: 525/785 AP → 450/675 AP
  - ▼ Shield Amount: 225/300 AP → 250/350 AP
  - **Ghi chú:** Dash Damage và Shield Amount tăng số liệu, nhưng Spell Damage (nguồn sát thương chính) giảm mạnh áp đảo — xác nhận tổng thể vẫn là nerf. Lên DB với `kind: "nerf"` cho cả 3 dòng của Kennen.
- **Draven**
  - ▼ Bleed Damage: 150/225 AD → 140/210 AD
  - ▼ Spell Base Damage: 180/270 AD → 130/200 AD
  - ▼ % Chance to Target Random in Range: 85% → 70%
- **Ivern**
  - ▼ Base AS: 0.85 → 0.8
  - ▼ Rock Hex AR/MR: 12/15 → 8/12
  - ▼ Water Hex Mana Regen: 2/3 → 1/2
  - ▼ Tree Hex Max Health: 6/12% → 8/12%
  - ▼ Flower Hex Attack Speed: 10/15% → 8/12%
  - ▼ Greenfather Seeds Per Combat: 4 → 3
  - ▲ Shield: 150/275 AP → 165/300 AP
  - **Ghi chú:** riêng dòng Shield là buff (số liệu tăng), nằm giữa các dòng còn lại của Ivern đều là nerf — xác nhận đúng là một điểm tăng sức mạnh cục bộ, không phải lỗi. Lên DB với `kind: "buff"` riêng cho dòng Shield, các dòng khác của Ivern giữ `kind: "nerf"`.
- **Lux**
  - ▼ Elderwood Health: 4% → 2.5%
  - ▼ Lunar Bonus Damage Duration: 6s → 4s
  - ▼ Lunar Bonus Damage Amount: 12% → 10%
  - ▼ Blossom Bonus Damage: 15% → 10%

#### 3-Star Champions

- 3-star 5-cost:
  - ▲ **Alune** — Moon Damage: 6500 AP → 7500 AP
  - ▲ **Draven** — Stun Duration: 10s → 15s, Bleed Damage: 1000 AD → 3000 AD
  - ▲ **Gnar** — Stun Duration: 5s → 15s, Leap Damage: 1500 AD → 2000 AD
  - ▲ **Kennen** — Dash Damage: 300 AP → 1500 AP, Spell Damage: 3000 AP → 5000 AP
  - ▲ **Taric** — True Damage: 15% máu tối đa mục tiêu → 25% máu tối đa mục tiêu
- 3-star 4-cost:
  - ▼ **Aphelios** — Swipe Damage: 11000 AD → 850 AD
  - ▲ **Brambleback** — Armor Ignore: 20% → 50%
  - ▼ **Sivir** — Secondary Boomerang Damage: 50% → 40%
  - ▲ **Ezreal** — Small Cast Damage: 900 AD → 1200 AD
  - ▲ **Soraka** — Giờ đánh 2 lần (double cast). Lần cast thứ 2 xảy ra ngay khi lần đầu vốn sẽ unlock Soraka, tự chọn mục tiêu mới (miễn còn địch khác trên bàn).

### Tộc Hệ

- ▼ **Blossom**
  - 9 Blossom AD/AP: 50% → 45%
  - **Blossom Charms:**
    - All Fours Bonus Gold: 4g → 2g
    - All Threes Bonus Gold: 3g → 2g
    - All Twos Bonus Gold: 2g → 1g
    - Barter Bonus Gold: 300% → 250%
    - Big Guns Cost: 6g → 7g
    - Blood and Iron Deaths Required: 14 → 16
    - Blood Ritual Health Cost: 6 Health → 8 Health
    - Bronze Spoon — Cost: 3g → 2g, Bonus XP: 6 → 4
    - Die Roll Cost: 2g → 3g
    - Doodad Bag Cost: 0g → 1g
    - Experienced — Cost: 1g → 0g, Bonus XP: 4 → 2
    - Forest Twins Cost: 4g → 5g
    - Healing Pool Health: 9 → 7
    - Killing Frenzy Attack Speed: 120% → 140%
    - Knick-Knack Bag Cost: 0g → 1g
    - Lesser Chaos Gold Limit: 2g → 1g
    - Lost Travelers Cost: 3g → 4g
    - Radiant Mana Potion — Starting Mana: 25 → 20, Teamwide Mana: 20 → 10
    - Rolling Bones Reroll Chance: 65% → 60%
    - Roly-Polys Reroll Time: 15s → 16s
    - Smurfing Cost: 5g → 6g
    - Thingamajig Bag Cost: 0g → 1g
    - Three Me Cost: 7g → 8g
- ▲ **Hunter**
  - Bonus AD: 15/25/40/60% → 20/30/45/65%

### Augments

- ▼ **Capital Gains I** — Gold Earned: 110% lãi suất → 100% lãi suất, Initial Gold: 2 → 1
- ▼ **Capital Gains II** (nerf tổng thể) — Gold Earned: 110% lãi suất → 125% lãi suất, Initial Gold: 4 → 1
  - **Ghi chú:** Gold Earned tăng là chủ đích, không phải lỗi đánh máy — nhưng Initial Gold giảm mạnh (4→1) chiếm phần lớn giá trị cốt lõi của augment này, phần lãi suất tăng chỉ bù lại một phần nhỏ sức mạnh đã mất. Xác nhận tổng thể vẫn là nerf. Lên DB với `kind: "nerf"`.
- ▼ **Going Long** — Immediate Gold: 16 → 10
- ▼ **Luxury Subscription** — Gold: 7 → 3
- ▼ **Residual Magic** — Initial Health (base/+/++): 80/100/120 → 60/75/90
- ▼ **Trait Ladder** — Nhìn chung làm dễ chơi hơn với đa số người chơi, nhưng giảm phần thưởng cực đại ở mốc cao (vốn cần xem guide mới đạt được).
  - Cashouts:
    - 7 Trait: bỏ Thieve's Gloves
    - 9 Trait Completed Item Anvil: bỏ
    - 9 Trait 5-cost Reward: 3x tướng 5 vàng → 3x tướng 5 vàng + 2g
    - 10 Trait: giờ trao 1 Tactician item (Crown/Shield/Cape)
    - 11 Trait: giờ trao 20 vàng
    - 12 Trait: giờ trao 1 Lucky Item Chest + 3x tướng 4 vàng
    - 13 Trait: giờ trao 4 thành phần + 1 remover + 8 vàng
    - 14 Trait: 3 Masterwork Upgrade → 1 Masterwork Upgrade + 10g

---

## Ghi chú thêm

4 dòng có mũi tên mâu thuẫn với số liệu trong ảnh gốc (Aphelios AS per extra attack, Kennen Dash Damage/Shield, Ivern Shield, Capital Gains II Gold Earned) đã được người dùng xác nhận trực tiếp và chỉnh lại đúng `kind` (nerf/buff) ở từng mục tương ứng — không còn gắn `mechanic` mơ hồ nữa.

Đã xác nhận: Lillia (giảm mana → kỹ năng ra sớm hơn, khống chế sớm hơn) và Morgana (Curse DoT tăng) đều là buff, dù ảnh gốc không đánh dấu mũi tên. Cả hai đã được gắn ▲ và sẽ lên DB với `kind: "buff"`.

