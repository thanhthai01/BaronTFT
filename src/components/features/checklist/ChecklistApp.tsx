'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Tabs } from '@/components/design-system/Tabs/Tabs';
import { checklistStages } from '@/content/checklist';
import { readJson, storageKeys, writeJson } from '@/lib/storage';
import { PostGameDebriefPanel, PostGameFocus } from './PostGameDebrief';
import type { PostGameDebrief } from './debrief';
import styles from './ChecklistApp.module.css';

type ChecklistState = Record<string, boolean>;

const DEFAULT_STAGE = checklistStages[0].id;

function isValidStage(value: string | null): value is (typeof checklistStages)[number]['id'] {
  return checklistStages.some((stage) => stage.id === value);
}

export function ChecklistApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedStage = searchParams.get('stage');
  const initialStage = isValidStage(requestedStage) ? requestedStage : DEFAULT_STAGE;
  const [activeStage, setActiveStage] = useState(initialStage);
  const [focusMode, setFocusMode] = useState(false);
  const [checked, setChecked] = useState<ChecklistState>({});
  const [checkedLoaded, setCheckedLoaded] = useState(false);
  const [debriefHistory, setDebriefHistory] = useState<PostGameDebrief[]>([]);
  const [debriefLoaded, setDebriefLoaded] = useState(false);
  const currentStage = checklistStages.find((stage) => stage.id === activeStage) ?? checklistStages[0];
  const visibleItems = focusMode ? currentStage.items.filter((item) => item.focus).slice(0, 3) : currentStage.items;
  const total = useMemo(() => checklistStages.flatMap((stage) => stage.items).length, []);
  const done = Object.values(checked).filter(Boolean).length;

  useEffect(() => {
    const nextStage = isValidStage(requestedStage) ? requestedStage : DEFAULT_STAGE;
    setActiveStage(nextStage);
  }, [requestedStage]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeStage === DEFAULT_STAGE) params.delete('stage');
    else params.set('stage', activeStage);
    const query = params.toString();
    router.replace(query ? `/checklist?${query}` : '/checklist', { scroll: false });
  }, [activeStage, router, searchParams]);

  useEffect(() => {
    setChecked((current) => (Object.keys(current).length === 0 ? readJson<ChecklistState>(storageKeys.checklist, {}) : current));
    setDebriefHistory(readJson<PostGameDebrief[]>(storageKeys.postGameDebriefs, []));
    setCheckedLoaded(true);
    setDebriefLoaded(true);
  }, []);

  useEffect(() => {
    if (!checkedLoaded) return;
    writeJson(storageKeys.checklist, checked);
  }, [checked, checkedLoaded]);

  useEffect(() => {
    if (!debriefLoaded) return;
    writeJson(storageKeys.postGameDebriefs, debriefHistory);
  }, [debriefHistory, debriefLoaded]);

  return (
    <section aria-label="Checklist theo giai đoạn" className={styles.shell} data-surface={focusMode ? 'focus' : undefined}>
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
      {activeStage !== 'post' ? <PostGameFocus latest={debriefHistory[0]} /> : null}
      <p aria-atomic="true" aria-live="polite" className={styles.progress}>{done}/{total} câu đã tick · dữ liệu lưu trên máy của bạn</p>
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
                onChange={(event) => {
                  setChecked((state) => {
                    const next = { ...state, [item.id]: event.target.checked };
                    writeJson(storageKeys.checklist, next);
                    return next;
                  });
                }}
              />
              <span>{item.text}</span>
            </label>
          );
        })}
      </div>
      {activeStage === 'post' ? <PostGameDebriefPanel history={debriefHistory} onHistoryChange={setDebriefHistory} /> : null}
    </section>
  );
}
