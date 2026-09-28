import { verbs } from './verbs'
import { grammarQuestions } from './grammarQuestions'

function shuffle(array) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sample(array, count) {
  return shuffle(array).slice(0, count)
}

function readPool(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey)
    const pool = raw ? JSON.parse(raw) : []
    return Array.isArray(pool) ? pool : []
  } catch {
    return []
  }
}

function savePool(storageKey, pool) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(pool))
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

// Draws `count` items by index without repeating any item until the whole
// pool has been used at least once, persisted across sessions/retries.
function drawWithoutRepeat(storageKey, itemCount, count) {
  let pool = readPool(storageKey).filter((i) => i >= 0 && i < itemCount)

  if (pool.length < count) {
    const usedSet = new Set(pool)
    const freshIndices = shuffle(
      Array.from({ length: itemCount }, (_, i) => i).filter((i) => !usedSet.has(i)),
    )
    pool = [...pool, ...freshIndices]
  }

  const selected = pool.slice(0, count)
  savePool(storageKey, pool.slice(count))
  return selected
}

const DIRECTIONS = [
  { from: 'v1', to: 'v2', fromLabel: 'V1 (base)', toLabel: 'V2 (past)' },
  { from: 'v1', to: 'v3', fromLabel: 'V1 (base)', toLabel: 'V3 (past participle)' },
  { from: 'v2', to: 'v1', fromLabel: 'V2 (past)', toLabel: 'V1 (base)' },
  { from: 'v3', to: 'v1', fromLabel: 'V3 (past participle)', toLabel: 'V1 (base)' },
]

// Generates `count` verb quiz questions. Verbs don't repeat within a quiz,
// and won't repeat across quizzes/retries until the whole verb list has appeared.
export function generateVerbQuiz(count = 20) {
  const n = Math.min(count, verbs.length)
  const indices = drawWithoutRepeat('verbQuizPool', verbs.length, n)
  const chosenVerbs = indices.map((i) => verbs[i])

  return chosenVerbs.map((verb, idx) => {
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
    const correctAnswer = verb[direction.to]

    const distractorPool = verbs
      .filter((v) => v.v1 !== verb.v1)
      .map((v) => v[direction.to])
      .filter((val) => val && val !== correctAnswer)

    const distractors = sample(distractorPool, 3)
    const options = shuffle([correctAnswer, ...distractors])

    return {
      id: `verb-${idx}-${verb.v1}`,
      question: `Apa bentuk ${direction.toLabel} dari "${verb[direction.from]}"?`,
      subtitle: verb.meaning,
      options,
      answer: correctAnswer,
      explanation: null,
    }
  })
}

// Generates `count` grammar quiz questions. Questions don't repeat within a
// quiz, and won't repeat across quizzes/retries until the whole bank has appeared.
export function generateGrammarQuiz(count = 20) {
  const n = Math.min(count, grammarQuestions.length)
  const indices = drawWithoutRepeat('grammarQuizPool', grammarQuestions.length, n)
  const chosen = indices.map((i) => grammarQuestions[i])

  return chosen.map((item, idx) => ({
    id: `grammar-${idx}`,
    question: item.q,
    subtitle: null,
    options: shuffle(item.options),
    answer: item.answer,
    explanation: item.explanation,
  }))
}
