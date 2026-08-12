import { set18EntityIndex } from '../../src/content/set18/set18-entity-index';
import { set18Tips } from '../../src/content/set18/set18-tips';
import { set18TipRelationProblems } from '../../src/content/set18/set18-tip-validation';

const problems = set18TipRelationProblems(set18Tips, set18EntityIndex, { requireEntityIds: true });

if (problems.length > 0) {
  console.error('Set18 tip relation validation failed:');
  problems.forEach((problem) => console.error(`- ${problem.tipId}: ${problem.check}: ${problem.detail}`));
  process.exit(1);
}

console.log(`✓ Set18 tip relation validation passed (${set18Tips.length} tips).`);
