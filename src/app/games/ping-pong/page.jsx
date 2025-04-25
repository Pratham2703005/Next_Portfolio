"use client"
import { useRef, useEffect, useState } from "react"
import { RotateCcw } from "lucide-react"

// Base game dimensions
const BASE_WIDTH = 800;
const BASE_HEIGHT = 500;
const BASE_PADDLE_HEIGHT = 100;
const BASE_PADDLE_WIDTH = 10;
const BASE_BALL_SIZE = 12;

const PongGame = () => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [botScore, setBotScore] = useState(0)
  const [gameActive, setGameActive] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [dimensions, setDimensions] = useState({
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    paddleHeight: BASE_PADDLE_HEIGHT,
    paddleWidth: BASE_PADDLE_WIDTH,
    ballSize: BASE_BALL_SIZE,
    scaleFactor: 1
  })
  const requestRef = useRef(null)

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const scaleFactor = Math.min(1, containerWidth / BASE_WIDTH);
      
      setDimensions({
        width: BASE_WIDTH * scaleFactor,
        height: BASE_HEIGHT * scaleFactor,
        paddleHeight: BASE_PADDLE_HEIGHT * scaleFactor,
        paddleWidth: BASE_PADDLE_WIDTH * scaleFactor,
        ballSize: BASE_BALL_SIZE * scaleFactor,
        scaleFactor
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    let playerY = dimensions.height / 2 - dimensions.paddleHeight / 2
    let botY = dimensions.height / 2 - dimensions.paddleHeight / 2
    const botSpeed = 4.5 * dimensions.scaleFactor

    const ball = {
      x: dimensions.width / 2,
      y: dimensions.height / 2,
      dx: 5 * dimensions.scaleFactor,
      dy: 3 * dimensions.scaleFactor,
      speed: 5 * dimensions.scaleFactor,
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
      for (let i = 0; i < dimensions.height; i += 20 * dimensions.scaleFactor) {
        drawRect(dimensions.width / 2 - 1, i, 2, 10 * dimensions.scaleFactor, "rgba(255, 255, 255, 0.3)")
      }
    }

    const drawScore = () => {
      ctx.fillStyle = "white"
      ctx.font = `${32 * dimensions.scaleFactor}px Geist, sans-serif`
      ctx.textAlign = "center"
      ctx.fillText(playerScore.toString(), dimensions.width / 4, 50 * dimensions.scaleFactor)
      ctx.fillText(botScore.toString(), (3 * dimensions.width) / 4, 50 * dimensions.scaleFactor)
    }

    const resetBall = () => {
      ball.x = dimensions.width / 2
      ball.y = dimensions.height / 2
      ball.dx = -ball.dx
      ball.dy = 3 * dimensions.scaleFactor * (Math.random() > 0.5 ? 1 : -1)
      ball.speed = 5 * dimensions.scaleFactor
    }

    const render = () => {
      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Draw game elements
      drawNet()
      drawScore()

      // Draw paddles with gradient
      const playerGradient = ctx.createLinearGradient(
        0, playerY, 
        dimensions.paddleWidth, playerY + dimensions.paddleHeight
      )
      playerGradient.addColorStop(0, "#a855f7")
      playerGradient.addColorStop(1, "#6366f1")
      drawRect(0, playerY, dimensions.paddleWidth, dimensions.paddleHeight, playerGradient)

      const botGradient = ctx.createLinearGradient(
        dimensions.width - dimensions.paddleWidth, botY, 
        dimensions.width, botY + dimensions.paddleHeight
      )
      botGradient.addColorStop(0, "#3b82f6")
      botGradient.addColorStop(1, "#2563eb")
      drawRect(
        dimensions.width - dimensions.paddleWidth, 
        botY, 
        dimensions.paddleWidth, 
        dimensions.paddleHeight, 
        botGradient
      )

      // Draw ball with glow effect
      ctx.shadowBlur = 15 * dimensions.scaleFactor
      ctx.shadowColor = "rgba(255, 255, 255, 0.7)"
      drawCircle(ball.x, ball.y, dimensions.ballSize, "#ffffff")
      ctx.shadowBlur = 0

      // Draw instructions if game not started
      if (!gameStarted) {
        ctx.fillStyle = "white"
        ctx.font = `${20 * dimensions.scaleFactor}px Geist, sans-serif`
        ctx.textAlign = "center"
        
        // Different instructions for touch devices
        if ('ontouchstart' in window) {
          ctx.fillText("Tap and drag to move paddle", dimensions.width / 2, dimensions.height / 2 - 30 * dimensions.scaleFactor)
        } else {
          ctx.fillText("Move your mouse to control the paddle", dimensions.width / 2, dimensions.height / 2 - 30 * dimensions.scaleFactor)
        }
        
        ctx.fillText("Tap to start", dimensions.width / 2, dimensions.height / 2 + 10 * dimensions.scaleFactor)
      }
    }

    const calculateBounceAngle = (ballY, paddleY) => {
      const relativeIntersectY = ballY - (paddleY + dimensions.paddleHeight / 2)
      const normalized = relativeIntersectY / (dimensions.paddleHeight / 2)
      const maxBounceAngle = Math.PI / 3 // 60 degrees
      return normalized * maxBounceAngle
    }

    const update = () => {
      if (!gameStarted || !gameActive) return

      ball.x += ball.dx
      ball.y += ball.dy

      // Bounce off top/bottom with slight randomization
      if (ball.y < dimensions.ballSize || ball.y > dimensions.height - dimensions.ballSize) {
        ball.dy *= -1
        // Add slight randomization to make game more unpredictable
        ball.dy += (Math.random() - 0.5) * 0.5 * dimensions.scaleFactor
      }

      // Player paddle collision
      if (
        ball.x < dimensions.paddleWidth + dimensions.ballSize && 
        ball.y > playerY && 
        ball.y < playerY + dimensions.paddleHeight
      ) {
        const angle = calculateBounceAngle(ball.y, playerY)
        ball.dx = ball.speed * Math.cos(angle)
        ball.dy = ball.speed * Math.sin(angle)

        // Increase ball speed slightly with each hit
        ball.speed += 0.2 * dimensions.scaleFactor
      }

      // Bot paddle collision
      if (
        ball.x > dimensions.width - dimensions.paddleWidth - dimensions.ballSize && 
        ball.y > botY && 
        ball.y < botY + dimensions.paddleHeight
      ) {
        const angle = calculateBounceAngle(ball.y, botY)
        ball.dx = -ball.speed * Math.cos(angle)
        ball.dy = ball.speed * Math.sin(angle)

        // Increase ball speed slightly with each hit
        ball.speed += 0.2 * dimensions.scaleFactor
      }

      // Score conditions
      if (ball.x < 0) {
        setBotScore((prev) => prev + 1)
        resetBall()
      } else if (ball.x > dimensions.width) {
        setPlayerScore((prev) => prev + 1)
        resetBall()
      }

      // Bot AI - follows the ball with some delay
      const botCenter = botY + dimensions.paddleHeight / 2
      const targetY = ball.y

      // Make bot slightly imperfect
      if (botCenter < targetY - 15 * dimensions.scaleFactor) botY += botSpeed
      if (botCenter > targetY + 15 * dimensions.scaleFactor) botY -= botSpeed

      // Keep bot paddle within canvas
      botY = Math.max(0, Math.min(dimensions.height - dimensions.paddleHeight, botY))
    }

    const gameLoop = () => {
      update()
      render()
      requestRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    // Mouse movement handler
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      playerY = (e.clientY - rect.top) * (dimensions.height / rect.height) - dimensions.paddleHeight / 2
      playerY = Math.max(0, Math.min(dimensions.height - dimensions.paddleHeight, playerY))
    }

    // Touch movement handler
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        const rect = canvas.getBoundingClientRect()
        playerY = (e.touches[0].clientY - rect.top) * (dimensions.height / rect.height) - dimensions.paddleHeight / 2
        playerY = Math.max(0, Math.min(dimensions.height - dimensions.paddleHeight, playerY))
      }
    }

    const handleClick = () => {
      if (!gameStarted) {
        setGameStarted(true)
      }
    }

    const handleTouchStart = (e) => {
      if (!gameStarted) {
        setGameStarted(true)
      }
    }

    // Add both mouse and touch event listeners
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("click", handleClick)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("touchstart", handleTouchStart)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchstart", handleTouchStart)
      cancelAnimationFrame(requestRef.current)
    }
  }, [gameActive, gameStarted, playerScore, botScore, dimensions])

  const resetGame = () => {
    setPlayerScore(0)
    setBotScore(0)
    setGameActive(true)
    setGameStarted(false)
  }
  let ping_pong_text ="Tap and drag to control"
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    ping_pong_text = "Move your mouse to control"
  }

  return (
    <div className="flex flex-col items-center h-full px-2 sm:px-4" ref={containerRef}>
      <div className="flex justify-between px-5 w-full max-w-3xl mb-4">
        <div className="mb-2 sm:mb-0 mt-10 md:mt-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-white">Ping Pong</h1>
          <p className="text-sm sm:text-base text-white/70 mb-2 sm:mb-6">
            {ping_pong_text}
          </p>
        </div>
        <div className="flex items-center"> 
          <button
            onClick={resetGame}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base rounded-lg transition-colors"
          >
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
            Reset Game
          </button>
        </div>
      </div>

      <div className="relative w-full flex justify-center">
        <canvas
          ref={canvasRef}
          className="border border-white/10 rounded-lg bg-black/50 backdrop-blur-sm touch-none"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            maxWidth: '100%'
          }}
        />
      </div>
    </div>
  )
}

export default PongGame