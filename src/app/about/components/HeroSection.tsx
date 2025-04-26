import { ArrowDown, Download, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ClientParticles from "@/components/ui/ClientParticles"
import { Button } from "@/components/ui/button"
import HeroAnimation from "@/components/ui/HeroAnimation"

export default function HeroSection() {
  return (
    <section id="hero" className="min-h-[100dvh] relative flex flex-col items-center md:justify-center overflow-hidden">
      {/* Background particles - client component */}
      <ClientParticles />

      <div className="container mx-auto px-4 z-10 text-center mt-20 md:mt-0">
        <HeroAnimation>
          <div className="relative mb-8">
            <div className="w-48 h-48 md:w-64 md:h-64 mx-auto relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-md opacity-50 animate-pulse"></div>
              <div className="relative w-full h-full rounded-full border-4 border-purple-400 overflow-hidden">
                <Image src="/profile1.jpg" alt="Pratham Israni" fill className="object-cover" priority />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Pratham Israni
          </h1>

          <h2 className="text-xl md:text-3xl text-gray-300 mb-4">Software Developer & Competitive Programmer</h2>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 relative">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 w-full md:w-auto"
            >
              <Link href="/resume.pdf" download>
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900 transition-all transform hover:scale-105 w-full md:w-auto"
            >
              <Link href="#about">
                <Mail className="mr-2 h-5 w-5" />
                Contact Me
              </Link>
            </Button>
      <ScrollIndicator />
          </div>
        </HeroAnimation>
      </div>

    </section>
  )
}

function ScrollIndicator() {
  return (
    <Link href='#about' className="absolute -bottom-20 md:-bottom-15 flex flex-col items-center" >
      <span className="mb-2 text-sm font-medium text-gray-400">Scroll Down</span>
      <ArrowDown className="h-6 w-6 animate-bounce text-purple-400" />
    </Link>
  )
}
