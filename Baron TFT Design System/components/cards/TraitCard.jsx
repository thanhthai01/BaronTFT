import React from 'react';

const CSS = `
.tfttrait{display:flex;gap:12px;align-items:flex-start;width:280px;padding:14px;border:1px solid var(--border-line);border-radius:var(--r-md);background:var(--surface-card);font-family:var(--font-body);transition:border-color var(--dur-base) var(--ease-out),background var(--dur-base) var(--ease-out)}
.tfttrait--active{border-color:var(--border-gold);background:linear-gradient(180deg,rgba(42,68,200,.07),transparent)}
.tfttrait__hex{flex:none;width:42px;height:42px;display:flex;align-items:center;justify-content:center;background:var(--surface-raised);clip-path:var(--hex-clip);color:var(--gold-300);font-family:var(--font-display);font-weight:var(--fw-bold);font-size:18px;text-transform:uppercase}
.tfttrait--active .tfttrait__hex{background:var(--grad-gold);color:var(--text-on-gold)}
.tfttrait__body{flex:1;min-width:0}
.tfttrait__top{display:flex;align-items:center;gap:8px}
.tfttrait__name{font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;font-size:var(--fs-h4);color:var(--text-strong);letter-spacing:var(--ls-tight);line-height:1}
.tfttrait__count{font-family:var(--font-mono);font-weight:var(--fw-bold);font-size:var(--fs-xs);color:var(--gold-300)}
.tfttrait__desc{font-size:var(--fs-sm);line-height:1.5;color:var(--text-muted);margin-top:6px}
.tfttrait__tiers{display:flex;gap:6px;margin-top:10px}
.tfttrait__tier{font-family:var(--font-mono);font-size:var(--fs-2xs);font-weight:var(--fw-medium);color:var(--text-subtle);padding:3px 7px;border-radius:var(--r-xs);background:var(--surface-raised);border:1px solid var(--border-subtle)}
.tfttrait__tier--on{color:var(--text-on-gold);background:var(--grad-gold);border-color:transparent}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-traitcard-css')) {
  const s = document.createElement('style'); s.id = 'tft-traitcard-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function TraitCard({ name, icon, count, active = false, description, tiers = [], activeTier = -1, className = '', ...rest }) {
  return (
    <div className={['tfttrait', active && 'tfttrait--active', className].filter(Boolean).join(' ')} {...rest}>
      <div className="tfttrait__hex">{icon || (name || '?').slice(0, 1)}</div>
      <div className="tfttrait__body">
        <div className="tfttrait__top">
          <span className="tfttrait__name">{name}</span>
          {count != null && <span className="tfttrait__count">{count}</span>}
        </div>
        {description && <p className="tfttrait__desc">{description}</p>}
        {tiers.length > 0 && (
          <div className="tfttrait__tiers">
            {tiers.map((t, i) => (
              <span key={i} className={['tfttrait__tier', i <= activeTier && 'tfttrait__tier--on'].filter(Boolean).join(' ')}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
