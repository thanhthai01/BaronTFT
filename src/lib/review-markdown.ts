export type ReviewSummaryInput = {
  placement: string;
  comp: string;
  weakStage: string;
  turningPoint: string;
  firstFixableError: string;
  errorTags: string[];
  replacementDecision: string;
};

export function createReviewMarkdown(input: ReviewSummaryInput): string {
  const tags = input.errorTags.length ? input.errorTags.join(', ') : 'Chưa gắn tag';

  return [
    '# Review trận TFT',
    '',
    `- Placement: ${input.placement || 'Chưa ghi'}`,
    `- Comp/line: ${input.comp || 'Chưa ghi'}`,
    `- Stage yếu nhất: ${input.weakStage || 'Chưa ghi'}`,
    `- Turning point: ${input.turningPoint || 'Chưa chọn'}`,
    `- Lỗi đầu tiên có thể sửa: ${input.firstFixableError || 'Chưa ghi'}`,
    `- Tag lỗi: ${tags}`,
    '',
    '## Quyết định thay thế',
    '',
    input.replacementDecision || 'Chưa ghi quyết định thay thế.',
  ].join('\n');
}
