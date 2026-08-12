import { describe, expect, it } from 'vitest';
import { set18Champions } from '../../src/content/set18/set18-champions';
import { set18EntityIndex } from '../../src/content/set18/set18-entity-index';
import { set18Tips } from '../../src/content/set18/set18-tips';
import { set18TipRelationProblems } from '../../src/content/set18/set18-tip-validation';
import { set18Traits } from '../../src/content/set18/set18-traits';

/**
 * Chốt chặn cho nội dung Set 18.
 *
 * `src/content/set18/*.ts` là file GENERATED. Loạt sửa bản dịch và sửa lỗi dữ
 * liệu nằm trực tiếp trong đó, nên chạy lại generator sẽ ghi đè và mất sạch —
 * mà trang vẫn build được, không có gì báo lỗi. Chỉ phát hiện khi tình cờ nhìn
 * thấy chữ sai trên giao diện.
 *
 * Các test dưới đây khẳng định đúng những bất biến đó. Chúng chạy trong
 * `pnpm test` (đã nằm sẵn trong quy trình) nên regenerate mà mất fix là đỏ ngay.
 * Khi đỏ: chạy `python apply_all_set18_fixes.py` để áp lại.
 */

const plain = (html: string) => html.replace(/<[^>]+>/g, '');
const allForms = set18Champions.flatMap((c) => (c.forms ?? []).map((f) => ({ champion: c.name, form: f })));

describe('Set 18 · thuật ngữ tiếng Việt', () => {
  // Trái là dạng cũ/sai, phải là dạng đã chốt. Xem apply_riot_official_vi.py
  // (theo bài viết chính thức của Riot) và apply_vi_house_style.py (quyết định
  // riêng của trang) để biết vì sao chọn dạng bên phải.
  const banned: [string, string][] = [
    ['Kỳ Quái', 'Gai Đen'],
    ['Kẻ Săn Tiền Thưởng', 'Săn Thưởng'],
    ['Người Bảo Vệ Rừng Sâu', 'Hộ Vệ Rừng'],
    ['Dấu Alpha', 'Dấu Ấn Đầu Đàn'],
    ['Quả Cầu Linh Hồn', 'Tinh Linh Cầu'],
    ['Chim Biến Dị', 'Chim Mẹ'],
    ['Người cưỡi', 'Kỵ Sĩ'],
    ['quy mô đội tối đa', 'số lượng tướng tối đa'],
    ['khả năng của BFF', 'hiệu ứng của LXKL'],
    // Suy Nhược/Bỏng đều là Wound/Burn dịch lệch khỏi thuật ngữ trang đang dùng
    ['Suy Nhược', 'Vết Thương Sâu'],
    ['Bỏng', 'Thiêu Đốt'],
    // Kiểu bỏ dấu của trang, cố ý khác bài viết của Riot
    ['Hỏa Ngục', 'Hoả Ngục'],
    // Dịch máy sai nghĩa hẳn
    ['thiệt hại vật chất', 'sát thương vật lý'],
    ['chai Kruglette', 'Kruglette'],
    ['Beige', 'Xám Đá'],
    ['xử lý ', 'gây ra '],
    ['Omnivamp', 'Hút Máu Toàn Phần'],
  ];

  const haystack = [
    ...set18Traits.flatMap((t) => [
      t.vi,
      t.descriptionVi,
      t.note ?? '',
      ...(t.breakpointDetails ?? []).map((b) => b.bullet?.textVi ?? ''),
      ...(t.subEffects?.items ?? []).map((i) => `${i.label} ${i.text}`),
    ]),
    ...allForms.map(({ form }) => plain(form.abilityHtmlVi)),
  ].join('\n');

  it.each(banned)('không còn dùng %j (phải là %j)', (bad) => {
    expect(haystack).not.toContain(bad);
  });

  it('gọi cơ chế Wisp là Tinh Linh, không phải Linh hỏa', () => {
    expect(haystack).not.toMatch(/[Ll]inh hỏa/);
  });
});

