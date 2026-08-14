CREATE TABLE IF NOT EXISTS "feedback_submissions" (
  "id" text PRIMARY KEY NOT NULL,
  "message" text NOT NULL,
  "contact_email" text,
  "status" text DEFAULT 'new' NOT NULL,
  "submitted_at" timestamp DEFAULT now() NOT NULL,
  "read_at" timestamp,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "feedback_submissions_status_check" CHECK ("status" IN ('new', 'read', 'archived'))
);

CREATE INDEX IF NOT EXISTS "feedback_submissions_submitted_at_idx" ON "feedback_submissions" ("submitted_at");
