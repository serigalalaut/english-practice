// Appends new regular verbs to src/data/verbs.js automatically: edit the
// CANDIDATES list below with [word, meaning] pairs and run this script.
// Forms are auto-conjugated and duplicates against the existing bank are
// skipped - no need to hand-type past-tense spelling for every word.
//
//   node scripts/add-regular-verbs.mjs
//
// Then run `npm run build:db` (or just `npm run dev`/`build`, which does
// it automatically) to refresh public/data/quiz.db with the new entries.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { regularVerbEntry } from './conjugateRegular.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VERBS_FILE = path.resolve(__dirname, '../src/data/verbs.js')

// Add more [word, Indonesian meaning] pairs here whenever you want to grow
// the bank further - that's the only manual step needed.
const CANDIDATES = [
  // ['example', 'contoh'],
]

function main() {
  const content = readFileSync(VERBS_FILE, 'utf8')
  const existing = new Set([...content.matchAll(/v1: '([^']+)'/g)].map((m) => m[1]))

  const seen = new Set()
  const newEntries = []
  const skipped = []

  for (const [v1, meaning] of CANDIDATES) {
    if (existing.has(v1) || seen.has(v1)) {
      skipped.push(v1)
      continue
    }
    seen.add(v1)
    newEntries.push(regularVerbEntry(v1, meaning))
  }

  if (newEntries.length === 0) {
    console.log('No new candidates to add (edit CANDIDATES in this script).')
    if (skipped.length) console.log('Skipped (already exist):', skipped.join(', '))
    return
  }

  const lines = newEntries
    .map((v) => `  { v1: '${v.v1}', v2: '${v.v2}', v3: '${v.v3}', meaning: '${v.meaning}' },`)
    .join('\n')

  const updated = content.replace(/\n\]\s*$/, `\n${lines}\n]\n`)
  writeFileSync(VERBS_FILE, updated)

  console.log(`Added ${newEntries.length} verbs.`)
  if (skipped.length) console.log('Skipped (already exist):', skipped.join(', '))
}

main()
