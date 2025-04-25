"use client";

import { motion } from "framer-motion";

export default function SkillCard({ title, skills, index }: { title: string; skills: string[]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: false, amount: 0.3 }}
      className="bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-md border border-gray-700 hover:border-purple-600 rounded-2xl p-6 shadow-xl transition-all"
    >
      <h3 className="text-xl font-semibold text-white mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: i * 0.05,
            }}
            whileHover={{
              scale: 1.1,
              backgroundColor: i % 2 === 0 ? "#3b82f6" : "#a855f7",
              color: "#fff",
            }}
            className="px-3 py-1 rounded-full text-sm font-medium bg-gray-800 border border-gray-600 text-gray-300 hover:text-white cursor-pointer"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}