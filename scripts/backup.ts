import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

async function main() {
  const source = path.resolve(process.env.DATABASE_FILE || './prisma/dev.db')
  const destinationRoot = path.resolve(process.env.BACKUP_ROOT || './backups')
  const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
  await mkdir(destinationRoot, { recursive: true })
  const destination = path.join(destinationRoot, `hocore-${stamp}.db`)
  await copyFile(source, destination)
  console.log(`SQLite backup written to ${destination}`)
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