describe('Set 18 · kỹ năng tướng', () => {
  it('mọi tướng đều có bản dịch, không để trơ chuỗi tiếng Anh', () => {
    // Cả 65 tướng đều CỐ Ý giữ tiếng Anh ở `ability`; lỗi là khi `abilityVi`
    // trùng khít với nó, nghĩa là thẻ tướng hiện tiếng Anh (Kha'Zix từng vậy).
    const untranslated = set18Champions.filter((c) => c.abilityVi && c.abilityVi === c.ability);
    expect(untranslated.map((c) => c.name)).toEqual([]);
  });

  it('không còn chữ dính số do template thiếu dấu cách', () => {
    // Riot nối thẳng <TFTCurveTable/> vào chữ liền trước hoặc liền sau, ra
    // "lên3 kẻ thù", "224/264/334Sức khỏe".
    const glued = allForms
      .filter(({ form }) => /[a-zà-ỹ)"”%]\d|\d[A-ZÀ-Ỹ][a-zà-ỹ]/.test(plain(form.abilityHtmlVi)))
      .map(({ champion }) => champion);
    expect([...new Set(glued)]).toEqual([]);
  });

  it('nhãn khối luôn bắt đầu dòng mới', () => {
    // Dấu hiệu lỗi: nhãn "<bright>Kích Hoạt:</>" dán ngay sau một câu đã kết
    // thúc bằng dấu chấm mà không có <br> — template Riot thiếu \r\n\r\n
    // (Gromp, Teemo, Amumu... từng bị).
    //
    // Không tính trường hợp nhãn nối tiếp trên cùng một dòng, vd Nidalee dạng AD
    // là "Thích Ứng <icon> Nội Tại:" — trước nhãn không có dấu chấm.
    const offenders: string[] = [];
    for (const { champion, form } of allForms) {
      const html = form.abilityHtmlVi;
      const re = /<span class="s18-style-(?:bright|dim)">\s*[^<]{1,40}?:/g;
      for (const m of html.matchAll(re)) {
        const before = html.slice(0, m.index);
        if (before.endsWith('<br>')) continue;
        if (!plain(before).trimEnd().endsWith('.')) continue;
        offenders.push(`${champion}: ${plain(m[0]).trim()}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('Set 18 · tộc hệ', () => {
  it('không còn token template chưa resolve', () => {
    // Mô tả tiếng Việt của Riot trỏ tới tên hàng cũ trong bảng số nên renderer
    // bỏ dở, để lại @TFTTrait...@ (Nguyên Sinh từng bị).
    const leaks = set18Traits.filter((t) => /@TFT|<TFTCurveTable|<TFTAttribute/.test(t.descriptionVi));
    expect(leaks.map((t) => t.name)).toEqual([]);
  });

  it('Nguyên Sinh giữ đủ 4 Phước Lành', () => {
    const primal = set18Traits.find((t) => t.name === 'Primal');
    expect(primal?.subEffects?.items.map((i) => i.label)).toEqual(['Gấu', 'Phượng Hoàng', 'Hổ', 'Rùa']);
  });

  it('Thiên Thực là trait ẩn nên mô tả điều kiện kích hoạt thay cho chip mốc', () => {
    const eclipse = set18Traits.find((t) => t.name === 'Eclipse');
    expect(eclipse?.activation).toBeTruthy();
    expect(eclipse?.champions).toEqual([]);
  });

  it('Đao Phủ tách câu giải nghĩa Chính Xác ra khỏi bullet mốc', () => {
    const exe = set18Traits.find((t) => t.name === 'Executioner');
    expect(exe?.note).toContain('Chính Xác:');
    // Mốc (2) vẫn được phép nhắc "Chính Xác" như một hiệu ứng; thứ phải biến
    // khỏi bullet là câu GIẢI NGHĨA, nhận ra nhờ dấu hai chấm ngay sau.
    const bullets = (exe?.breakpointDetails ?? []).map((b) => b.bullet?.textVi ?? '');
    expect(bullets.some((b) => b.includes('Chính Xác:'))).toBe(false);
  });

  it('Mặt Trời tách bảng thưởng theo số tướng 3 sao', () => {
    const solar = set18Traits.find((t) => t.name === 'Solar');
    expect(solar?.subEffects?.items.map((i) => i.label)).toEqual(['3', '5', '8']);
    // Tiền tố "(3)" trùng với chip mốc đã bỏ khỏi đoạn mô tả
    expect(solar?.descriptionVi.startsWith('(3)')).toBe(false);
  });
});

describe('Set 18 · mẹo', () => {
  it('mọi related entity của tip đều resolve và legacy fields mirror entityIds', () => {
    expect(set18TipRelationProblems(set18Tips, set18EntityIndex, { requireEntityIds: true })).toEqual([]);
  });
});
