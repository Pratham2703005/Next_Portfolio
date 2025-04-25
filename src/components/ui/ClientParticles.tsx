"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
type ParticlesType = {
  x: number,
  y: number,
  size: number,
  scale: number,
  duration: number
}
export default function ClientParticles() {
  const [particles, setParticles] = useState<ParticlesType[]>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 80 + 20,
      scale: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 15 + 10,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"
          initial={{ x: p.x, y: p.y, scale: p.scale }}
          animate={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          transition={{
            duration: p.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{ width: `${p.size}px`, height: `${p.size}px` }}
        />
      ))}
    </div>
  )
}
