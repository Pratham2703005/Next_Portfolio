import { Code, Download, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SectionHeading from "@/components/ui/SectionHeading"
import SectionAnimation from "@/components/ui/SectionAnimation"
import { ReactNode } from "react"

export default function AboutSection() {
  return (
    <section id="about" className="min-h-[100dvh] flex items-center pb-10 relative">
      <div className="container mx-auto px-4">
        <SectionHeading>About Me</SectionHeading>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <SectionAnimation className="lg:w-1/2">
            <Card className="bg-black/40 border-gray-800 backdrop-blur-sm hover:border-purple-900/50 transition-all duration-300">
              <CardContent className="p-4 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-purple-300">Who I Am</h3>
                <div className="space-y-2 text-sm md:space-y-4 md:text-lg">
                  <p>
                    I&apos;m a passionate <span className="font-semibold text-purple-300">Software Developer</span> and{" "}
                    <span className="font-semibold text-blue-300">Competitive Programmer</span>, driven by my love for
                    solving complex problems and creating impactful solutions.
                  </p>
                  <p>
                    With a strong focus on writing clean, efficient code, I enjoy diving into emerging technologies and
                    constantly enhancing my skills to stay at the forefront of the industry.
                  </p>
                  <p>
                    Whether it&apos;s tackling algorithmic challenges, building dynamic web applications, or exploring the
                    latest tech trends, I&apos;m always up for taking on new projects. I believe in pushing boundaries and
                    constantly evolving, both as a programmer and as an individual.
                  </p>
                  <p className="font-semibold italic text-blue-300">Let&apos;s build something amazing together! 🚀</p>
                </div>
              </CardContent>
            </Card>
          </SectionAnimation>

          <SectionAnimation className="w-full md:w-1/2" delay={0.2}>
            <Card className="bg-black/40 border-gray-800 backdrop-blur-sm hover:border-blue-900/50 transition-all duration-300 h-full">
              <CardContent className="p-4 md:p-8">
                <h3 className="text-2xl font-bold mb-6 text-blue-300">Connect With Me</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                  <SocialLink
                    href="https://github.com/Pratham2703005"
                    icon={<Github className="h-6 w-6 text-blue-400" />}
                    title="GitHub"
                    description="Check out my repos"
                  />

                  <SocialLink
                    href="https://www.linkedin.com/in/pratham-israni-a6b672275/"
                    icon={<Linkedin className="h-6 w-6 text-blue-400" />}
                    title="LinkedIn"
                    description="Professional network"
                  />

                  <SocialLink
                    href="https://leetcode.com/u/Pratham012/"
                    icon={<Code className="h-6 w-6 text-blue-400" />}
                    title="LeetCode"
                    description="350+ day streak"
                  />

                  
                  <SocialLink
                    href="mailto:pk2732004@gmail.com"
                    icon={<Mail className="h-6 w-6 text-blue-400" />}
                    title="Email"
                    description="Get in touch"
                  />
                </div>

                <div className="mt-8">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Link href="/resume.pdf" download>
                      <Download className="mr-2 h-5 w-5" />
                      Download My Resume
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SectionAnimation>
        </div>
      </div>
    </section>
  )
}

function SocialLink({ href, icon, title, description }:{title: string, description:string, href:string, icon:ReactNode}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-4 border-white/20 hover:bg-purple-500/10 border-solid border-[1px] rounded-lg transition-colors"
    >
      <div className="bg-black/50 p-3 rounded-full mr-4">{icon}</div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </Link>
  )
}
