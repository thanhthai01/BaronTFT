# Publish Audits

Optional DB/content publish audit logs can be written here with:

```bash
pnpm db:publish-audit -- --expect-target staging --write-log docs/publish-audits/<date>-<change>.json
```

Only commit audit logs when they are useful for a reviewed release or incident record. Never include secrets or raw database URLs.
