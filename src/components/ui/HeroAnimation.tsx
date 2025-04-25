"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function HeroAnimation({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  )
}
