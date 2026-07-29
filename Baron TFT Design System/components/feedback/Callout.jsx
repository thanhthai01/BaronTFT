import React from 'react';

const CSS = `
.tftcallout{--_c:var(--gold-500);--_tint:rgba(42,68,200,.09);display:flex;gap:13px;padding:15px 17px;border-radius:var(--r-md);background:var(--_tint);border:1px solid var(--border-line);border-left:3px solid var(--_c);font-family:var(--font-body)}
.tftcallout--tip{--_c:var(--teal-500);--_tint:rgba(255,90,31,.10)}
.tftcallout--warning{--_c:var(--warning);--_tint:rgba(228,169,60,.1)}
.tftcallout--danger{--_c:var(--danger);--_tint:rgba(229,86,62,.1)}
.tftcallout--success{--_c:var(--success);--_tint:rgba(53,194,122,.1)}
.tftcallout__mark{flex:none;width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:var(--_c);color:var(--text-on-gold);clip-path:var(--hex-clip);font-family:var(--font-display);font-weight:var(--fw-bold);font-size:15px}
.tftcallout__body{flex:1;min-width:0}
.tftcallout__title{font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;font-size:var(--fs-h4);line-height:1.1;color:var(--text-strong);letter-spacing:var(--ls-tight);margin-bottom:3px}
.tftcallout__text{font-size:var(--fs-sm);line-height:1.55;color:var(--text-muted)}
.tftcallout__text b{color:var(--text-strong);font-weight:var(--fw-semibold)}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-callout-css')) {
  const s = document.createElement('style'); s.id = 'tft-callout-css'; s.textContent = CSS; document.head.appendChild(s);
}
const MARK = { note: 'i', tip: '✦', warning: '!', danger: '×', success: '✓' };

export function Callout({ variant = 'note', mark, title, children, className = '', ...rest }) {
  return (
    <div className={['tftcallout', `tftcallout--${variant}`, className].filter(Boolean).join(' ')} {...rest}>
      <div className="tftcallout__mark">{mark || MARK[variant]}</div>
      <div className="tftcallout__body">
        {title && <div className="tftcallout__title">{title}</div>}
        <div className="tftcallout__text">{children}</div>
      </div>
    </div>
  );
}
