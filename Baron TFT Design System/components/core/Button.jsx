import React from 'react';

const CSS = `
.tftbtn{--_bg:var(--grad-gold);--_fg:var(--text-on-gold);display:inline-flex;align-items:center;justify-content:center;gap:var(--sp-2);font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;letter-spacing:var(--ls-wide);border:1px solid transparent;border-radius:var(--r-sm);cursor:pointer;white-space:nowrap;transition:transform var(--dur-fast) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),background var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out);user-select:none;text-decoration:none}
.tftbtn:focus-visible{outline:none;box-shadow:var(--ring)}
.tftbtn:active{transform:translateY(1px)}
.tftbtn__i{display:inline-flex;align-items:center}
.tftbtn--block{width:100%}
.tftbtn--sm{font-size:var(--fs-xs);padding:7px 14px}
.tftbtn--md{font-size:var(--fs-sm);padding:10px 20px}
.tftbtn--lg{font-size:var(--fs-lg);padding:14px 28px}
.tftbtn--primary{background:var(--grad-gold);color:var(--text-on-gold);box-shadow:var(--shadow-sm)}
.tftbtn--primary:hover{box-shadow:var(--glow-gold)}
.tftbtn--secondary{background:transparent;color:var(--gold-300);border-color:var(--border-gold)}
.tftbtn--secondary:hover{background:rgba(42,68,200,0.08);border-color:var(--gold-600)}
.tftbtn--ghost{background:transparent;color:var(--text-body);border-color:var(--border-line)}
.tftbtn--ghost:hover{background:var(--surface-hover);color:var(--text-strong)}
.tftbtn--danger{background:var(--danger);color:#fff}
.tftbtn--danger:hover{filter:brightness(1.08)}
.tftbtn:disabled{opacity:.42;cursor:not-allowed;box-shadow:none;transform:none;filter:none}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-btn-css')) {
  const s = document.createElement('style'); s.id = 'tft-btn-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Button({ variant = 'primary', size = 'md', block = false, leftIcon, rightIcon, disabled = false, as = 'button', children, className = '', ...rest }) {
  const Tag = as;
  const cls = ['tftbtn', `tftbtn--${variant}`, `tftbtn--${size}`, block && 'tftbtn--block', className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} disabled={Tag === 'button' ? disabled : undefined} {...rest}>
      {leftIcon && <span className="tftbtn__i">{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && <span className="tftbtn__i">{rightIcon}</span>}
    </Tag>
  );
}
