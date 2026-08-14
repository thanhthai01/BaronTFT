export type JsonParseResult =
  | { ok: true; value: unknown }
  | { ok: false; error: string; status: number };

export async function readJsonWithLimit(request: Request, maxBytes: number): Promise<JsonParseResult> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return { ok: false, error: 'Content-Type không hợp lệ.', status: 415 };
  }

  const declaredLength = request.headers.get('content-length');
  if (declaredLength) {
    const parsedLength = Number(declaredLength);
    if (!Number.isSafeInteger(parsedLength) || parsedLength < 0) {
      return { ok: false, error: 'Content-Length không hợp lệ.', status: 400 };
    }
    if (parsedLength > maxBytes) {
      return { ok: false, error: 'Dữ liệu gửi quá lớn.', status: 413 };
    }
  }

  if (!request.body) return { ok: false, error: 'Dữ liệu không hợp lệ.', status: 400 };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return { ok: false, error: 'Dữ liệu gửi quá lớn.', status: 413 };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, error: 'Dữ liệu không hợp lệ.', status: 400 };
  }

  try {
    const body = new TextDecoder('utf-8', { fatal: true }).decode(concatChunks(chunks, totalBytes));
    return { ok: true, value: JSON.parse(body) };
  } catch {
    return { ok: false, error: 'Dữ liệu không hợp lệ.', status: 400 };
  }
}

function concatChunks(chunks: Uint8Array[], totalBytes: number) {
  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}
