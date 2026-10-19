import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Gallery } from './collections/Gallery'
import { Events } from './collections/Events'
import { Leads } from './collections/Leads'
import { Products } from './collections/Products'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, Gallery, Events, Leads, Products],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  sharp,
  secret: process.env.PAYLOAD_SECRET || 'super-secret-lokesh-rohilla-payload-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: process.env.DATABASE_URI
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI,
        },
        push: true,
      })
    : sqliteAdapter({
        client: {
          url: process.env.SQLITE_URL || 'file:./payload.db',
        },
        push: true,
      }),
})
