import React from 'react';
import { Badge } from '../core/Badge.jsx';
import { Tag } from '../core/Tag.jsx';

const CSS = `
.tftcc{--_c:var(--cost-1);position:relative;width:172px;border:1px solid var(--border-line);border-radius:var(--r-md);background:var(--surface-card);overflow:hidden;transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out);font-family:var(--font-body)}
.tftcc:hover{transform:translateY(-3px);border-color:var(--_c);box-shadow:var(--shadow-lg)}
.tftcc__port{position:relative;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;background:radial-gradient(120% 100% at 50% 0%,color-mix(in srgb,var(--_c) 30%,var(--ink-700)) 0%,var(--ink-800) 70%);border-bottom:2px solid var(--_c)}
.tftcc__init{font-family:var(--font-display);font-weight:var(--fw-extra);font-size:44px;color:var(--text-strong);text-transform:uppercase;letter-spacing:-.02em}
.tftcc__img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tftcc__cost{position:absolute;top:8px;right:8px}
.tftcc__body{padding:10px 12px 12px}
.tftcc__name{font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;font-size:var(--fs-h4);line-height:1.05;color:var(--text-strong);letter-spacing:var(--ls-tight)}
.tftcc__traits{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}
.tftcc__trait{font-size:var(--fs-2xs);font-weight:var(--fw-medium);color:var(--text-muted);background:var(--surface-raised);border:1px solid var(--border-subtle);border-radius:var(--r-xs);padding:3px 7px;letter-spacing:.02em}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-champcard-css')) {
  const s = document.createElement('style'); s.id = 'tft-champcard-css'; s.textContent = CSS; document.head.appendChild(s);
}
const COST_VAR = { 1: 'var(--cost-1)', 2: 'var(--cost-2)', 3: 'var(--cost-3)', 4: 'var(--cost-4)', 5: 'var(--cost-5)' };

export function ChampionCard({ name, cost = 1, traits = [], portrait, className = '', style, ...rest }) {
  return (
    <article className={['tftcc', className].filter(Boolean).join(' ')} style={{ '--_c': COST_VAR[cost], ...style }} {...rest}>
      <div className="tftcc__port">
        {portrait ? <img className="tftcc__img" src={portrait} alt={name} /> : <span className="tftcc__init">{(name || '?').slice(0, 2)}</span>}
        <span className="tftcc__cost"><Badge cost={cost} /></span>
      </div>
      <div className="tftcc__body">
        <div className="tftcc__name">{name}</div>
        {traits.length > 0 && (
          <div className="tftcc__traits">
            {traits.map((t) => <span key={t} className="tftcc__trait">{t}</span>)}
          </div>
        )}
      </div>
    </article>
  );
}
