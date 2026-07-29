import React from 'react';

const CSS = `
.tftit{width:250px;border-radius:var(--r-md);overflow:hidden;background:var(--ink-800);border:1px solid var(--border-line);box-shadow:var(--shadow-lg);font-family:var(--font-body)}
.tftit__head{display:flex;gap:11px;align-items:center;padding:12px 14px;border-bottom:1px solid var(--border-line);background:var(--grad-panel)}
.tftit__icon{flex:none;width:40px;height:40px;border-radius:var(--r-sm);background:var(--grad-gold);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:var(--fw-bold);font-size:18px;color:var(--text-on-gold);box-shadow:var(--shadow-sm)}
.tftit__icon img{width:100%;height:100%;object-fit:cover;border-radius:var(--r-sm)}
.tftit__name{font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;font-size:var(--fs-h4);line-height:1.05;color:var(--text-strong);letter-spacing:var(--ls-tight)}
.tftit__kind{font-size:var(--fs-2xs);color:var(--teal-300);text-transform:uppercase;letter-spacing:var(--ls-caps);font-weight:var(--fw-semibold);margin-top:3px}
.tftit__stats{display:flex;flex-wrap:wrap;gap:6px;padding:11px 14px 4px}
.tftit__stat{font-family:var(--font-mono);font-size:var(--fs-2xs);font-weight:var(--fw-medium);color:var(--gold-100);background:rgba(42,68,200,.08);border:1px solid rgba(42,68,200,.3);border-radius:var(--r-xs);padding:3px 7px}
.tftit__desc{padding:6px 14px 14px;font-size:var(--fs-sm);line-height:1.5;color:var(--text-muted)}
.tftit__desc b{color:var(--gold-100);font-weight:var(--fw-semibold)}
.tftit__recipe{display:flex;align-items:center;gap:6px;padding:10px 14px;border-top:1px solid var(--border-line);background:var(--ink-850)}
.tftit__comp{width:24px;height:24px;border-radius:var(--r-xs);background:var(--surface-raised);border:1px solid var(--border-line);display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:11px;color:var(--text-muted)}
.tftit__plus{color:var(--text-subtle);font-weight:700}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-itemtip-css')) {
  const s = document.createElement('style'); s.id = 'tft-itemtip-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function ItemTooltip({ name, icon, kind = 'Trang bị', stats = [], description, recipe = [], className = '', ...rest }) {
  return (
    <div className={['tftit', className].filter(Boolean).join(' ')} role="tooltip" {...rest}>
      <div className="tftit__head">
        <div className="tftit__icon">{typeof icon === 'string' ? <img src={icon} alt="" /> : (icon || (name || '?').slice(0, 1))}</div>
        <div>
          <div className="tftit__name">{name}</div>
          <div className="tftit__kind">{kind}</div>
        </div>
      </div>
      {stats.length > 0 && <div className="tftit__stats">{stats.map((s, i) => <span key={i} className="tftit__stat">{s}</span>)}</div>}
      {description && (typeof description === 'string'
        ? <p className="tftit__desc" dangerouslySetInnerHTML={{ __html: description }} />
        : <p className="tftit__desc">{description}</p>)}
      {recipe.length > 0 && (
        <div className="tftit__recipe">
          {recipe.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="tftit__plus">+</span>}
              <span className="tftit__comp">{c}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
