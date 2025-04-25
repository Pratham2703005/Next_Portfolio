"use client"
import { useState, useEffect } from "react"
import { RotateCcw } from "lucide-react"

const initialBoard = Array(9).fill(null)

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const checkWinner = (board, player) => {
  return winningCombinations.some((combination) => combination.every((index) => board[index] === player))
}

const getAvailableMoves = (board) => board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null)

const getBotMove = (board) => {
  // Try to win
  for (const move of getAvailableMoves(board)) {
    const copy = [...board]
    copy[move] = "O"
    if (checkWinner(copy, "O")) return move
  }

  // Try to block X
  for (const move of getAvailableMoves(board)) {
    const copy = [...board]
    copy[move] = "X"
    if (checkWinner(copy, "X")) return move
  }

  // Try to take center
  if (board[4] === null) return 4

  // Otherwise, random move
  const available = getAvailableMoves(board)
  return available[Math.floor(Math.random() * available.length)]
}

const TicTacToe = () => {
  const [board, setBoard] = useState(initialBoard)
  const [isXTurn, setIsXTurn] = useState(true)
  const [winner, setWinner] = useState(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [botScore, setBotScore] = useState(0)
  const [draws, setDraws] = useState(0)

  const handleClick = (index) => {
    if (board[index] || winner || !isXTurn) return

    const newBoard = [...board]
    newBoard[index] = "X"
    setBoard(newBoard)
    setIsXTurn(false)
  }

  useEffect(() => {
    const handleBotTurn = () => {
      if (isXTurn || winner) return
      const move = getBotMove(board)
      if (move !== undefined) {
        const newBoard = [...board]
        newBoard[move] = "O"
        setBoard(newBoard)
        setIsXTurn(true)
      }
    }
    const timer = setTimeout(handleBotTurn, 500) // delay for realism
    return () => clearTimeout(timer)
  }, [board, isXTurn, winner])

  useEffect(() => {
    if (checkWinner(board, "X")) {
      setWinner("X")
      setPlayerScore((prev) => prev + 1)
    } else if (checkWinner(board, "O")) {
      setWinner("O")
      setBotScore((prev) => prev + 1)
    } else if (!board.includes(null)) {
      setWinner("Draw")
      setDraws((prev) => prev + 1)
    }
  }, [board])

  const resetGame = () => {
    setBoard(initialBoard)
    setIsXTurn(true)
    setWinner(null)
  }

  return (
    <div className="h-full flex items-center justify-center p-8 ">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="!text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Tic Tac Toe</h1>
            <p className="text-white/70 mb-6">Play against an AI opponent</p>

            <div className="flex justify-center text-center gap-6 mb-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 w-24">
                <div className="text-sm text-white/70">You (X)</div>
                <div className="text-2xl font-bold text-purple-400">{playerScore}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 w-24">
                <div className="text-sm text-white/70">Draws</div>
                <div className="text-2xl font-bold text-white">{draws}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 w-24">
                <div className="text-sm text-white/70">Bot (O)</div>
                <div className="text-2xl font-bold text-blue-400">{botScore}</div>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="w-full gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              New Game
            </button>
          </div>
          
          
        </div>

        <div className="w-full md:w-1/2">
          <div className="relative aspect-square w-full mb-6">
            {/* Horizontal lines */}
            <div className="absolute left-0 right-0 top-1/3 h-px bg-white/30"></div>
            <div className="absolute left-0 right-0 top-2/3 h-px bg-white/30"></div>
            
            {/* Vertical lines */}
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/30"></div>
            <div className="absolute top-0 bottom-0 left-2/3 w-px bg-white/30"></div>
            
            {/* Game cells with fixed dimensions */}
            <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  disabled={!!cell || !!winner || !isXTurn}
                  className={`
                    flex items-center justify-center h-full w-full transition-all relative
                    ${!cell && !winner && isXTurn ? "hover:bg-white/10 cursor-pointer" : ""}
                  `}
                >
                  {/* Empty placeholder to maintain consistent size */}
                  <span className="opacity-0 select-none text-5xl">X</span>
                  
                  {/* Actual content positioned absolutely */}
                  {cell === "X" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl font-bold relative">
                        <span className="absolute text-white">X</span>
                        <span className="relative z-10 text-purple-400">X</span>
                      </div>
                    </div>
                  )}
                  {cell === "O" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl font-bold relative">
                        <span className="absolute text-white">O</span>
                        <span className="relative z-10 text-blue-400">O</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {winner && (
            <div className="text-center mb-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
              {winner === "Draw" ? (
                <div className="text-xl text-white">It's a draw!</div>
              ) : (
                <div className="text-xl">
                  <span className="text-white">Winner: </span>
                  <span className={winner === "X" ? "text-purple-400" : "text-blue-400"}>
                    {winner === "X" ? "You" : "Bot"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicTacToe
