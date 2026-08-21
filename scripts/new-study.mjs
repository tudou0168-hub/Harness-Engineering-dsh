import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const title = process.argv.slice(2).join(' ').trim()
if (!title) {
  console.error('usage: npm run study:new -- "Study title"')
  process.exit(1)
}

const date = new Date().toISOString().slice(0, 10)
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 72)

if (!slug) {
  console.error('title produced an empty slug')
  process.exit(1)
}

const template = await readFile(resolve('templates/study.md'), 'utf8')
const output = template.replaceAll('{{TITLE}}', title)
const path = resolve('studies', `${date}-${slug}.md`)
await writeFile(path, output, { flag: 'wx' })
console.log(path)
