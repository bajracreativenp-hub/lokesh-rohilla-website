import { sql } from '@payloadcms/db-postgres'

export const up = async ({ db }: { db: any }) => {
  await db.execute(
    sql.raw(`ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "timezone" varchar DEFAULT 'IST';`),
  )
}

export const down = async ({ db }: { db: any }) => {
  await db.execute(sql.raw(`ALTER TABLE "events" DROP COLUMN IF EXISTS "timezone";`))
}
