export type ConstraintProblem = {
  check: string;
  detail: string;
  count: number;
};

export type ConstraintValidationCounts = {
  duplicatePatchReportOrders: number;
  duplicateTipSlugs: number;
  invalidPatchEntryCategories: number;
  invalidPatchEntryKinds: number;
  invalidAugmentRarities: number;
  invalidTraitTypes: number;
};

export function constraintProblems(counts: ConstraintValidationCounts): ConstraintProblem[] {
  const problems: ConstraintProblem[] = [];
  if (counts.duplicatePatchReportOrders > 0) {
    problems.push({ check: 'patch_reports_report_order_unique', detail: 'duplicate patch_reports.report_order values', count: counts.duplicatePatchReportOrders });
  }
  if (counts.duplicateTipSlugs > 0) {
    problems.push({ check: 'set18_tips_slug_unique', detail: 'duplicate set18_tips.slug values', count: counts.duplicateTipSlugs });
  }
  if (counts.invalidPatchEntryCategories > 0) {
    problems.push({ check: 'patch_entries_category_check', detail: 'patch_entries.category has values outside the allowed set', count: counts.invalidPatchEntryCategories });
  }
  if (counts.invalidPatchEntryKinds > 0) {
    problems.push({ check: 'patch_entries_kind_check', detail: 'patch_entries.kind has values outside the allowed set', count: counts.invalidPatchEntryKinds });
  }
  if (counts.invalidAugmentRarities > 0) {
    problems.push({ check: 'set18_augments_rarity_check', detail: 'set18_augments.rarity has values outside Silver/Gold/Prismatic', count: counts.invalidAugmentRarities });
  }
  if (counts.invalidTraitTypes > 0) {
    problems.push({ check: 'set18_traits_type_check', detail: 'set18_traits.type has values outside Origin/Class/Unique', count: counts.invalidTraitTypes });
  }
  return problems;
}
