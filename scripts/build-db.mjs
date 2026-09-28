// Generates public/data/quiz.db (a real SQLite database) from the source
// data files. The app reads this .db file at runtime via sql.js (SQLite
// compiled to WebAssembly), entirely in the browser - no backend/server
// needed to query it.
import initSqlJs from 'sql.js'
import { writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { verbs } from '../src/data/verbs.js'
import { grammarQuestions } from '../src/data/grammarQuestions.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Vite bundles sql.js's browser build (dist/sql-wasm-browser.js), which
// loads dist/sql-wasm-browser.wasm at runtime - copy it into public/ so
// it's served as a static asset the app can fetch.
function syncWasmAsset() {
  const src = path.resolve(__dirname, '../node_modules/sql.js/dist/sql-wasm-browser.wasm')
  const dest = path.resolve(__dirname, '../public/sql-wasm-browser.wasm')
  copyFileSync(src, dest)
  console.log(`Copied sql-wasm-browser.wasm -> public/`)
}

async function main() {
  syncWasmAsset()

  const SQL = await initSqlJs()
  const db = new SQL.Database()

  db.run(`
    CREATE TABLE verbs (
      id INTEGER PRIMARY KEY,
      v1 TEXT NOT NULL,
      v2 TEXT NOT NULL,
      v3 TEXT NOT NULL,
      meaning TEXT NOT NULL
    );

    CREATE TABLE grammar_questions (
      id INTEGER PRIMARY KEY,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      answer TEXT NOT NULL,
      explanation TEXT NOT NULL
    );
  `)

  const insertVerb = db.prepare(
    'INSERT INTO verbs (id, v1, v2, v3, meaning) VALUES (?, ?, ?, ?, ?)',
  )
  verbs.forEach((v, i) => {
    insertVerb.run([i, v.v1, v.v2, v.v3, v.meaning])
  })
  insertVerb.free()

  const insertQuestion = db.prepare(
    'INSERT INTO grammar_questions (id, question, options, answer, explanation) VALUES (?, ?, ?, ?, ?)',
  )
  grammarQuestions.forEach((q, i) => {
    insertQuestion.run([i, q.q, JSON.stringify(q.options), q.answer, q.explanation])
  })
  insertQuestion.free()

  const outDir = path.resolve(__dirname, '../public/data')
  mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, 'quiz.db')
  writeFileSync(outPath, Buffer.from(db.export()))

  console.log(`Built ${outPath}`)
  console.log(`  verbs: ${verbs.length}`)
  console.log(`  grammar_questions: ${grammarQuestions.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
