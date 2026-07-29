import React from 'react';

const CSS = `
.tftbadge{display:inline-flex;align-items:center;justify-content:center;gap:5px;font-family:var(--font-mono);font-weight:var(--fw-bold);font-size:var(--fs-2xs);line-height:1;letter-spacing:0.02em;padding:4px 8px;border-radius:var(--r-xs);background:var(--surface-raised);color:var(--text-body);border:1px solid var(--border-line);font-feature-settings:'tnum' 1}
.tftbadge--cost1{background:rgba(141,150,165,.16);color:var(--cost-1);border-color:rgba(141,150,165,.5)}
.tftbadge--cost2{background:rgba(47,184,107,.15);color:var(--cost-2);border-color:rgba(47,184,107,.5)}
.tftbadge--cost3{background:rgba(59,130,246,.15);color:var(--cost-3);border-color:rgba(59,130,246,.5)}
.tftbadge--cost4{background:rgba(177,92,240,.16);color:var(--cost-4);border-color:rgba(177,92,240,.5)}
.tftbadge--cost5{background:rgba(228,169,60,.15);color:var(--cost-5);border-color:rgba(228,169,60,.55)}
.tftbadge--success{background:rgba(53,194,122,.15);color:var(--success);border-color:rgba(53,194,122,.5)}
.tftbadge--warning{background:rgba(228,169,60,.15);color:var(--warning);border-color:rgba(228,169,60,.5)}
.tftbadge--danger{background:rgba(229,86,62,.15);color:var(--danger);border-color:rgba(229,86,62,.5)}
.tftbadge__coin{width:9px;height:9px;border-radius:50%;background:var(--grad-gold);flex:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-badge-css')) {
  const s = document.createElement('style'); s.id = 'tft-badge-css'; s.textContent = CSS; document.head.appendChild(s);
}

/** Numeric / status chip. Pass `cost` (1–5) to render a gold-coin cost badge. */
export function Badge({ cost, tone, children, className = '', ...rest }) {
  if (cost != null) {
    const cls = ['tftbadge', `tftbadge--cost${cost}`, className].filter(Boolean).join(' ');
    return <span className={cls} {...rest}><span className="tftbadge__coin" />{cost}</span>;
  }
  const cls = ['tftbadge', tone && `tftbadge--${tone}`, className].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}
