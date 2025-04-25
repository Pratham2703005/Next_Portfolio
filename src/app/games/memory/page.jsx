"use client"
import { useState, useEffect } from "react"
import { RotateCcw, Clock, Trophy } from "lucide-react"

// Card icons (using Lucide React icons as emoji representations)
const cardIcons = ["🍎", "🍌", "🍒", "🍓", "🍊", "🍇", "🍉", "🥝", "🍍", "🥭", "🍑", "🍐", "🥥", "🥑", "🍋", "🍈"]

const MemoryGame = () => {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [bestTime, setBestTime] = useState(null)
  const [bestMoves, setBestMoves] = useState(null)
  const [difficulty, setDifficulty] = useState("medium") // easy, medium, hard

  // Initialize game
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBestTime = localStorage.getItem("memoryBestTime")
      const storedBestMoves = localStorage.getItem("memoryBestMoves")
      if (storedBestTime) setBestTime(Number.parseInt(storedBestTime))
      if (storedBestMoves) setBestMoves(Number.parseInt(storedBestMoves))
    }

    initializeGame()
  }, [difficulty])

  // Timer
  useEffect(() => {
    let interval = null

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1)
      }, 1000)
    } else if (!isRunning) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isRunning])

  // Check for game completion
  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setIsRunning(false)
      setGameOver(true)

      // Update best scores
      if (bestTime === null || timer < bestTime) {
        setBestTime(timer)
        localStorage.setItem("memoryBestTime", timer.toString())
      }

      if (bestMoves === null || moves < bestMoves) {
        setBestMoves(moves)
        localStorage.setItem("memoryBestMoves", moves.toString())
      }
    }
  }, [matched, cards.length, timer, moves, bestTime, bestMoves])

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped

      if (cards[first].icon === cards[second].icon) {
        setMatched((prev) => [...prev, first, second])
      }

      // Flip cards back after a delay
      const timeout = setTimeout(() => {
        setFlipped([])
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [flipped, cards])

  const initializeGame = () => {
    // Determine number of pairs based on difficulty
    let numPairs
    switch (difficulty) {
      case "easy":
        numPairs = 6
        break
      case "hard":
        numPairs = 16
        break
      case "medium":
      default:
        numPairs = 10
        break
    }

    // Create pairs of cards
    const selectedIcons = cardIcons.slice(0, numPairs)
    const cardPairs = [...selectedIcons, ...selectedIcons]

    // Shuffle cards
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }))

    setCards(shuffledCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTimer(0)
    setGameOver(false)
    setIsRunning(false)
  }

  const handleCardClick = (index) => {
    // Start timer on first card click
    if (!isRunning && !gameOver) {
      setIsRunning(true)
    }

    // Ignore click if card is already flipped or matched
    if (flipped.includes(index) || matched.includes(index)) {
      return
    }

    // Ignore if two cards are already flipped
    if (flipped.length === 2) {
      return
    }

    // Flip the card
    setFlipped((prev) => [...prev, index])

    // Count move when second card is flipped
    if (flipped.length === 1) {
      setMoves((prev) => prev + 1)
    }
  }

  const resetGame = () => {
    initializeGame()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getGridClass = () => {
    switch (difficulty) {
      case "easy":
        return "grid-cols-3 sm:grid-cols-4"
      case "hard":
        return "grid-cols-4 sm:grid-cols-8"
      case "medium":
      default:
        return "grid-cols-4 sm:grid-cols-5"
    }
  }


  return (
    <div className="flex justify-around h-full max-w-5xl mx-auto items-center">
      <div className="space-y-1 w-1/2 text-center p-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Memory Cards</h1>
        <p className="text-white/70 mb-6">Match pairs of cards to win</p>

        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg py-2 px-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-white/70" />
            <div className="text-xl font-mono text-white">{formatTime(timer)}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg py-2 px-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-white/70" />
            <div className="text-xl font-mono text-white">{moves}</div>
          </div>
        </div>
        <div className="mb-6 flex justify-center gap-2">
          <button
            onClick={() => setDifficulty("easy")}
            className={`px-3 py-1 rounded-md text-sm ${
              difficulty === "easy" ? "bg-purple-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setDifficulty("medium")}
            className={`px-3 py-1 rounded-md text-sm ${
              difficulty === "medium" ? "bg-purple-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setDifficulty("hard")}
            className={`px-3 py-1 rounded-md text-sm ${
              difficulty === "hard" ? "bg-purple-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Hard
          </button>
      </div>
            {gameOver && (
              <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-center">
                <div className="text-xl font-bold text-white mb-2">Game Complete!</div>
                <div className="text-white/70">
                  Time: {formatTime(timer)} | Moves: {moves}
                </div>
                {(bestTime !== null || bestMoves !== null) && (
                  <div className="mt-2 text-sm text-purple-400">
                    Best Time: {bestTime !== null ? formatTime(bestTime) : "N/A"} | Best Moves:{" "}
                    {bestMoves !== null ? bestMoves : "N/A"}
                  </div>
                )}
              </div>
            )}
      
          <div className="flex justify-center">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-12 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              New Game
            </button>

          </div>     

      </div>


      <div className={`grid ${getGridClass()} gap-3 mb-6 w-1/2`}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`
              aspect-square flex items-center justify-center text-5xl rounded-lg cursor-pointer transition-all duration-300 transform
              ${
                flipped.includes(index) || matched.includes(index)
                  ? "bg-purple-500/20 text-white rotate-y-0"
                  : "bg-white/5 text-transparent rotate-y-180"
              }
              ${matched.includes(index) ? "bg-green-500/20" : ""}
              hover:bg-white/10
            `}
            style={{
              perspective: "1000px",
            }}
          >
            {flipped.includes(index) || matched.includes(index) ? card.icon : "?"}
          </div>
        ))}
      </div>

    </div>
  )
}

export default MemoryGame
