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

const DIRECTIONS = [
  { from: 'v1', to: 'v2', fromLabel: 'V1 (base)', toLabel: 'V2 (past)' },
  { from: 'v1', to: 'v3', fromLabel: 'V1 (base)', toLabel: 'V3 (past participle)' },
  { from: 'v2', to: 'v1', fromLabel: 'V2 (past)', toLabel: 'V1 (base)' },
  { from: 'v3', to: 'v1', fromLabel: 'V3 (past participle)', toLabel: 'V1 (base)' },
]

// Generates `count` verb quiz questions, each verb used only once (no repeats).
export function generateVerbQuiz(count = 20) {
  const chosenVerbs = sample(verbs, Math.min(count, verbs.length))

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

// Generates `count` grammar quiz questions from the bank, no repeats within a session.
export function generateGrammarQuiz(count = 20) {
  const chosen = sample(grammarQuestions, Math.min(count, grammarQuestions.length))
  return chosen.map((item, idx) => ({
    id: `grammar-${idx}`,
    question: item.q,
    subtitle: null,
    options: shuffle(item.options),
    answer: item.answer,
    explanation: item.explanation,
  }))
}
