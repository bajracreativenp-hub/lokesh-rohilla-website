import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'locationType', 'date', 'venue', 'timezone', 'status'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'locationType',
      label: 'Event Type',
      type: 'select',
      required: true,
      defaultValue: 'virtual',
      options: [
        { label: 'Virtual', value: 'virtual' },
        { label: 'In Person', value: 'in-person' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },
    {
      name: 'title',
      label: 'Event Name',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'e.g. Grow your business exponentially',
      },
    },
    {
      name: 'bannerImage',
      label: 'Event Photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      label: 'Details / Description',
      type: 'richText',
    },
    {
      name: 'date',
      label: 'Date & Time (for Countdown & Display)',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'venue',
      label: 'Place',
      type: 'text',
      required: true,
      defaultValue: 'Virtual',
      admin: {
        placeholder: 'e.g. Virtual or Hyatt Regency, New Delhi',
      },
    },
    {
      name: 'timezone',
      label: 'Timezone',
      type: 'text',
      required: true,
      defaultValue: 'IST',
      admin: {
        placeholder: 'e.g. IST, Eastern, GMT+5:30',
      },
    },
    {
      name: 'registrationUrl',
      label: 'Apply Now / Registration Link (Optional)',
      type: 'text',
      admin: {
        placeholder: 'Defaults to /contact#contact-form if left empty',
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
      label: 'Pin to Top of Events Page',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from Event Name if left blank.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === 'string' && value.trim().length > 0) {
              return value.trim()
            }
            const base =
              typeof data?.title === 'string' && data.title.trim().length > 0
                ? data.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')
                : 'event'
            return `${base}-${Date.now().toString(36)}`
          },
        ],
      },
    },
  ],
}
