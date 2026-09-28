import { useState } from 'react'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Result from './components/Result'
import { generateVerbQuiz, generateGrammarQuiz } from './data/quizGenerator'
import './App.css'

const QUIZ_TITLES = {
  verb: 'Verb Forms',
  grammar: 'Grammar',
}

function App() {
  const [screen, setScreen] = useState('home') // home | loading | quiz | result
  const [quizType, setQuizType] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [loadError, setLoadError] = useState(null)

  async function startQuiz(type) {
    setQuizType(type)
    setScreen('loading')
    setLoadError(null)
    try {
      const generated = type === 'verb' ? await generateVerbQuiz(20) : await generateGrammarQuiz(20)
      setQuestions(generated)
      setScreen('quiz')
    } catch {
      setLoadError('Gagal memuat soal. Coba muat ulang halaman.')
      setScreen('home')
    }
  }

  function finishQuiz(finalAnswers) {
    setAnswers(finalAnswers)
    setScreen('result')
  }

  function retryQuiz() {
    startQuiz(quizType)
  }

  function goHome() {
    setScreen('home')
    setQuizType(null)
    setQuestions([])
    setAnswers([])
  }

  return (
    <div className="app">
      {screen === 'home' && <Home onStart={startQuiz} error={loadError} />}
      {screen === 'loading' && (
        <div className="screen loading">
          <div className="spinner" />
          <p>Menyiapkan soal...</p>
        </div>
      )}
      {screen === 'quiz' && (
        <Quiz
          questions={questions}
          quizTitle={QUIZ_TITLES[quizType]}
          onFinish={finishQuiz}
          onExit={goHome}
        />
      )}
      {screen === 'result' && (
        <Result
          answers={answers}
          quizTitle={QUIZ_TITLES[quizType]}
          onRetry={retryQuiz}
          onHome={goHome}
        />
      )}
    </div>
  )
}

export default App
