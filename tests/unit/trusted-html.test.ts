import { describe, expect, it } from 'vitest';
import { lessons } from '../../src/content/lessons.generated';
import { set18Champions } from '../../src/content/set18/set18-champions';
import {
  validateGeneratedSet18ChampionHtml,
  validateTrustedHtml,
} from '../../scripts/lib/trusted-html-validation.mjs';

describe('trusted generated HTML validation', () => {
  it('accepts current generated lesson HTML', () => {
    for (const lesson of lessons) {
      for (const block of lesson.blocks) {
        if (block.type !== 'concept') continue;
        expect(() =>
          validateTrustedHtml(block.html, {
            profile: 'evergreenMarkdownHtml',
            source: `${lesson.slug}:${block.anchor}`,
          }),
        ).not.toThrow();
      }
    }
  });

  it('accepts current generated Set 18 champion tooltip HTML', () => {
    expect(() => validateGeneratedSet18ChampionHtml(set18Champions, 'set18-champions.ts')).not.toThrow();
  });

  it.each([
    ['script tag', '<script>alert(1)</script>', 'evergreenMarkdownHtml'],
    ['event handler', '<p onclick="alert(1)">x</p>', 'evergreenMarkdownHtml'],
    ['javascript href', '<a href="javascript:alert(1)">x</a>', 'evergreenMarkdownHtml'],
    ['inline style', '<span style="color:red">x</span>', 'set18TooltipHtml'],
    ['unknown Set18 class', '<span class="s18-unknown-token">x</span>', 'set18TooltipHtml'],
  ] as const)('rejects %s', (_name, html, profile) => {
    expect(() => validateTrustedHtml(html, { profile, source: 'fixture' })).toThrow(/Unsafe generated HTML/);
  });
});
