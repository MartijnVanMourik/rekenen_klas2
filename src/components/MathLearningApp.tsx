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
  sourceChapterId?: string
}

interface GameStats {
  correct: number
  incorrect: number
  streak: number
  totalProblems: number
}

interface Chapter {
  id: string
  title: string
  description: string
  problemTypes: MathProblem['type'][]
  difficulty: 'easy' | 'medium' | 'hard'
}

interface Block {
  id: string
  title: string
  description: string
  chapters: Chapter[]
}

// Blok 1 definitie gebaseerd op de inhoudsopgave
const BLOCKS: Block[] = [
  {
    id: 'block1',
    title: 'Blok 1',
    description: 'Optellen, aftrekken, decimale getallen, grote getallen en handig rekenen',
    chapters: [
      {
        id: 'chapter1',
        title: 'Optellen en aftrekken',
        description: 'Basis optellen en aftrekken',
        problemTypes: ['addition', 'subtraction'],
        difficulty: 'easy'
      },
      {
        id: 'chapter2',
        title: 'Vermenigvuldigen en delen',
        description: 'Basis vermenigvuldigen en delen',
        problemTypes: ['multiplication', 'division'],
        difficulty: 'easy'
      },
      {
        id: 'chapter3',
        title: 'Decimale getallen',
        description: 'Rekenen met kommagetallen',
        problemTypes: ['decimals'],
        difficulty: 'medium'
      },
      {
        id: 'chapter4',
        title: 'Decimale getallen vermenigvuldigen en delen',
        description: 'Vermenigvuldigen en delen met kommagetallen',
        problemTypes: ['multiplication', 'division', 'decimals'],
        difficulty: 'medium'
      },
      {
        id: 'chapter5',
        title: 'Grote getallen',
        description: 'Rekenen met grote getallen',
        problemTypes: ['addition', 'subtraction', 'multiplication'],
        difficulty: 'hard'
      },
      {
        id: 'chapter6',
        title: 'Handig rekenen en rekenvolgorde',
        description: 'Strategieën voor efficiënt rekenen',
        problemTypes: ['addition', 'subtraction', 'multiplication', 'division'],
        difficulty: 'medium'
      }
    ]
  }
]

// Context-sjablonen voor unieke contextopgaven (hoofdstuk 1)
const CONTEXT_TEMPLATES = [
  {
    theme: 'geld',
    template: (numbers: number[]) => `Lisa koopt een boek voor €${numbers[0]}. Ze koopt ook een pen voor €${numbers[1]}. Hoeveel betaalt ze in totaal?`,
    operation: 'addition',
    minNumbers: 2,
    maxNumbers: 2
  },
  {
    theme: 'reizen',
    template: (numbers: number[]) => `De bus rijdt ${numbers[0]} km op maandag, ${numbers[1]} km op dinsdag en ${numbers[2]} km op woensdag. Hoeveel km rijdt de bus in totaal?`,
    operation: 'addition',
    minNumbers: 3,
    maxNumbers: 3
  },
  {
    theme: 'bezoekers',
    template: (numbers: number[]) => `In week 12 kwamen er ${numbers[0]} bezoekers, in week 13 ${numbers[1]}. Hoeveel meer bezoekers waren er in week 13?`,
    operation: 'subtraction',
    minNumbers: 2,
    maxNumbers: 2
  },
  {
    theme: 'korting',
    template: (numbers: number[]) => `Een fiets kost €${numbers[0]}. In de uitverkoop krijg je €${numbers[1]} korting. Wat betaal je nu?`,
    operation: 'subtraction',
    minNumbers: 2,
    maxNumbers: 2
  },
  {
    theme: 'school',
    template: (numbers: number[]) => `Er zijn ${numbers[0]} leerlingen op school. ${numbers[1]} gaan naar huis. Hoeveel blijven er over?`,
    operation: 'subtraction',
    minNumbers: 2,
    maxNumbers: 2
  },
  {
    theme: 'familie',
    template: (numbers: number[]) => `Op een feestje zijn ${numbers[0]} volwassenen, ${numbers[1]} kinderen en ${numbers[2]} baby's. Hoeveel mensen zijn er in totaal?`,
    operation: 'addition',
    minNumbers: 3,
    maxNumbers: 3
  },
  {
    theme: 'winkelen',
    template: (numbers: number[]) => `Je koopt drie producten voor €${numbers[0]}, €${numbers[1]} en €${numbers[2]}. Hoeveel betaal je samen?`,
    operation: 'addition',
    minNumbers: 3,
    maxNumbers: 3
  },
  {
    theme: 'sport',
    template: (numbers: number[]) => `Je team scoort ${numbers[0]}, ${numbers[1]} en ${numbers[2]} punten in drie wedstrijden. Hoeveel punten in totaal?`,
    operation: 'addition',
    minNumbers: 3,
    maxNumbers: 3
  }
]

