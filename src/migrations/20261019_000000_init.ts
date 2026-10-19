import { sql } from '@payloadcms/db-postgres'

export const up = async ({ db }: { db: any }) => {
  await db.execute(sql.raw(`CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');

CREATE TYPE "public"."enum_posts_category" AS ENUM('business-strategy', 'leadership', 'mindset', 'case-studies', 'press');

CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');

CREATE TYPE "public"."enum_gallery_category" AS ENUM('speaking', 'workshops', 'client-transformations', 'media-press', 'behind-the-scenes');

CREATE TYPE "public"."enum_events_location_type" AS ENUM('in-person', 'virtual', 'hybrid');

CREATE TYPE "public"."enum_events_status" AS ENUM('upcoming', 'ongoing', 'completed', 'cancelled');

CREATE TYPE "public"."enum_leads_type" AS ENUM('diagnostic_quiz', 'contact_inquiry', 'consultation_request', 'workshop_booking');

CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'closed_won', 'archived');

CREATE TYPE "public"."enum_leads_track" AS ENUM('founder_breakthrough', 'executive_coaching', 'enterprise_turnaround', 'general');

CREATE TYPE "public"."enum_products_type" AS ENUM('book', 'course', 'consultation', 'workshop');

CREATE TYPE "public"."enum_products_currency" AS ENUM('USD', 'INR', 'EUR', 'GBP');

CREATE TABLE "users_sessions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) with time zone,
	"expires_at" timestamp(3) with time zone NOT NULL
);
;

CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"role" "enum_users_role" DEFAULT 'admin' NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"reset_password_requested_at" timestamp(3) with time zone,
	"login_attempts" numeric DEFAULT 0,
	"lock_until" timestamp(3) with time zone
);
;

CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar NOT NULL,
	"caption" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric,
	"sizes_thumbnail_url" varchar,
	"sizes_thumbnail_width" numeric,
	"sizes_thumbnail_height" numeric,
	"sizes_thumbnail_mime_type" varchar,
	"sizes_thumbnail_filesize" numeric,
	"sizes_thumbnail_filename" varchar,
	"sizes_card_url" varchar,
	"sizes_card_width" numeric,
	"sizes_card_height" numeric,
	"sizes_card_mime_type" varchar,
	"sizes_card_filesize" numeric,
	"sizes_card_filename" varchar,
	"sizes_feature_url" varchar,
	"sizes_feature_width" numeric,
	"sizes_feature_height" numeric,
	"sizes_feature_mime_type" varchar,
	"sizes_feature_filesize" numeric,
	"sizes_feature_filename" varchar
);
;

CREATE TABLE "posts_tags" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"tag" varchar
);
;

CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"category" "enum_posts_category" NOT NULL,
	"status" "enum_posts_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp(3) with time zone,
	"reading_time" numeric,
	"featured_image_id" integer NOT NULL,
	"excerpt" varchar NOT NULL,
	"content" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
;

CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"image_id" integer NOT NULL,
	"caption" varchar,
	"category" "enum_gallery_category" NOT NULL,
	"featured" boolean DEFAULT false,
	"order" numeric DEFAULT 0,
	"date" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
;

CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"date" timestamp(3) with time zone NOT NULL,
	"location_type" "enum_events_location_type" DEFAULT 'in-person' NOT NULL,
	"venue" varchar NOT NULL,
	"status" "enum_events_status" DEFAULT 'upcoming' NOT NULL,
	"featured" boolean DEFAULT false,
	"banner_image_id" integer,
	"description" jsonb,
	"registration_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
;

CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "enum_leads_type" DEFAULT 'contact_inquiry' NOT NULL,
	"status" "enum_leads_status" DEFAULT 'new' NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"company" varchar,
	"track" "enum_leads_track",
	"quiz_score" numeric,
	"quiz_breakdown" jsonb,
	"message" varchar,
	"internal_notes" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
;

CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"type" "enum_products_type" NOT NULL,
	"price" numeric NOT NULL,
	"currency" "enum_products_currency" DEFAULT 'USD' NOT NULL,
	"active" boolean DEFAULT true,
	"featured" boolean DEFAULT false,
	"image_id" integer,
	"description" varchar,
	"external_buy_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
;

CREATE TABLE "payload_kv" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"data" jsonb NOT NULL
);
;

CREATE TABLE "payload_locked_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"global_slug" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
;

CREATE TABLE "payload_locked_documents_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"media_id" integer,
	"posts_id" integer,
	"gallery_id" integer,
	"events_id" integer,
	"leads_id" integer,
	"products_id" integer
);
;

CREATE TABLE "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
;

CREATE TABLE "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
);
;

CREATE TABLE "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
;

CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_title" varchar DEFAULT 'Lokesh Rohilla | Business Doctor, Author & Executive Coach',
	"tagline" varchar DEFAULT 'Transforming Founders, Leaders & Organizations',
	"hero_portrait_id" integer,
	"contact_email" varchar DEFAULT 'connect@lokeshrohilla.com',
	"contact_phone" varchar,
	"social_links_linkedin" varchar,
	"social_links_twitter" varchar,
	"social_links_instagram" varchar,
	"social_links_youtube" varchar,
	"diagnostic_quiz_active" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);
;

ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "gallery" ADD CONSTRAINT "gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "events" ADD CONSTRAINT "events_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_portrait_id_media_id_fk" FOREIGN KEY ("hero_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");

CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");

CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");

CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");

CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");

CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");

CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");

CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");

CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");

CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");

CREATE INDEX "media_sizes_feature_sizes_feature_filename_idx" ON "media" USING btree ("sizes_feature_filename");

CREATE INDEX "posts_tags_order_idx" ON "posts_tags" USING btree ("_order");

CREATE INDEX "posts_tags_parent_id_idx" ON "posts_tags" USING btree ("_parent_id");

CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");

CREATE INDEX "posts_featured_image_idx" ON "posts" USING btree ("featured_image_id");

CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");

CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");

CREATE INDEX "gallery_image_idx" ON "gallery" USING btree ("image_id");

CREATE INDEX "gallery_updated_at_idx" ON "gallery" USING btree ("updated_at");

CREATE INDEX "gallery_created_at_idx" ON "gallery" USING btree ("created_at");

CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");

CREATE INDEX "events_banner_image_idx" ON "events" USING btree ("banner_image_id");

CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");

CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");

CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");

CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");

CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");

CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");

CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");

CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");

CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");

CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");

CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");

CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");

CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");

CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");

CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");

CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");

CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");

CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");

CREATE INDEX "payload_locked_documents_rels_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_id");

CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");

CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");

CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");

CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");

CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");

CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");

CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");

CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");

CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");

CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");

CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");

CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");

CREATE INDEX "site_settings_hero_portrait_idx" ON "site_settings" USING btree ("hero_portrait_id");`))
}

export const down = async () => {}
