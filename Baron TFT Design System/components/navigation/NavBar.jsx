import React from 'react';

const CSS = `
.tftnav{display:flex;align-items:center;gap:26px;height:64px;padding:0 24px;background:var(--paper-0);border-bottom:2px solid var(--gold-500);font-family:var(--font-body)}
.tftnav__brand{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:var(--fw-extra);text-transform:uppercase;font-size:22px;letter-spacing:.02em;color:var(--text-on-gold);text-decoration:none}
.tftnav__mark{width:30px;height:30px;background:var(--grad-gold);clip-path:var(--hex-clip);display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--text-on-gold);font-weight:var(--fw-bold)}
.tftnav__brand em{font-style:normal;color:var(--teal-500)}
.tftnav__links{display:flex;align-items:center;gap:4px;margin-left:8px}
.tftnav__link{font-size:var(--fs-sm);font-weight:var(--fw-medium);color:rgba(246,241,228,.66);text-decoration:none;padding:8px 12px;border-radius:var(--r-sm);transition:color var(--dur-fast),background var(--dur-fast);position:relative}
.tftnav__link:hover{color:var(--text-on-gold);background:rgba(246,241,228,.1)}
.tftnav__link--active{color:var(--text-on-gold)}
.tftnav__link--active::after{content:"";position:absolute;left:12px;right:12px;bottom:-2px;height:2px;background:var(--teal-500);border-radius:2px}
.tftnav__spacer{flex:1}
.tftnav__actions{display:flex;align-items:center;gap:12px}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-nav-css')) {
  const s = document.createElement('style'); s.id = 'tft-nav-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function NavBar({ brand = 'BARON', accentWord = 'TFT', links = [], active, onNavigate, actions, className = '', ...rest }) {
  return (
    <nav className={['tftnav', className].filter(Boolean).join(' ')} {...rest}>
      <a className="tftnav__brand" href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(null); }}>
        <span className="tftnav__mark">◆</span>{brand}{accentWord && <em>{accentWord}</em>}
      </a>
      <div className="tftnav__links">
        {links.map((l) => {
          const key = l.key || l.label;
          return (
            <a key={key} href={l.href || '#'} className={['tftnav__link', active === key && 'tftnav__link--active'].filter(Boolean).join(' ')}
              onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(key); } : undefined}>{l.label}</a>
          );
        })}
      </div>
      <span className="tftnav__spacer" />
      {actions && <div className="tftnav__actions">{actions}</div>}
    </nav>
  );
}
