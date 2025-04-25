"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gamepad2, Joystick, Puzzle, Dice5 } from "lucide-react"

const games = [
  { name: "Tic Tac Toe", href: "/games/tic-tac-toe", icon: Puzzle },
  { name: "Ping Pong", href: "/games/ping-pong", icon: Gamepad2 },
  { name: "Snake", href: "/games/snake", icon: Joystick },
  { name: "Memory Cards", href: "/games/memory", icon: Dice5 },
]

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full ">
      {/* Simple Sidebar */}
      <div className="w-72 backdrop-blur-md  border-r border-white/10 hidden md:block mt-4 ">
        
        <nav className="flex flex-col  ">
        
          {games.map((game) => (
            <Link
              key={game.name}
              href={game.href}
              className={`flex items-center justify-center p-4 text-white hover:bg-white/20 ${pathname === game.href ? "bg-white/20" : ""}`}
            >
              <game.icon className="h-4 w-4 mr-2" /> {game.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-full">
        {children}
      </div>
    </div>
  )
}