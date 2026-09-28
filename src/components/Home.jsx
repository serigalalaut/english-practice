function Home({ onStart }) {
  return (
    <div className="screen home">
      <span className="eyebrow">✨ English Practice</span>
      <h1>Verb &amp; Grammar Quiz</h1>
      <p className="subtitle">Belajar Verb 1, Verb 2, Verb 3, dan Grammar Bahasa Inggris</p>

      <div className="card-grid">
        <div className="quiz-card">
          <div className="card-icon">🔤</div>
          <h2>Verb Forms</h2>
          <p>Tebak bentuk V1 / V2 / V3 dari kata kerja tidak beraturan.</p>
          <div className="card-meta">
            <span className="pill">20 soal</span>
            <span className="pill">Tanpa pengulangan</span>
          </div>
          <button className="btn primary" onClick={() => onStart('verb')}>
            Mulai Quiz Verb
          </button>
        </div>

        <div className="quiz-card">
          <div className="card-icon">📚</div>
          <h2>Grammar</h2>
          <p>Uji pemahaman tenses, passive voice, conditional, dan struktur kalimat lainnya.</p>
          <div className="card-meta">
            <span className="pill">20 soal</span>
            <span className="pill">Pilihan ganda</span>
          </div>
          <button className="btn primary" onClick={() => onStart('grammar')}>
            Mulai Quiz Grammar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
