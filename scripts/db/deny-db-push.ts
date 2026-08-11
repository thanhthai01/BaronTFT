console.error('`pnpm db:push` is disabled for shared/prod safety.');
console.error('Use reviewed migrations or an explicitly approved schema-change plan before mutating the DB schema.');
console.error('See docs/DB_CONTENT_WORKFLOW.md for the current migration policy.');
process.exit(1);
