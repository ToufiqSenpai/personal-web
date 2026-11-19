import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "contact_rate_limits" (
      "id" serial PRIMARY KEY NOT NULL,
      "ip" varchar NOT NULL,
      "window_start" timestamp(3) with time zone NOT NULL,
      "count" integer DEFAULT 1 NOT NULL
    );

    -- One row per IP per fixed window. The upsert in the rate limiter relies on
    -- this constraint to increment atomically instead of racing with other requests.
    CREATE UNIQUE INDEX "contact_rate_limits_ip_window_start_idx"
      ON "contact_rate_limits" USING btree ("ip", "window_start");

    -- Supports pruning of windows older than the retention period.
    CREATE INDEX "contact_rate_limits_window_start_idx"
      ON "contact_rate_limits" USING btree ("window_start");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "contact_rate_limits";
  `)
}
