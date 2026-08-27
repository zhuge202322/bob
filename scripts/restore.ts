import { access, copyFile } from 'node:fs/promises'
import path from 'node:path'

async function main() {
  const source = path.resolve(process.argv[2] || '')
  const destination = path.resolve(process.env.DATABASE_FILE || './prisma/dev.db')
  if (!process.argv[2]) throw new Error('Usage: tsx scripts/restore.ts <backup-file>')
  await access(source)
  if (source === destination) throw new Error('Backup and database paths must differ')
  await copyFile(source, destination)
  console.log(`SQLite database restored from ${source}`)
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
