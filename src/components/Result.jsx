function ScoreRing({ score }) {
  const size = 160
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <svg className="score-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.7s ease' }}
      />
      <text x="50%" y="47%" textAnchor="middle" className="score-ring-value">
        {score}
      </text>
      <text x="50%" y="63%" textAnchor="middle" className="score-ring-max">
        / 100
      </text>
    </svg>
  )
}

function Result({ answers, quizTitle, onRetry, onHome }) {
  const total = answers.length
  const correctCount = answers.filter((a) => a.isCorrect).length
  const score = Math.round((correctCount / total) * 100)

  let message = 'Terus berlatih ya! 💪'
  if (score === 100) message = 'Sempurna! Kerja bagus! 🏆'
  else if (score >= 80) message = 'Bagus sekali! 🎉'
  else if (score >= 60) message = 'Lumayan, tingkatkan lagi! 👍'

  return (
    <div className="screen result">
      <h1>Hasil {quizTitle}</h1>
      <ScoreRing score={score} />
      <p className="score-detail">{correctCount} dari {total} jawaban benar</p>
      <p className="score-message">{message}</p>

      <div className="review-list">
        {answers.map((a, idx) => (
          <div key={idx} className={`review-item ${a.isCorrect ? 'ok' : 'bad'}`}>
            <span className="review-icon">{a.isCorrect ? '✅' : '❌'}</span>
            <div className="review-body">
              <div className="review-question">
                <span className="review-index">{idx + 1}.</span> {a.question}
              </div>
              <div className="review-answer">
                Jawabanmu: <strong>{a.selected}</strong>
                {!a.isCorrect && (
                  <>
                    {' '}— Benar: <strong>{a.correctAnswer}</strong>
                  </>
                )}
              </div>
              {a.explanation && <div className="review-explanation">💡 {a.explanation}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="result-actions">
        <button className="btn primary" onClick={onRetry}>Coba Lagi</button>
        <button className="btn" onClick={onHome}>Kembali ke Menu</button>
      </div>
    </div>
  )
}

export default Result
