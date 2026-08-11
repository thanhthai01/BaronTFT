import { describe, expect, it } from 'vitest';
import { assertTrustedHtml } from '../../src/lib/trusted-html';

describe('runtime trusted HTML gate', () => {
  it('returns safe HTML unchanged', () => {
    expect(assertTrustedHtml('<p><strong>Tempo</strong></p>', 'evergreenMarkdownHtml')).toBe('<p><strong>Tempo</strong></p>');
    expect(assertTrustedHtml('<span class="s18-value s18-style-colorPhysical">100</span>', 'set18TooltipHtml')).toBe('<span class="s18-value s18-style-colorPhysical">100</span>');
  });

  it('rejects unsafe HTML before render', () => {
    expect(() => assertTrustedHtml('<img src=x onerror=alert(1)>', 'evergreenMarkdownHtml')).toThrow(/Unsafe generated HTML/);
    expect(() => assertTrustedHtml('<span style="color:red">100</span>', 'set18TooltipHtml')).toThrow(/Unsafe generated HTML/);
  });
});
