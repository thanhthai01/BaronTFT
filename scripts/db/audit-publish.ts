import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';
import { count, eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { patchEntries, patchReports, set18Champions, set18Tips } from '../../src/db/schema';
import { patchReports as generatedPatchReports } from '../../src/content/patch-notes.generated';
import { set18Champions as generatedChampions } from '../../src/content/set18/set18-champions';
import { set18EntityIndex } from '../../src/content/set18/set18-entity-index';
import { set18Tips as generatedTips } from '../../src/content/set18/set18-tips';
import { set18TipRelationProblems } from '../../src/content/set18/set18-tip-validation';
import type { PatchReport } from '../../src/content/patch-notes';
import { getDbTargetInfo } from './lib/db-target';
import type { PatchChangeset } from './lib/patch-changeset';

function argValue(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function loadDraft(filePath: string): Promise<PatchReport> {
  const absPath = path.resolve(process.cwd(), filePath);
  const mod: Record<string, unknown> = await import(pathToFileURL(absPath).href);
  const value = mod.default ?? mod.report ?? mod.changeset;
  const maybeChangeset = value as Partial<PatchChangeset> | undefined;
  const report = (maybeChangeset?.patchReport ?? value) as PatchReport | undefined;
  if (!report) throw new Error(`Draft "${filePath}" không export PatchReport.`);
  return report;
}

async function main() {
  const expectedTarget = argValue('--expect-target');
  const draftPath = argValue('--draft');
  const changesetPath = argValue('--changeset');
  const writeLogPath = argValue('--write-log');
  const target = getDbTargetInfo();
  const targetLabel = target.label;
  const problems: string[] = [];

  if (expectedTarget && targetLabel !== expectedTarget) {
    problems.push(`DB_TARGET_LABEL=${targetLabel}, expected ${expectedTarget}`);
  }

  const [dbChampionCount, dbTipCount, dbReportCount, dbEntryCount] = await Promise.all([
    db.select({ value: count() }).from(set18Champions),
    db.select({ value: count() }).from(set18Tips),
    db.select({ value: count() }).from(patchReports),
    db.select({ value: count() }).from(patchEntries),
  ]);

  const generatedEntryCount = generatedPatchReports.reduce((sum, report) => sum + report.entries.length, 0);
  const tipRelationProblems = set18TipRelationProblems(generatedTips, set18EntityIndex, { requireEntityIds: true });
  if (dbChampionCount[0].value !== generatedChampions.length) problems.push('generated champion count is stale');
  if (dbTipCount[0].value !== generatedTips.length) problems.push('generated tip count is stale');
  tipRelationProblems.forEach((problem) => problems.push(`generated tip relation invalid: ${problem.tipId}: ${problem.check}: ${problem.detail}`));
  if (dbReportCount[0].value !== generatedPatchReports.length) problems.push('generated patch report count is stale');
  if (dbEntryCount[0].value !== generatedEntryCount) problems.push('generated patch entry count is stale');

  const latest = await db.select().from(patchReports).orderBy(patchReports.reportOrder).limit(1);
  if (latest[0]?.id !== generatedPatchReports[0]?.id) {
    problems.push(`latest patch mismatch: DB=${latest[0]?.id ?? 'none'}, generated=${generatedPatchReports[0]?.id ?? 'none'}`);
  }

  const sourcePath = changesetPath ?? draftPath;
  if (sourcePath) {
    const draft = await loadDraft(sourcePath);
    const [dbDraftReport] = await db.select().from(patchReports).where(eq(patchReports.id, draft.id));
    const generatedDraftReport = generatedPatchReports.find((report) => report.id === draft.id);
    if (!dbDraftReport) problems.push(`draft ${draft.id} not found in DB`);
    if (!generatedDraftReport) problems.push(`draft ${draft.id} not found in generated patch notes`);
  }

  const audit = {
    auditedAt: new Date().toISOString(),
    targetLabel,
    database: target.database,
    latestPatchId: latest[0]?.id ?? null,
    draft: sourcePath ?? null,
    dbCounts: {
      champions: dbChampionCount[0].value,
      tips: dbTipCount[0].value,
      reports: dbReportCount[0].value,
      entries: dbEntryCount[0].value,
    },
    generatedCounts: {
      champions: generatedChampions.length,
      tips: generatedTips.length,
      reports: generatedPatchReports.length,
      entries: generatedEntryCount,
    },
    tipRelationProblems,
    problems,
  };

  console.log(`DB target: ${audit.targetLabel} (${audit.database})`);
  console.log(`DB counts: champions=${audit.dbCounts.champions}, tips=${audit.dbCounts.tips}, reports=${audit.dbCounts.reports}, entries=${audit.dbCounts.entries}`);
  console.log(`Generated counts: champions=${audit.generatedCounts.champions}, tips=${audit.generatedCounts.tips}, reports=${audit.generatedCounts.reports}, entries=${audit.generatedCounts.entries}`);
  if (writeLogPath) writeFileSync(writeLogPath, `${JSON.stringify(audit, null, 2)}\n`);

  if (problems.length > 0) {
    console.error('Publish audit failed:');
    problems.forEach((problem) => console.error(`- ${problem}`));
    process.exit(1);
  }
  console.log('✓ Publish audit passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
