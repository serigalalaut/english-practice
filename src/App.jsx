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
  const [screen, setScreen] = useState('home') // home | quiz | result
  const [quizType, setQuizType] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])

  function startQuiz(type) {
    const generated = type === 'verb' ? generateVerbQuiz(20) : generateGrammarQuiz(20)
    setQuizType(type)
    setQuestions(generated)
    setScreen('quiz')
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
      {screen === 'home' && <Home onStart={startQuiz} />}
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