// Helper om random getallen te genereren met x cijfers
function randomIntWithDigits(digits: number) {
  const min = Math.pow(10, digits - 1)
  const max = Math.pow(10, digits) - 1
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper om een array van random getallen te maken
function generateRandomNumbers(count: number, digits: number) {
  return Array.from({ length: count }, () => randomIntWithDigits(digits))
}

// Gemini API helper
async function generateGeminiContext({ numbers, operation, difficulty }: { numbers: number[], operation: string, difficulty: string }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  if (!apiKey) {
    console.warn('Geen Gemini API key gevonden (NEXT_PUBLIC_GOOGLE_API_KEY)')
    return null
  }
  console.log('Gemini API wordt aangeroepen met key:', apiKey.slice(0, 5) + '...')
  const prompt = `Genereer een korte, realistische contextvraag voor een rekenopgave voor een leerling uit de onderbouw van het voortgezet onderwijs. Gebruik de volgende getallen: ${numbers.join(', ')} en de bewerking: ${operation === 'addition' ? 'optellen' : 'aftrekken'}. De vraag moet lijken op de voorbeeldsommen uit een Nederlands rekenboek, zoals: "Lisa koopt een boek voor €12,95 en een pen voor €2,50. Hoeveel betaalt ze in totaal?". Gebruik geen namen uit het voorbeeld, maar verzin zelf een korte, unieke context. Stel de vraag in het Nederlands.`
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    console.log('Gemini API response:', data)
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      console.warn('Geen geldig antwoord van Gemini API')
    }
    return text || null
  } catch (e) {
    console.warn('Fout bij Gemini API:', e)
    return null
  }
}

// Maak generateAdvancedMathProblem asynchroon
async function generateAdvancedMathProblemAsync({
  id,
  operation,
  difficulty,
  isWordProblem = false,
  useGeminiContext = false
}: {
  id: string,
  operation: 'addition' | 'subtraction',
  difficulty: 'easy' | 'medium' | 'hard',
  isWordProblem?: boolean,
  useGeminiContext?: boolean
}): Promise<MathProblem> {
  // Moeilijkheid bepaalt aantal cijfers en getallen
  let numCount: number, digits: number
  switch (difficulty) {
    case 'easy':
      numCount = 2
      digits = 3
      break
    case 'medium':
      numCount = Math.random() < 0.5 ? 2 : 3
      digits = 4
      break
    case 'hard':
      numCount = Math.random() < 0.5 ? 3 : 4
      digits = 4 + Math.floor(Math.random() * 2) // 4 of 5 cijfers
      break
    default:
      numCount = 2
      digits = 3
  }

  let numbers: number[]
  let question: string
  if (isWordProblem) {
    numbers = generateRandomNumbers(numCount, digits)
    if (useGeminiContext) {
      // Probeer Gemini context te genereren
      const geminiQ = await generateGeminiContext({ numbers, operation, difficulty })
      if (geminiQ) {
        question = geminiQ
      } else {
        // Fallback naar bestaande contextgenerator
        const candidates = CONTEXT_TEMPLATES.filter(t => t.operation === operation && t.minNumbers <= numCount && t.maxNumbers >= numCount)
        if (candidates.length > 0) {
          const template = candidates[Math.floor(Math.random() * candidates.length)]
          numCount = Math.floor(Math.random() * (template.maxNumbers - template.minNumbers + 1)) + template.minNumbers
          numbers = generateRandomNumbers(numCount, digits)
          question = template.template(numbers)
        } else {
          question = numbers.join(operation === 'addition' ? ' + ' : ' - ') + ' = ?'
        }
      }
    } else {
      // Bestaande contextgenerator
      const candidates = CONTEXT_TEMPLATES.filter(t => t.operation === operation && t.minNumbers <= numCount && t.maxNumbers >= numCount)
      if (candidates.length > 0) {
        const template = candidates[Math.floor(Math.random() * candidates.length)]
        numCount = Math.floor(Math.random() * (template.maxNumbers - template.minNumbers + 1)) + template.minNumbers
        numbers = generateRandomNumbers(numCount, digits)
        question = template.template(numbers)
      } else {
        question = numbers.join(operation === 'addition' ? ' + ' : ' - ') + ' = ?'
      }
    }
  } else {
    numbers = generateRandomNumbers(numCount, digits)
    if (operation === 'addition') {
      question = numbers.join(' + ') + ' = ?'
    } else {
      numbers = [Math.max(...numbers), ...numbers.slice(1)]
      question = numbers.join(' - ') + ' = ?'
    }
  }

  let answer: number
  if (operation === 'addition') {
    answer = numbers.reduce((a, b) => a + b, 0)
  } else {
    answer = numbers.reduce((a, b) => a - b)
  }

  return {
    id,
    question,
    answer,
    type: operation,
    difficulty,
    explanation: `${question.replace('= ?', '= ' + answer)}`
  }
}

