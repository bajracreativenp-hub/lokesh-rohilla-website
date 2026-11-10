import { sql } from '@payloadcms/db-postgres'

export const up = async ({ db }: { db: any }) => {
  await db.execute(
    sql.raw(`
      ALTER TABLE "site_settings"
        ADD COLUMN IF NOT EXISTS "theme_preset" varchar DEFAULT 'royal-blue',
        ADD COLUMN IF NOT EXISTS "custom_accent_color" varchar,
        ADD COLUMN IF NOT EXISTS "font_family" varchar DEFAULT 'instrument-sans',
        ADD COLUMN IF NOT EXISTS "serif_font_family" varchar DEFAULT 'instrument-serif',
        ADD COLUMN IF NOT EXISTS "hero_artwork_url" varchar,
        ADD COLUMN IF NOT EXISTS "hero_wordmark" varchar DEFAULT 'Lokesh',
        ADD COLUMN IF NOT EXISTS "hero_lede" varchar,
        ADD COLUMN IF NOT EXISTS "hunger_portrait_id" integer,
        ADD COLUMN IF NOT EXISTS "hunger_portrait_url" varchar,
        ADD COLUMN IF NOT EXISTS "hunger_video_thumb_id" integer,
        ADD COLUMN IF NOT EXISTS "hunger_video_url" varchar,
        ADD COLUMN IF NOT EXISTS "coaching_video_thumb_id" integer,
        ADD COLUMN IF NOT EXISTS "coaching_video_url" varchar,
        ADD COLUMN IF NOT EXISTS "path_one_image_id" integer,
        ADD COLUMN IF NOT EXISTS "path_two_image_id" integer,
        ADD COLUMN IF NOT EXISTS "path_three_image_id" integer,
        ADD COLUMN IF NOT EXISTS "testimonial_one_thumb_id" integer,
        ADD COLUMN IF NOT EXISTS "testimonial_one_title" varchar DEFAULT 'Business Transformation Session',
        ADD COLUMN IF NOT EXISTS "testimonial_one_url" varchar,
        ADD COLUMN IF NOT EXISTS "testimonial_two_thumb_id" integer,
        ADD COLUMN IF NOT EXISTS "testimonial_two_title" varchar DEFAULT 'The Bookwishes Club Live Cohort',
        ADD COLUMN IF NOT EXISTS "testimonial_two_url" varchar,
        ADD COLUMN IF NOT EXISTS "testimonial_three_thumb_id" integer,
        ADD COLUMN IF NOT EXISTS "testimonial_three_title" varchar DEFAULT 'Leadership & Team Workshop',
        ADD COLUMN IF NOT EXISTS "testimonial_three_url" varchar;

      ALTER TABLE "posts" ALTER COLUMN "featured_image_id" DROP NOT NULL;
    `),
  )
}

export const down = async ({ db }: { db: any }) => {
  await db.execute(
    sql.raw(`
      ALTER TABLE "site_settings"
        DROP COLUMN IF EXISTS "theme_preset",
        DROP COLUMN IF EXISTS "custom_accent_color",
        DROP COLUMN IF EXISTS "font_family",
        DROP COLUMN IF EXISTS "serif_font_family",
        DROP COLUMN IF EXISTS "hero_artwork_url",
        DROP COLUMN IF EXISTS "hero_wordmark",
        DROP COLUMN IF EXISTS "hero_lede",
        DROP COLUMN IF EXISTS "hunger_portrait_id",
        DROP COLUMN IF EXISTS "hunger_portrait_url",
        DROP COLUMN IF EXISTS "hunger_video_thumb_id",
        DROP COLUMN IF EXISTS "hunger_video_url",
        DROP COLUMN IF EXISTS "coaching_video_thumb_id",
        DROP COLUMN IF EXISTS "coaching_video_url",
        DROP COLUMN IF EXISTS "path_one_image_id",
        DROP COLUMN IF EXISTS "path_two_image_id",
        DROP COLUMN IF EXISTS "path_three_image_id",
        DROP COLUMN IF EXISTS "testimonial_one_thumb_id",
        DROP COLUMN IF EXISTS "testimonial_one_title",
        DROP COLUMN IF EXISTS "testimonial_one_url",
        DROP COLUMN IF EXISTS "testimonial_two_thumb_id",
        DROP COLUMN IF EXISTS "testimonial_two_title",
        DROP COLUMN IF EXISTS "testimonial_two_url",
        DROP COLUMN IF EXISTS "testimonial_three_thumb_id",
        DROP COLUMN IF EXISTS "testimonial_three_title",
        DROP COLUMN IF EXISTS "testimonial_three_url";
    `),
  )
}
