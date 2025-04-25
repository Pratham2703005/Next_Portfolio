"use client"
import { useRef, useEffect, useState } from "react"
import { RotateCcw } from "lucide-react"

const canvasWidth = 800
const canvasHeight = 500
const paddleHeight = 100
const paddleWidth = 10
const ballSize = 12

const PongGame = () => {
  const canvasRef = useRef(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [botScore, setBotScore] = useState(0)
  const [gameActive, setGameActive] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const requestRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")

    let playerY = canvasHeight / 2 - paddleHeight / 2
    let botY = canvasHeight / 2 - paddleHeight / 2
    const botSpeed = 4.5

    const ball = {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      dx: 5,
      dy: 3,
      speed: 5,
    }

    const drawRect = (x, y, w, h, color) => {
      ctx.fillStyle = color
      ctx.fillRect(x, y, w, h)
    }

    const drawCircle = (x, y, r, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
    }

    const drawNet = () => {
      for (let i = 0; i < canvasHeight; i += 20) {
        drawRect(canvasWidth / 2 - 1, i, 2, 10, "rgba(255, 255, 255, 0.3)")
      }
    }

    const drawScore = () => {
      ctx.fillStyle = "white"
      ctx.font = "32px Geist, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(playerScore.toString(), canvasWidth / 4, 50)
      ctx.fillText(botScore.toString(), (3 * canvasWidth) / 4, 50)
    }

    const resetBall = () => {
      ball.x = canvasWidth / 2
      ball.y = canvasHeight / 2
      ball.dx = -ball.dx
      ball.dy = 3 * (Math.random() > 0.5 ? 1 : -1)
      ball.speed = 5
    }

    const render = () => {
      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Draw game elements
      drawNet()
      drawScore()

      // Draw paddles with gradient
      const playerGradient = ctx.createLinearGradient(0, playerY, paddleWidth, playerY + paddleHeight)
      playerGradient.addColorStop(0, "#a855f7")
      playerGradient.addColorStop(1, "#6366f1")
      drawRect(0, playerY, paddleWidth, paddleHeight, playerGradient)

      const botGradient = ctx.createLinearGradient(canvasWidth - paddleWidth, botY, canvasWidth, botY + paddleHeight)
      botGradient.addColorStop(0, "#3b82f6")
      botGradient.addColorStop(1, "#2563eb")
      drawRect(canvasWidth - paddleWidth, botY, paddleWidth, paddleHeight, botGradient)

      // Draw ball with glow effect
      ctx.shadowBlur = 15
      ctx.shadowColor = "rgba(255, 255, 255, 0.7)"
      drawCircle(ball.x, ball.y, ballSize, "#ffffff")
      ctx.shadowBlur = 0

      // Draw instructions if game not started
      if (!gameStarted) {
        ctx.fillStyle = "white"
        ctx.font = "20px Geist, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Move your mouse up and down to control the paddle", canvasWidth / 2, canvasHeight / 2 - 30)
        ctx.fillText("Click anywhere to start", canvasWidth / 2, canvasHeight / 2 + 10)
      }
    }

    const calculateBounceAngle = (ballY, paddleY) => {
      const relativeIntersectY = ballY - (paddleY + paddleHeight / 2)
      const normalized = relativeIntersectY / (paddleHeight / 2)
      const maxBounceAngle = Math.PI / 3 // 60 degrees
      return normalized * maxBounceAngle
    }

    const update = () => {
      if (!gameStarted || !gameActive) return

      ball.x += ball.dx
      ball.y += ball.dy

      // Bounce off top/bottom with slight randomization
      if (ball.y < ballSize || ball.y > canvasHeight - ballSize) {
        ball.dy *= -1
        // Add slight randomization to make game more unpredictable
        ball.dy += (Math.random() - 0.5) * 0.5
      }

      // Player paddle collision
      if (ball.x < paddleWidth + ballSize && ball.y > playerY && ball.y < playerY + paddleHeight) {
        const angle = calculateBounceAngle(ball.y, playerY)
        ball.dx = ball.speed * Math.cos(angle)
        ball.dy = ball.speed * Math.sin(angle)

        // Increase ball speed slightly with each hit
        ball.speed += 0.2
      }

      // Bot paddle collision
      if (ball.x > canvasWidth - paddleWidth - ballSize && ball.y > botY && ball.y < botY + paddleHeight) {
        const angle = calculateBounceAngle(ball.y, botY)
        ball.dx = -ball.speed * Math.cos(angle)
        ball.dy = ball.speed * Math.sin(angle)

        // Increase ball speed slightly with each hit
        ball.speed += 0.2
      }

      // Score conditions
      if (ball.x < 0) {
        setBotScore((prev) => prev + 1)
        resetBall()
      } else if (ball.x > canvasWidth) {
        setPlayerScore((prev) => prev + 1)
        resetBall()
      }

      // Bot AI - follows the ball with some delay
      const botCenter = botY + paddleHeight / 2
      const targetY = ball.y

      // Make bot slightly imperfect
      if (botCenter < targetY - 15) botY += botSpeed
      if (botCenter > targetY + 15) botY -= botSpeed

      // Keep bot paddle within canvas
      botY = Math.max(0, Math.min(canvasHeight - paddleHeight, botY))
    }

    const gameLoop = () => {
      update()
      render()
      requestRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      playerY = (e.clientY - rect.top) * (canvasHeight / rect.height) - paddleHeight / 2
      playerY = Math.max(0, Math.min(canvasHeight - paddleHeight, playerY))
    }

    const handleClick = () => {
      if (!gameStarted) {
        setGameStarted(true)
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("click", handleClick)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
      cancelAnimationFrame(requestRef.current)
    }
  }, [gameActive, gameStarted, playerScore, botScore])

  const resetGame = () => {
    setPlayerScore(0)
    setBotScore(0)
    setGameActive(true)
    setGameStarted(false)
  }

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex justify-between w-3xl">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Ping Pong</h1>
          <p className="text-white/70 mb-6">Move your mouse to control the paddle</p>
        </div>
        <div className="flex items-center"> 
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Game
        </button>
        </div>
      </div>

      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-white/10 rounded-lg bg-black/50 backdrop-blur-sm"
        />
      </div>

      
    </div>
  )
}

export default PongGame
