import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Appearance & Landing Page',
  admin: {
    group: 'Customizations',
    description:
      'Customize website theme color, typography (fonts), landing page photos & videos, and contact settings.',
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
          label: 'Theme Color & Fonts',
          description: 'Change the global brand accent color and typography across the entire website.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'themePreset',
                  label: 'Website Theme Color Preset',
                  type: 'select',
                  defaultValue: 'royal-blue',
                  options: [
                    { label: 'Royal Blue (#3B5FCC — Default)', value: 'royal-blue' },
                    { label: 'Blanxer Violet (#6D28D9)', value: 'blanxer-violet' },
                    { label: 'Emerald Green (#059669)', value: 'emerald' },
                    { label: 'Crimson Red (#DC2626)', value: 'crimson' },
                    { label: 'Amber Gold (#D97706)', value: 'amber' },
                    { label: 'Ocean Teal (#0D9488)', value: 'teal' },
                    { label: 'Midnight Indigo (#4F46E5)', value: 'indigo' },
                    { label: 'Custom Hex Color (set on right)', value: 'custom' },
                  ],
                },
                {
                  name: 'customAccentColor',
                  label: 'Custom Theme Hex Color (Optional)',
                  type: 'text',
                  admin: {
                    placeholder: '#3B5FCC',
                    description: 'If filled (e.g. #7C3AED), overrides the preset color above.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'fontFamily',
                  label: 'Primary Website Font (Sans / Body & Headings)',
                  type: 'select',
                  defaultValue: 'instrument-sans',
                  options: [
                    { label: 'Instrument Sans (Default)', value: 'instrument-sans' },
                    { label: 'Inter (Clean UI Sans)', value: 'inter' },
                    { label: 'Plus Jakarta Sans (Geometric Executive)', value: 'plus-jakarta' },
                    { label: 'DM Sans (Editorial Minimal)', value: 'dm-sans' },
                    { label: 'Space Grotesk (Bold Keynote)', value: 'space-grotesk' },
                    { label: 'Outfit (Contemporary Brand)', value: 'outfit' },
                  ],
                },
                {
                  name: 'serifFontFamily',
                  label: 'Accent Serif Font (Italic Accent Letters)',
                  type: 'select',
                  defaultValue: 'instrument-serif',
                  options: [
                    { label: 'Instrument Serif (Default)', value: 'instrument-serif' },
                    { label: 'Playfair Display', value: 'playfair' },
                    { label: 'Fraunces', value: 'fraunces' },
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
