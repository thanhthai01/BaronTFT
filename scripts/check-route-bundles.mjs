import { gzipSync } from 'node:zlib';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const manifestPath = path.join('.next', 'app-build-manifest.json');
const budgetsKb = {
  '/': 136,
  '/mua-18/[section]': 190,
  '/patch': 182,
  '/patch/[version]': 182,
};

const getManifestKey = (route) => (route === '/' ? '/page' : `${route}/page`);

if (!existsSync(manifestPath)) {
  console.error('Missing .next/app-build-manifest.json. Run `pnpm build` before `pnpm perf:smoke`.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const pages = manifest.pages ?? {};
const failures = [];

for (const [route, budgetKb] of Object.entries(budgetsKb)) {
  const manifestKey = getManifestKey(route);
  const files = pages[manifestKey];
  if (!Array.isArray(files)) {
    failures.push(`${route}: missing from app-build-manifest at ${manifestKey}`);
    continue;
  }
  let gzipBytes = 0;
  for (const file of new Set(files)) {
    const filePath = path.join('.next', file);
    if (!existsSync(filePath) || !statSync(filePath).isFile()) continue;
    gzipBytes += gzipSync(readFileSync(filePath)).byteLength;
  }
  const gzipKb = gzipBytes / 1024;
  console.log(`${route}: ${gzipKb.toFixed(1)} kB gzip (budget ${budgetKb} kB)`);
  if (gzipKb > budgetKb) failures.push(`${route}: ${gzipKb.toFixed(1)} kB > ${budgetKb} kB`);
}

if (failures.length > 0) {
  console.error('Route bundle budget failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('✓ Route bundle budgets passed.');
