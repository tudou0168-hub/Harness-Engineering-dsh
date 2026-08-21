import { access, readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const required = [
  'README.md',
  'AGENTS.md',
  'research.config.json',
  'docs/00-research-method.md',
  'docs/01-dsh-architecture-model.md',
  'docs/02-harness-engineering-principles.md',
  'docs/03-context-engineering.md',
  'docs/04-agent-lifecycle-and-continuation.md',
  'docs/05-prompt-preset-skill.md',
  'docs/06-tools-permissions-and-approval.md',
  'docs/07-observability-and-production-validation.md',
  'docs/08-production-agent-design-guide.md',
  'evidence/README.md',
  'studies/README.md',
  'decisions/README.md'
]

for (const path of required) await access(resolve(path))

const config = JSON.parse(await readFile(resolve('research.config.json'), 'utf8'))
if (!config.baseline?.version || !config.baseline?.commit) {
  throw new Error('research.config.json must pin baseline.version and baseline.commit')
}

for (const dir of ['docs', 'studies', 'decisions']) {
  const files = (await readdir(resolve(dir))).filter(name => name.endsWith('.md'))
  for (const file of files) {
    const text = await readFile(resolve(dir, file), 'utf8')
    if (!text.endsWith('\n')) throw new Error(`${dir}/${file} must end with newline`)
  }
}

console.log(`research baseline OK: DSH ${config.baseline.version} @ ${config.baseline.commit}`)
