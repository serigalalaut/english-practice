import { useState } from 'react'

function Quiz({ questions, quizTitle, onFinish, onExit }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [locked, setLocked] = useState(false)
  const [answers, setAnswers] = useState([])

  const question = questions[current]
  const total = questions.length
  const progress = Math.round(((current + 1) / total) * 100)

  function handleSelect(option) {
    if (locked) return
    setSelected(option)
    setLocked(true)
  }

  function handleNext() {
    const isCorrect = selected === question.answer
    const updatedAnswers = [
      ...answers,
      {
        question: question.question,
        subtitle: question.subtitle,
        selected,
        correctAnswer: question.answer,
        explanation: question.explanation,
        isCorrect,
      },
    ]

    if (current + 1 < total) {
      setAnswers(updatedAnswers)
      setCurrent(current + 1)
      setSelected(null)
      setLocked(false)
    } else {
      onFinish(updatedAnswers)
    }
  }

  return (
    <div className="screen quiz">
      <div className="quiz-header">
        <button className="btn link" onClick={onExit}>← Keluar</button>
        <span className="quiz-title">{quizTitle}</span>
        <span className="quiz-counter">{current + 1} / {total}</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="question-box">
        <h2>{question.question}</h2>
        {question.subtitle && <p className="hint">artinya: {question.subtitle}</p>}

        <div className="options">
          {question.options.map((option) => {
            let className = 'option'
            let icon = null
            if (locked) {
              if (option === question.answer) {
                className += ' correct'
                icon = '✓'
              } else if (option === selected) {
                className += ' incorrect'
                icon = '✗'
              }
            }
            return (
              <button
                key={option}
                className={className}
                onClick={() => handleSelect(option)}
                disabled={locked}
              >
                <span>{option}</span>
                {icon && <span className="option-icon">{icon}</span>}
              </button>
            )
          })}
        </div>

        {locked && question.explanation && (
          <p className="explanation">💡 {question.explanation}</p>
        )}

        <button className="btn primary next-btn" onClick={handleNext} disabled={!locked}>
          {current + 1 < total ? 'Berikutnya' : 'Lihat Hasil'}
        </button>
      </div>
    </div>
  )
}

export default Quiz
