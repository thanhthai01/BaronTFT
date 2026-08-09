'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  addDebrief,
  createDebrief,
  emptyDebriefDraft,
  errorLabelDescriptions,
  errorLabels,
  errorStages,
  outcomeBiases,
  recommendNextLesson,
  topLabelSummary,
  validateDebriefDraft,
  type DebriefDraft,
  type PostGameDebrief,
} from './debrief';
import styles from './ChecklistApp.module.css';

const outcomeBiasLabel: Record<(typeof outcomeBiases)[number], string> = {
  'good-decision-bad-result': 'Quyết định tốt, kết quả xấu',
  'bad-decision-good-result': 'Quyết định xấu, kết quả tốt',
};

export function PostGameFocus({ latest }: { latest?: PostGameDebrief }) {
  if (!latest) return null;

  return (
    <aside className={styles.nextFocus} aria-label="Trọng tâm trận này">
      <strong>Trọng tâm trận này</strong>
      <p>{latest.nextGameBehavior}</p>
    </aside>
  );
}

export function PostGameDebriefPanel({
  history,
  onHistoryChange,
}: {
  history: PostGameDebrief[];
  onHistoryChange: (history: PostGameDebrief[]) => void;
}) {
  const [draft, setDraft] = useState<DebriefDraft>(emptyDebriefDraft);
  const [submitted, setSubmitted] = useState(false);
  const errors = validateDebriefDraft(draft);
  const recommendation = recommendNextLesson(history);

  function update<K extends keyof DebriefDraft>(key: K, value: DebriefDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function save() {
    setSubmitted(true);
    const record = createDebrief(draft);
    if (!record) return;
    onHistoryChange(addDebrief(history, record));
    setDraft(emptyDebriefDraft);
    setSubmitted(false);
  }

  function deleteRecord(id: string) {
    onHistoryChange(history.filter((record) => record.id !== id));
  }

  function clearHistory() {
    if (window.confirm('Xóa toàn bộ lịch sử debrief trên máy này?')) onHistoryChange([]);
  }

  return (
    <section className={styles.debrief} aria-labelledby="post-game-debrief-title">
      <div className={styles.debriefHead}>
        <div>
          <h2 id="post-game-debrief-title">Debrief 30–60 giây</h2>
          <p>Không nhập placement. Chỉ ghi lỗi đầu tiên có thể sửa, một nhãn chính và hành vi trận sau.</p>
        </div>
        <div className={styles.debriefStats} aria-label="Tóm tắt nhãn lỗi">
          <span>{topLabelSummary(history, 10)}</span>
          <span>{topLabelSummary(history, 20)}</span>
        </div>
      </div>

      {submitted && errors.length > 0 ? (
        <div className={styles.formError} role="alert">
          <strong>Chưa lưu được</strong>
          <ul>
            {errors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        </div>
      ) : null}

      <div className={styles.debriefForm}>
        <label className={styles.field}>
          <span>Stage của lỗi sớm nhất</span>
          <select value={draft.errorStage} onChange={(event) => update('errorStage', event.target.value as DebriefDraft['errorStage'])}>
            {errorStages.map((stage) => <option key={stage}>{stage}</option>)}
          </select>
        </label>

        <label className={styles.field}>
          <span>Lỗi đầu tiên có thể sửa</span>
          <textarea
            rows={3}
            value={draft.firstFixableError}
            onChange={(event) => update('firstFixableError', event.target.value)}
          />
        </label>

        <fieldset className={styles.labelFieldset}>
          <legend>Chọn một nhãn lỗi chính</legend>
          <div className={styles.labelGrid}>
            {errorLabels.map((label) => (
              <label className={styles.labelChoice} key={label} title={errorLabelDescriptions[label]}>
                <input
                  checked={draft.errorLabel === label}
                  name="error-label"
                  type="radio"
                  value={label}
                  onChange={() => update('errorLabel', label)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className={styles.field}>
          <span>Hành vi quan sát được cho trận sau</span>
          <textarea
            rows={2}
            value={draft.nextGameBehavior}
            onChange={(event) => update('nextGameBehavior', event.target.value)}
          />
        </label>

        <fieldset className={styles.biasFieldset}>
          <legend>Bias kết quả (không bắt buộc)</legend>
          {outcomeBiases.map((bias) => (
            <label key={bias}>
              <input
                checked={draft.outcomeBias === bias}
                name="outcome-bias"
                type="radio"
                value={bias}
                onChange={() => update('outcomeBias', bias)}
              />
              <span>{outcomeBiasLabel[bias]}</span>
            </label>
          ))}
          <button className={styles.clearBias} type="button" onClick={() => update('outcomeBias', '')}>
            Bỏ chọn bias
          </button>
        </fieldset>

        <button className={styles.saveDebrief} type="button" onClick={save}>
          Lưu debrief
        </button>
      </div>

      {recommendation ? (
        <aside className={styles.recommendation} aria-label="Gợi ý bài học tiếp theo">
          <strong>Gợi ý một bài</strong>
          <p>{recommendation.reason}</p>
          <Link href={recommendation.href}>{recommendation.label}</Link>
        </aside>
      ) : (
        <p className={styles.noRecommendation}>Chưa đủ tín hiệu lặp lại — giữ đúng hành vi đã chọn cho trận kế tiếp.</p>
      )}

      <div className={styles.historyHead}>
        <h3>Lịch sử debrief</h3>
        {history.length > 0 ? <button className={styles.reset} type="button" onClick={clearHistory}>Xóa lịch sử</button> : null}
      </div>
      {history.length === 0 ? (
        <p className={styles.emptyHistory}>Chưa có debrief nào. Lưu record đầu tiên sau trận này.</p>
      ) : (
        <ol className={styles.historyList}>
          {history.map((record) => (
            <li className={styles.historyItem} key={record.id}>
              <div>
                <strong>{record.errorLabel} · {record.errorStage}</strong>
                <p>{record.firstFixableError}</p>
                <small>Trận sau: {record.nextGameBehavior}</small>
              </div>
              <button type="button" onClick={() => deleteRecord(record.id)}>Xóa</button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
