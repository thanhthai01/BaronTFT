import { describe, expect, it } from 'vitest';
import { constraintProblems } from '../../scripts/db/lib/db-constraint-validation';

const cleanCounts = {
  duplicatePatchReportOrders: 0,
  duplicateTipSlugs: 0,
  invalidTipEntityIdsJson: 0,
  invalidTipChampionIdsJson: 0,
  invalidTipTraitIdsJson: 0,
  invalidPatchEntryCategories: 0,
  invalidPatchEntryKinds: 0,
  invalidAugmentRarities: 0,
  invalidTraitTypes: 0,
};

describe('db constraint validation', () => {
  it('returns no problems for clean counts', () => {
    expect(constraintProblems(cleanCounts)).toEqual([]);
  });

  it('maps non-zero counts to named constraints', () => {
    expect(
      constraintProblems({
        ...cleanCounts,
        duplicatePatchReportOrders: 1,
        invalidTipEntityIdsJson: 3,
        invalidPatchEntryKinds: 2,
      }),
    ).toEqual([
      {
        check: 'patch_reports_report_order_unique',
        detail: 'duplicate patch_reports.report_order values',
        count: 1,
      },
      {
        check: 'set18_tips_entity_ids_array_check',
        detail: 'set18_tips.entity_ids must be a JSON array',
        count: 3,
      },
      {
        check: 'patch_entries_kind_check',
        detail: 'patch_entries.kind has values outside the allowed set',
        count: 2,
      },
    ]);
  });
});
