'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toSlug } from '@/lib/slug';
import { searchActions } from '@/content/search-actions';
import { searchIndex, type SearchIndexEntry, type SearchIndexKind } from '@/content/search-index.generated';
import styles from './CommandPalette.module.css';

const KIND_GROUP_LABEL: Record<SearchIndexKind, string> = {
  champion: 'Tướng',
  trait: 'Tộc hệ',
  wisp: 'Tinh Linh',
  augment: 'Nâng cấp',
  lesson: 'Bài học',
};

const KIND_ORDER: SearchIndexKind[] = ['champion', 'trait', 'wisp', 'augment', 'lesson'];
const MAX_RESULTS_PER_KIND = 8;

function fold(value: string): string {
  return toSlug(value).replace(/-/g, ' ');
}

/** Xếp hạng theo mức khớp: khớp đầu chuỗi (prefix) trước, khớp chứa chuỗi con sau
 * — gõ "aka" nên đưa "Akali" lên trước 1 augment nào đó tình cờ chứa "aka" giữa câu. */
function rankMatches(entries: SearchIndexEntry[], foldedQuery: string): SearchIndexEntry[] {
  const scored = entries
    .map((entryItem) => {
      const foldedLabel = fold(entryItem.label);
      if (foldedLabel.startsWith(foldedQuery)) return { entryItem, score: 0 };
      if (entryItem.folded.startsWith(foldedQuery)) return { entryItem, score: 1 };
      if (entryItem.folded.includes(foldedQuery)) return { entryItem, score: 2 };
      return null;
    })
    .filter((row): row is { entryItem: SearchIndexEntry; score: number } => row !== null);
  scored.sort((a, b) => a.score - b.score);
  return scored.map((row) => row.entryItem);
}

export default function CommandPaletteDialog({
  open,
  onOpenChange,
  groups,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: string[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const foldedQuery = fold(query.trim());

  const resultsByKind = useMemo(() => {
    if (!foldedQuery) return null;
    const grouped = new Map<SearchIndexKind, SearchIndexEntry[]>();
    for (const kind of KIND_ORDER) {
      const matches = rankMatches(
        searchIndex.filter((entryItem) => entryItem.kind === kind),
        foldedQuery,
      ).slice(0, MAX_RESULTS_PER_KIND);
      if (matches.length) grouped.set(kind, matches);
    }
    return grouped;
  }, [foldedQuery]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <Command.Dialog
      contentClassName={styles.dialog}
      label="Tìm nhanh"
      open={open}
      onOpenChange={onOpenChange}
      overlayClassName={styles.overlay}
      shouldFilter={false}
    >
      <Command.Input
        className={styles.input}
        onValueChange={setQuery}
        placeholder="Tìm bài học, checklist, mùa 18…"
        value={query}
      />
      <Command.List className={styles.list}>
        <Command.Empty className={styles.empty}>Không tìm thấy hành động phù hợp.</Command.Empty>

        {resultsByKind === null
          ? groups.map((group) => (
              <Command.Group heading={group} key={group} className={styles.groupHeading}>
                {searchActions
                  .filter((action) => action.group === group)
                  .map((action) => (
                    <Command.Item
                      className={styles.item}
                      key={action.id}
                      onSelect={() => go(action.href)}
                      value={action.id}
                    >
                      <strong>{action.label}</strong>
                      <span>{action.description}</span>
                    </Command.Item>
                  ))}
              </Command.Group>
            ))
          : KIND_ORDER.filter((kind) => resultsByKind.has(kind)).map((kind) => (
              <Command.Group heading={KIND_GROUP_LABEL[kind]} key={kind} className={styles.groupHeading}>
                {resultsByKind.get(kind)!.map((entryItem) => (
                  <Command.Item
                    className={styles.item}
                    key={entryItem.id}
                    onSelect={() => go(entryItem.href)}
                    value={entryItem.id}
                  >
                    <strong>{entryItem.label}</strong>
                    <span>{entryItem.sublabel}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
      </Command.List>
    </Command.Dialog>
  );
}
