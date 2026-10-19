import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'locationType', 'status', 'featured'],
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'locationType',
      type: 'select',
      required: true,
      defaultValue: 'in-person',
      options: [
        { label: 'In Person', value: 'in-person' },
        { label: 'Virtual', value: 'virtual' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'venue',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'e.g. Virtual via Zoom or Hyatt Regency, New Delhi',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'upcoming',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Feature on Homepage',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'registrationUrl',
      type: 'text',
      label: 'RSVP / Ticket Registration Link',
    },
  ],
}
