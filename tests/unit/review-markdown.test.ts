import { describe, expect, it } from 'vitest';
import { createReviewMarkdown } from '../../src/lib/review-markdown';

describe('createReviewMarkdown', () => {
  it('creates a readable TFT review summary', () => {
    const markdown = createReviewMarkdown({
      placement: '6th',
      comp: 'AD tempo',
      weakStage: 'Stage 4',
      turningPoint: 'Stage 3',
      firstFixableError: 'Rolled without a clear target.',
      errorTags: ['Economy', 'Rolldown'],
      replacementDecision: 'Stop at 20 gold after stabilizing frontline.',
    });

    expect(markdown).toContain('# Review trận TFT');
    expect(markdown).toContain('- Placement: 6th');
    expect(markdown).toContain('- Tag lỗi: Economy, Rolldown');
    expect(markdown).toContain('Stop at 20 gold');
  });
});
