import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'order', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Keynotes & Speaking', value: 'speaking' },
        { label: 'Corporate Workshops', value: 'workshops' },
        { label: 'Client Transformations', value: 'client-transformations' },
        { label: 'Media & Press', value: 'media-press' },
        { label: 'Behind the Scenes', value: 'behind-the-scenes' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Feature on Homepage Gallery',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order (lower numbers appear first)',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'date',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
