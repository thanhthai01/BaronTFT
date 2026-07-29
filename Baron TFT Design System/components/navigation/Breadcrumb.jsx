import React from 'react';

const CSS = `
.tftbc{display:flex;align-items:center;gap:8px;font-family:var(--font-body);font-size:var(--fs-sm);flex-wrap:wrap}
.tftbc__item{color:var(--text-subtle);text-decoration:none;transition:color var(--dur-fast)}
.tftbc__item:hover{color:var(--text-body)}
.tftbc__item--current{color:var(--gold-300);font-weight:var(--fw-semibold);pointer-events:none}
.tftbc__sep{color:var(--text-disabled);font-size:12px}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-bc-css')) {
  const s = document.createElement('style'); s.id = 'tft-bc-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Breadcrumb({ items = [], separator = '/', onNavigate, className = '', ...rest }) {
  return (
    <nav className={['tftbc', className].filter(Boolean).join(' ')} aria-label="Breadcrumb" {...rest}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span className="tftbc__sep" aria-hidden="true">{separator}</span>}
            <a href={it.href || '#'} aria-current={last ? 'page' : undefined}
              className={['tftbc__item', last && 'tftbc__item--current'].filter(Boolean).join(' ')}
              onClick={onNavigate && !last ? (e) => { e.preventDefault(); onNavigate(it, i); } : undefined}>{it.label}</a>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
