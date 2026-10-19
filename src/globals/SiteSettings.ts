import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings & Branding',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
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
      name: 'heroPortrait',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Portrait Photo (replaces default illustration/placeholder)',
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
}
