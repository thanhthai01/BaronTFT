'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/design-system/Button/Button';
import { createReviewMarkdown, type ReviewSummaryInput } from '@/lib/review-markdown';
import { readJson, storageKeys, writeJson } from '@/lib/storage';
import styles from './ReviewLab.module.css';

const defaultDraft: ReviewSummaryInput = {
  placement: '',
  comp: '',
  weakStage: 'Stage 4',
  turningPoint: 'Stage 3',
  firstFixableError: '',
  errorTags: [],
  replacementDecision: '',
};

const stages = ['Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'];
const tags = ['Economy', 'Tempo', 'Item', 'Augment', 'Pivot', 'Scout', 'Positioning', 'Rolldown', 'Tilt'];

export function ReviewLab() {
  const [draft, setDraft] = useState<ReviewSummaryInput>(defaultDraft);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const markdown = useMemo(() => createReviewMarkdown(draft), [draft]);

  useEffect(() => {
    setDraft((current) => (current === defaultDraft ? readJson<ReviewSummaryInput>(storageKeys.reviewDraft, defaultDraft) : current));
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    writeJson(storageKeys.reviewDraft, draft);
  }, [draft, draftLoaded]);

  function update<K extends keyof ReviewSummaryInput>(key: K, value: ReviewSummaryInput[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className={styles.grid}>
      <form className={styles.form}>
        <div className={styles.comparison}>
          <div className={styles.box}>
            <strong>Quyết định tốt, kết quả xấu</strong>
            <span>Không sửa bừa chỉ vì bot 4.</span>
          </div>
          <div className={styles.box}>
            <strong>Quyết định xấu, kết quả tốt</strong>
            <span>Không giữ thói quen sai chỉ vì top 2.</span>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="placement">Placement</label>
          <input id="placement" placeholder="Ví dụ: 6th" value={draft.placement} onChange={(event) => update('placement', event.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="comp">Comp / line</label>
          <input id="comp" placeholder="Ví dụ: AD tempo → Fast 8" value={draft.comp} onChange={(event) => update('comp', event.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="weakStage">Stage yếu nhất</label>
          <select id="weakStage" value={draft.weakStage} onChange={(event) => update('weakStage', event.target.value)}>
            {stages.map((stage) => <option key={stage}>{stage}</option>)}
          </select>
        </div>

        <fieldset>
          <legend className={styles.legend}>Turning point</legend>
          <div className={styles.timeline}>
            {stages.map((stage) => (
              <button
                aria-pressed={draft.turningPoint === stage}
                className={styles.pill}
                key={stage}
                type="button"
                onClick={() => update('turningPoint', stage)}
              >
                {stage}
              </button>
            ))}
          </div>
        </fieldset>

        <div className={styles.field}>
          <label htmlFor="firstFixableError">Lỗi đầu tiên có thể sửa</label>
          <textarea id="firstFixableError" value={draft.firstFixableError} onChange={(event) => update('firstFixableError', event.target.value)} />
        </div>

        <fieldset>
          <legend className={styles.legend}>Tag lỗi</legend>
          <div className={styles.tags}>
            {tags.map((tag) => {
              const active = draft.errorTags.includes(tag);
              return (
                <button
                  aria-pressed={active}
                  className={styles.pill}
                  key={tag}
                  type="button"
                  onClick={() => update('errorTags', active ? draft.errorTags.filter((item) => item !== tag) : [...draft.errorTags, tag])}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className={styles.field}>
          <label htmlFor="replacementDecision">Quyết định thay thế</label>
          <textarea id="replacementDecision" value={draft.replacementDecision} onChange={(event) => update('replacementDecision', event.target.value)} />
        </div>
      </form>

      <aside className={styles.preview}>
        <div className={styles.copyRow}>
          <span className="kicker">Markdown summary</span>
          <Button type="button" variant="secondary" onClick={copyMarkdown}>Copy review summary</Button>
        </div>
        <pre>{markdown}</pre>
        <p aria-live="polite" className={styles.status}>{copied ? 'Đã copy review summary.' : ''}</p>
      </aside>
    </section>
  );
}
