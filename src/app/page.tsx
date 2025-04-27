import TypeWriter from '@/components/ui/TypeWriter';
import React from 'react'

const Home = () => {
  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl w-full mx-auto sm:mx-0 space-y-8 sm:space-y-10">
          {/* Hero section */}
          <div className="space-y-3 text-center sm:text-left">
            <h1 className="text-4xl sm:text-6xl md:text-5xl font-extrabold text-white tracking-tight 
                            animate-fade-in-up [text-wrap:balance]">
              Pratham Israni
            </h1>

            {/* Type animation with fixed height to prevent layout shift */}
            <div className="h-16 sm:h-14 flex items-center justify-center sm:justify-start">
              <TypeWriter/>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto sm:mx-0 
                            animate-fade-in-up animation-delay-300 leading-relaxed">
              Explore my journey through code and creativity.
              Building experiences that make a difference.
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Home