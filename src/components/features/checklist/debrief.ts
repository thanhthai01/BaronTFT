export const errorStages = ['Stage 2', 'Stage 3', 'Stage 4', 'Stage 5+'] as const;

export const errorLabels = [
  'INFO',
  'STATE',
  'GOAL',
  'ECO',
  'HP',
  'BOARD',
  'ITEM',
  'AUG',
  'LEVEL',
  'ROLL',
  'PIVOT',
  'POS',
  'EXEC',
  'MENTAL',
] as const;

export const outcomeBiases = ['good-decision-bad-result', 'bad-decision-good-result'] as const;

export type ErrorStage = (typeof errorStages)[number];
export type ErrorLabel = (typeof errorLabels)[number];
export type OutcomeBias = (typeof outcomeBiases)[number];

export type PostGameDebrief = {
  id: string;
  createdAt: string;
  errorStage: ErrorStage;
  firstFixableError: string;
  errorLabel: ErrorLabel;
  nextGameBehavior: string;
  outcomeBias?: OutcomeBias;
};

export type DebriefDraft = {
  errorStage: ErrorStage;
  firstFixableError: string;
  errorLabel: ErrorLabel | '';
  nextGameBehavior: string;
  outcomeBias: OutcomeBias | '';
};

export const emptyDebriefDraft: DebriefDraft = {
  errorStage: 'Stage 3',
  firstFixableError: '',
  errorLabel: '',
  nextGameBehavior: '',
  outcomeBias: '',
};

export const errorLabelDescriptions: Record<ErrorLabel, string> = {
  INFO: 'Thiếu thông tin hoặc không scout đúng lúc.',
  STATE: 'Đọc sai trạng thái máu, vàng, board hoặc lobby.',
  GOAL: 'Chọn sai mục tiêu thứ hạng/nhịp trận.',
  ECO: 'Quản lý vàng, chuỗi hoặc lợi tức sai.',
  HP: 'Đổi máu lấy vàng hoặc tempo sai thời điểm.',
  BOARD: 'Board yếu hơn mức cần thiết hoặc nâng cấp sai slot.',
  ITEM: 'Ghép, giữ hoặc chuyển đồ sai chức năng.',
  AUG: 'Chọn nâng cấp không khớp trạng thái.',
  LEVEL: 'Lên cấp sai nhịp hoặc sai breakpoint.',
  ROLL: 'Roll thiếu mục tiêu, điểm dừng hoặc outs.',
  PIVOT: 'Đổi line quá muộn, quá sớm hoặc thiếu cầu nối.',
  POS: 'Xếp bài không theo matchup thật.',
  EXEC: 'Thao tác chậm/sai dù kế hoạch đúng.',
  MENTAL: 'Tilt, autopilot hoặc đổi quyết định vì kết quả vừa xảy ra.',
};

export const labelLessonMap: Partial<Record<ErrorLabel, { label: string; href: string }>> = {
  INFO: { label: 'Scouting, contest và lobby ecology', href: '/kien-thuc-nen-tang/scouting-contest-va-lobby-ecology' },
  STATE: { label: 'Đọc trạng thái và mục tiêu thứ hạng', href: '/kien-thuc-nen-tang/doc-trang-thai-va-muc-tieu-thu-hang' },
  GOAL: { label: 'Kế hoạch theo stage và điều kiện thắng', href: '/kien-thuc-nen-tang/ke-hoach-theo-stage-va-dieu-kien-thang' },
  ECO: { label: 'Kinh tế, máu, chuỗi và tempo', href: '/kien-thuc-nen-tang/kinh-te-mau-chuoi-va-tempo' },
  HP: { label: 'Kinh tế, máu, chuỗi và tempo', href: '/kien-thuc-nen-tang/kinh-te-mau-chuoi-va-tempo' },
  BOARD: { label: 'Strongest board và opener', href: '/kien-thuc-nen-tang/strongest-board-va-opener' },
  ITEM: { label: 'Trang bị và phân bổ chỉ số', href: '/kien-thuc-nen-tang/trang-bi-va-phan-bo-chi-so' },
  AUG: { label: 'Chọn Nâng Cấp theo trạng thái board', href: '/kien-thuc-nen-tang/chon-nang-cap-theo-trang-thai-board' },
  LEVEL: { label: 'Level, roll, outs và breakpoint', href: '/kien-thuc-nen-tang/level-roll-outs-va-breakpoint' },
  ROLL: { label: 'Level, roll, outs và breakpoint', href: '/kien-thuc-nen-tang/level-roll-outs-va-breakpoint' },
  PIVOT: { label: 'Flex, transition và pivot', href: '/kien-thuc-nen-tang/flex-transition-va-pivot' },
  POS: { label: 'Positioning, targeting và pathing', href: '/kien-thuc-nen-tang/positioning-targeting-va-pathing' },
  EXEC: { label: 'Bài tập TFT theo kỹ năng', href: '/kien-thuc-nen-tang/bai-tap-tft-theo-ky-nang' },
  MENTAL: { label: 'Quản lý phiên chơi và mindset', href: '/kien-thuc-nen-tang/quan-ly-phien-choi-va-mindset' },
};

export function validateDebriefDraft(draft: DebriefDraft): string[] {
  const errors: string[] = [];
  if (!draft.firstFixableError.trim()) errors.push('Ghi lỗi đầu tiên có thể sửa.');
  if (!draft.errorLabel) errors.push('Chọn đúng một nhãn lỗi chính.');
  if (!draft.nextGameBehavior.trim()) errors.push('Ghi một hành vi quan sát được cho trận sau.');
  return errors;
}

export function createDebrief(draft: DebriefDraft, now = new Date()): PostGameDebrief | null {
  if (validateDebriefDraft(draft).length > 0 || !draft.errorLabel) return null;
  return {
    id: `debrief-${now.toISOString()}-${Math.round(now.getTime() % 100000)}`,
    createdAt: now.toISOString(),
    errorStage: draft.errorStage,
    firstFixableError: draft.firstFixableError.trim(),
    errorLabel: draft.errorLabel,
    nextGameBehavior: draft.nextGameBehavior.trim(),
    ...(draft.outcomeBias ? { outcomeBias: draft.outcomeBias } : {}),
  };
}

export function addDebrief(history: PostGameDebrief[], record: PostGameDebrief): PostGameDebrief[] {
  return [record, ...history].slice(0, 20);
}

export function labelCounts(history: PostGameDebrief[], limit: 5 | 10 | 20) {
  const counts = new Map<ErrorLabel, number>();
  for (const record of history.slice(0, limit)) {
    counts.set(record.errorLabel, (counts.get(record.errorLabel) ?? 0) + 1);
  }
  return counts;
}

export function topLabelSummary(history: PostGameDebrief[], limit: 5 | 10 | 20): string {
  const counts = [...labelCounts(history, limit).entries()].sort((a, b) => b[1] - a[1]);
  if (counts.length === 0) return `Chưa có dữ liệu ${limit} trận.`;
  const [label, count] = counts[0];
  return `${label}: ${count}/${Math.min(limit, history.length)} trận gần nhất`;
}

export function recommendNextLesson(history: PostGameDebrief[]): { label: string; href: string; reason: string } | null {
  const lastFive = history.slice(0, 5);
  const lastTen = history.slice(0, 10);
  const biasCount = lastTen.filter((record) => record.outcomeBias).length;

  for (const [label, count] of labelCounts(lastTen, 10)) {
    if (count >= 3 || biasCount > 0) {
      return {
        label: 'VOD review và phân loại lỗi',
        href: '/kien-thuc-nen-tang/vod-review-va-phan-loai-loi',
        reason: count >= 3 ? `${label} lặp ${count}/10 trận.` : 'Có bias kết quả cần tách khỏi chất lượng quyết định.',
      };
    }
  }

  for (const [label, count] of labelCounts(lastFive, 5)) {
    const lesson = labelLessonMap[label];
    if (count >= 2 && lesson) {
      return { ...lesson, reason: `${label} lặp ${count}/5 trận gần nhất.` };
    }
  }

  return null;
}
