"use client"
import { useEffect, useRef, useState } from "react"
import { RotateCcw, Play, Pause } from "lucide-react"

const GRID_SIZE = 23
const CELL_SIZE = 23
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE
const INITIAL_SPEED = 150

const directions = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

const SnakeGame = () => {
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

    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw background
    ctx.fillStyle = "#111"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE)
      ctx.stroke()
    }

    // Draw food with glow
    ctx.shadowBlur = 10
    ctx.shadowColor = "#a855f7"
    ctx.fillStyle = "#a855f7"
    ctx.beginPath()
    ctx.arc(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Draw snake
    snake.forEach((segment, index) => {
      // Create gradient for snake body
      const gradient = ctx.createLinearGradient(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        segment.x * CELL_SIZE + CELL_SIZE,
        segment.y * CELL_SIZE + CELL_SIZE,
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
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2)
    })

    // Draw game instructions if not started
    if (!gameStarted && !gameOver) {
      ctx.fillStyle = "white"
      ctx.font = "16px Geist, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Press any arrow key to start", CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20)
      ctx.fillText("Use arrow keys to move", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 10)
      ctx.fillText("Space to pause", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 40)
    }

    // Draw game over message
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

      ctx.fillStyle = "white"
      ctx.font = "24px Geist, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Game Over!", CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20)
      ctx.font = "16px Geist, sans-serif"
      ctx.fillText(`Score: ${score}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 10)
      ctx.fillText("Press Reset to play again", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 40)
    }

    // Draw pause overlay
    if (isPaused && !gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

      ctx.fillStyle = "white"
      ctx.font = "24px Geist, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Paused", CANVAS_SIZE / 2, CANVAS_SIZE / 2)
      ctx.font = "16px Geist, sans-serif"
      ctx.fillText("Press Space to resume", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 30)
    }
  }, [snake, food, gameOver, isPaused, score, gameStarted])

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
    <div className="flex h-full justify-around items-center">
      <div className="space-y-2" > 
        <h1 className="text-3xl text-center font-bold mb-2 text-white">Snake</h1>
        <p className="text-white/70 mb-6">Use arrow keys to move, space to pause</p>

        <div className="flex justify-center gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 w-24">
            <div className="text-sm text-white/70">Score</div>
            <div className="text-2xl font-bold text-purple-400">{score}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 w-24">
            <div className="text-sm text-white/70">Best</div>
            <div className="text-2xl font-bold text-blue-400">{highScore}</div>
          </div>
        </div>

        
          <button
            onClick={resetGame}
            className="flex w-full justify-center items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            onClick={togglePause}
            disabled={!gameStarted || gameOver}
            className={`
              flex w-full justify-center items-center gap-2 px-6 py-3 rounded-lg transition-colors
              ${
                !gameStarted || gameOver
                  ? "bg-white/5 text-white/40 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              }
            `}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {isPaused ? "Resume" : "Pause"}
          </button>
        
      </div>

      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border border-white/10 rounded-lg backdrop-blur-sm"
        />
      </div>

     
    </div>
  )
}

export default SnakeGame
