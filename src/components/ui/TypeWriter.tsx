'use client';
import React from 'react'
import { TypeAnimation } from 'react-type-animation'

const TypeWriter = () => {
  return (
    <TypeAnimation
                sequence={[
                  "Programmer.",
                  2000,
                  "Frontend Developer.",
                  2000,
                  "Competitive Programmer.",
                  2000,
                  "Problem Solver.",
                  2000,
                  "UI/UX Designer.",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                cursor={true}
                className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light"
                repeat={Infinity}
              />
  )
}

export default TypeWriter
