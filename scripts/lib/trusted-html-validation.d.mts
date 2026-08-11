export type TrustedHtmlProfile = 'evergreenMarkdownHtml' | 'set18TooltipHtml';

export function validateTrustedHtml(
  html: string,
  options: { profile: TrustedHtmlProfile; source?: string },
): string;

export function validateGeneratedSet18ChampionHtml(champions: unknown[], source?: string): void;
