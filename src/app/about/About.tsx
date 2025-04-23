'use client';
import CrazyButton from '@/components/ui/CrazyButton'
import React from 'react'

const AboutSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-12">
          <div
            className={`w-full md:w-1/3 transform transition-all duration-1000 ease-out 
              translate-x-0 opacity-100`}
            
          >
            <div className="relative aspect-square rounded-full overflow-hidden">
              <img
                src="/profile1.jpg?height=400&width=400"
                alt="Pratham Israni"
                className="rounded-full transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500 to-transparent opacity-20"></div>
            </div>
          </div>
          <div
            className={`w-full md:w-2/3 space-y-6 transform transition-all duration-1000 delay-300 ease-out 
              translate-x-0 opacity-100
            }`}
          >
         
          <p className="text-lg leading-relaxed">
            I&apos;m a passionate <span className="font-semibold text-cyan-300">Software Developer</span> and{' '}
            <span className="font-semibold text-blue-300">Competitive Programmer</span>, driven by my love for solving complex
            problems and creating impactful solutions. With a strong focus on writing clean, efficient code, I enjoy diving into
            emerging technologies and constantly enhancing my skills.
          </p>

          <p className="text-lg leading-relaxed">
            Whether it&apos;s tackling algorithmic challenges, building dynamic web applications, or exploring the latest tech
            trends, I&apos;m always up for taking on new projects. I believe in pushing boundaries and constantly evolving, both
            as a programmer and as an individual.
          </p>

          <p className="text-lg font-semibold italic">
            Feel free to explore my portfolio to check out the projects I&apos;ve worked on and the skills I&apos;ve honed over time. 🚀
          </p>


            {/* Resume Buttons */}
            <div className="mt-8">
              <CrazyButton href="/resume.pdf" width="auto">
                View My Resume
              </CrazyButton>
            </div>
          </div>
        </div>
  )
}

export default AboutSection
