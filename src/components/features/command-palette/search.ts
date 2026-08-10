import type { SearchAction } from '@/content/search-actions';
import type { SearchIndexEntry, SearchIndexKind } from '@/content/search-index.generated';
import { toSlug } from '../../../lib/slug';

export const KIND_GROUP_LABEL: Record<SearchIndexKind, string> = {
  lesson: 'Bài học',
  champion: 'Tướng',
  trait: 'Tộc hệ',
  wisp: 'Tinh Linh',
  augment: 'Nâng cấp',
};

export const KIND_ORDER: SearchIndexKind[] = ['lesson', 'champion', 'trait', 'wisp', 'augment'];

export function foldSearch(value: string): string {
  return toSlug(value).replace(/-/g, ' ');
}

function scoreCandidate(fields: Array<{ value: string; score: number }>, foldedQuery: string): number | null {
  let best: number | null = null;
  for (const field of fields) {
    const folded = foldSearch(field.value);
    if (folded.startsWith(foldedQuery)) best = Math.min(best ?? field.score, field.score);
    else if (folded.includes(foldedQuery)) best = Math.min(best ?? field.score + 3, field.score + 3);
  }
  return best;
}

/** Actions là việc người dùng muốn làm, nên so cả label, mô tả và keywords. */
export function rankActionMatches(actions: SearchAction[], foldedQuery: string): SearchAction[] {
  const scored = actions
    .map((action) => {
      const score = scoreCandidate(
        [
          { value: action.label, score: 0 },
          { value: action.keywords.join(' '), score: 1 },
          { value: action.description, score: 2 },
          { value: action.group, score: 3 },
        ],
        foldedQuery,
      );
      return score === null ? null : { action, score };
    })
    .filter((row): row is { action: SearchAction; score: number } => row !== null);

  scored.sort((a, b) => a.score - b.score || a.action.label.localeCompare(b.action.label));
  return scored.map((row) => row.action);
}

/** Search index ưu tiên prefix trước substring; thứ tự kind xử lý ở caller. */
export function rankIndexMatches(entries: SearchIndexEntry[], foldedQuery: string): SearchIndexEntry[] {
  const scored = entries
    .map((entryItem) => {
      const foldedLabel = foldSearch(entryItem.label);
      if (foldedLabel.startsWith(foldedQuery)) return { entryItem, score: 0 };
      if (entryItem.folded.startsWith(foldedQuery)) return { entryItem, score: 1 };
      if (entryItem.folded.includes(foldedQuery)) return { entryItem, score: 2 };
      return null;
    })
    .filter((row): row is { entryItem: SearchIndexEntry; score: number } => row !== null);
  scored.sort((a, b) => a.score - b.score || a.entryItem.label.localeCompare(b.entryItem.label));
  return scored.map((row) => row.entryItem);
}