// Pas generateAddition en generateSubtraction aan om generateAdvancedMathProblemAsync te gebruiken
const generateAddition = async (id: string, difficulty: 'easy' | 'medium' | 'hard', isWordProblem: boolean = false, useGeminiContext: boolean = false): Promise<MathProblem> => {
  return generateAdvancedMathProblemAsync({ id, operation: 'addition', difficulty, isWordProblem, useGeminiContext })
}
const generateSubtraction = async (id: string, difficulty: 'easy' | 'medium' | 'hard', isWordProblem: boolean = false, useGeminiContext: boolean = false): Promise<MathProblem> => {
  return generateAdvancedMathProblemAsync({ id, operation: 'subtraction', difficulty, isWordProblem, useGeminiContext })
}

// 1. Voeg Socratische uitleg via Gemini toe
async function generateSocraticHint({ question, answer }: { question: string, answer: number }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  if (!apiKey) {
    console.warn('Geen Gemini API key gevonden (NEXT_PUBLIC_GOOGLE_API_KEY)')
    return null
  }
  const prompt = `Je bent een vriendelijke, Socratische rekenleraar. De leerling heeft deze opgave fout gemaakt:\n${question}\nHet juiste antwoord is: ${answer}\nGeef een korte, sturende tip (max 5 zinnen) met hints en vragen, zodat de leerling zelf tot het antwoord kan komen. Geef niet direct het antwoord.`
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      console.warn('Geen geldig antwoord van Gemini API voor Socratische uitleg')
    }
    return text || null
  } catch (e) {
    console.warn('Fout bij Gemini API (Socratische uitleg):', e)
    return null
  }
}

