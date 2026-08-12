# Patch TFT18.1ac (PBE) — Minor pass on balance (nháp, chưa duyệt)

> **Tên file tạm thời:** chưa rõ số patch chính thức theo Liquipedia (kiểu `Patch_TFT18.1`). Đặt tiếp theo 18.1ab (10/08) nên tạm gọi 18.1ac.

**Nguồn:** [@TheTruexy trên X](https://x.com/TheTruexy/status/2087223629058908343) — dev chính thức PBE.
**Thời điểm:** Truexy tự ghi trong caption là bản vá cho ngày "8/11". Timestamp hiển thị trên trang X (chưa đăng nhập, múi giờ không xác định chắc chắn): 12:04 AM · Aug 12, 2026.

Truexy note kèm theo: bản vá nhỏ hơn hôm nay, tập trung vào những thứ trước giờ chưa được để ý hoặc từng bị nerf quá tay. Buff Kha'zix thay cho một đợt mini-update sắp tới của tộc Blackthorn (6) — đội ngũ nhận thấy tộc này quá phân cực quanh mốc (6), khiến mốc 2/4 tương đối yếu. Cũng đẩy Essence per-kill của Coven lên cao hơn để rõ ràng hơn cách stack lượng lớn: hoặc liên tục thua sát để giữ máu, đạt breakpoint cao rồi thua liên tục để gom essence nhanh, hoặc thắng liên tục để gom essence ở tốc độ 0.5x bình thường. Phần còn lại của tuần sẽ tập trung vào các hệ thống như Artifacts, Augments, đảm bảo càng nhiều nội dung càng có đường đến thành công thật.

Chú thích: ▲ = buff, ▼ = nerf, không có mũi tên = rework/cơ chế/bugfix.

---

## Balance

### Champions

#### 1 Cost

- ▲ **Karma**
  - Spell Damage Tether: 260/390/585/995 AP → 280/420/630/1070 AP
  - Spell Damage AoE: 110/165/250/420 AP → 120/180/270/460 AP
- ▲ **Varus**
  - Spell Damage: 350/525/790/1340 AD → 350/525/840/1390 AD

#### 2 Cost

- ▲ **Elise**
  - On-Attack Healing: 55/85/160 → 55/90/170
- ▲ **Scuttlecrab**
  - Burrow Heal: 300/375/625 → 325/400/675
- ▲ **Warwick**
  - AS on Cast: 20% → 25%

#### 3 Cost

- ▲ **Cassiopeia**
  - Spell Damage: 425/640/1020 AP → 440/660/1050 AP
- ▼ **Master Yi**
  - Base AD (dạng AD): 70 → 67
- ▲ **Kha'zix**
  - Spell Damage: 240/360/540 AP → 260/370/550/935 AP
  - Isolation Damage: 290/435/650 AP → 310/445/660/1150 AP
  - **Ghi chú:** dải số liệu sau có thêm 1 mốc (4 giá trị thay vì 3) — đây là chỉ số ở cấp 4 sao (Kha'zix có cơ chế evolve/Ravager trong set này nên có thể vượt 3 sao thường). Người dùng đã xác nhận số liệu đọc đúng từ ảnh gốc độ phân giải cao.
- ▲ **Krug**
  - Spell Bonus HP: 175/225/325 → 185/240/350
- ▲ **Mama Beak**
  - Mini Damage per attack: 25/38/60 AD → 27/41/65 AD

#### 4 Cost

- ▼ **Sentinel**
  - Mana Reave: 15 → 10

#### 5 Cost

- ▼ **Lux**
  - Coven Resist Reduction: 12 → 8

### Tộc Hệ

- **Coven** (mixed, không đánh dấu hướng chung — xem ghi chú)
  - Essence Per Loss: 20/25/30/80 → 18/25/32/60
  - Essence Per Kill: 1/2/3/10 → 2/2/3/10
  - **Ghi chú:** không phải buff/nerf đồng nhất — mốc breakpoint thấp giảm nhẹ, mốc cao (Per Loss ở ngưỡng 80→60) giảm mạnh, trong khi Per Kill ở ngưỡng thấp nhất lại tăng. Đúng như caption mô tả: mục tiêu là định hình lại cách stack essence (ưu tiên breakpoint cao + losestreak, hoặc winstreak ở tốc độ chậm hơn) chứ không đơn thuần buff/nerf. Đề xuất lên DB với `kind: "mechanic"` cho cả 2 dòng, không gắn buff/nerf.
- ▲ **Eclipse**
  - Beam Cooldown: 4 seconds → 3.5 seconds
- ▲ **Elderwood**
  - 5 Piece HP Bonus: 150 → 200
- ▲ **Primal**
  - Tiger AS (đơn vị Primal): 30% → 35%
- ▲ **Sprykin**
  - 5 Sprykin Health increase: 30% → 40%
  - 5 Sprykin Attack speed increase: 30% → 35%

### Augments

- **Build-a-Bud** — Re-enabled (mechanic, không phải buff/nerf số liệu — augment từng bị tắt nay bật lại).
- **Heart of Steel** — Fixed a bug where Steadfast would stack during combat celebration phase until end of combat (bugfix).

### Wisps

- ▲ **Barrier**
  - Cost: 6g → 4g
  - Shield Duration: 5s → 6s
  - Shield Amount: 1200 → 1250
- ▲ **Giant Growth**
  - Health Gain: 600 → 700
- ▼ **Homing Fireflies**
  - Damage: 125 → 110
- ▼ **Infliction**
  - Slow Amount: 30% → 20%
- ▲ **Ironwood**
  - Damage Reduction: 10/14% → 12/18%
- ▲ **Mana-Rich Soil**
  - Mana Reduction: 15% → 18%
- ▲ **Phantom Emblem**
  - Cost: 4/2 gold → 3/1 gold
- ▲ **Quicken**
  - Cost: 3g → 2g
  - Attack Speed Duration: 3/4 seconds → 4/5 seconds
- **Stealthy** — Blossom Upgrade version now checks for an itemized Assassin or Fighter (base version already does this) — mechanic/bugfix, không phải số liệu buff/nerf.

### Bug Fixes (chỉ lên patch report, không sync codex vì không đổi số liệu hiện tại)

- Fixed a bug where Prismatic Destiny was being offered more often than intended.
- Draven can no longer grant Tactician items from Bounty Hunter.
- Phantom Splash now works with certain traits (i.e. Elderwood/Solar/Blackthorn/etc.)
- Void Gauntlet no longer causes draws by dealing damage if the holder is the last unit alive.
- Kha'Zix now properly pops off Ravager Emblem if he evolves Ravager while holding one.
- Fixed a bug where Ahri's orb could get stuck bouncing and fizzle between two equidistant targets (most commonly units in opposite back corners).

---

## Ghi chú thêm

- Dòng Kha'zix (Spell Damage, Isolation Damage) có thêm mốc 4 sao trong dải số liệu — đã xác nhận với người dùng, không phải lỗi đọc ảnh.
- Coven không gắn ▲/▼ vì thay đổi mang tính tái cân bằng breakpoint (mechanic), không đồng nhất buff hay nerf — xem ghi chú tại mục Tộc Hệ.
- Build-a-Bud (re-enable) và Stealthy (bugfix logic) không có số liệu before/after an toàn để lên codex — chỉ đưa vào patch report dạng mechanic/bugfix.
- Toàn bộ 6 mục Bug Fixes không đổi số liệu hiện tại của bất kỳ entity nào trong codex — chỉ lên patch report với `kind: "bugfix"`, không cần script sync DB riêng.
