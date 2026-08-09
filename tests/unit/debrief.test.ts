import { describe, expect, it } from 'vitest';
import {
  addDebrief,
  createDebrief,
  emptyDebriefDraft,
  recommendNextLesson,
  validateDebriefDraft,
  type PostGameDebrief,
} from '../../src/components/features/checklist/debrief';

function record(index: number, label: PostGameDebrief['errorLabel'] = 'ROLL', bias = false): PostGameDebrief {
  return {
    id: `record-${index}`,
    createdAt: `2026-08-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
    errorStage: 'Stage 4',
    firstFixableError: `error ${index}`,
    errorLabel: label,
    nextGameBehavior: `behavior ${index}`,
    ...(bias ? { outcomeBias: 'bad-decision-good-result' as const } : {}),
  };
}

describe('post-game debrief', () => {
  it('requires first error, one label, and next behavior', () => {
    expect(validateDebriefDraft(emptyDebriefDraft)).toEqual([
      'Ghi lỗi đầu tiên có thể sửa.',
      'Chọn đúng một nhãn lỗi chính.',
      'Ghi một hành vi quan sát được cho trận sau.',
    ]);
  });

  it('creates a trimmed record from a valid draft', () => {
    const result = createDebrief(
      {
        errorStage: 'Stage 3',
        firstFixableError: '  rolled without target  ',
        errorLabel: 'ROLL',
        nextGameBehavior: '  name three outs before rolling  ',
        outcomeBias: '',
      },
      new Date('2026-08-10T00:00:00.000Z'),
    );

    expect(result).toMatchObject({
      createdAt: '2026-08-10T00:00:00.000Z',
      errorStage: 'Stage 3',
      firstFixableError: 'rolled without target',
      errorLabel: 'ROLL',
      nextGameBehavior: 'name three outs before rolling',
    });
  });

  it('keeps newest 20 records', () => {
    const history = Array.from({ length: 20 }, (_, index) => record(index));
    const next = addDebrief(history, record(99, 'ITEM'));
    expect(next).toHaveLength(20);
    expect(next[0].id).toBe('record-99');
    expect(next.at(-1)?.id).toBe('record-18');
  });

  it('recommends label lesson for repeated labels in five games', () => {
    const recommendation = recommendNextLesson([record(1, 'ROLL'), record(2, 'ROLL'), record(3, 'ITEM')]);
    expect(recommendation).toMatchObject({ href: '/kien-thuc-nen-tang/level-roll-outs-va-breakpoint' });
  });

  it('escalates to VOD review for three labels in ten or outcome bias', () => {
    expect(recommendNextLesson([record(1, 'ROLL'), record(2, 'ROLL'), record(3, 'ROLL')])).toMatchObject({
      href: '/kien-thuc-nen-tang/vod-review-va-phan-loai-loi',
    });
    expect(recommendNextLesson([record(1, 'ITEM', true)])).toMatchObject({
      href: '/kien-thuc-nen-tang/vod-review-va-phan-loai-loi',
    });
  });
});
