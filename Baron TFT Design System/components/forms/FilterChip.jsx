import React from 'react';

const CSS = `
.tftchip{display:inline-flex;align-items:center;gap:7px;font-family:var(--font-body);font-weight:var(--fw-medium);font-size:var(--fs-sm);color:var(--text-muted);background:var(--surface-card);border:1px solid var(--border-line);border-radius:var(--r-pill);padding:7px 14px;cursor:pointer;user-select:none;transition:all var(--dur-fast) var(--ease-out);white-space:nowrap}
.tftchip:hover{border-color:var(--border-strong);color:var(--text-strong)}
.tftchip--on{color:var(--text-on-gold);background:var(--grad-gold);border-color:transparent;font-weight:var(--fw-semibold)}
.tftchip__count{font-family:var(--font-mono);font-size:var(--fs-2xs);opacity:.75}
.tftchip__x{display:inline-flex;font-size:14px;line-height:1;opacity:.8}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-chip-css')) {
  const s = document.createElement('style'); s.id = 'tft-chip-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function FilterChip({ active = false, count, removable = false, children, className = '', onClick, ...rest }) {
  return (
    <button type="button" className={['tftchip', active && 'tftchip--on', className].filter(Boolean).join(' ')} aria-pressed={active} onClick={onClick} {...rest}>
      {children}
      {count != null && <span className="tftchip__count">{count}</span>}
      {removable && active && <span className="tftchip__x">×</span>}
    </button>
  );
}
