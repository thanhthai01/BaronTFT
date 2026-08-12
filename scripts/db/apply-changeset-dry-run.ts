import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { set18EntityIndex } from '../../src/content/set18/set18-entity-index';
import { assertKnownDbTarget, logDbTarget } from './lib/db-target';
import { assertValidPatchChangeset, type PatchChangeset } from './lib/patch-changeset';
import { planEntityMutation } from './lib/patch-changeset-apply';

async function loadChangeset(filePath: string): Promise<PatchChangeset> {
  const absPath = path.resolve(process.cwd(), filePath);
  const mod: Record<string, unknown> = await import(pathToFileURL(absPath).href);
  const changeset = (mod.default ?? mod.changeset) as PatchChangeset | undefined;
  if (!changeset) {
    throw new Error(`Changeset "${filePath}" phải export default (hoặc export const changeset) một object PatchChangeset.`);
  }
  return changeset;
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Dùng: pnpm db:apply-changeset:dry-run <đường dẫn file changeset.ts>');
    process.exit(1);
  }

  const target = assertKnownDbTarget('db:apply-changeset:dry-run');
  logDbTarget('changeset dry-run', target);

  const changeset = await loadChangeset(filePath);
  if (target.label !== changeset.expectedTarget) {
    throw new Error(`Changeset target mismatch: DB_TARGET_LABEL=${target.label}, expectedTarget=${changeset.expectedTarget}`);
  }

  const result = assertValidPatchChangeset(changeset, { entities: set18EntityIndex });
  (changeset.entityMutations ?? []).forEach((mutation) => planEntityMutation(mutation));
  result.warnings.forEach((warning) => console.warn(`Changeset warning: ${warning}`));

  console.log('DRY RUN — không ghi DB.');
  console.log(`Changeset: ${result.summary.changesetId}`);
  console.log(`Patch: ${result.summary.patchId}`);
  console.log(`Entries: ${result.summary.entries}`);
  console.log(`Entity mutations: ${result.summary.entityMutations}`);
  console.log(`Unapplied changes: ${result.summary.unappliedChanges}`);
  console.log(`Affected tables: ${result.summary.affectedTables.length ? result.summary.affectedTables.join(', ') : 'none'}`);
  console.log('Generated files expected: src/content/patch-notes.generated.ts, src/content/set18/** when entity mutations exist.');
  console.log('Apply support: patch report + entries + allowlisted top-level scalar entity mutations.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
