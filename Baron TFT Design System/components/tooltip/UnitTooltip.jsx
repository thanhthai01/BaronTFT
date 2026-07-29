import React from 'react';
import { Badge } from '../core/Badge.jsx';

const CSS = `
.tftut{width:280px;border-radius:var(--r-md);overflow:hidden;background:var(--ink-800);border:1px solid var(--border-gold);box-shadow:var(--shadow-lg);font-family:var(--font-body)}
.tftut__head{padding:12px 14px;background:linear-gradient(180deg,rgba(42,68,200,.12),transparent),var(--ink-700);border-bottom:1px solid var(--border-line)}
.tftut__top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.tftut__name{font-family:var(--font-display);font-weight:var(--fw-bold);text-transform:uppercase;font-size:var(--fs-h3);line-height:1;color:var(--text-strong);letter-spacing:var(--ls-tight)}
.tftut__title{font-size:var(--fs-2xs);color:var(--gold-300);text-transform:uppercase;letter-spacing:var(--ls-caps);font-weight:var(--fw-semibold);margin-top:5px}
.tftut__traits{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}
.tftut__trait{font-size:var(--fs-2xs);color:var(--text-muted);background:var(--surface-card);border:1px solid var(--border-subtle);border-radius:var(--r-xs);padding:3px 7px}
.tftut__stats{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border-subtle)}
.tftut__stat{background:var(--ink-800);padding:8px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px}
.tftut__stat span{font-size:var(--fs-2xs);color:var(--text-subtle);text-transform:uppercase;letter-spacing:.06em}
.tftut__stat b{font-family:var(--font-mono);font-size:var(--fs-sm);font-weight:var(--fw-bold);color:var(--text-body)}
.tftut__abil{padding:12px 14px}
.tftut__ability-name{display:flex;align-items:center;gap:8px;font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;font-size:var(--fs-h4);color:var(--gold-300);letter-spacing:var(--ls-tight)}
.tftut__mana{font-family:var(--font-mono);font-size:var(--fs-2xs);color:var(--teal-300);margin-left:auto}
.tftut__ability-desc{font-size:var(--fs-sm);line-height:1.5;color:var(--text-muted);margin-top:6px}
.tftut__ability-desc b{color:var(--gold-100);font-weight:var(--fw-semibold)}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-unittip-css')) {
  const s = document.createElement('style'); s.id = 'tft-unittip-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function UnitTooltip({ name, cost = 1, title, traits = [], stats = [], ability, className = '', ...rest }) {
  return (
    <div className={['tftut', className].filter(Boolean).join(' ')} role="tooltip" {...rest}>
      <div className="tftut__head">
        <div className="tftut__top">
          <div>
            <div className="tftut__name">{name}</div>
            {title && <div className="tftut__title">{title}</div>}
          </div>
          <Badge cost={cost} />
        </div>
        {traits.length > 0 && <div className="tftut__traits">{traits.map((t) => <span key={t} className="tftut__trait">{t}</span>)}</div>}
      </div>
      {stats.length > 0 && (
        <div className="tftut__stats">
          {stats.map((s) => <div key={s.label} className="tftut__stat"><span>{s.label}</span><b>{s.value}</b></div>)}
        </div>
      )}
      {ability && (
        <div className="tftut__abil">
          <div className="tftut__ability-name">{ability.name}{ability.mana && <span className="tftut__mana">{ability.mana} MP</span>}</div>
          {typeof ability.desc === 'string'
            ? <p className="tftut__ability-desc" dangerouslySetInnerHTML={{ __html: ability.desc }} />
            : <p className="tftut__ability-desc">{ability.desc}</p>}
        </div>
      )}
    </div>
  );
}
