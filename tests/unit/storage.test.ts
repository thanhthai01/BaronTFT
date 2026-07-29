import { describe, expect, it } from 'vitest';
import { readJson, writeJson } from '../../src/lib/storage';

describe('storage helpers', () => {
  it('returns fallback for corrupt JSON', () => {
    window.localStorage.setItem('bad-json', '{');
    expect(readJson('bad-json', { ok: true })).toEqual({ ok: true });
  });

  it('writes and reads JSON values', () => {
    writeJson('sample-key', { checked: true });
    expect(readJson('sample-key', { checked: false })).toEqual({ checked: true });
  });
});
