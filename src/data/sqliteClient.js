// Loads the app's data (verbs, grammar questions) from a real SQLite
// database file (public/data/quiz.db) using sql.js - SQLite compiled to
// WebAssembly, running entirely in the browser. No backend/server needed.
import initSqlJs from 'sql.js'

let dbPromise = null

function loadDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const SQL = await initSqlJs({ locateFile: (file) => `/${file}` })
      const res = await fetch('/data/quiz.db')
      const buffer = await res.arrayBuffer()
      return new SQL.Database(new Uint8Array(buffer))
    })()
  }
  return dbPromise
}

function queryAll(db, sql) {
  const result = db.exec(sql)
  if (result.length === 0) return []
  const { columns, values } = result[0]
  return values.map((row) => Object.fromEntries(row.map((val, i) => [columns[i], val])))
}

let verbsCache = null
export async function getAllVerbs() {
  if (verbsCache) return verbsCache
  const db = await loadDb()
  verbsCache = queryAll(db, 'SELECT v1, v2, v3, meaning FROM verbs ORDER BY id')
  return verbsCache
}

let grammarCache = null
export async function getAllGrammarQuestions() {
  if (grammarCache) return grammarCache
  const db = await loadDb()
  const rows = queryAll(db, 'SELECT question, options, answer, explanation FROM grammar_questions ORDER BY id')
  grammarCache = rows.map((r) => ({
    q: r.question,
    options: JSON.parse(r.options),
    answer: r.answer,
    explanation: r.explanation,
  }))
  return grammarCache
}
