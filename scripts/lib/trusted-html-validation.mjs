const COMMON_BLOCK_TAGS = new Set([
  'a',
  'blockquote',
  'br',
  'code',
  'del',
  'em',
  'h4',
  'hr',
  'li',
  'ol',
  'p',
  'pre',
  'strong',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'ul',
]);

const SET18_TAGS = new Set(['br', 'span']);
const DANGEROUS_ATTR = /^(on|style$|srcdoc$)/i;
const SET18_CLASS = /^(s18-value|s18-icon|s18-icon-icon_[a-z0-9_]+|s18-shroom|s18-style-[A-Za-z0-9]+|shroom(?:Green|Red|Yellow))$/;
const ATTR_RE = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const TAG_RE = /<\s*(\/?)([a-zA-Z][\w:-]*)([^>]*)>/g;

function isSafeHref(value) {
  const trimmed = value.trim().replace(/[\u0000-\u001f\u007f\s]+/g, '');
  return !/^(?:javascript|data|vbscript):/i.test(trimmed);
}

function parseAttributes(raw, tag, source, errors) {
  const attrs = [];
  const normalized = raw.replace(/\/$/, '').trim();
  if (!normalized) return attrs;

  let remainder = normalized;
  for (const match of normalized.matchAll(ATTR_RE)) {
    remainder = remainder.replace(match[0], '');
    attrs.push({ name: match[1].toLowerCase(), value: match[2] ?? match[3] ?? match[4] ?? '' });
  }
  if (remainder.trim().length > 0) {
    errors.push(`${source}: malformed attributes on <${tag}>`);
  }
  return attrs;
}

function validateEvergreenAttribute(tag, name, value) {
  if (tag === 'a' && name === 'href') return isSafeHref(value);
  if (tag === 'a' && name === 'title') return true;
  if (tag === 'code' && name === 'class') return /^language-[a-z0-9_-]+$/i.test(value);
  if (tag === 'blockquote' && name === 'class') return value === 'case-study';
  if ((tag === 'th' || tag === 'td') && name === 'align') return /^(left|center|right)$/i.test(value);
  return false;
}

function validateSet18Attribute(tag, name, value) {
  if (tag !== 'span' || name !== 'class') return false;
  return value.split(/\s+/).filter(Boolean).every((token) => SET18_CLASS.test(token));
}

export function validateTrustedHtml(html, { profile, source = 'trusted HTML' }) {
  const errors = [];
  const tags = profile === 'set18TooltipHtml' ? SET18_TAGS : COMMON_BLOCK_TAGS;
  const validateAttribute = profile === 'set18TooltipHtml' ? validateSet18Attribute : validateEvergreenAttribute;

  if (/<!--|<!doctype|<\?xml/i.test(html)) errors.push(`${source}: comments and declarations are not allowed`);

  for (const match of html.matchAll(TAG_RE)) {
    const closing = Boolean(match[1]);
    const tag = match[2].toLowerCase();
    if (!tags.has(tag)) {
      errors.push(`${source}: <${tag}> is not allowed`);
      continue;
    }
    if (closing) continue;

    for (const attr of parseAttributes(match[3], tag, source, errors)) {
      if (DANGEROUS_ATTR.test(attr.name) || !validateAttribute(tag, attr.name, attr.value)) {
        errors.push(`${source}: attribute ${attr.name} is not allowed on <${tag}>`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Unsafe generated HTML detected:\n- ${errors.join('\n- ')}`);
  }
  return html;
}

export function validateGeneratedSet18ChampionHtml(champions, source = 'set18_champions') {
  for (const champion of champions) {
    if (!Array.isArray(champion.forms)) continue;
    for (const form of champion.forms) {
      if (typeof form.abilityHtmlVi === 'string') {
        validateTrustedHtml(form.abilityHtmlVi, {
          profile: 'set18TooltipHtml',
          source: `${source}:${champion.name}:${form.label}:abilityHtmlVi`,
        });
      }
      if (!Array.isArray(form.calcs)) continue;
      for (const calc of form.calcs) {
        if (typeof calc.terms === 'string') {
          validateTrustedHtml(calc.terms, {
            profile: 'set18TooltipHtml',
            source: `${source}:${champion.name}:${form.label}:${calc.id}:terms`,
          });
        }
      }
    }
  }
}
