import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'price', 'currency', 'active'],
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
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Book / Publication', value: 'book' },
        { label: 'Online Course / Program', value: 'course' },
        { label: '1-on-1 Consultation Package', value: 'consultation' },
        { label: 'Masterclass / Workshop Ticket', value: 'workshop' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'USD',
      options: [
        { label: 'USD ($)', value: 'USD' },
        { label: 'INR (₹)', value: 'INR' },
        { label: 'EUR (€)', value: 'EUR' },
        { label: 'GBP (£)', value: 'GBP' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'externalBuyUrl',
      type: 'text',
      label: 'Checkout / Buy Link (Stripe, Amazon, Gumroad, etc.)',
    },
  ],
}
