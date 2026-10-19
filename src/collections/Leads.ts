import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'type', 'track', 'status', 'createdAt'],
  },
  access: {
    // Anyone (including public frontend forms) can create a lead submission
    create: () => true,
    // Only authenticated admin/editor users can read, update, or delete leads
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'contact_inquiry',
      options: [
        { label: 'Transformation Diagnostic Quiz', value: 'diagnostic_quiz' },
        { label: 'Contact Form Inquiry', value: 'contact_inquiry' },
        { label: 'Consultation Request', value: 'consultation_request' },
        { label: 'Workshop Booking', value: 'workshop_booking' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Closed / Won', value: 'closed_won' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'track',
      type: 'select',
      options: [
        { label: 'Founder & CEO Breakthrough', value: 'founder_breakthrough' },
        { label: 'Executive & Senior Leadership', value: 'executive_coaching' },
        { label: 'Enterprise Strategy & Turnaround', value: 'enterprise_turnaround' },
        { label: 'General Inquiry', value: 'general' },
      ],
    },
    {
      name: 'quizScore',
      type: 'number',
      label: 'Diagnostic Quiz Score (out of 100)',
    },
    {
      name: 'quizBreakdown',
      type: 'json',
      label: 'Detailed Diagnostic Quiz Answers',
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Internal Team Notes',
      admin: {
        description: 'Private notes for Lokesh and team (never exposed publicly)',
      },
    },
  ],
}
