"use client"
import { useEffect, useRef, useState } from "react"
import { RotateCcw, Play, Pause } from "lucide-react"

const GRID_SIZE = 23
const CELL_SIZE_BASE = 23 // Base cell size, will be adjusted for smaller screens
const INITIAL_SPEED = 150

const directions = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

const SnakeGame = () => {
  // State for responsive sizing
  const [cellSize, setCellSize] = useState(CELL_SIZE_BASE)
  const [canvasSize, setCanvasSize] = useState(GRID_SIZE * CELL_SIZE_BASE)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  )

  const canvasRef = useRef(null)
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 5, y: 5 })
  const [direction, setDirection] = useState(directions.RIGHT)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const directionRef = useRef(direction)
  const gameLoopRef = useRef(null)

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initialize on first render

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Adjust canvas and cell size based on window width
  useEffect(() => {
    if (typeof window === "undefined") return

    let newCellSize = CELL_SIZE_BASE
    
    // Responsive adjustments
    if (windowWidth < 640) { // sm breakpoint
      newCellSize = 14
    } else if (windowWidth < 768) { // md breakpoint
      newCellSize = 18
    }

    setCellSize(newCellSize)
    setCanvasSize(GRID_SIZE * newCellSize)
  }, [windowWidth])

  // Initialize game
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedHighScore = localStorage.getItem("snakeHighScore")
      if (storedHighScore) setHighScore(Number.parseInt(storedHighScore))
    }

    generateFood()

    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current)
    }
  }, [])

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) {
        setGameStarted(true)
        return
      }

      switch (e.key) {
        case "ArrowUp":
          if (directionRef.current !== directions.DOWN) {
            setDirection(directions.UP)
            directionRef.current = directions.UP
          }
          break
        case "ArrowDown":
          if (directionRef.current !== directions.UP) {
            setDirection(directions.DOWN)
            directionRef.current = directions.DOWN
          }
          break
        case "ArrowLeft":
          if (directionRef.current !== directions.RIGHT) {
            setDirection(directions.LEFT)
            directionRef.current = directions.LEFT
          }
          break
        case "ArrowRight":
          if (directionRef.current !== directions.LEFT) {
            setDirection(directions.RIGHT)
            directionRef.current = directions.RIGHT
          }
          break
        case " ":
          togglePause()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameStarted])

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake]
        const head = { ...newSnake[0] }

        head.x += direction.x
        head.y += direction.y

        // Check for collisions
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          newSnake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true)
          if (score > highScore) {
            setHighScore(score)
            localStorage.setItem("snakeHighScore", score.toString())
          }
          return prevSnake
        }

        // Check if snake eats food
        if (head.x === food.x && head.y === food.y) {
          setScore((prevScore) => prevScore + 1)
          generateFood()
          newSnake.unshift(head) // Add new head without removing tail
          return newSnake
        }

        // Normal movement
        newSnake.unshift(head)
        newSnake.pop()
        return newSnake
      })

      gameLoopRef.current = setTimeout(moveSnake, INITIAL_SPEED - Math.min(score * 5, 100))
    }

    gameLoopRef.current = setTimeout(moveSnake, INITIAL_SPEED - Math.min(score * 5, 100))

    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current)
    }
  }, [direction, gameOver, isPaused, food, score, highScore, gameStarted])

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Update canvas dimensions if they've changed
    if (canvas.width !== canvasSize) {
      canvas.width = canvasSize
      canvas.height = canvasSize
    }

    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // Draw background
    ctx.fillStyle = "#111"
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, canvasSize)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(canvasSize, i * cellSize)
      ctx.stroke()
    }

    // Draw food with glow
    ctx.shadowBlur = cellSize / 2
    ctx.shadowColor = "#a855f7"
    ctx.fillStyle = "#a855f7"
    ctx.beginPath()
    ctx.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Draw snake
    snake.forEach((segment, index) => {
      // Create gradient for snake body
      const gradient = ctx.createLinearGradient(
        segment.x * cellSize,
        segment.y * cellSize,
        segment.x * cellSize + cellSize,
        segment.y * cellSize + cellSize,
      )

      // Head is purple, body gradually transitions to blue
      if (index === 0) {
        gradient.addColorStop(0, "#a855f7")
        gradient.addColorStop(1, "#8b5cf6")
      } else {
        const ratio = 1 - index / snake.length
        gradient.addColorStop(0, `rgba(139, 92, 246, ${0.5 + ratio * 0.5})`)
        gradient.addColorStop(1, `rgba(59, 130, 246, ${0.5 + ratio * 0.5})`)
      }

      ctx.fillStyle = gradient
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2)
    })

    // Draw game instructions if not started
    if (!gameStarted && !gameOver) {
      // Adjust font size for smaller screens
      const fontSize = Math.max(12, Math.floor(cellSize * 0.7))
      ctx.fillStyle = "white"
      ctx.font = `${fontSize}px Geist, sans-serif`
      ctx.textAlign = "center"
      ctx.fillText("Press any arrow key to start", canvasSize / 2, canvasSize / 2 - fontSize)
      ctx.fillText("Use arrow keys to move", canvasSize / 2, canvasSize / 2 + fontSize/2)
      ctx.fillText("Space to pause", canvasSize / 2, canvasSize / 2 + fontSize*2)
      ctx.fillText("(Game works only in Large Screens)", canvasSize / 2, canvasSize / 2 + fontSize*2+fontSize+4)
    }

    // Draw game over message
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvasSize, canvasSize)

      const titleSize = Math.max(16, Math.floor(cellSize * 1))
      const textSize = Math.max(12, Math.floor(cellSize * 0.7))
      
      ctx.fillStyle = "white"
      ctx.font = `${titleSize}px Geist, sans-serif`
      ctx.textAlign = "center"
      ctx.fillText("Game Over!", canvasSize / 2, canvasSize / 2 - titleSize)
      
      ctx.font = `${textSize}px Geist, sans-serif`
      ctx.fillText(`Score: ${score}`, canvasSize / 2, canvasSize / 2 + textSize/2)
      ctx.fillText("Press Reset to play again", canvasSize / 2, canvasSize / 2 + textSize*2)
    }

    // Draw pause overlay
    if (isPaused && !gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvasSize, canvasSize)

      const titleSize = Math.max(16, Math.floor(cellSize * 1))
      const textSize = Math.max(12, Math.floor(cellSize * 0.7))
      
      ctx.fillStyle = "white"
      ctx.font = `${titleSize}px Geist, sans-serif`
      ctx.textAlign = "center"
      ctx.fillText("Paused", canvasSize / 2, canvasSize / 2)
      
      ctx.font = `${textSize}px Geist, sans-serif`
      ctx.fillText("Press Space to resume", canvasSize / 2, canvasSize / 2 + textSize*1.5)
    }
  }, [snake, food, gameOver, isPaused, score, gameStarted, cellSize, canvasSize])

  const generateFood = () => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
      // Make sure food doesn't spawn on snake
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))

    setFood(newFood)
  }

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setDirection(directions.RIGHT)
    directionRef.current = directions.RIGHT
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
    setGameStarted(false)
    generateFood()
  }

  const togglePause = () => {
    if (!gameStarted || gameOver) return
    setIsPaused(!isPaused)
  }

  return (
    <div className="flex flex-col md:flex-row w-full gap-8 items-center justify-center p-4">
      <div className="w-full md:w-auto space-y-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">Snake</h1>
          <p className="text-white/70 text-sm md:text-base">Use arrow keys to move, space to pause</p>
        </div>

        <div className="flex justify-center gap-4 md:gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-2 md:p-3 w-20 md:w-24">
            <div className="text-xs md:text-sm text-white/70">Score</div>
            <div className="text-xl md:text-2xl font-bold text-purple-400">{score}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-2 md:p-3 w-20 md:w-24">
            <div className="text-xs md:text-sm text-white/70">Best</div>
            <div className="text-xl md:text-2xl font-bold text-blue-400">{highScore}</div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-3 md:gap-4">
          <button
            onClick={resetGame}
            className="flex flex-1 md:w-full justify-center items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm md:text-base"
          >
            <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
            Reset
          </button>

          <button
            onClick={togglePause}
            disabled={!gameStarted || gameOver}
            className={`
              flex flex-1 md:w-full justify-center items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base
              ${
                !gameStarted || gameOver
                  ? "bg-white/5 text-white/40 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              }
            `}
          >
            {isPaused ? <Play className="h-3 w-3 md:h-4 md:w-4" /> : <Pause className="h-3 w-3 md:h-4 md:w-4" />}
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <div className="relative w-full md:w-auto flex justify-center">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="border border-white/10 rounded-lg backdrop-blur-sm max-w-full"
          style={{ 
            width: canvasSize, 
            height: canvasSize,
            maxWidth: '100%',
            maxHeight: '100vw'
          }}
        />
      </div>
    </div>
  )
}

export default SnakeGame