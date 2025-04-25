import Link from "next/link"
import { Puzzle, Gamepad2, Joystick, Dice5 } from "lucide-react"

const games = [
  {
    name: "Tic Tac Toe",
    href: "/games/tic-tac-toe",
    icon: Puzzle,
    description: "Classic game of X's and O's. Play against a smart AI opponent.",
  },
  {
    name: "Ping Pong",
    href: "/games/ping-pong",
    icon: Gamepad2,
    description: "Test your reflexes in this classic arcade game.",
  },
  {
    name: "Snake",
    href: "/games/snake",
    icon: Joystick,
    description: "Control a snake and eat food to grow longer without hitting walls or yourself.",
  },
  {
    name: "Memory Cards",
    href: "/games/memory",
    icon: Dice5,
    description: "Test your memory by matching pairs of cards.",
  },
]

export default function Games() {
  return (
    <div className="container mx-auto px-3 py-10 md:p-6">
      <h1 className="text-4xl font-bold mb-4 md:mb-8 text-white">Arcade Games</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {games.map((game) => (
          <Link key={game.name} href={game.href} className="group">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 md:p-6 h-full transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                  <game.icon className="h-6 w-6 text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{game.name}</h2>
              </div>
              <p className="text-white/70 text-sm md:text-md">{game.description}</p>
              <div className="mt-4 text-purple-400 flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform">
                Play now <span className="ml-1">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
