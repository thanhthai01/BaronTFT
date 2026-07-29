import React from 'react';
import { Tag } from '../core/Tag.jsx';

const CSS = `
.tftguide{display:flex;flex-direction:column;width:300px;border:1px solid var(--border-line);border-radius:var(--r-lg);background:var(--surface-card);overflow:hidden;font-family:var(--font-body);transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out);cursor:pointer;text-decoration:none}
.tftguide:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:var(--border-strong)}
.tftguide__cover{position:relative;aspect-ratio:16/9;background:var(--grad-board);display:flex;align-items:center;justify-content:center;border-bottom:1px solid var(--border-line);overflow:hidden}
.tftguide__cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tftguide__num{font-family:var(--font-display);font-weight:var(--fw-extra);font-size:64px;color:color-mix(in srgb,var(--accent) 22%,transparent);text-transform:uppercase;letter-spacing:-.03em}
.tftguide__lvl{position:absolute;top:10px;left:10px}
.tftguide__body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:8px;flex:1}
.tftguide__title{font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;font-size:var(--fs-h3);line-height:1.05;color:var(--text-strong);letter-spacing:var(--ls-tight)}
.tftguide__desc{font-size:var(--fs-sm);line-height:1.55;color:var(--text-muted);flex:1}
.tftguide__meta{display:flex;align-items:center;gap:12px;margin-top:4px;font-family:var(--font-mono);font-size:var(--fs-2xs);color:var(--text-subtle);letter-spacing:.02em}
.tftguide__meta b{color:var(--gold-300);font-weight:var(--fw-bold)}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-guidecard-css')) {
  const s = document.createElement('style'); s.id = 'tft-guidecard-css'; s.textContent = CSS; document.head.appendChild(s);
}
const LVL_TONE = { 'Nhập môn': 'teal', 'Cơ bản': 'teal', 'Trung cấp': 'gold', 'Nâng cao': 'gold', Beginner: 'teal', Advanced: 'gold' };

export function GuideCard({ title, description, level = 'Nhập môn', number, duration, lessons, cover, as = 'a', className = '', ...rest }) {
  const Tag2 = as;
  return (
    <Tag2 className={['tftguide', className].filter(Boolean).join(' ')} {...rest}>
      <div className="tftguide__cover">
        {cover ? <img src={cover} alt={title} /> : <span className="tftguide__num">{number != null ? String(number).padStart(2, '0') : 'TFT'}</span>}
        <span className="tftguide__lvl"><Tag tone={LVL_TONE[level] || 'neutral'} dot>{level}</Tag></span>
      </div>
      <div className="tftguide__body">
        <div className="tftguide__title">{title}</div>
        {description && <p className="tftguide__desc">{description}</p>}
        <div className="tftguide__meta">
          {lessons != null && <span><b>{lessons}</b> bài</span>}
          {duration && <span>{duration}</span>}
        </div>
      </div>
    </Tag2>
  );
}
