import { describe, expect, it } from 'vitest';
import { searchActions } from '../../src/content/search-actions';
import { searchIndex } from '../../src/content/search-index.generated';
import { foldSearch, KIND_ORDER, rankActionMatches, rankIndexMatches } from '../../src/components/features/command-palette/search';

describe('command palette search', () => {
  it('folds Vietnamese diacritics for action matching', () => {
    expect(foldSearch('sau trận')).toBe('sau tran');
    const matches = rankActionMatches(searchActions, foldSearch('sau tran'));
    expect(matches[0]).toMatchObject({ id: 'post-game-debrief', href: '/checklist?stage=post' });
  });

  it('finds rolldown checklist action before entity results', () => {
    const actions = rankActionMatches(searchActions, foldSearch('rolldown'));
    const entities = rankIndexMatches(searchIndex, foldSearch('rolldown'));
    expect(actions[0]).toMatchObject({ id: 'roll-checklist' });
    expect(entities.length).toBeGreaterThan(0);
  });

  it('keeps lessons before Set18 entity kinds in kind order', () => {
    expect(KIND_ORDER[0]).toBe('lesson');
    expect(KIND_ORDER.slice(1)).toEqual(['champion', 'trait', 'wisp', 'augment']);
  });

  it('finds VOD review action by review query', () => {
    const matches = rankActionMatches(searchActions, foldSearch('review vod'));
    expect(matches.some((match) => match.id === 'vod-review')).toBe(true);
  });
});
