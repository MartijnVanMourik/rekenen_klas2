'use client'

import { useState, useEffect } from 'react'

interface MathProblem {
  id: string
  question: string
  answer: number
  options?: number[]
  type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'fractions' | 'decimals'
  difficulty: 'easy' | 'medium' | 'hard'
  explanation?: string
}

interface GameStats {
  correct: number
  incorrect: number
  streak: number
  totalProblems: number
}

export default function MathLearningApp() {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [stats, setStats] = useState<GameStats>({ correct: 0, incorrect: 0, streak: 0, totalProblems: 0 })
  const [selectedType, setSelectedType] = useState<string>('mixed')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [showExplanation, setShowExplanation] = useState(false)
  const [gameMode, setGameMode] = useState<'practice' | 'quiz' | 'challenge'>('practice')
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isTimerActive, setIsTimerActive] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isTimerActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time === null || time <= 1) {
            setIsTimerActive(false)
            handleTimeUp()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, timeLeft])

  const handleTimeUp = () => {
    setShowResult(true)
    setIsCorrect(false)
    setStats(prev => ({
      ...prev,
      incorrect: prev.incorrect + 1,
      streak: 0,
      totalProblems: prev.totalProblems + 1
    }))
  }

  const generateProblem = (): MathProblem => {
    const types = selectedType === 'mixed' 
      ? ['addition', 'subtraction', 'multiplication', 'division'] 
      : [selectedType]
    
    const type = types[Math.floor(Math.random() * types.length)] as MathProblem['type']
    const id = `${type}_${Date.now()}_${Math.random()}`
    
    let problem: MathProblem

    switch (type) {
      case 'addition':
        problem = generateAddition(id, selectedDifficulty)
        break
      case 'subtraction':
        problem = generateSubtraction(id, selectedDifficulty)
        break
      case 'multiplication':
        problem = generateMultiplication(id, selectedDifficulty)
        break
      case 'division':
        problem = generateDivision(id, selectedDifficulty)
        break
      case 'fractions':
        problem = generateFractions(id, selectedDifficulty)
        break
      case 'decimals':
        problem = generateDecimals(id, selectedDifficulty)
        break
      default:
        problem = generateAddition(id, selectedDifficulty)
    }

    return problem
  }

  const generateAddition = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
    let a: number, b: number
    
    switch (difficulty) {
      case 'easy':
        a = Math.floor(Math.random() * 20) + 1
        b = Math.floor(Math.random() * 20) + 1
        break
      case 'medium':
        a = Math.floor(Math.random() * 100) + 10
        b = Math.floor(Math.random() * 100) + 10
        break
      case 'hard':
        a = Math.floor(Math.random() * 500) + 50
        b = Math.floor(Math.random() * 500) + 50
        break
    }
    
    const answer = a + b
    return {
      id,
      question: `${a} + ${b} = ?`,
      answer,
      type: 'addition',
      difficulty,
      explanation: `${a} + ${b} = ${answer}`
    }
  }

  const generateSubtraction = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
    let a: number, b: number
    
    switch (difficulty) {
      case 'easy':
        a = Math.floor(Math.random() * 20) + 10
        b = Math.floor(Math.random() * a) + 1
        break
      case 'medium':
        a = Math.floor(Math.random() * 100) + 50
        b = Math.floor(Math.random() * a) + 1
        break
      case 'hard':
        a = Math.floor(Math.random() * 500) + 100
        b = Math.floor(Math.random() * a) + 1
        break
    }
    
    const answer = a - b
    return {
      id,
      question: `${a} - ${b} = ?`,
      answer,
      type: 'subtraction',
      difficulty,
      explanation: `${a} - ${b} = ${answer}`
    }
  }

  const generateMultiplication = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
    let a: number, b: number
    
    switch (difficulty) {
      case 'easy':
        a = Math.floor(Math.random() * 10) + 1
        b = Math.floor(Math.random() * 10) + 1
        break
      case 'medium':
        a = Math.floor(Math.random() * 12) + 1
        b = Math.floor(Math.random() * 15) + 1
        break
      case 'hard':
        a = Math.floor(Math.random() * 25) + 1
        b = Math.floor(Math.random() * 20) + 1
        break
    }
    
    const answer = a * b
    return {
      id,
      question: `${a} × ${b} = ?`,
      answer,
      type: 'multiplication',
      difficulty,
      explanation: `${a} × ${b} = ${answer}`
    }
  }

  const generateDivision = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
    let divisor: number, answer: number
    
    switch (difficulty) {
      case 'easy':
        divisor = Math.floor(Math.random() * 9) + 2
        answer = Math.floor(Math.random() * 10) + 1
        break
      case 'medium':
        divisor = Math.floor(Math.random() * 12) + 2
        answer = Math.floor(Math.random() * 15) + 1
        break
      case 'hard':
        divisor = Math.floor(Math.random() * 20) + 2
        answer = Math.floor(Math.random() * 25) + 1
        break
    }
    
    const dividend = divisor * answer
    return {
      id,
      question: `${dividend} ÷ ${divisor} = ?`,
      answer,
      type: 'division',
      difficulty,
      explanation: `${dividend} ÷ ${divisor} = ${answer} (want ${divisor} × ${answer} = ${dividend})`
    }
  }

  const generateFractions = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
    // Simplified fraction problems for now
    const numerator = Math.floor(Math.random() * 8) + 1
    const denominator = Math.floor(Math.random() * 8) + numerator + 1
    const answer = parseFloat((numerator / denominator).toFixed(2))
    
    return {
      id,
      question: `Wat is ${numerator}/${denominator} als decimaal? (rond af op 2 decimalen)`,
      answer,
      type: 'fractions',
      difficulty,
      explanation: `${numerator} ÷ ${denominator} = ${answer}`
    }
  }

  const generateDecimals = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
    let a: number, b: number
    
    switch (difficulty) {
      case 'easy':
        a = parseFloat((Math.random() * 10).toFixed(1))
        b = parseFloat((Math.random() * 10).toFixed(1))
        break
      case 'medium':
        a = parseFloat((Math.random() * 50).toFixed(2))
        b = parseFloat((Math.random() * 50).toFixed(2))
        break
      case 'hard':
        a = parseFloat((Math.random() * 100).toFixed(2))
        b = parseFloat((Math.random() * 100).toFixed(2))
        break
    }
    
    const answer = parseFloat((a + b).toFixed(2))
    return {
      id,
      question: `${a} + ${b} = ?`,
      answer,
      type: 'decimals',
      difficulty,
      explanation: `${a} + ${b} = ${answer}`
    }
  }

  const startNewProblem = () => {
    const problem = generateProblem()
    setCurrentProblem(problem)
    setUserAnswer('')
    setShowResult(false)
    setShowExplanation(false)
    setIsCorrect(false)
    
    // Set timer for challenge mode
    if (gameMode === 'challenge') {
      setTimeLeft(30)
      setIsTimerActive(true)
    } else {
      setTimeLeft(null)
      setIsTimerActive(false)
    }
  }

  const checkAnswer = () => {
    if (!currentProblem) return
    
    setIsTimerActive(false)
    const userNum = parseFloat(userAnswer)
    const correct = Math.abs(userNum - currentProblem.answer) < 0.01 // Allow small floating point differences
    
    setIsCorrect(correct)
    setShowResult(true)
    
    setStats(prev => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: correct ? prev.incorrect : prev.incorrect + 1,
      streak: correct ? prev.streak + 1 : 0,
      totalProblems: prev.totalProblems + 1
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim() && !showResult) {
      checkAnswer()
    }
  }

  const resetStats = () => {
    setStats({ correct: 0, incorrect: 0, streak: 0, totalProblems: 0 })
  }

  const getEncouragement = () => {
    if (stats.streak >= 10) return "🔥 Fantastisch! Je bent echt een rekenster!"
    if (stats.streak >= 5) return "⭐ Geweldig! Je bent lekker bezig!"
    if (stats.streak >= 3) return "👍 Goed zo! Je bent op de goede weg!"
    if (isCorrect) return "✅ Goed gedaan!"
    return "💪 Probeer het nog eens, je kunt het!"
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'addition': return '➕'
      case 'subtraction': return '➖'
      case 'multiplication': return '✖️'
      case 'division': return '➗'
      case 'fractions': return '🍰'
      case 'decimals': return '🔢'
      default: return '🧮'
    }
  }

  // Initialize with first problem
  useEffect(() => {
    startNewProblem()
  }, [selectedType, selectedDifficulty, gameMode])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Game Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Spelmodus</label>
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value as 'practice' | 'quiz' | 'challenge')}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="practice">🎯 Oefenen</option>
              <option value="quiz">📝 Quiz</option>
              <option value="challenge">⏱️ Uitdaging (30 sec)</option>
            </select>
          </div>

          {/* Problem Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rekensoort</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="mixed">🎲 Gemengd</option>
              <option value="addition">➕ Optellen</option>
              <option value="subtraction">➖ Aftrekken</option>
              <option value="multiplication">✖️ Vermenigvuldigen</option>
              <option value="division">➗ Delen</option>
              <option value="fractions">🍰 Breuken</option>
              <option value="decimals">🔢 Kommagetallen</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Moeilijkheid</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="easy">🟢 Makkelijk</option>
              <option value="medium">🟡 Gemiddeld</option>
              <option value="hard">🔴 Moeilijk</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
            <div className="text-sm text-green-700">Goed</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
            <div className="text-sm text-red-700">Fout</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.streak}</div>
            <div className="text-sm text-blue-700">Serie</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalProblems > 0 ? Math.round((stats.correct / stats.totalProblems) * 100) : 0}%
            </div>
            <div className="text-sm text-purple-700">Score</div>
          </div>
        </div>
      </div>

      {/* Main Problem Area */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        {currentProblem && (
          <>
            {/* Problem Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeEmoji(currentProblem.type)}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(currentProblem.difficulty)}`}>
                  {currentProblem.difficulty === 'easy' ? 'Makkelijk' : 
                   currentProblem.difficulty === 'medium' ? 'Gemiddeld' : 'Moeilijk'}
                </span>
              </div>
              
              {timeLeft !== null && (
                <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                  ⏱️ {timeLeft}s
                </div>
              )}
            </div>

            {/* Problem Question */}
            <div className="text-center mb-8">
              <div className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                {currentProblem.question}
              </div>
              
              {!showResult && (
                <div className="max-w-md mx-auto">
                  <input
                    type="number"
                    step="0.01"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Jouw antwoord..."
                    className="w-full p-4 text-2xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                    disabled={showResult}
                  />
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim() || showResult}
                    className="w-full mt-4 px-6 py-3 bg-blue-600 text-white text-xl font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Controleren
                  </button>
                </div>
              )}
            </div>

            {/* Result */}
            {showResult && (
              <div className="text-center">
                <div className={`text-6xl mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✅' : '❌'}
                </div>
                
                <div className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? 'Goed gedaan!' : `Helaas, het juiste antwoord is ${currentProblem.answer}`}
                </div>
                
                <div className="text-lg text-gray-600 mb-4">
                  {getEncouragement()}
                </div>

                {!isCorrect && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {showExplanation ? '🔼 Verberg uitleg' : '🔽 Toon uitleg'}
                    </button>
                    
                    {showExplanation && currentProblem.explanation && (
                      <div className="mt-3 text-blue-800">
                        <strong>Uitleg:</strong> {currentProblem.explanation}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={startNewProblem}
                  className="px-8 py-3 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Volgende som
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Additional Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-gray-600">
            <span className="font-medium">Tips:</span> Gebruik Enter om je antwoord te controleren. 
            Bij kommagetallen gebruik je een punt (bijvoorbeeld: 3.14)
          </div>
          
          <button
            onClick={resetStats}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            🔄 Reset Statistieken
          </button>
        </div>
      </div>
    </div>
  )
}