/* eslint-disable react/prop-types */
import { motion } from "framer-motion"
import { useState } from "react"

const CrazyButton = ({ href, children, width = "auto", className=''}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      
      style={{ width }} // Apply the custom width here
      className={`relative inline-block px-8 py-3 group ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-lg opacity-75"
        animate={{
          background: isHovered
            ? [
                "linear-gradient(to right, #06b6d4, #3b82f6, #a855f7)",
                "linear-gradient(to left, #06b6d4, #3b82f6, #a855f7)",
              ]
            : "linear-gradient(to right, #06b6d4, #3b82f6, #a855f7)",
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg blur-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-50"
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
      />

      {/* Border gradient */}
      <motion.div
        className="absolute inset-0.5 rounded-lg bg-black"
        animate={{
          background: isHovered
            ? [
                "linear-gradient(to right, #000, #111, #000)",
                "linear-gradient(to left, #000, #111, #000)",
              ]
            : "linear-gradient(to right, #000, #111, #000)",
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Text content */}
      <motion.span
        className="relative block font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"
        animate={{
          backgroundPosition: isHovered ? ["0%", "100%"] : "0%",
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        {children}
      </motion.span>

      {/* Particles effect */}
      {isHovered && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              initial={{
                opacity: 1,
                scale: 0,
              }}
              animate={{
                opacity: 0,
                scale: 2,
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              style={{
                left: "50%",
                top: "50%",
              }}
            />
          ))}
        </>
      )}
    </motion.a>
  )
}

export default CrazyButton;
