'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { searchActions, type SearchAction } from '@/content/search-actions';
import { searchIndex, type SearchIndexEntry, type SearchIndexKind } from '@/content/search-index.generated';
import { foldSearch, KIND_GROUP_LABEL, KIND_ORDER, rankActionMatches, rankIndexMatches } from './search';
import styles from './CommandPalette.module.css';

const MAX_RESULTS_PER_KIND = 8;
const MAX_ACTION_RESULTS = 6;

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
  const foldedQuery = foldSearch(query.trim());

  const queryResults = useMemo((): { actions: SearchAction[]; byKind: Map<SearchIndexKind, SearchIndexEntry[]> } | null => {
    if (!foldedQuery) return null;
    const byKind = new Map<SearchIndexKind, SearchIndexEntry[]>();
    for (const kind of KIND_ORDER) {
      const matches = rankIndexMatches(
        searchIndex.filter((entryItem) => entryItem.kind === kind),
        foldedQuery,
      ).slice(0, MAX_RESULTS_PER_KIND);
      if (matches.length) byKind.set(kind, matches);
    }
    return {
      actions: rankActionMatches(searchActions, foldedQuery).slice(0, MAX_ACTION_RESULTS),
      byKind,
    };
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

        {queryResults === null
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
          : (
              <>
                {queryResults.actions.length ? (
                  <Command.Group heading="Hành động" className={styles.groupHeading}>
                    {queryResults.actions.map((action) => (
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
                ) : null}
                {KIND_ORDER.filter((kind) => queryResults.byKind.has(kind)).map((kind) => (
                  <Command.Group heading={KIND_GROUP_LABEL[kind]} key={kind} className={styles.groupHeading}>
                    {queryResults.byKind.get(kind)!.map((entryItem) => (
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
              </>
            )}
      </Command.List>
    </Command.Dialog>
  );
}
