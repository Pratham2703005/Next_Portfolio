"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
type EventType = {
  year: string,
      title: string,
      institution: string,
      description: string,
      achievement: string,
      icon: ReactNode
}
export default function TimelineEvent({ event, index }:{event:EventType, index:number}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      viewport={{ once: false, amount: 0.3 }}
      className={`flex flex-col md:flex-row items-start mb-16 relative ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Timeline Dot with Icon */}
      <div className="absolute left-5 md:left-1/2 transform -translate-x-1/2 mt-10 w-10 h-10 rounded-full bg-black/80 border-4 border-purple-400 z-10 flex items-center justify-center">
        {event.icon}
      </div>

      {/* Date Bubble - Mobile */}
      <div className="md:hidden ml-16 mb-4 bg-blue-600 text-white text-sm rounded-full px-3 py-1 inline-block">
        {event.year}
      </div>

      {/* Left Side - Only visible on desktop */}
      <div className={`hidden md:block md:w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}>
        {index % 2 === 0 && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full px-3 py-1 inline-block mb-2">
            {event.year}
          </div>
        )}
      </div>

      {/* Content - always visible */}
      <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
        {index % 2 !== 0 && (
          <div className="hidden md:inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full px-3 py-1 mb-2">
            {event.year}
          </div>
        )}

        <div className="bg-black/40 p-6 rounded-lg shadow-md border border-gray-700 hover:border-purple-700 transition-all duration-300 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-purple-300 mb-2">{event.title}</h3>
          <h4 className="text-lg font-medium text-gray-300 mb-3">{event.institution}</h4>
          <p className="text-gray-400 mb-3">{event.description}</p>
          <p className="font-medium text-blue-300">{event.achievement}</p>
        </div>
      </div>
    </motion.div>
  )
}
