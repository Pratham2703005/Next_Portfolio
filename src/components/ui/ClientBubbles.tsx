"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
type BubblesType = {
  x: number,
  y: number,
  size: number,
  scale: number,
  duration: number
}

export default function ClientBubbles() {
  const [bubbles, setBubbles] = useState<BubblesType[]>([])

  useEffect(() => {
    const newBubbles = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 200 + 50,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 10 + 20,
    }))
    setBubbles(newBubbles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-10"
          initial={{ x: b.x, y: b.y, scale: b.scale }}
          animate={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          transition={{
            duration: b.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{ width: `${b.size}px`, height: `${b.size}px` }}
        />
      ))}
    </div>
  )
}
