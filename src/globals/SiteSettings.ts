import type { Field, GlobalConfig } from 'payload'

const hexField = (name: string, label: string, placeholder: string, description?: string): Field => ({
  name,
  label,
  type: 'text',
  admin: {
    placeholder,
    description: description || `HEX code (e.g. ${placeholder})`,
  },
})

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Appearance & Landing Page',
  admin: {
    group: 'Customizations',
    description:
      'Customize website HEX colours across all 8 design token groups, add custom fonts, and manage landing page photos & videos.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Theme Colours & Custom Fonts',
          description:
            'Configure HEX colours for every part of the website (leave any field blank to use the default Royal Blue theme) and select or add custom fonts.',
          fields: [
            {
              type: 'collapsible',
              label: 'Quick Theme Preset & Custom Fonts',
              admin: { initCollapsed: false },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'themePreset',
                      label: 'Base Theme Color Preset',
                      type: 'select',
                      defaultValue: 'royal-blue',
                      options: [
                        { label: 'Royal Blue (#3B5FCC — Default)', value: 'royal-blue' },
                        { label: 'Royal Violet (#6D28D9)', value: 'royal-violet' },
                        { label: 'Emerald Green (#059669)', value: 'emerald' },
                        { label: 'Crimson Red (#DC2626)', value: 'crimson' },
                        { label: 'Amber Gold (#D97706)', value: 'amber' },
                        { label: 'Ocean Teal (#0D9488)', value: 'teal' },
                        { label: 'Midnight Indigo (#4F46E5)', value: 'indigo' },
                        { label: 'Custom HEX Palette (configured below)', value: 'custom' },
                      ],
                    },
                    hexField(
                      'customAccentColor',
                      'Quick Master Brand HEX Override',
                      '#3B5FCC',
                      'Enter any HEX code (e.g. #1E5AE6) to quickly override the master brand accent colour.',
                    ),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'fontFamily',
                      label: 'Primary Website Font (Body & UI)',
                      type: 'select',
                      defaultValue: 'instrument-sans',
                      options: [
                        { label: 'Instrument Sans (Default)', value: 'instrument-sans' },
                        { label: 'Inter (Clean UI Sans)', value: 'inter' },
                        { label: 'Plus Jakarta Sans (Geometric Executive)', value: 'plus-jakarta' },
                        { label: 'DM Sans (Editorial Minimal)', value: 'dm-sans' },
                        { label: 'Space Grotesk (Bold Keynote)', value: 'space-grotesk' },
                        { label: 'Outfit (Contemporary Brand)', value: 'outfit' },
                        { label: 'Custom Font (configured below)', value: 'custom' },
                      ],
                    },
                    {
                      name: 'serifFontFamily',
                      label: 'Accent / Editorial Serif Font',
                      type: 'select',
                      defaultValue: 'instrument-serif',
                      options: [
                        { label: 'Instrument Serif (Default)', value: 'instrument-serif' },
                        { label: 'Playfair Display', value: 'playfair' },
                        { label: 'Fraunces', value: 'fraunces' },
                        { label: 'Custom Heading/Serif Font (configured below)', value: 'custom' },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'customFontName',
                      label: 'Custom Primary Font Family Name (Optional)',
                      type: 'text',
                      admin: {
                        placeholder: 'Poppins',
                        description:
                          'Exact font-family name (e.g. Poppins, Montserrat, Satoshi). Overrides Primary Font when set.',
                      },
                    },
                    {
                      name: 'customFontUrl',
                      label: 'Custom Primary Font Stylesheet URL (Google Fonts / CDN)',
                      type: 'text',
                      admin: {
                        placeholder:
                          'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
                        description: 'Paste a Google Fonts or custom CSS stylesheet URL to load the font.',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'customHeadingFontName',
                      label: 'Custom Heading / Serif Font Family Name (Optional)',
                      type: 'text',
                      admin: {
                        placeholder: 'Cormorant Garamond',
                        description: 'Optional custom font-family name for headings / serif accents.',
                      },
                    },
                    {
                      name: 'customHeadingFontUrl',
                      label: 'Custom Heading / Serif Font Stylesheet URL (Optional)',
                      type: 'text',
                      admin: {
                        placeholder:
                          'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&display=swap',
                      },
                    },
                  ],
                },
              ],
            },

            /* 1. Brand Colours */
            {
              type: 'collapsible',
              label: '1. Brand Colours (Primary, Hover, Active, Light, Dark, Secondary, Accent, Tertiary)',
              admin: { initCollapsed: false },
              fields: [
                {
                  type: 'row',
                  fields: [
                    hexField('brandPrimary', 'Primary Colour (HEX)', '#3B5FCC'),
                    hexField('brandPrimaryHover', 'Primary Hover (HEX)', '#2E4EB8'),
                    hexField('brandPrimaryActive', 'Primary Active (HEX)', '#233E99'),
                    hexField('brandPrimaryLight', 'Primary Light (HEX)', '#EEF2FA'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('brandPrimaryDark', 'Primary Dark (HEX)', '#1E3A8A'),
                    hexField('brandSecondary', 'Secondary Colour (HEX)', '#0B1730'),
                    hexField('brandAccent', 'Accent Colour (HEX)', '#3B5FCC'),
                    hexField('brandTertiary', 'Tertiary Colour (HEX)', '#F59E0B'),
                  ],
                },
              ],
            },

            /* 2. Background Colours */
            {
              type: 'collapsible',
              label: '2. Background Colours (Main, Secondary, Card, Header, Footer, Modal, Input)',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    hexField('bgMain', 'Main Background (HEX)', '#FFFFFF'),
                    hexField('bgSecondary', 'Secondary Background (HEX)', '#F7F9FD'),
                    hexField('bgCard', 'Card Background (HEX)', '#FFFFFF'),
                    hexField('bgHeader', 'Header Background (HEX)', '#FFFFFF'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('bgFooter', 'Footer Background (HEX)', '#0A0A0C'),
                    hexField('bgModal', 'Modal Background (HEX)', '#FFFFFF'),
                    hexField('bgInput', 'Input Background (HEX)', '#F7F9FD'),
                  ],
                },
              ],
            },

            /* 3. Typography Colours */
            {
              type: 'collapsible',
              label: '3. Typography Colours (Heading, Body, Secondary, Muted, Link, Link Hover, Inverted)',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    hexField('textHeading', 'Heading Text (HEX)', '#0B1730'),
                    hexField('textBody', 'Body Text (HEX)', '#0B1730'),
                    hexField('textSecondary', 'Secondary Text (HEX)', '#5D6679'),
                    hexField('textMuted', 'Muted Text (HEX)', '#8C96AB'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('textLink', 'Link Colour (HEX)', '#3B5FCC'),
                    hexField('textLinkHover', 'Link Hover Colour (HEX)', '#2E4EB8'),
                    hexField('textInverted', 'Inverted Text (HEX)', '#FFFFFF'),
                  ],
                },
              ],
            },

            /* 4. Button Colours */
            {
              type: 'collapsible',
              label: '4. Button Colours (Primary, Secondary, Outline, Ghost, Danger & States)',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    hexField('btnPrimaryBg', 'Primary Button BG (HEX)', '#3B5FCC'),
                    hexField('btnPrimaryText', 'Primary Button Text (HEX)', '#FFFFFF'),
                    hexField('btnPrimaryHoverBg', 'Primary Button Hover BG (HEX)', '#2E4EB8'),
                    hexField('btnPrimaryActiveBg', 'Primary Button Active BG (HEX)', '#233E99'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('btnSecondaryBg', 'Secondary Button BG (HEX)', '#0B1730'),
                    hexField('btnSecondaryText', 'Secondary Button Text (HEX)', '#FFFFFF'),
                    hexField('btnSecondaryHoverBg', 'Secondary Button Hover BG (HEX)', '#16284C'),
                    hexField('btnSecondaryActiveBg', 'Secondary Button Active BG (HEX)', '#071022'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('btnOutlineBorder', 'Outline Button Border (HEX)', '#CBD5E1'),
                    hexField('btnOutlineText', 'Outline Button Text (HEX)', '#0B1730'),
                    hexField('btnOutlineHoverBg', 'Outline Button Hover BG (HEX)', '#EEF2FA'),
                    hexField('btnOutlineActiveBg', 'Outline Button Active BG (HEX)', '#E2E8F0'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('btnGhostText', 'Ghost Button Text (HEX)', '#0B1730'),
                    hexField('btnGhostHoverBg', 'Ghost Button Hover BG (HEX)', '#EEF2FA'),
                    hexField('btnGhostActiveBg', 'Ghost Button Active BG (HEX)', '#E2E8F0'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('btnDangerBg', 'Danger Button BG (HEX)', '#DC2626'),
                    hexField('btnDangerText', 'Danger Button Text (HEX)', '#FFFFFF'),
                    hexField('btnDangerHoverBg', 'Danger Button Hover BG (HEX)', '#B91C1C'),
                    hexField('btnDangerActiveBg', 'Danger Button Active BG (HEX)', '#991B1B'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('btnDisabledBg', 'Disabled Button BG (HEX)', '#E2E8F0'),
                    hexField('btnDisabledText', 'Disabled Button Text (HEX)', '#94A3B8'),
                  ],
                },
              ],
            },

            /* 5. Navigation Colours */
            {
              type: 'collapsible',
              label: '5. Navigation Colours (Navbar BG, Text, Hover, Active, Dropdown, Mobile Menu)',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    hexField('navBg', 'Navbar Background (HEX)', '#FFFFFF'),
                    hexField('navText', 'Navigation Text (HEX)', '#5D6679'),
                    hexField('navLinkHover', 'Navigation Link Hover (HEX)', '#3B5FCC'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('navLinkActive', 'Navigation Active Link (HEX)', '#3B5FCC'),
                    hexField('navDropdownBg', 'Dropdown Background (HEX)', '#FFFFFF'),
                    hexField('navMobileBg', 'Mobile Menu Background (HEX)', '#FFFFFF'),
                  ],
                },
              ],
            },

            /* 6. Borders & Effects */
            {
              type: 'collapsible',
              label: '6. Borders & Effects (Primary, Secondary, Divider, Card, Input, Focus Ring, Shadows)',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    hexField('borderPrimary', 'Primary Border (HEX)', '#E2E8F0'),
                    hexField('borderSecondary', 'Secondary Border (HEX)', '#CBD5E1'),
                    hexField('borderDivider', 'Divider Line (HEX)', '#E2E8F0'),
                    hexField('borderCard', 'Card Border (HEX)', '#E2E8F0'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('borderInput', 'Input Border (HEX)', '#CBD5E1'),
                    hexField('effectFocusRing', 'Focus Ring Colour (HEX)', '#3B5FCC'),
                    hexField(
                      'effectShadow',
                      'Card Shadow Colour / CSS',
                      '0 20px 40px -20px rgba(11, 23, 48, 0.28)',
                      'Enter a HEX shadow tint or full CSS box-shadow value.',
                    ),
                  ],
                },
              ],
            },

            /* 7. Forms & Input Colours */
            {
              type: 'collapsible',
              label: '7. Forms & Input Colours (BG, Text, Placeholder, Focus, Disabled, Checkbox, Radio, Error, Success)',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    hexField('inputBg', 'Input Background (HEX)', '#F7F9FD'),
                    hexField('inputText', 'Input Text (HEX)', '#0B1730'),
                    hexField('inputPlaceholder', 'Input Placeholder (HEX)', '#8C96AB'),
                    hexField('inputFocusBorder', 'Input Focus Colour (HEX)', '#3B5FCC'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('inputDisabledBg', 'Input Disabled BG (HEX)', '#EEF2FA'),
                    hexField('inputCheckboxAccent', 'Checkbox Colour (HEX)', '#3B5FCC'),
                    hexField('inputRadioAccent', 'Radio Colour (HEX)', '#3B5FCC'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('inputErrorBorder', 'Input Error Colour (HEX)', '#DC2626'),
                    hexField('inputSuccessBorder', 'Input Success Colour (HEX)', '#16A34A'),
                  ],
                },
              ],
            },

            /* 8. Status & Notification Colours */
            {
              type: 'collapsible',
              label: '8. Status & Notification Colours (Success, Warning, Error, Information, Neutral)',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    hexField('statusSuccessText', 'Success Text (HEX)', '#15803D'),
                    hexField('statusSuccessBg', 'Success Background (HEX)', '#DCFCE7'),
                    hexField('statusSuccessBorder', 'Success Border (HEX)', '#86EFAC'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('statusWarningText', 'Warning Text (HEX)', '#B45309'),
                    hexField('statusWarningBg', 'Warning Background (HEX)', '#FEF3C7'),
                    hexField('statusWarningBorder', 'Warning Border (HEX)', '#FDE68A'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('statusErrorText', 'Error Text (HEX)', '#B91C1C'),
                    hexField('statusErrorBg', 'Error Background (HEX)', '#FEE2E2'),
                    hexField('statusErrorBorder', 'Error Border (HEX)', '#FCA5A5'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('statusInfoText', 'Information Text (HEX)', '#1D4ED8'),
                    hexField('statusInfoBg', 'Information Background (HEX)', '#DBEAFE'),
                    hexField('statusInfoBorder', 'Information Border (HEX)', '#93C5FD'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    hexField('statusNeutralText', 'Neutral Text (HEX)', '#334155'),
                    hexField('statusNeutralBg', 'Neutral Background (HEX)', '#F1F5F9'),
                    hexField('statusNeutralBorder', 'Neutral Border (HEX)', '#CBD5E1'),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Landing Page Photos & Videos',
          description: 'Upload or link new photos and videos for every section of the landing page.',
          fields: [
            {
              name: 'heroPortrait',
              type: 'upload',
              relationTo: 'media',
              label: '1. Hero Background Photograph (Upload)',
            },
            {
              name: 'heroArtworkUrl',
              type: 'text',
              label: '1b. Hero Background Photo URL (Optional fallback if not uploaded above)',
              admin: {
                placeholder: '/hero-artwork.jpg',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroWordmark',
                  type: 'text',
                  label: 'Hero Wordmark Title',
                  defaultValue: 'Lokesh',
                },
                {
                  name: 'heroLede',
                  type: 'textarea',
                  label: 'Hero Supporting Paragraph',
                  defaultValue:
                    '18+ years turning operational chaos into self-running business systems through Business Doctor, and helping individuals conquer the stage through The Bookwishes Club.',
                },
              ],
            },
            {
              name: 'hungerPortrait',
              type: 'upload',
              relationTo: 'media',
              label: '2. "Hunger for Quality" Section — Main Portrait Photo (Upload)',
            },
            {
              name: 'hungerPortraitUrl',
              type: 'text',
              label: '2b. "Hunger for Quality" Main Portrait Photo URL (Optional)',
              admin: {
                placeholder: '/lokesh-hunger.png',
              },
            },
            {
              name: 'hungerVideoThumb',
              type: 'upload',
              relationTo: 'media',
              label: '3. "Hunger for Quality" Section — Keynote Video Thumbnail (Upload)',
            },
            {
              name: 'hungerVideoUrl',
              type: 'text',
              label: '3b. "Hunger for Quality" Video URL (YouTube, Vimeo, or MP4)',
              admin: {
                placeholder: 'https://www.youtube.com/watch?v=...',
              },
            },
            {
              name: 'coachingVideoThumb',
              type: 'upload',
              relationTo: 'media',
              label: '4. "Expert Guidance / Coaching" Section — Video Thumbnail (Upload)',
            },
            {
              name: 'coachingVideoUrl',
              type: 'text',
              label: '4b. "Expert Guidance / Coaching" Video URL (YouTube, Vimeo, or MP4)',
              admin: {
                placeholder: 'https://www.youtube.com/watch?v=...',
              },
            },
            {
              name: 'pathOneImage',
              type: 'upload',
              relationTo: 'media',
              label: '5. Transform Path 1 Photo — Business Consultation',
            },
            {
              name: 'pathTwoImage',
              type: 'upload',
              relationTo: 'media',
              label: '6. Transform Path 2 Photo — Self-Development (Bookwishes Club)',
            },
            {
              name: 'pathThreeImage',
              type: 'upload',
              relationTo: 'media',
              label: '7. Transform Path 3 Photo — Leaders & Team Development',
            },
            {
              name: 'testimonialOneThumb',
              type: 'upload',
              relationTo: 'media',
              label: '8. Testimonials Video Slot 1 — Thumbnail Photo',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'testimonialOneTitle',
                  type: 'text',
                  label: 'Testimonials Video Slot 1 — Label',
                  defaultValue: 'Business Transformation Session',
                },
                {
                  name: 'testimonialOneUrl',
                  type: 'text',
                  label: 'Testimonials Video Slot 1 — Video URL (YouTube / Vimeo / MP4)',
                  admin: { placeholder: 'https://www.youtube.com/watch?v=...' },
                },
              ],
            },
            {
              name: 'testimonialTwoThumb',
              type: 'upload',
              relationTo: 'media',
              label: '9. Testimonials Video Slot 2 — Thumbnail Photo',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'testimonialTwoTitle',
                  type: 'text',
                  label: 'Testimonials Video Slot 2 — Label',
                  defaultValue: 'The Bookwishes Club Live Cohort',
                },
                {
                  name: 'testimonialTwoUrl',
                  type: 'text',
                  label: 'Testimonials Video Slot 2 — Video URL (YouTube / Vimeo / MP4)',
                  admin: { placeholder: 'https://www.youtube.com/watch?v=...' },
                },
              ],
            },
            {
              name: 'testimonialThreeThumb',
              type: 'upload',
              relationTo: 'media',
              label: '10. Testimonials Video Slot 3 — Thumbnail Photo',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'testimonialThreeTitle',
                  type: 'text',
                  label: 'Testimonials Video Slot 3 — Label',
                  defaultValue: 'Leadership & Team Workshop',
                },
                {
                  name: 'testimonialThreeUrl',
                  type: 'text',
                  label: 'Testimonials Video Slot 3 — Video URL (YouTube / Vimeo / MP4)',
                  admin: { placeholder: 'https://www.youtube.com/watch?v=...' },
                },
              ],
            },
          ],
        },
        {
          label: 'General & Contact Info',
          fields: [
            {
              name: 'siteTitle',
              type: 'text',
              defaultValue: 'Lokesh Rohilla | Business Doctor, Author & Executive Coach',
            },
            {
              name: 'tagline',
              type: 'text',
              defaultValue: 'Transforming Founders, Leaders & Organizations',
            },
            {
              name: 'contactEmail',
              type: 'email',
              defaultValue: 'connect@lokeshrohilla.com',
            },
            {
              name: 'contactPhone',
              type: 'text',
            },
            {
              name: 'socialLinks',
              type: 'group',
              fields: [
                { name: 'linkedin', type: 'text', label: 'LinkedIn Profile URL' },
                { name: 'twitter', type: 'text', label: 'X / Twitter Profile URL' },
                { name: 'instagram', type: 'text', label: 'Instagram Profile URL' },
                { name: 'youtube', type: 'text', label: 'YouTube Channel URL' },
              ],
            },
            {
              name: 'diagnosticQuizActive',
              type: 'checkbox',
              defaultValue: true,
              label: 'Enable Transformation Diagnostic Quiz on Site',
            },
          ],
        },
      ],
    },
  ],
}
