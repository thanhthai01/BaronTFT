import React from 'react';

const CSS = `
.tfttabs{display:inline-flex;gap:4px;padding:4px;background:var(--surface-card);border:1px solid var(--border-line);border-radius:var(--r-md);font-family:var(--font-body)}
.tfttabs--line{background:none;border:none;border-bottom:1px solid var(--border-line);border-radius:0;padding:0;gap:2px}
.tfttab{display:inline-flex;align-items:center;gap:7px;font-size:var(--fs-sm);font-weight:var(--fw-semibold);color:var(--text-muted);background:none;border:none;cursor:pointer;padding:8px 16px;border-radius:var(--r-sm);transition:all var(--dur-fast) var(--ease-out);white-space:nowrap}
.tfttab:hover{color:var(--text-strong)}
.tfttab--on{color:var(--text-on-gold);background:var(--grad-gold)}
.tfttabs--line .tfttab{border-radius:0;padding:12px 4px;margin:0 12px;position:relative}
.tfttabs--line .tfttab--on{color:var(--gold-300);background:none}
.tfttabs--line .tfttab--on::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--grad-gold)}
.tfttab__badge{font-family:var(--font-mono);font-size:var(--fs-2xs);opacity:.8}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-tabs-css')) {
  const s = document.createElement('style'); s.id = 'tft-tabs-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Tabs({ tabs = [], value, onChange, variant = 'segment', className = '', ...rest }) {
  return (
    <div className={['tfttabs', variant === 'line' && 'tfttabs--line', className].filter(Boolean).join(' ')} role="tablist" {...rest}>
      {tabs.map((t) => {
        const key = t.key || t.label;
        const on = value === key;
        return (
          <button key={key} role="tab" aria-selected={on} className={['tfttab', on && 'tfttab--on'].filter(Boolean).join(' ')} onClick={() => onChange && onChange(key)}>
            {t.icon}{t.label}{t.badge != null && <span className="tfttab__badge">{t.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