export default function MathLearningApp() {
  // Existing state
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

  // New state for block structure
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null)
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [isDiagnosticTestActive, setIsDiagnosticTestActive] = useState(false)
  const [diagnosticTestProblems, setDiagnosticTestProblems] = useState<MathProblem[]>([])
  const [diagnosticTestCurrentProblemIndex, setDiagnosticTestCurrentProblemIndex] = useState(0)
  const [diagnosticTestScores, setDiagnosticTestScores] = useState<Record<string, { correct: number, total: number }>>({})
  const [diagnosticTestAttempts, setDiagnosticTestAttempts] = useState(0)
  const [showDiagnosticResults, setShowDiagnosticResults] = useState(false)

  // Voeg Gemini setting toe aan de state
  const [useGeminiContext, setUseGeminiContext] = useState(false)

  // 2. Voeg state toe voor Socratische uitleg
  const [socraticHint, setSocraticHint] = useState<string | null>(null)
  const [isLoadingHint, setIsLoadingHint] = useState(false)

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
    if (isDiagnosticTestActive) {
      submitDiagnosticAnswer()
    } else {
      setShowResult(true)
      setIsCorrect(false)
      setStats(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        streak: 0,
        totalProblems: prev.totalProblems + 1
      }))
    }
  }

  // Maak generateProblem asynchroon
  const generateProblem = async (
    problemTypes: MathProblem['type'][],
    difficulty: 'easy' | 'medium' | 'hard',
    isWordProblem: boolean = false,
    sourceChapterId?: string,
    currentChapterId?: string,
    useGeminiContext?: boolean
  ): Promise<MathProblem> => {
    // Forceer in hoofdstuk 1 altijd alleen optellen/aftrekken
    let allowedTypes = problemTypes
    if (sourceChapterId === 'chapter1' || currentChapterId === 'chapter1') {
      allowedTypes = ['addition', 'subtraction'] as MathProblem['type'][]
    }
    const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)]
    const id = `${type}_${Date.now()}_${Math.random()}`

    let problem: MathProblem

    switch (type) {
      case 'addition':
        problem = await generateAddition(id, difficulty, isWordProblem, useGeminiContext)
        break
      case 'subtraction':
        problem = await generateSubtraction(id, difficulty, isWordProblem, useGeminiContext)
        break
      case 'multiplication':
        problem = generateMultiplication(id, difficulty, isWordProblem)
        break
      case 'division':
        problem = generateDivision(id, difficulty, isWordProblem)
        break
      case 'fractions':
        problem = generateFractions(id, difficulty, isWordProblem)
        break
      case 'decimals':
        problem = generateDecimals(id, difficulty, isWordProblem)
        break
      default:
        problem = await generateAddition(id, difficulty, isWordProblem, useGeminiContext)
    }

    if (sourceChapterId) {
      problem.sourceChapterId = sourceChapterId
    }

    return problem
  }

  const generateMultiplication = (id: string, difficulty: 'easy' | 'medium' | 'hard', isWordProblem: boolean = false): MathProblem => {
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
    const question = isWordProblem 
      ? `In een doos zitten ${a} rijen met elk ${b} snoepjes. Hoeveel snoepjes zijn er in totaal?`
      : `${a} × ${b} = ?`
    
    return {
      id,
      question,
      answer,
      type: 'multiplication',
      difficulty,
      explanation: `${a} × ${b} = ${answer}`
    }
  }

  const generateDivision = (id: string, difficulty: 'easy' | 'medium' | 'hard', isWordProblem: boolean = false): MathProblem => {
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
    const question = isWordProblem 
      ? `${dividend} koekjes worden eerlijk verdeeld over ${divisor} kinderen. Hoeveel koekjes krijgt elk kind?`
      : `${dividend} ÷ ${divisor} = ?`
    
    return {
      id,
      question,
      answer,
      type: 'division',
      difficulty,
      explanation: `${dividend} ÷ ${divisor} = ${answer} (want ${divisor} × ${answer} = ${dividend})`
    }
  }

  const generateFractions = (id: string, difficulty: 'easy' | 'medium' | 'hard', isWordProblem: boolean = false): MathProblem => {
    const numerator = Math.floor(Math.random() * 8) + 1
    const denominator = Math.floor(Math.random() * 8) + numerator + 1
    const answer = parseFloat((numerator / denominator).toFixed(2))
    
    const question = isWordProblem 
      ? `Een pizza is verdeeld in ${denominator} stukken. Je eet ${numerator} stukken. Welk deel van de pizza heb je gegeten? (als decimaal, 2 decimalen)`
      : `Wat is ${numerator}/${denominator} als decimaal? (rond af op 2 decimalen)`
    
    return {
      id,
      question,
      answer,
      type: 'fractions',
      difficulty,
      explanation: `${numerator} ÷ ${denominator} = ${answer}`
    }
  }

  const generateDecimals = (id: string, difficulty: 'easy' | 'medium' | 'hard', isWordProblem: boolean = false): MathProblem => {
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
    const question = isWordProblem 
      ? `Je koopt een boek voor €${a} en een pen voor €${b}. Hoeveel betaal je in totaal?`
      : `${a} + ${b} = ?`
    
    return {
      id,
      question,
      answer,
      type: 'decimals',
      difficulty,
      explanation: `${a} + ${b} = ${answer}`
    }
  }

  // Block and diagnostic test functions
  const startBlock = (block: Block) => {
    setCurrentBlock(block)
    setCurrentChapter(null)
    setIsDiagnosticTestActive(false)
    setShowDiagnosticResults(false)
    setDiagnosticTestAttempts(0)
    setDiagnosticTestScores({})
  }

  // Pas startDiagnosticTest aan om te awaiten op generateProblem
  const startDiagnosticTest = async (block: Block) => {
    setIsLoadingProblem(true)
    const problems: MathProblem[] = []
    for (const chapter of block.chapters) {
      const calcProblem = await generateProblem(chapter.problemTypes, chapter.difficulty, false, chapter.id, chapter.id, useGeminiContext)
      problems.push(calcProblem)
      const wordProblem = await generateProblem(chapter.problemTypes, chapter.difficulty, true, chapter.id, chapter.id, useGeminiContext)
      problems.push(wordProblem)
    }
    const shuffledProblems = problems.sort(() => Math.random() - 0.5)
    setDiagnosticTestProblems(shuffledProblems)
    setDiagnosticTestCurrentProblemIndex(0)
    setCurrentProblem(shuffledProblems[0])
    setIsDiagnosticTestActive(true)
    setShowDiagnosticResults(false)
    setUserAnswer('')
    setShowResult(false)
    setShowExplanation(false)
    const initialScores: Record<string, { correct: number, total: number }> = {}
    block.chapters.forEach(chapter => {
      initialScores[chapter.id] = { correct: 0, total: 0 }
    })
    setDiagnosticTestScores(initialScores)
    setDiagnosticTestAttempts(prev => prev + 1)
    setIsLoadingProblem(false)
  }

  const submitDiagnosticAnswer = () => {
    if (!currentProblem || !isDiagnosticTestActive) return
    
    const userNum = parseFloat(userAnswer) || 0
    const correct = Math.abs(userNum - currentProblem.answer) < 0.01
    
    // Update scores for the chapter
    if (currentProblem.sourceChapterId) {
      setDiagnosticTestScores(prev => ({
        ...prev,
        [currentProblem.sourceChapterId!]: {
          correct: prev[currentProblem.sourceChapterId!].correct + (correct ? 1 : 0),
          total: prev[currentProblem.sourceChapterId!].total + 1
        }
      }))
    }
    
    setIsCorrect(correct)
    setShowResult(true)
    
    // Move to next problem after a delay
    setTimeout(() => {
      const nextIndex = diagnosticTestCurrentProblemIndex + 1
      if (nextIndex < diagnosticTestProblems.length) {
        setDiagnosticTestCurrentProblemIndex(nextIndex)
        setCurrentProblem(diagnosticTestProblems[nextIndex])
        setUserAnswer('')
        setShowResult(false)
        setShowExplanation(false)
        setIsCorrect(false)
      } else {
        // Test completed
        setShowDiagnosticResults(true)
        setIsDiagnosticTestActive(false)
      }
    }, 2000)
  }

  const calculateDiagnosticTotalScore = (): number => {
    const totalCorrect = Object.values(diagnosticTestScores).reduce((sum, score) => sum + score.correct, 0)
    const totalQuestions = Object.values(diagnosticTestScores).reduce((sum, score) => sum + score.total, 0)
    return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  }

  const retryDiagnosticTest = () => {
    if (currentBlock) {
      startDiagnosticTest(currentBlock)
    }
  }

  const passDiagnosticTest = () => {
    setShowDiagnosticResults(false)
    setIsDiagnosticTestActive(false)
  }

  const startChapter = (chapter: Chapter) => {
    setCurrentChapter(chapter)
    setSelectedType(chapter.problemTypes[0])
    setSelectedDifficulty(chapter.difficulty)
    setIsDiagnosticTestActive(false)
    setShowDiagnosticResults(false)
    setCurrentProblem(null)
    setUserAnswer('')
    setShowResult(false)
    setShowExplanation(false)
    setIsCorrect(false)
    setSocraticHint(null)
    setIsLoadingHint(false)
    setTimeout(() => { startNewProblem() }, 0)
  }

  // Pas startNewProblem aan om te awaiten op generateProblem en een loading state te tonen
  const [isLoadingProblem, setIsLoadingProblem] = useState(false)

  const startNewProblem = async () => {
    setIsLoadingProblem(true)
    let problem: MathProblem
    let isWordProblem = false
    let types: MathProblem['type'][]

    if (currentChapter && currentChapter.id === 'chapter1') {
      types = ['addition', 'subtraction'] as MathProblem['type'][]
      if (selectedDifficulty === 'medium' && Math.random() < 0.4) {
        isWordProblem = true
      }
      if (selectedDifficulty === 'hard' && Math.random() < 0.6) {
        isWordProblem = true
      }
      problem = await generateProblem(types, selectedDifficulty, isWordProblem, 'chapter1', 'chapter1', useGeminiContext)
    } else if (currentChapter) {
      types = currentChapter.problemTypes as MathProblem['type'][]
      problem = await generateProblem(types, selectedDifficulty, false, currentChapter.id, currentChapter.id, useGeminiContext)
    } else {
      types = selectedType === 'mixed' 
        ? (['addition', 'subtraction', 'multiplication', 'division'] as MathProblem['type'][])
        : ([selectedType] as MathProblem['type'][])
      problem = await generateProblem(types, selectedDifficulty, false, undefined, undefined, useGeminiContext)
    }

    setCurrentProblem(problem)
    setUserAnswer('')
    setShowResult(false)
    setShowExplanation(false)
    setIsCorrect(false)
    setIsLoadingProblem(false)
    setSocraticHint(null)
    setIsLoadingHint(false)

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
    
    if (isDiagnosticTestActive) {
      submitDiagnosticAnswer()
      return
    }
    
    setIsTimerActive(false)
    const userNum = parseFloat(userAnswer)
    const correct = Math.abs(userNum - currentProblem.answer) < 0.01
    
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

  const backToBlockSelection = () => {
    setCurrentBlock(null)
    setCurrentChapter(null)
    setIsDiagnosticTestActive(false)
    setShowDiagnosticResults(false)
  }

  const backToBlockOverview = () => {
    setCurrentChapter(null)
    setIsDiagnosticTestActive(false)
    setShowDiagnosticResults(false)
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

  // Haal de tip altijd op bij elke nieuwe foutpoging
  useEffect(() => {
    if (showResult && !isCorrect && currentProblem && userAnswer !== '') {
      setIsLoadingHint(true)
      setSocraticHint(null)
      generateSocraticHint({ question: currentProblem.question, answer: currentProblem.answer })
        .then(hint => setSocraticHint(hint))
        .finally(() => setIsLoadingHint(false))
    } else {
      setSocraticHint(null)
      setIsLoadingHint(false)
    }
  }, [showResult, isCorrect, userAnswer, currentProblem])

  // Render block selection screen
  if (!currentBlock) {
    return (
      <div className="max-w-4xl mx-auto">
        {!currentBlock && !currentChapter && (
          <div className="flex items-center justify-end mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useGeminiContext}
                onChange={e => setUseGeminiContext(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700 text-sm">Gebruik Gemini 2.5 Flash voor contextopgaven</span>
            </label>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Kies een blok om te starten</h2>
          <p className="text-gray-600 mb-8">Elk blok begint met een diagnostische toets om je niveau te bepalen</p>
          
          <div className="grid gap-6">
            {BLOCKS.map(block => (
              <div key={block.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
                <h3 className="text-2xl font-bold text-blue-600 mb-3">{block.title}</h3>
                <p className="text-gray-600 mb-4">{block.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  {block.chapters.length} hoofdstukken
                </div>
                <button
                  onClick={() => startBlock(block)}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start {block.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render diagnostic test results
  if (showDiagnosticResults) {
    const totalScore = calculateDiagnosticTotalScore()
    const passed = totalScore >= 70
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className={`text-6xl mb-4 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
              {passed ? '🎉' : '📚'}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Diagnostische Toets Resultaten
            </h2>
            <div className={`text-4xl font-bold mb-4 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
              {totalScore}%
            </div>
            <p className="text-lg text-gray-600 mb-6">
              {passed 
                ? 'Gefeliciteerd! Je hebt de toets gehaald en kunt door naar de hoofdstukken.'
                : 'Je hebt nog wat extra oefening nodig. Probeer de toets opnieuw of oefen met de hoofdstukken.'
              }
            </p>
          </div>

          {/* Chapter scores */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resultaten per hoofdstuk:</h3>
            <div className="grid gap-4">
              {currentBlock.chapters.map(chapter => {
                const chapterScore = diagnosticTestScores[chapter.id]
                const percentage = chapterScore ? Math.round((chapterScore.correct / chapterScore.total) * 100) : 0
                return (
                  <div key={chapter.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-800">{chapter.title}</h4>
                      <p className="text-sm text-gray-600">{chapter.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                        {percentage}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {chapterScore?.correct || 0}/{chapterScore?.total || 0}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={retryDiagnosticTest}
              className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              🔄 Toets Opnieuw Doen (Poging {diagnosticTestAttempts + 1})
            </button>
            <button
              onClick={passDiagnosticTest}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              📚 Ga naar Hoofdstukken
            </button>
            <button
              onClick={backToBlockSelection}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Terug naar Blokken
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render block overview with chapters
  if (currentBlock && !currentChapter && !isDiagnosticTestActive) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{currentBlock.title}</h2>
              <p className="text-gray-600 mt-2">{currentBlock.description}</p>
            </div>
            <button
              onClick={backToBlockSelection}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Terug
            </button>
          </div>

          {/* Diagnostic test section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-800 mb-3">📋 Diagnostische Toets</h3>
            <p className="text-blue-700 mb-4">
              Begin met een diagnostische toets om je niveau te bepalen. Je moet minimaal 70% halen om door te gaan.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-600">
                • {currentBlock.chapters.length * 2} vragen (mix van berekeningen en vraagstukken)<br/>
                • Minimaal 70% om te slagen<br/>
                • Onbeperkt aantal pogingen
              </div>
              <button
                onClick={() => startDiagnosticTest(currentBlock)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                🚀 Start Diagnostische Toets
              </button>
            </div>
          </div>

          {/* Chapters */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Hoofdstukken</h3>
            <div className="grid gap-4">
              {currentBlock.chapters.map(chapter => (
                <div key={chapter.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{chapter.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{chapter.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(chapter.difficulty)}`}>
                          {chapter.difficulty === 'easy' ? 'Makkelijk' : 
                           chapter.difficulty === 'medium' ? 'Gemiddeld' : 'Moeilijk'}
                        </span>
                        <div className="flex space-x-1">
                          {chapter.problemTypes.map(type => (
                            <span key={type} className="text-lg" title={type}>
                              {getTypeEmoji(type)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => startChapter(chapter)}
                      className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Oefen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render diagnostic test in progress
  if (isDiagnosticTestActive && currentProblem) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Diagnostische Toets Voortgang</span>
            <span className="text-sm text-gray-500">
              {diagnosticTestCurrentProblemIndex + 1} van {diagnosticTestProblems.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((diagnosticTestCurrentProblemIndex + 1) / diagnosticTestProblems.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Problem */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-blue-600 font-semibold mb-2">📋 Diagnostische Toets</div>
            <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {currentProblem.question}
            </div>
            
            {isLoadingProblem && (
              <div className="text-center text-blue-600 text-lg mb-4 animate-pulse">Nieuwe som wordt geladen...</div>
            )}

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
                />
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="w-full mt-4 px-6 py-3 bg-blue-600 text-white text-xl font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Controleren
                </button>
              </div>
            )}

            {showResult && (
              <div className="text-center">
                <div className={`text-6xl mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✅' : '❌'}
                </div>
                <div className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? 'Goed gedaan!' : `Het juiste antwoord is ${currentProblem.answer}`}
                </div>
                {!isCorrect && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4 mt-2">
                    {isLoadingHint && <span>Tip wordt opgehaald...</span>}
                    {!isLoadingHint && socraticHint && <span><strong>Tip:</strong> {socraticHint}</span>}
                    {!isLoadingHint && !socraticHint && <span><strong>Tip:</strong> Er is geen tip beschikbaar.</span>}
                  </div>
                )}
                {isCorrect && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4 mt-2">
                    <strong>Het juiste antwoord is:</strong> {currentProblem?.answer}
                  </div>
                )}
                {!isCorrect && (
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                    <button
                      onClick={() => {
                        setUserAnswer('')
                        setShowResult(false)
                        setShowExplanation(false)
                        setIsCorrect(false)
                        setSocraticHint(null)
                        setIsLoadingHint(false)
                      }}
                      className="px-6 py-3 bg-yellow-500 text-white text-lg font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                    >
                      Probeer het opnieuw
                    </button>
                    <button
                      onClick={startNewProblem}
                      className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                      Volgende som
                    </button>
                  </div>
                )}
                {isCorrect && (
                  <button
                    onClick={startNewProblem}
                    className="px-8 py-3 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Volgende som
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render chapter practice mode
  return (
    <div className="max-w-4xl mx-auto">
      {/* Chapter header */}
      {currentChapter && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentChapter.title}</h2>
              <p className="text-gray-600">{currentChapter.description}</p>
            </div>
            <button
              onClick={backToBlockOverview}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Terug naar {currentBlock?.title}
            </button>
          </div>
        </div>
      )}

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

          {/* Problem Type - disabled in chapter mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rekensoort</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={!!currentChapter}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              {currentChapter ? (
                <option value={currentChapter.problemTypes[0]}>
                  {currentChapter.problemTypes.map(type => getTypeEmoji(type)).join(' ')} {currentChapter.title}
                </option>
              ) : (
                <>
                  <option value="mixed">🎲 Gemengd</option>
                  <option value="addition">➕ Optellen</option>
                  <option value="subtraction">➖ Aftrekken</option>
                  <option value="multiplication">✖️ Vermenigvuldigen</option>
                  <option value="division">➗ Delen</option>
                  <option value="fractions">🍰 Breuken</option>
                  <option value="decimals">🔢 Kommagetallen</option>
                </>
              )}
            </select>
          </div>

          {/* Difficulty - disabled in chapter mode */}
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
      {currentChapter && currentProblem && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
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
            
            {isLoadingProblem && (
              <div className="text-center text-blue-600 text-lg mb-4 animate-pulse">Nieuwe som wordt geladen...</div>
            )}

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
                />
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="w-full mt-4 px-6 py-3 bg-blue-600 text-white text-xl font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                {isCorrect ? 'Goed gedaan!' : 'Helaas, probeer het nog eens!'}
              </div>
              
              <div className="text-lg text-gray-600 mb-4">{getEncouragement()}</div>

              {!isCorrect && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 mt-2">
                  {isLoadingHint && <span>Tip wordt opgehaald...</span>}
                  {!isLoadingHint && socraticHint && <span><strong>Tip:</strong> {socraticHint}</span>}
                  {!isLoadingHint && !socraticHint && <span><strong>Tip:</strong> Er is geen tip beschikbaar.</span>}
                </div>
              )}

              {isCorrect && (
                <div className="bg-green-50 p-4 rounded-lg mb-4 mt-2">
                  <strong>Het juiste antwoord is:</strong> {currentProblem?.answer}
                </div>
              )}

              {!isCorrect && (
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                  <button
                    onClick={() => {
                      setUserAnswer('')
                      setShowResult(false)
                      setShowExplanation(false)
                      setIsCorrect(false)
                      setSocraticHint(null)
                      setIsLoadingHint(false)
                    }}
                    className="px-6 py-3 bg-yellow-500 text-white text-lg font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                  >
                    Probeer het opnieuw
                  </button>
                  <button
                    onClick={startNewProblem}
                    className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Volgende som
                  </button>
                </div>
              )}
              {isCorrect && (
                <button
                  onClick={startNewProblem}
                  className="px-8 py-3 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Volgende som
                </button>
              )}
            </div>
          )}
        </div>
      )}

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