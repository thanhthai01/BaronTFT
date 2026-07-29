/* @ds-bundle: {"format":4,"namespace":"BaronTFTDesignSystem_5d933f","components":[{"name":"HexBoard","sourcePath":"components/board/HexBoard.jsx"},{"name":"ChampionCard","sourcePath":"components/cards/ChampionCard.jsx"},{"name":"GuideCard","sourcePath":"components/cards/GuideCard.jsx"},{"name":"TraitCard","sourcePath":"components/cards/TraitCard.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Callout","sourcePath":"components/feedback/Callout.jsx"},{"name":"FilterChip","sourcePath":"components/forms/FilterChip.jsx"},{"name":"SearchInput","sourcePath":"components/forms/SearchInput.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"ItemTooltip","sourcePath":"components/tooltip/ItemTooltip.jsx"},{"name":"UnitTooltip","sourcePath":"components/tooltip/UnitTooltip.jsx"}],"sourceHashes":{"components/board/HexBoard.jsx":"c6beed3e69e5","components/cards/ChampionCard.jsx":"daf320fd990d","components/cards/GuideCard.jsx":"e8d9e731d495","components/cards/TraitCard.jsx":"779d8daf93c4","components/core/Badge.jsx":"079169ba572d","components/core/Button.jsx":"9724c5a8d6ad","components/core/Tag.jsx":"56435af0f0de","components/feedback/Callout.jsx":"fa511a40e15d","components/forms/FilterChip.jsx":"f4b7e214c8cc","components/forms/SearchInput.jsx":"9d426a930c46","components/navigation/Breadcrumb.jsx":"9baae4e4503b","components/navigation/NavBar.jsx":"281fe14626ea","components/navigation/Tabs.jsx":"92a1dedb5470","components/tooltip/ItemTooltip.jsx":"20f5ca9a96ee","components/tooltip/UnitTooltip.jsx":"3de2e658f352","ui_kits/landing/ChampionExplorer.jsx":"3d6e7ad39230","ui_kits/landing/Hero.jsx":"ca86c2d76dbf","ui_kits/landing/LearningPath.jsx":"93f548bd2275","ui_kits/landing/Sections.jsx":"a5760fb63f2c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BaronTFTDesignSystem_5d933f = window.BaronTFTDesignSystem_5d933f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/board/HexBoard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'tft-hexboard-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const COST_VAR = {
  1: 'var(--cost-1)',
  2: 'var(--cost-2)',
  3: 'var(--cost-3)',
  4: 'var(--cost-4)',
  5: 'var(--cost-5)'
};
function HexBoard({
  rows = 4,
  cols = 7,
  units = [],
  hexSize = 64,
  onHexClick,
  className = '',
  style,
  ...rest
}) {
  const map = {};
  for (const u of units) map[`${u.row}-${u.col}`] = u;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['tfthb', className].filter(Boolean).join(' '),
    style: {
      '--_hw': `${hexSize}px`,
      ...style
    }
  }, rest), Array.from({
    length: rows
  }).map((_, r) => /*#__PURE__*/React.createElement("div", {
    key: r,
    className: ['tfthb__row', r % 2 === 1 && 'tfthb__row--odd'].filter(Boolean).join(' ')
  }, Array.from({
    length: cols
  }).map((_, c) => {
    const u = map[`${r}-${c}`];
    return /*#__PURE__*/React.createElement("div", {
      key: c,
      className: ['tfthex', u && 'tfthex--filled'].filter(Boolean).join(' '),
      style: u ? {
        '--_c': COST_VAR[u.cost || 1]
      } : undefined,
      onClick: onHexClick ? () => onHexClick(r, c, u) : undefined
    }, u && u.cost && /*#__PURE__*/React.createElement("span", {
      className: "tfthex__cost"
    }), u && /*#__PURE__*/React.createElement("span", {
      className: "tfthex__unit"
    }, u.portrait ? /*#__PURE__*/React.createElement("img", {
      src: u.portrait,
      alt: u.name
    }) : (u.name || '').slice(0, 2)), u && u.stars && /*#__PURE__*/React.createElement("span", {
      className: "tfthex__star"
    }, '★'.repeat(u.stars)));
  }))));
}
Object.assign(__ds_scope, { HexBoard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/board/HexBoard.jsx", error: String((e && e.message) || e) }); }

// components/cards/TraitCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tfttrait{display:flex;gap:12px;align-items:flex-start;width:280px;padding:14px;border:1px solid var(--border-line);border-radius:var(--r-md);background:var(--surface-card);font-family:var(--font-body);transition:border-color var(--dur-base) var(--ease-out),background var(--dur-base) var(--ease-out)}
.tfttrait--active{border-color:var(--border-gold);background:linear-gradient(180deg,rgba(42,68,200,.07),transparent)}
.tfttrait__hex{flex:none;width:42px;height:42px;display:flex;align-items:center;justify-content:center;background:var(--surface-raised);clip-path:var(--hex-clip);color:var(--gold-300);font-family:var(--font-display);font-weight:var(--fw-bold);font-size:18px;text-transform:uppercase}
.tfttrait--active .tfttrait__hex{background:var(--grad-gold);color:var(--text-on-gold)}
.tfttrait__body{flex:1;min-width:0}
.tfttrait__top{display:flex;align-items:center;gap:8px}
.tfttrait__name{font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;font-size:var(--fs-h4);color:var(--text-strong);letter-spacing:var(--ls-tight);line-height:1}
.tfttrait__count{font-family:var(--font-mono);font-weight:var(--fw-bold);font-size:var(--fs-xs);color:var(--gold-300)}
.tfttrait__desc{font-size:var(--fs-sm);line-height:1.5;color:var(--text-muted);margin-top:6px}
.tfttrait__tiers{display:flex;gap:6px;margin-top:10px}
.tfttrait__tier{font-family:var(--font-mono);font-size:var(--fs-2xs);font-weight:var(--fw-medium);color:var(--text-subtle);padding:3px 7px;border-radius:var(--r-xs);background:var(--surface-raised);border:1px solid var(--border-subtle)}
.tfttrait__tier--on{color:var(--text-on-gold);background:var(--grad-gold);border-color:transparent}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-traitcard-css')) {
  const s = document.createElement('style');
  s.id = 'tft-traitcard-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function TraitCard({
  name,
  icon,
  count,
  active = false,
  description,
  tiers = [],
  activeTier = -1,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['tfttrait', active && 'tfttrait--active', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "tfttrait__hex"
  }, icon || (name || '?').slice(0, 1)), /*#__PURE__*/React.createElement("div", {
    className: "tfttrait__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tfttrait__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tfttrait__name"
  }, name), count != null && /*#__PURE__*/React.createElement("span", {
    className: "tfttrait__count"
  }, count)), description && /*#__PURE__*/React.createElement("p", {
    className: "tfttrait__desc"
  }, description), tiers.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "tfttrait__tiers"
  }, tiers.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: ['tfttrait__tier', i <= activeTier && 'tfttrait__tier--on'].filter(Boolean).join(' ')
  }, t)))));
}
Object.assign(__ds_scope, { TraitCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/TraitCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'tft-badge-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}

/** Numeric / status chip. Pass `cost` (1–5) to render a gold-coin cost badge. */
function Badge({
  cost,
  tone,
  children,
  className = '',
  ...rest
}) {
  if (cost != null) {
    const cls = ['tftbadge', `tftbadge--cost${cost}`, className].filter(Boolean).join(' ');
    return /*#__PURE__*/React.createElement("span", _extends({
      className: cls
    }, rest), /*#__PURE__*/React.createElement("span", {
      className: "tftbadge__coin"
    }), cost);
  }
  const cls = ['tftbadge', tone && `tftbadge--${tone}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'tft-btn-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  leftIcon,
  rightIcon,
  disabled = false,
  as = 'button',
  children,
  className = '',
  ...rest
}) {
  const Tag = as;
  const cls = ['tftbtn', `tftbtn--${variant}`, `tftbtn--${size}`, block && 'tftbtn--block', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    disabled: Tag === 'button' ? disabled : undefined
  }, rest), leftIcon && /*#__PURE__*/React.createElement("span", {
    className: "tftbtn__i"
  }, leftIcon), children && /*#__PURE__*/React.createElement("span", null, children), rightIcon && /*#__PURE__*/React.createElement("span", {
    className: "tftbtn__i"
  }, rightIcon));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tfttag{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-body);font-weight:var(--fw-semibold);font-size:var(--fs-2xs);letter-spacing:var(--ls-wide);text-transform:uppercase;padding:4px 10px;border-radius:var(--r-pill);border:1px solid var(--border-line);background:var(--surface-raised);color:var(--text-muted);white-space:nowrap;line-height:1}
.tfttag__dot{width:7px;height:7px;border-radius:50%;background:currentColor;flex:none}
.tfttag--gold{color:var(--gold-300);border-color:var(--border-gold);background:rgba(42,68,200,0.09)}
.tfttag--teal{color:var(--teal-300);border-color:rgba(255,90,31,0.45);background:rgba(255,90,31,0.10)}
.tfttag--solid{background:var(--grad-gold);color:var(--text-on-gold);border-color:transparent}
.tfttag--outline{background:transparent}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-tag-css')) {
  const s = document.createElement('style');
  s.id = 'tft-tag-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Tag({
  tone = 'neutral',
  dot = false,
  children,
  className = '',
  style,
  ...rest
}) {
  const cls = ['tfttag', tone !== 'neutral' && `tfttag--${tone}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: style
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "tfttag__dot"
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/cards/ChampionCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tftcc{--_c:var(--cost-1);position:relative;width:172px;border:1px solid var(--border-line);border-radius:var(--r-md);background:var(--surface-card);overflow:hidden;transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out);font-family:var(--font-body)}
.tftcc:hover{transform:translateY(-3px);border-color:var(--_c);box-shadow:var(--shadow-lg)}
.tftcc__port{position:relative;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;background:radial-gradient(120% 100% at 50% 0%,color-mix(in srgb,var(--_c) 30%,var(--ink-700)) 0%,var(--ink-800) 70%);border-bottom:2px solid var(--_c)}
.tftcc__init{font-family:var(--font-display);font-weight:var(--fw-extra);font-size:44px;color:var(--text-strong);text-transform:uppercase;letter-spacing:-.02em}
.tftcc__img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tftcc__cost{position:absolute;top:8px;right:8px}
.tftcc__body{padding:10px 12px 12px}
.tftcc__name{font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;font-size:var(--fs-h4);line-height:1.05;color:var(--text-strong);letter-spacing:var(--ls-tight)}
.tftcc__traits{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}
.tftcc__trait{font-size:var(--fs-2xs);font-weight:var(--fw-medium);color:var(--text-muted);background:var(--surface-raised);border:1px solid var(--border-subtle);border-radius:var(--r-xs);padding:3px 7px;letter-spacing:.02em}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-champcard-css')) {
  const s = document.createElement('style');
  s.id = 'tft-champcard-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const COST_VAR = {
  1: 'var(--cost-1)',
  2: 'var(--cost-2)',
  3: 'var(--cost-3)',
  4: 'var(--cost-4)',
  5: 'var(--cost-5)'
};
function ChampionCard({
  name,
  cost = 1,
  traits = [],
  portrait,
  className = '',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({
    className: ['tftcc', className].filter(Boolean).join(' '),
    style: {
      '--_c': COST_VAR[cost],
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "tftcc__port"
  }, portrait ? /*#__PURE__*/React.createElement("img", {
    className: "tftcc__img",
    src: portrait,
    alt: name
  }) : /*#__PURE__*/React.createElement("span", {
    className: "tftcc__init"
  }, (name || '?').slice(0, 2)), /*#__PURE__*/React.createElement("span", {
    className: "tftcc__cost"
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    cost: cost
  }))), /*#__PURE__*/React.createElement("div", {
    className: "tftcc__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tftcc__name"
  }, name), traits.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "tftcc__traits"
  }, traits.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "tftcc__trait"
  }, t)))));
}
Object.assign(__ds_scope, { ChampionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ChampionCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/GuideCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tftguide{display:flex;flex-direction:column;width:300px;border:1px solid var(--border-line);border-radius:var(--r-lg);background:var(--surface-card);overflow:hidden;font-family:var(--font-body);transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out);cursor:pointer;text-decoration:none}
.tftguide:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:var(--border-strong)}
.tftguide__cover{position:relative;aspect-ratio:16/9;background:var(--grad-board);display:flex;align-items:center;justify-content:center;border-bottom:1px solid var(--border-line);overflow:hidden}
.tftguide__cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tftguide__num{font-family:var(--font-display);font-weight:var(--fw-extra);font-size:64px;color:color-mix(in srgb,var(--accent) 22%,transparent);text-transform:uppercase;letter-spacing:-.03em}
.tftguide__lvl{position:absolute;top:10px;left:10px}
.tftguide__body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:8px;flex:1}
.tftguide__title{font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;font-size:var(--fs-h3);line-height:1.05;color:var(--text-strong);letter-spacing:var(--ls-tight)}
.tftguide__desc{font-size:var(--fs-sm);line-height:1.55;color:var(--text-muted);flex:1}
.tftguide__meta{display:flex;align-items:center;gap:12px;margin-top:4px;font-family:var(--font-mono);font-size:var(--fs-2xs);color:var(--text-subtle);letter-spacing:.02em}
.tftguide__meta b{color:var(--gold-300);font-weight:var(--fw-bold)}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-guidecard-css')) {
  const s = document.createElement('style');
  s.id = 'tft-guidecard-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const LVL_TONE = {
  'Nhập môn': 'teal',
  'Cơ bản': 'teal',
  'Trung cấp': 'gold',
  'Nâng cao': 'gold',
  Beginner: 'teal',
  Advanced: 'gold'
};
function GuideCard({
  title,
  description,
  level = 'Nhập môn',
  number,
  duration,
  lessons,
  cover,
  as = 'a',
  className = '',
  ...rest
}) {
  const Tag2 = as;
  return /*#__PURE__*/React.createElement(Tag2, _extends({
    className: ['tftguide', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "tftguide__cover"
  }, cover ? /*#__PURE__*/React.createElement("img", {
    src: cover,
    alt: title
  }) : /*#__PURE__*/React.createElement("span", {
    className: "tftguide__num"
  }, number != null ? String(number).padStart(2, '0') : 'TFT'), /*#__PURE__*/React.createElement("span", {
    className: "tftguide__lvl"
  }, /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    tone: LVL_TONE[level] || 'neutral',
    dot: true
  }, level))), /*#__PURE__*/React.createElement("div", {
    className: "tftguide__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tftguide__title"
  }, title), description && /*#__PURE__*/React.createElement("p", {
    className: "tftguide__desc"
  }, description), /*#__PURE__*/React.createElement("div", {
    className: "tftguide__meta"
  }, lessons != null && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, lessons), " b\xE0i"), duration && /*#__PURE__*/React.createElement("span", null, duration))));
}
Object.assign(__ds_scope, { GuideCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/GuideCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Callout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'tft-callout-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const MARK = {
  note: 'i',
  tip: '✦',
  warning: '!',
  danger: '×',
  success: '✓'
};
function Callout({
  variant = 'note',
  mark,
  title,
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['tftcallout', `tftcallout--${variant}`, className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "tftcallout__mark"
  }, mark || MARK[variant]), /*#__PURE__*/React.createElement("div", {
    className: "tftcallout__body"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "tftcallout__title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "tftcallout__text"
  }, children)));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Callout.jsx", error: String((e && e.message) || e) }); }

