CREATE TABLE IF NOT EXISTS "feedback_request_limits" (
  "key" text PRIMARY KEY NOT NULL,
  "window_started_at" timestamp NOT NULL,
  "request_count" integer NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "feedback_request_limits_request_count_check" CHECK ("request_count" > 0)
);

CREATE INDEX IF NOT EXISTS "feedback_request_limits_updated_at_idx" ON "feedback_request_limits" ("updated_at");
