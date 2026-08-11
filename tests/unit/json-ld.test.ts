import { describe, expect, it } from 'vitest';
import { serializeJsonLd } from '../../src/lib/json-ld';

describe('serializeJsonLd', () => {
  it('escapes script-breaking characters while preserving valid JSON', () => {
    const serialized = serializeJsonLd({ text: '</script><script>alert(1)</script>&\u2028x\u2029' });

    expect(serialized).not.toContain('</script>');
    expect(serialized).not.toContain('<script>');
    expect(serialized).toContain('\\u003c/script\\u003e');
    expect(serialized).toContain('\\u0026');
    expect(serialized).toContain('\\u2028');
    expect(serialized).toContain('\\u2029');
    expect(JSON.parse(serialized).text).toBe('</script><script>alert(1)</script>&\u2028x\u2029');
  });
});