// components/forms/FilterChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tftchip{display:inline-flex;align-items:center;gap:7px;font-family:var(--font-body);font-weight:var(--fw-medium);font-size:var(--fs-sm);color:var(--text-muted);background:var(--surface-card);border:1px solid var(--border-line);border-radius:var(--r-pill);padding:7px 14px;cursor:pointer;user-select:none;transition:all var(--dur-fast) var(--ease-out);white-space:nowrap}
.tftchip:hover{border-color:var(--border-strong);color:var(--text-strong)}
.tftchip--on{color:var(--text-on-gold);background:var(--grad-gold);border-color:transparent;font-weight:var(--fw-semibold)}
.tftchip__count{font-family:var(--font-mono);font-size:var(--fs-2xs);opacity:.75}
.tftchip__x{display:inline-flex;font-size:14px;line-height:1;opacity:.8}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-chip-css')) {
  const s = document.createElement('style');
  s.id = 'tft-chip-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function FilterChip({
  active = false,
  count,
  removable = false,
  children,
  className = '',
  onClick,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: ['tftchip', active && 'tftchip--on', className].filter(Boolean).join(' '),
    "aria-pressed": active,
    onClick: onClick
  }, rest), children, count != null && /*#__PURE__*/React.createElement("span", {
    className: "tftchip__count"
  }, count), removable && active && /*#__PURE__*/React.createElement("span", {
    className: "tftchip__x"
  }, "\xD7"));
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'tft-search-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const Glass = () => /*#__PURE__*/React.createElement("svg", {
  width: "17",
  height: "17",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.2",
  strokeLinecap: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "11",
  cy: "11",
  r: "7"
}), /*#__PURE__*/React.createElement("path", {
  d: "m20 20-3.2-3.2"
}));
function SearchInput({
  size = 'md',
  value,
  onChange,
  placeholder = 'Tìm tướng, tộc hệ, trang bị…',
  kbd,
  onClear,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ['tftsearch', size === 'sm' && 'tftsearch--sm', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("span", {
    className: "tftsearch__ico"
  }, /*#__PURE__*/React.createElement(Glass, null)), /*#__PURE__*/React.createElement("input", _extends({
    type: "search",
    value: value,
    onChange: onChange,
    placeholder: placeholder
  }, rest)), value && onClear ? /*#__PURE__*/React.createElement("button", {
    className: "tftsearch__clear",
    onClick: onClear,
    "aria-label": "Xo\xE1"
  }, "\xD7") : kbd ? /*#__PURE__*/React.createElement("span", {
    className: "tftsearch__kbd"
  }, kbd) : null);
}
Object.assign(__ds_scope, { SearchInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchInput.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tftbc{display:flex;align-items:center;gap:8px;font-family:var(--font-body);font-size:var(--fs-sm);flex-wrap:wrap}
.tftbc__item{color:var(--text-subtle);text-decoration:none;transition:color var(--dur-fast)}
.tftbc__item:hover{color:var(--text-body)}
.tftbc__item--current{color:var(--gold-300);font-weight:var(--fw-semibold);pointer-events:none}
.tftbc__sep{color:var(--text-disabled);font-size:12px}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-bc-css')) {
  const s = document.createElement('style');
  s.id = 'tft-bc-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Breadcrumb({
  items = [],
  separator = '/',
  onNavigate,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: ['tftbc', className].filter(Boolean).join(' '),
    "aria-label": "Breadcrumb"
  }, rest), items.map((it, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, i > 0 && /*#__PURE__*/React.createElement("span", {
      className: "tftbc__sep",
      "aria-hidden": "true"
    }, separator), /*#__PURE__*/React.createElement("a", {
      href: it.href || '#',
      "aria-current": last ? 'page' : undefined,
      className: ['tftbc__item', last && 'tftbc__item--current'].filter(Boolean).join(' '),
      onClick: onNavigate && !last ? e => {
        e.preventDefault();
        onNavigate(it, i);
      } : undefined
    }, it.label));
  }));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'tft-nav-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function NavBar({
  brand = 'BARON',
  accentWord = 'TFT',
  links = [],
  active,
  onNavigate,
  actions,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: ['tftnav', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("a", {
    className: "tftnav__brand",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate(null);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tftnav__mark"
  }, "\u25C6"), brand, accentWord && /*#__PURE__*/React.createElement("em", null, accentWord)), /*#__PURE__*/React.createElement("div", {
    className: "tftnav__links"
  }, links.map(l => {
    const key = l.key || l.label;
    return /*#__PURE__*/React.createElement("a", {
      key: key,
      href: l.href || '#',
      className: ['tftnav__link', active === key && 'tftnav__link--active'].filter(Boolean).join(' '),
      onClick: onNavigate ? e => {
        e.preventDefault();
        onNavigate(key);
      } : undefined
    }, l.label);
  })), /*#__PURE__*/React.createElement("span", {
    className: "tftnav__spacer"
  }), actions && /*#__PURE__*/React.createElement("div", {
    className: "tftnav__actions"
  }, actions));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'tft-tabs-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Tabs({
  tabs = [],
  value,
  onChange,
  variant = 'segment',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['tfttabs', variant === 'line' && 'tfttabs--line', className].filter(Boolean).join(' '),
    role: "tablist"
  }, rest), tabs.map(t => {
    const key = t.key || t.label;
    const on = value === key;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      role: "tab",
      "aria-selected": on,
      className: ['tfttab', on && 'tfttab--on'].filter(Boolean).join(' '),
      onClick: () => onChange && onChange(key)
    }, t.icon, t.label, t.badge != null && /*#__PURE__*/React.createElement("span", {
      className: "tfttab__badge"
    }, t.badge));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/tooltip/ItemTooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tftit{width:250px;border-radius:var(--r-md);overflow:hidden;background:var(--ink-800);border:1px solid var(--border-line);box-shadow:var(--shadow-lg);font-family:var(--font-body)}
