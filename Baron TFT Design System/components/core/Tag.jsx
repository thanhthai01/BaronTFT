import React from 'react';

const CSS = `
.tfttag{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-body);font-weight:var(--fw-semibold);font-size:var(--fs-2xs);letter-spacing:var(--ls-wide);text-transform:uppercase;padding:4px 10px;border-radius:var(--r-pill);border:1px solid var(--border-line);background:var(--surface-raised);color:var(--text-muted);white-space:nowrap;line-height:1}
.tfttag__dot{width:7px;height:7px;border-radius:50%;background:currentColor;flex:none}
.tfttag--gold{color:var(--gold-300);border-color:var(--border-gold);background:rgba(42,68,200,0.09)}
.tfttag--teal{color:var(--teal-300);border-color:rgba(255,90,31,0.45);background:rgba(255,90,31,0.10)}
.tfttag--solid{background:var(--grad-gold);color:var(--text-on-gold);border-color:transparent}
.tfttag--outline{background:transparent}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-tag-css')) {
  const s = document.createElement('style'); s.id = 'tft-tag-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Tag({ tone = 'neutral', dot = false, children, className = '', style, ...rest }) {
  const cls = ['tfttag', tone !== 'neutral' && `tfttag--${tone}`, className].filter(Boolean).join(' ');
  return (
    <span className={cls} style={style} {...rest}>
      {dot && <span className="tfttag__dot" />}
      {children}
    </span>
  );
}
