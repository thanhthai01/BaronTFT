'use client';

import { useState } from 'react';
import { Tabs, tabElementId, tabPanelId } from '@/components/design-system/Tabs/Tabs';
import { practiceForms, practiceReviewQuestions } from '@/content/practice-forms.generated';
import styles from './PracticeFormsView.module.css';

const TAB_PREFIX = 'bieu-mau-';

export function PracticeFormsView() {
  const [activeId, setActiveId] = useState(practiceForms[0].id);
  const [copied, setCopied] = useState(false);
  const activeForm = practiceForms.find((form) => form.id === activeId) ?? practiceForms[0];

  async function copyTemplate() {
    await navigator.clipboard.writeText(activeForm.template);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={styles.shell}>
      <section aria-labelledby="bieu-mau-title" className={styles.formsSection}>
        <h2 className={styles.sectionTitle} id="bieu-mau-title">7 biểu mẫu điền tay</h2>
        <Tabs
          idPrefix={TAB_PREFIX}
          label="Chọn biểu mẫu"
          tabs={practiceForms.map((form) => ({ id: form.id, label: form.title }))}
          value={activeId}
          onChange={setActiveId}
        />
        <div
          aria-labelledby={tabElementId(TAB_PREFIX, activeId)}
          className={styles.panel}
          id={tabPanelId(TAB_PREFIX, activeId)}
          role="tabpanel"
        >
          <div className={styles.panelHead}>
            <h3>{activeForm.title}</h3>
            <button className={styles.copyButton} type="button" onClick={copyTemplate}>
              {copied ? 'Đã copy' : 'Copy'}
            </button>
          </div>
          <pre className={styles.template}>{activeForm.template}</pre>
        </div>
      </section>

      <section aria-labelledby="review-questions-title" className={styles.reviewSection}>
        <h2 className={styles.sectionTitle} id="review-questions-title">Bộ câu hỏi review sâu</h2>
        <ol className={styles.reviewList}>
          {practiceReviewQuestions.map((question) => <li key={question}>{question}</li>)}
        </ol>
      </section>
    </div>
  );
}
