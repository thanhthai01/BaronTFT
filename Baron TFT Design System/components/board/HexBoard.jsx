import React from 'react';

const CSS = `
.tfthb{--_hw:64px;--_gap:8px;display:inline-flex;flex-direction:column;gap:var(--_gap);padding:20px;background:var(--grad-board);border:1px solid var(--border-line);border-radius:var(--r-lg);box-shadow:var(--shadow-inset)}
.tfthb__row{display:flex;gap:var(--_gap)}
.tfthb__row--odd{margin-left:calc((var(--_hw) + var(--_gap)) / 2)}
.tfthex{--_c:var(--ink-500);position:relative;width:var(--_hw);height:calc(var(--_hw) * 1.1547);clip-path:var(--hex-clip);background:var(--ink-500);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background var(--dur-fast) var(--ease-out)}
.tfthex::before{content:"";position:absolute;inset:2px;clip-path:var(--hex-clip);background:var(--ink-800)}
.tfthex:hover::before{background:var(--ink-700)}
.tfthex--filled{background:var(--_c)}
.tfthex--filled::before{background:radial-gradient(120% 100% at 50% 0%,color-mix(in srgb,var(--_c) 45%,var(--ink-700)),var(--ink-800))}
.tfthex__unit{position:relative;z-index:1;font-family:var(--font-display);font-weight:var(--fw-extra);font-size:calc(var(--_hw) * .3);text-transform:uppercase;color:var(--text-strong);letter-spacing:-.02em;text-align:center;line-height:1;text-shadow:0 1px 2px rgba(255,255,255,.55)}
.tfthex__unit img{width:100%;height:100%;object-fit:cover}
.tfthex__cost{position:absolute;z-index:2;top:5px;left:50%;transform:translateX(-50%);width:8px;height:8px;border-radius:50%;background:var(--_c);box-shadow:0 0 0 1.5px rgba(0,0,0,.4)}
.tfthex__star{position:absolute;z-index:2;bottom:6px;left:50%;transform:translateX(-50%);font-size:9px;color:var(--gold-300);letter-spacing:-1px;line-height:1;text-shadow:0 1px 2px rgba(0,0,0,.7)}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-hexboard-css')) {
  const s = document.createElement('style'); s.id = 'tft-hexboard-css'; s.textContent = CSS; document.head.appendChild(s);
}
const COST_VAR = { 1: 'var(--cost-1)', 2: 'var(--cost-2)', 3: 'var(--cost-3)', 4: 'var(--cost-4)', 5: 'var(--cost-5)' };

export function HexBoard({ rows = 4, cols = 7, units = [], hexSize = 64, onHexClick, className = '', style, ...rest }) {
  const map = {};
  for (const u of units) map[`${u.row}-${u.col}`] = u;
  return (
    <div className={['tfthb', className].filter(Boolean).join(' ')} style={{ '--_hw': `${hexSize}px`, ...style }} {...rest}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className={['tfthb__row', r % 2 === 1 && 'tfthb__row--odd'].filter(Boolean).join(' ')}>
          {Array.from({ length: cols }).map((_, c) => {
            const u = map[`${r}-${c}`];
            return (
              <div key={c} className={['tfthex', u && 'tfthex--filled'].filter(Boolean).join(' ')}
                style={u ? { '--_c': COST_VAR[u.cost || 1] } : undefined}
                onClick={onHexClick ? () => onHexClick(r, c, u) : undefined}>
                {u && u.cost && <span className="tfthex__cost" />}
                {u && <span className="tfthex__unit">{u.portrait ? <img src={u.portrait} alt={u.name} /> : (u.name || '').slice(0, 2)}</span>}
                {u && u.stars && <span className="tfthex__star">{'★'.repeat(u.stars)}</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
