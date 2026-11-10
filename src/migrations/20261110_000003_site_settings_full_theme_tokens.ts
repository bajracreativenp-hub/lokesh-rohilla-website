import { sql } from '@payloadcms/db-postgres'

const COLUMNS = [
  'custom_font_name',
  'custom_font_url',
  'custom_heading_font_name',
  'custom_heading_font_url',
  'brand_primary',
  'brand_primary_hover',
  'brand_primary_active',
  'brand_primary_light',
  'brand_primary_dark',
  'brand_secondary',
  'brand_accent',
  'brand_tertiary',
  'bg_main',
  'bg_secondary',
  'bg_card',
  'bg_header',
  'bg_footer',
  'bg_modal',
  'bg_input',
  'text_heading',
  'text_body',
  'text_secondary',
  'text_muted',
  'text_link',
  'text_link_hover',
  'text_inverted',
  'btn_primary_bg',
  'btn_primary_text',
  'btn_primary_hover_bg',
  'btn_primary_active_bg',
  'btn_secondary_bg',
  'btn_secondary_text',
  'btn_secondary_hover_bg',
  'btn_secondary_active_bg',
  'btn_outline_border',
  'btn_outline_text',
  'btn_outline_hover_bg',
  'btn_outline_active_bg',
  'btn_ghost_text',
  'btn_ghost_hover_bg',
  'btn_ghost_active_bg',
  'btn_danger_bg',
  'btn_danger_text',
  'btn_danger_hover_bg',
  'btn_danger_active_bg',
  'btn_disabled_bg',
  'btn_disabled_text',
  'nav_bg',
  'nav_text',
  'nav_link_hover',
  'nav_link_active',
  'nav_dropdown_bg',
  'nav_mobile_bg',
  'border_primary',
  'border_secondary',
  'border_divider',
  'border_card',
  'border_input',
  'effect_focus_ring',
  'effect_shadow',
  'input_bg',
  'input_text',
  'input_placeholder',
  'input_focus_border',
  'input_disabled_bg',
  'input_checkbox_accent',
  'input_radio_accent',
  'input_error_border',
  'input_success_border',
  'status_success_text',
  'status_success_bg',
  'status_success_border',
  'status_warning_text',
  'status_warning_bg',
  'status_warning_border',
  'status_error_text',
  'status_error_bg',
  'status_error_border',
  'status_info_text',
  'status_info_bg',
  'status_info_border',
  'status_neutral_text',
  'status_neutral_bg',
  'status_neutral_border',
]

export const up = async ({ db }: { db: any }) => {
  const addClauses = COLUMNS.map((col) => `ADD COLUMN IF NOT EXISTS "${col}" varchar`).join(',\n        ')
  await db.execute(
    sql.raw(`
      ALTER TABLE "site_settings"
        ${addClauses};
    `),
  )
}

export const down = async ({ db }: { db: any }) => {
  const dropClauses = COLUMNS.map((col) => `DROP COLUMN IF EXISTS "${col}"`).join(',\n        ')
  await db.execute(
    sql.raw(`
      ALTER TABLE "site_settings"
        ${dropClauses};
    `),
  )
}