.tftit__head{display:flex;gap:11px;align-items:center;padding:12px 14px;border-bottom:1px solid var(--border-line);background:var(--grad-panel)}
.tftit__icon{flex:none;width:40px;height:40px;border-radius:var(--r-sm);background:var(--grad-gold);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:var(--fw-bold);font-size:18px;color:var(--text-on-gold);box-shadow:var(--shadow-sm)}
.tftit__icon img{width:100%;height:100%;object-fit:cover;border-radius:var(--r-sm)}
.tftit__name{font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;font-size:var(--fs-h4);line-height:1.05;color:var(--text-strong);letter-spacing:var(--ls-tight)}
.tftit__kind{font-size:var(--fs-2xs);color:var(--teal-300);text-transform:uppercase;letter-spacing:var(--ls-caps);font-weight:var(--fw-semibold);margin-top:3px}
.tftit__stats{display:flex;flex-wrap:wrap;gap:6px;padding:11px 14px 4px}
.tftit__stat{font-family:var(--font-mono);font-size:var(--fs-2xs);font-weight:var(--fw-medium);color:var(--gold-100);background:rgba(42,68,200,.08);border:1px solid rgba(42,68,200,.3);border-radius:var(--r-xs);padding:3px 7px}
.tftit__desc{padding:6px 14px 14px;font-size:var(--fs-sm);line-height:1.5;color:var(--text-muted)}
.tftit__desc b{color:var(--gold-100);font-weight:var(--fw-semibold)}
.tftit__recipe{display:flex;align-items:center;gap:6px;padding:10px 14px;border-top:1px solid var(--border-line);background:var(--ink-850)}
.tftit__comp{width:24px;height:24px;border-radius:var(--r-xs);background:var(--surface-raised);border:1px solid var(--border-line);display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:11px;color:var(--text-muted)}
.tftit__plus{color:var(--text-subtle);font-weight:700}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-itemtip-css')) {
  const s = document.createElement('style');
  s.id = 'tft-itemtip-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function ItemTooltip({
  name,
  icon,
  kind = 'Trang bị',
  stats = [],
  description,
  recipe = [],
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['tftit', className].filter(Boolean).join(' '),
    role: "tooltip"
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "tftit__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tftit__icon"
  }, typeof icon === 'string' ? /*#__PURE__*/React.createElement("img", {
    src: icon,
    alt: ""
  }) : icon || (name || '?').slice(0, 1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "tftit__name"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "tftit__kind"
  }, kind))), stats.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "tftit__stats"
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "tftit__stat"
  }, s))), description && (typeof description === 'string' ? /*#__PURE__*/React.createElement("p", {
    className: "tftit__desc",
    dangerouslySetInnerHTML: {
      __html: description
    }
  }) : /*#__PURE__*/React.createElement("p", {
    className: "tftit__desc"
  }, description)), recipe.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "tftit__recipe"
  }, recipe.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    className: "tftit__plus"
  }, "+"), /*#__PURE__*/React.createElement("span", {
    className: "tftit__comp"
  }, c)))));
}
Object.assign(__ds_scope, { ItemTooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tooltip/ItemTooltip.jsx", error: String((e && e.message) || e) }); }

// components/tooltip/UnitTooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tftut{width:280px;border-radius:var(--r-md);overflow:hidden;background:var(--ink-800);border:1px solid var(--border-gold);box-shadow:var(--shadow-lg);font-family:var(--font-body)}
.tftut__head{padding:12px 14px;background:linear-gradient(180deg,rgba(42,68,200,.12),transparent),var(--ink-700);border-bottom:1px solid var(--border-line)}
.tftut__top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.tftut__name{font-family:var(--font-display);font-weight:var(--fw-bold);text-transform:uppercase;font-size:var(--fs-h3);line-height:1;color:var(--text-strong);letter-spacing:var(--ls-tight)}
.tftut__title{font-size:var(--fs-2xs);color:var(--gold-300);text-transform:uppercase;letter-spacing:var(--ls-caps);font-weight:var(--fw-semibold);margin-top:5px}
.tftut__traits{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}
.tftut__trait{font-size:var(--fs-2xs);color:var(--text-muted);background:var(--surface-card);border:1px solid var(--border-subtle);border-radius:var(--r-xs);padding:3px 7px}
.tftut__stats{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border-subtle)}
.tftut__stat{background:var(--ink-800);padding:8px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px}
.tftut__stat span{font-size:var(--fs-2xs);color:var(--text-subtle);text-transform:uppercase;letter-spacing:.06em}
.tftut__stat b{font-family:var(--font-mono);font-size:var(--fs-sm);font-weight:var(--fw-bold);color:var(--text-body)}
.tftut__abil{padding:12px 14px}
.tftut__ability-name{display:flex;align-items:center;gap:8px;font-family:var(--font-display);font-weight:var(--fw-semibold);text-transform:uppercase;font-size:var(--fs-h4);color:var(--gold-300);letter-spacing:var(--ls-tight)}
.tftut__mana{font-family:var(--font-mono);font-size:var(--fs-2xs);color:var(--teal-300);margin-left:auto}
.tftut__ability-desc{font-size:var(--fs-sm);line-height:1.5;color:var(--text-muted);margin-top:6px}
.tftut__ability-desc b{color:var(--gold-100);font-weight:var(--fw-semibold)}
`;
if (typeof document !== 'undefined' && !document.getElementById('tft-unittip-css')) {
  const s = document.createElement('style');
  s.id = 'tft-unittip-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function UnitTooltip({
  name,
  cost = 1,
  title,
  traits = [],
  stats = [],
  ability,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['tftut', className].filter(Boolean).join(' '),
    role: "tooltip"
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "tftut__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tftut__top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "tftut__name"
  }, name), title && /*#__PURE__*/React.createElement("div", {
    className: "tftut__title"
  }, title)), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    cost: cost
  })), traits.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "tftut__traits"
  }, traits.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "tftut__trait"
  }, t)))), stats.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "tftut__stats"
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    className: "tftut__stat"
  }, /*#__PURE__*/React.createElement("span", null, s.label), /*#__PURE__*/React.createElement("b", null, s.value)))), ability && /*#__PURE__*/React.createElement("div", {
    className: "tftut__abil"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tftut__ability-name"
  }, ability.name, ability.mana && /*#__PURE__*/React.createElement("span", {
    className: "tftut__mana"
  }, ability.mana, " MP")), typeof ability.desc === 'string' ? /*#__PURE__*/React.createElement("p", {
    className: "tftut__ability-desc",
    dangerouslySetInnerHTML: {
      __html: ability.desc
    }
  }) : /*#__PURE__*/React.createElement("p", {
    className: "tftut__ability-desc"
  }, ability.desc)));
}
Object.assign(__ds_scope, { UnitTooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tooltip/UnitTooltip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/ChampionExplorer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Baron TFT landing — Champion explorer: search + cost filters + roster grid + a live tooltip.
const {
  SearchInput,
  FilterChip,
  ChampionCard,
  UnitTooltip,
  Tag
} = window.BaronTFTDesignSystem_5d933f;
const ROSTER = [{
  name: 'Garen',
  cost: 1,
  traits: ['Đấu Sĩ', 'Hộ Vệ']
}, {
  name: 'Lux',
  cost: 2,
  traits: ['Pháp Sư', 'Ánh Sáng']
}, {
  name: 'Jax',
  cost: 2,
  traits: ['Võ Sư']
}, {
  name: 'Vi',
  cost: 3,
  traits: ['Đấu Sĩ', 'Quả Đấm']
}, {
  name: 'Sett',
  cost: 1,
  traits: ['Đấu Sĩ']
}, {
  name: 'Ahri',
  cost: 4,
  traits: ['Pháp Sư', 'Học Giả']
}, {
  name: 'Jinx',
  cost: 4,
  traits: ['Xạ Thủ', 'Phá Hoại']
}, {
  name: 'Ari',
  cost: 5,
  traits: ['Thần Long', 'Pháp Sư']
}];
function ChampionExplorer() {
  const [q, setQ] = React.useState('');
  const [cost, setCost] = React.useState(null);
  const list = ROSTER.filter(c => (cost == null || c.cost === cost) && (q === '' || c.name.toLowerCase().includes(q.toLowerCase()) || c.traits.some(t => t.toLowerCase().includes(q.toLowerCase()))));
  const counts = [1, 2, 3, 4, 5].map(c => ROSTER.filter(u => u.cost === c).length);
  return /*#__PURE__*/React.createElement("section", {
    className: "lp-section lp-section--alt",
    id: "champions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-section__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tft-eyebrow"
  }, "Th\u01B0 vi\u1EC7n t\u01B0\u1EDBng"), /*#__PURE__*/React.createElement("h2", {
    className: "lp-section__title"
  }, "Tra c\u1EE9u m\u1ECDi t\u01B0\u1EDBng Set 18"), /*#__PURE__*/React.createElement("p", {
    className: "lp-section__sub"
  }, "L\u1ECDc theo gi\xE1 ti\u1EC1n, xem t\u1ED9c\u2013h\u1EC7 v\xE0 ch\u1EC9 s\u1ED1. Di chu\u1ED9t v\xE0o t\u01B0\u1EDBng \u0111\u1EC3 xem chi ti\u1EBFt.")), /*#__PURE__*/React.createElement("div", {
    className: "lp-explorer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-explorer__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-explorer__controls"
  }, /*#__PURE__*/React.createElement(SearchInput, {
    value: q,
    onChange: e => setQ(e.target.value),
    onClear: () => setQ(''),
    placeholder: "T\xECm t\u01B0\u1EDBng ho\u1EB7c t\u1ED9c\u2013h\u1EC7\u2026"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lp-chips"
  }, /*#__PURE__*/React.createElement(FilterChip, {
    active: cost == null,
    onClick: () => setCost(null)
  }, "T\u1EA5t c\u1EA3"), [1, 2, 3, 4, 5].map((c, i) => /*#__PURE__*/React.createElement(FilterChip, {
    key: c,
    active: cost === c,
    count: counts[i],
    onClick: () => setCost(cost === c ? null : c)
  }, c, " v\xE0ng")))), /*#__PURE__*/React.createElement("div", {
    className: "lp-roster"
  }, list.map(c => /*#__PURE__*/React.createElement(ChampionCard, _extends({
    key: c.name
  }, c))), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "lp-roster__empty"
  }, "Kh\xF4ng t\xECm th\u1EA5y t\u01B0\u1EDBng ph\xF9 h\u1EE3p."))), /*#__PURE__*/React.createElement("aside", {
    className: "lp-explorer__side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-explorer__sidelabel"
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "teal",
    dot: true
  }, "V\xED d\u1EE5 chi ti\u1EBFt")), /*#__PURE__*/React.createElement(UnitTooltip, {
    name: "Ahri",
    cost: 4,
    title: "C\u1EEDu V\u0129 H\u1ED3",
    traits: ['Pháp Sư', 'Học Giả'],
    stats: [{
      label: 'Máu',
      value: '700'
    }, {
      label: 'Sát thương',
      value: '55'
    }, {
      label: 'Giáp',
      value: '30'
    }, {
      label: 'Mana',
      value: '0/80'
    }],
    ability: {
      name: 'Cầu Lửa Hồ Ly',
      mana: '80',
      desc: 'Bắn cầu lửa vào kẻ địch xa nhất, gây <b>250</b> sát thương phép và giảm <b>20%</b> giáp trong 4 giây.'
    }
  })))));
}
window.ChampionExplorer = ChampionExplorer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/ChampionExplorer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Hero.jsx
try { (() => {
// Baron TFT landing — Hero section. Uses NavBar + Button + Tag from the DS bundle.
const {
  Button,
  Tag
} = window.BaronTFTDesignSystem_5d933f;
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lp-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-hero__glow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lp-container lp-hero__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-hero__copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tft-eyebrow"
  }, "H\u1ECDc TFT \xB7 Set 18 \xB7 Mi\u1EC5n ph\xED"), /*#__PURE__*/React.createElement("h1", {
    className: "lp-hero__title"
  }, "L\xE0m ch\u1EE7", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "\u0111\u1EA5u tr\u01B0\u1EDDng"), /*#__PURE__*/React.createElement("br", null), "ch\u1EC9 trong", /*#__PURE__*/React.createElement("br", null), "v\xE0i v\xE1n"), /*#__PURE__*/React.createElement("p", {
    className: "lp-hero__lead"
  }, "Baron TFT d\u1EA1y b\u1EA1n t\u1EEB con s\u1ED1 0: v\xE0ng, m\xE1u, t\u1ED9c\u2013h\u1EC7, \u0111\u1ED9i h\xECnh v\xE0 c\xE1ch leo rank. B\xE0i h\u1ECDc ng\u1EAFn, v\xED d\u1EE5 tr\u1EF1c quan, \u0111\u1ECDc l\xE0 hi\u1EC3u."), /*#__PURE__*/React.createElement("div", {
    className: "lp-hero__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg"
  }, "B\u1EAFt \u0111\u1EA7u h\u1ECDc"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary"
  }, "Xem l\u1ED9 tr\xECnh")), /*#__PURE__*/React.createElement("div", {
    className: "lp-hero__stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-stat"
  }, /*#__PURE__*/React.createElement("b", null, "60+"), /*#__PURE__*/React.createElement("span", null, "B\xE0i h\u1ECDc")), /*#__PURE__*/React.createElement("div", {
    className: "lp-stat"
  }, /*#__PURE__*/React.createElement("b", null, "Set 18"), /*#__PURE__*/React.createElement("span", null, "C\u1EADp nh\u1EADt")), /*#__PURE__*/React.createElement("div", {
    className: "lp-stat"
  }, /*#__PURE__*/React.createElement("b", null, "VI / EN"), /*#__PURE__*/React.createElement("span", null, "Song ng\u1EEF")))), /*#__PURE__*/React.createElement("div", {
    className: "lp-hero__board"
  }, /*#__PURE__*/React.createElement(HeroBoard, null))));
}
function HeroBoard() {
  const {
    HexBoard,
    Tag
  } = window.BaronTFTDesignSystem_5d933f;
  const units = [{
    row: 0,
    col: 2,
    name: 'Ari',
    cost: 5,
    stars: 2
  }, {
    row: 0,
    col: 4,
    name: 'Ahri',
    cost: 4,
    stars: 2
  }, {
    row: 1,
    col: 3,
    name: 'Vi',
    cost: 3,
    stars: 1
  }, {
    row: 1,
    col: 5,
    name: 'Lux',
    cost: 2,
    stars: 2
  }, {
    row: 2,
    col: 1,
    name: 'Jax',
    cost: 2,
    stars: 1
  }, {
    row: 3,
    col: 2,
    name: 'Garen',
    cost: 1,
    stars: 2
  }, {
    row: 3,
    col: 4,
    name: 'Sett',
    cost: 1,
    stars: 1
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "lp-heroboard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-heroboard__tag"
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "gold",
    dot: true
  }, "\u0110\u1ED9i h\xECnh m\u1EABu")), /*#__PURE__*/React.createElement(HexBoard, {
    units: units,
    hexSize: 58
  }), /*#__PURE__*/React.createElement("div", {
    className: "lp-heroboard__caption"
  }, "K\xE9o\u2013th\u1EA3 \u0111\u1EC3 x\u1EBFp \u0111\u1ED9i \xB7 v\u1ECB tr\xED quy\u1EBFt \u0111\u1ECBnh th\u1EAFng thua"));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/LearningPath.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Baron TFT landing — "Learning path" section: guide cards + a sample lesson preview.
const {
  GuideCard,
  Callout,
  Tabs
} = window.BaronTFTDesignSystem_5d933f;
function LearningPath() {
  const [level, setLevel] = React.useState('nhap-mon');
  const guides = {
    'nhap-mon': [{
      number: 1,
      title: 'Bàn cờ hoạt động thế nào',
      level: 'Nhập môn',
      lessons: 4,
      duration: '10 phút',
      description: 'Vàng, máu, vòng đấu và cửa hàng — nền tảng của mọi ván.'
    }, {
      number: 2,
      title: 'Mua & bán tướng',
      level: 'Nhập môn',
      lessons: 3,
      duration: '8 phút',
      description: 'Cách roll, ghép 3 sao và khi nào nên bán.'
    }, {
      number: 3,
      title: 'Tộc & Hệ là gì',
      level: 'Nhập môn',
      lessons: 5,
      duration: '12 phút',
      description: 'Kích hoạt sức mạnh cộng hưởng cho cả đội.'
    }],
    'co-ban': [{
      number: 4,
      title: 'Quản lý vàng & lãi',
      level: 'Cơ bản',
      lessons: 4,
      duration: '11 phút',
      description: 'Giữ mốc 50 vàng, khi nào nên tiêu và giữ.'
    }, {
      number: 5,
      title: 'Lên cấp đúng lúc',
      level: 'Cơ bản',
      lessons: 3,
      duration: '9 phút',
      description: 'Nhịp lên cấp để cân bằng máu và sức mạnh.'
    }, {
      number: 6,
      title: 'Trang bị cơ bản',
      level: 'Cơ bản',
      lessons: 6,
      duration: '15 phút',
      description: 'Ghép đồ từ các mảnh và ưu tiên carry.'
    }],
    'nang-cao': [{
      number: 7,
      title: 'Đọc vị đối thủ',
      level: 'Nâng cao',
      lessons: 4,
      duration: '13 phút',
      description: 'Scout bàn địch để xoay đội hình kịp thời.'
    }, {
      number: 8,
      title: 'Positioning chuyên sâu',
      level: 'Nâng cao',
      lessons: 5,
      duration: '16 phút',
      description: 'Xếp vị trí chống sát thủ và AoE.'
    }, {
      number: 9,
      title: 'Flex & chuyển hướng',
      level: 'Nâng cao',
      lessons: 4,
      duration: '14 phút',
      description: 'Không cố định lối chơi — bám theo tài nguyên.'
    }]
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "lp-section",
    id: "learn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-section__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tft-eyebrow"
  }, "L\u1ED9 tr\xECnh h\u1ECDc"), /*#__PURE__*/React.createElement("h2", {
    className: "lp-section__title"
  }, "T\u1EEB ng\u01B0\u1EDDi m\u1EDBi \u0111\u1EBFn leo rank"), /*#__PURE__*/React.createElement("p", {
    className: "lp-section__sub"
  }, "Ba ch\u1EB7ng, m\u1ED7i ch\u1EB7ng v\xE0i b\xE0i ng\u1EAFn. H\u1ECDc t\u1EDBi \u0111\xE2u, ch\u01A1i t\u1EDBi \u0111\xF3.")), /*#__PURE__*/React.createElement("div", {
    className: "lp-section__tabs"
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: level,
    onChange: setLevel,
    tabs: [{
      label: 'Nhập môn',
      key: 'nhap-mon'
    }, {
      label: 'Cơ bản',
      key: 'co-ban'
    }, {
      label: 'Nâng cao',
      key: 'nang-cao'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "lp-guidegrid"
  }, guides[level].map(g => /*#__PURE__*/React.createElement(GuideCard, _extends({
    key: g.number
  }, g, {
    as: "div"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "lp-calloutrow"
  }, /*#__PURE__*/React.createElement(Callout, {
    variant: "tip",
    title: "M\u1EB9o h\u1ECDc nhanh"
  }, "L\xE0m theo th\u1EE9 t\u1EF1 v\xE0 ch\u01A1i th\u1EED ngay sau m\u1ED7i b\xE0i. Ki\u1EBFn th\u1EE9c ch\u1EC9 d\xEDnh khi b\u1EA1n ", /*#__PURE__*/React.createElement("b", null, "\xE1p d\u1EE5ng trong v\xE1n th\u1EADt"), "."))));
}
window.LearningPath = LearningPath;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/LearningPath.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Sections.jsx
try { (() => {
// Baron TFT landing — Traits panel + item cheat row + CTA + footer.
const {
  TraitCard,
  ItemTooltip,
  Button,
  Tag
} = window.BaronTFTDesignSystem_5d933f;
function TraitsSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lp-section",
    id: "traits"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-two"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-two__left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tft-eyebrow"
  }, "T\u1ED9c & H\u1EC7"), /*#__PURE__*/React.createElement("h2", {
    className: "lp-section__title"
  }, "C\u1ED9ng h\u01B0\u1EDFng s\u1EE9c m\u1EA1nh"), /*#__PURE__*/React.createElement("p", {
    className: "lp-section__sub"
  }, "Gom \u0111\u1EE7 s\u1ED1 t\u01B0\u1EDBng c\xF9ng t\u1ED9c\u2013h\u1EC7 \u0111\u1EC3 k\xEDch ho\u1EA1t hi\u1EC7u \u1EE9ng. \u0110\xE2y l\xE0 tr\xE1i tim c\u1EE7a vi\u1EC7c d\u1EF1ng \u0111\u1ED9i."), /*#__PURE__*/React.createElement("div", {
    className: "lp-traitlist"
  }, /*#__PURE__*/React.createElement(TraitCard, {
    name: "Ph\xE1p S\u01B0",
    icon: "\u2726",
    count: "4 / 6",
    active: true,
    tiers: ['2', '4', '6'],
    activeTier: 1,
    description: "T\u0103ng s\xE1t th\u01B0\u01A1ng ph\xE9p cho to\xE0n \u0111\u1ED9i m\u1ED7i khi thi tri\u1EC3n k\u1EF9 n\u0103ng."
  }), /*#__PURE__*/React.createElement(TraitCard, {
    name: "\u0110\u1EA5u S\u0129",
    icon: "\u2694",
    count: "2 / 4",
    tiers: ['2', '4', '6'],
    activeTier: 0,
    description: "Nh\u1EADn th\xEAm m\xE1u t\u1ED1i \u0111a v\xE0 gi\xE1p khi v\xE0o tr\u1EADn."
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lp-two__right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-itempanel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-itempanel__head"
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "gold",
    dot: true
  }, "Trang b\u1ECB n\u1ED5i b\u1EADt")), /*#__PURE__*/React.createElement("div", {
    className: "lp-itemrow"
  }, /*#__PURE__*/React.createElement(ItemTooltip, {
    name: "S\xE1ch C\u0169 N\xE1t",
    kind: "Trang b\u1ECB ho\xE0n ch\u1EC9nh",
    stats: ['+20 SM Phép', '+150 Máu', '+20 Mana'],
    description: "Khi t\u01B0\u1EDBng thi tri\u1EC3n k\u1EF9 n\u0103ng, g\xE2y <b>ch\xE1y lan</b> l\xEAn k\u1EBB \u0111\u1ECBch xung quanh.",
    recipe: ['🗡', '⚡']
  }), /*#__PURE__*/React.createElement(ItemTooltip, {
    name: "V\xF4 C\u1EF1c Ki\u1EBFm",
    kind: "Trang b\u1ECB ho\xE0n ch\u1EC9nh",
    stats: ['+35% Chí Mạng', '+45 SM Vật Lý'],
    description: "S\xE1t th\u01B0\u01A1ng ch\xED m\u1EA1ng v\u01B0\u1EE3t tr\u1ED9i \u2014 <b>trang b\u1ECB carry</b> h\xE0ng \u0111\u1EA7u.",
    recipe: ['🗡', '🎯']
  })))))));
}
function CTASection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lp-cta",
    id: "start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-cta__glow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lp-container lp-cta__inner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tft-eyebrow"
  }, "S\u1EB5n s\xE0ng ch\u01B0a?"), /*#__PURE__*/React.createElement("h2", {
    className: "lp-cta__title"
  }, "B\u1EAFt \u0111\u1EA7u v\xE1n \u0111\u1EA7u ti\xEAn", /*#__PURE__*/React.createElement("br", null), "v\u1EDBi s\u1EF1 t\u1EF1 tin"), /*#__PURE__*/React.createElement("p", {
    className: "lp-cta__sub"
  }, "Mi\u1EC5n ph\xED, song ng\u1EEF, v\xE0 lu\xF4n c\u1EADp nh\u1EADt theo phi\xEAn b\u1EA3n m\u1EDBi nh\u1EA5t."), /*#__PURE__*/React.createElement("div", {
    className: "lp-cta__buttons"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg"
  }, "H\u1ECDc b\xE0i \u0111\u1EA7u ti\xEAn"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost"
  }, "T\u1EA3i cheat-sheet"))));
}
function Footer() {
  const cols = [{
    h: 'Học',
    links: ['Lộ trình', 'Nhập môn', 'Cơ bản', 'Nâng cao']
  }, {
    h: 'Dữ liệu',
    links: ['Tướng', 'Tộc & Hệ', 'Trang bị', 'Đội hình meta']
  }, {
    h: 'Cộng đồng',
    links: ['Discord', 'Đóng góp', 'Báo lỗi', 'Về Baron TFT']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    className: "lp-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-container lp-footer__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-footer__brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-footer__mark"
  }, "\u25C6"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lp-footer__wm"
  }, "BARON", /*#__PURE__*/React.createElement("em", null, "TFT")), /*#__PURE__*/React.createElement("p", {
    className: "lp-footer__note"
  }, "Website gi\xE1o d\u1EE5c \u0111\u1ED9c l\u1EADp v\u1EC1 Teamfight Tactics. Kh\xF4ng li\xEAn k\u1EBFt v\u1EDBi Riot Games."))), /*#__PURE__*/React.createElement("div", {
    className: "lp-footer__cols"
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h,
    className: "lp-footer__col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lp-footer__h"
  }, c.h), c.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    className: "lp-footer__link"
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    className: "lp-footer__bar"
  }, "\xA9 2026 Baron TFT \xB7 Ng\xF4n ng\u1EEF: Ti\u1EBFng Vi\u1EC7t (EN h\u1ED7 tr\u1EE3)"));
}
Object.assign(window, {
  TraitsSection,
  CTASection,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.HexBoard = __ds_scope.HexBoard;

__ds_ns.ChampionCard = __ds_scope.ChampionCard;

__ds_ns.GuideCard = __ds_scope.GuideCard;

__ds_ns.TraitCard = __ds_scope.TraitCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.SearchInput = __ds_scope.SearchInput;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.ItemTooltip = __ds_scope.ItemTooltip;

__ds_ns.UnitTooltip = __ds_scope.UnitTooltip;

})();
