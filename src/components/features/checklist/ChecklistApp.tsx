'use client';

import { useEffect, useMemo, useState } from 'react';
import { Tabs } from '@/components/design-system/Tabs/Tabs';
import { checklistStages } from '@/content/checklist';
import { readJson, storageKeys, writeJson } from '@/lib/storage';
import styles from './ChecklistApp.module.css';

type ChecklistState = Record<string, boolean>;

export function ChecklistApp() {
  const [activeStage, setActiveStage] = useState(checklistStages[0].id);
  const [focusMode, setFocusMode] = useState(false);
  const [checked, setChecked] = useState<ChecklistState>({});
  const currentStage = checklistStages.find((stage) => stage.id === activeStage) ?? checklistStages[0];
  const visibleItems = focusMode ? currentStage.items.filter((item) => item.focus).slice(0, 3) : currentStage.items;
  const total = useMemo(() => checklistStages.flatMap((stage) => stage.items).length, []);
  const done = Object.values(checked).filter(Boolean).length;

  useEffect(() => {
    setChecked(readJson<ChecklistState>(storageKeys.checklist, {}));
  }, []);

  useEffect(() => {
    writeJson(storageKeys.checklist, checked);
  }, [checked]);

  return (
    <section className={styles.shell} data-surface={focusMode ? 'focus' : undefined}>
      <div className={styles.toolbar}>
        <Tabs
          label="Chọn giai đoạn trận đấu"
          tabs={checklistStages.map((stage) => ({ id: stage.id, label: stage.label }))}
          value={activeStage}
          onChange={setActiveStage}
        />
        <div className={styles.actions}>
          <button
            aria-pressed={focusMode}
            className={styles.focusToggle}
            type="button"
            onClick={() => setFocusMode((value) => !value)}
          >
            Focus mode
          </button>
          <button className={styles.reset} type="button" onClick={() => setChecked({})}>
            Reset trận mới
          </button>
        </div>
      </div>
      <p className={styles.progress}>{done}/{total} câu đã tick · dữ liệu lưu trên máy của bạn</p>
      <div
        aria-labelledby={`${currentStage.id}-tab`}
        className={styles.panel}
        id={`${currentStage.id}-panel`}
        role="tabpanel"
      >
        {visibleItems.map((item) => {
          const isChecked = Boolean(checked[item.id]);
          return (
            <label className={[styles.item, isChecked && styles.done].filter(Boolean).join(' ')} key={item.id}>
              <input
                checked={isChecked}
                type="checkbox"
                onChange={(event) => setChecked((state) => ({ ...state, [item.id]: event.target.checked }))}
              />
              <span>{item.text}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
