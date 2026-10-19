import fs from 'fs'
import path from 'path'

const sql = fs.readFileSync('scripts/init-neon.sql', 'utf8')

const migrationDir = path.resolve('src/migrations')
if (!fs.existsSync(migrationDir)) {
  fs.mkdirSync(migrationDir, { recursive: true })
}

// In Drizzle execute(sql`...`), sql.raw() can run raw SQL string safely without template literal issues!
const migrationContent = `import { sql } from '@payloadcms/db-postgres'

export const up = async ({ db }: { db: any }) => {
  await db.execute(sql.raw(\`${sql.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`))
}

export const down = async () => {}
`

fs.writeFileSync(path.join(migrationDir, '20261019_000000_init.ts'), migrationContent, 'utf8')

const indexContent = `import * as migration0 from './20261019_000000_init'

export const migrations = [
  {
    name: '20261019_000000_init',
    up: migration0.up,
    down: migration0.down,
  },
]
`

fs.writeFileSync(path.join(migrationDir, 'index.ts'), indexContent, 'utf8')
console.log('Migration generated successfully in src/migrations/')
