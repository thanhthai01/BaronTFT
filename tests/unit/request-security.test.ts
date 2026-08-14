import { describe, expect, it } from 'vitest';
import { readJsonWithLimit } from '../../src/lib/request-security';

function jsonRequest(body: string, contentType = 'application/json') {
  return new Request('https://barontft.vercel.app/api/test', {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body,
  });
}

describe('request security helpers', () => {
  it('parses JSON within the byte limit', async () => {
    await expect(readJsonWithLimit(jsonRequest('{"ok":true}'), 64)).resolves.toEqual({ ok: true, value: { ok: true } });
  });

  it('rejects oversized JSON before parsing the payload', async () => {
    await expect(readJsonWithLimit(jsonRequest('{"message":"too long"}'), 8)).resolves.toMatchObject({ ok: false, status: 413 });
  });

  it('rejects non-JSON content types', async () => {
    await expect(readJsonWithLimit(jsonRequest('{"ok":true}', 'text/plain'), 64)).resolves.toMatchObject({ ok: false, status: 415 });
  });
});
