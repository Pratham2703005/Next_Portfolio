import SectionHeading from "./SectionHeading";
import ClientBubbles from "./ClientBubbles";
import SkillCard from './SkillCard';

export default function SkillsSection() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        "Next.js",
        "React.js",
        "HTML5",
        "CSS3",
        "JavaScript",
        "TypeScript",
        "Tailwind CSS",
      ],
    },
    {
      title: "Backend",
      skills: ["Node.js", "Express", "Java"],
    },
    {
      title: "Databases",
      skills: ["MongoDB", "Firebase", "Prisma"],
    },
    {
      title: "Auth & Validation",
      skills: ["Zod", "NextAuth"],
    },
    {
      title: "UI Libraries",
      skills: ["ShadCN", "Chakra UI", "Daisy UI", "Magic UI", "UIVerse"],
    },
    {
      title: "Tools & Platforms",
      skills: [
        "Git",
        "GitHub",
        "Vercel",
        "VS Code",
        "Postman",
        "Redux Toolkit",
        "Zustand",
      ],
    },
  ];

  return (
    <section id="skills" className="min-h-screen py-20 relative">
      {/* Floating particles - client component */}
      <ClientBubbles />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading>Technical Skills</SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {skillCategories.map((category, index) => (
            <SkillCard key={index} title={category.title} skills={category.skills} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
