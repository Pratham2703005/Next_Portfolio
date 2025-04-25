import type { Metadata } from "next"
import HeroSection from "./components/HeroSection"
import AboutSection from "./components/AboutSection"
import SkillsSection from "./components/SkillsSection"
import AchievementsSection from "./components/AchievementsSection"
import EducationSection from "./components/EducationSection"
import ScrollProgressBar from "@/components/ui/ScrollProgressBar"

export const metadata: Metadata = {
  title: "Pratham Israni | Software Developer",
  description: "Portfolio of Pratham Israni, Software Developer & Competitive Programmer",
}

export default function AboutMeScrollablePage() {
  return (
    <div className="relative text-white overflow-x-hidden">
      {/* Progress bar is client component */}
      <ScrollProgressBar />

      {/* Server-rendered sections */}
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <EducationSection />
      <AchievementsSection />
      {/* <ContactSection /> */}
    </div>
  )
}
