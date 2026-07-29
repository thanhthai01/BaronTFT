import React from 'react';

const CSS = `
.tftsearch{display:inline-flex;align-items:center;gap:9px;width:100%;background:var(--surface-card);border:1px solid var(--border-line);border-radius:var(--r-sm);padding:0 13px;height:44px;transition:border-color var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out)}
.tftsearch:focus-within{border-color:var(--border-gold);box-shadow:var(--ring)}
.tftsearch--sm{height:36px;padding:0 11px}
.tftsearch__ico{flex:none;display:flex;color:var(--text-subtle)}
.tftsearch input{flex:1;min-width:0;background:none;border:none;outline:none;font-family:var(--font-body);font-size:var(--fs-body);color:var(--text-strong)}
.tftsearch--sm input{font-size:var(--fs-sm)}
.tftsearch input::placeholder{color:var(--text-subtle)}
.tftsearch__kbd{flex:none;font-family:var(--font-mono);font-size:var(--fs-2xs);color:var(--text-subtle);border:1px solid var(--border-line);border-radius:var(--r-xs);padding:2px 6px;background:var(--surface-raised)}
.tftsearch__clear{flex:none;border:none;background:none;cursor:pointer;color:var(--text-subtle);font-size:16px;line-height:1;padding:2px}
.tftsearch__clear:hover{color:var(--text-strong)}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-search-css')) {
  const s = document.createElement('style'); s.id = 'tft-search-css'; s.textContent = CSS; document.head.appendChild(s);
}
const Glass = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>);

export function SearchInput({ size = 'md', value, onChange, placeholder = 'Tìm tướng, tộc hệ, trang bị…', kbd, onClear, className = '', ...rest }) {
  return (
    <div className={['tftsearch', size === 'sm' && 'tftsearch--sm', className].filter(Boolean).join(' ')}>
      <span className="tftsearch__ico"><Glass /></span>
      <input type="search" value={value} onChange={onChange} placeholder={placeholder} {...rest} />
      {value && onClear ? <button className="tftsearch__clear" onClick={onClear} aria-label="Xoá">×</button> : kbd ? <span className="tftsearch__kbd">{kbd}</span> : null}
    </div>
  );
}
