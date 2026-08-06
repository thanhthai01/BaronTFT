'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useState } from 'react';
import { Button } from '@/components/design-system/Button/Button';
import { decisionSkills } from '@/content/decision-skills';
import { motion, prefersReducedMotion } from '@/lib/motion';
import styles from './DecisionBoard.module.css';

const rows = [
  decisionSkills.slice(0, 3),
  decisionSkills.slice(3, 7),
  decisionSkills.slice(7, 10),
];

gsap.registerPlugin(useGSAP);

export function DecisionBoard() {
  const [selectedId, setSelectedId] = useState(decisionSkills[0].id);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = decisionSkills.find((skill) => skill.id === selectedId) ?? decisionSkills[0];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Không dùng scale ở đây: các ô stagger vào không cùng lúc, nếu scale
      // từ 0.92 lên 1 thì trong lúc đang vào, ô đã xong trông to hơn hẳn ô
      // chưa xong — nhìn như các ô không cùng kích thước.
      gsap.from('[data-hex]', {
        autoAlpha: 0,
        y: 18,
        duration: motion.base,
        ease: motion.easeOut,
        stagger: 0.045,
      });
    },
    { scope: wrapRef },
  );

  function selectSkill(id: string) {
    setSelectedId(id);
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div aria-label="Bàn kỹ năng ra quyết định TFT" className={styles.board} role="group">
        {rows.map((row, rowIndex) => (
          <div className={styles.row} key={rowIndex}>
            {row.map((skill) => (
              <button
                aria-pressed={selected.id === skill.id}
                className={styles.hex}
                data-hex="true"
                key={skill.id}
                type="button"
                onClick={() => selectSkill(skill.id)}
              >
                <span>{skill.shortLabel}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <aside aria-live="polite" className={styles.panel} key={selected.id}>
        <span className="kicker">Kỹ năng đang mở</span>
        <h2>{selected.label}</h2>
        <p>{selected.signal}</p>
        <dl className={styles.dl}>
          <div>
            <dt>Bài nên đọc</dt>
            <dd>{selected.lesson}</dd>
          </div>
          <div>
            <dt>Checklist nên mở</dt>
            <dd>{selected.checklist}</dd>
          </div>
          <div>
            <dt>Bài tập 10 trận</dt>
            <dd>{selected.drill}</dd>
          </div>
        </dl>
        <Button href={selected.href} variant="secondary">
          Mở bài học liên quan
        </Button>
      </aside>
    </div>
  );
}
