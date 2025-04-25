import SectionHeading from "./ui/SectionHeading"
import AchievementCarousel from "./ui/AchievementCarousel"

export default function AchievementsSection() {
  const achievements = [
    {
      title: "SIH 2024 Finalist",
      description:
        "Being a part of Smart India Hackathon 2024 as one of the top 48 teams out of 1200+ teams was a rewarding experience. Our team worked on ISRO's problem statement, focusing on semantic segmentation of satellite imagery to identify features like urban areas and forests.",
      image: "/img/sih.jpg",
      link: "https://www.linkedin.com/feed/update/urn:li:activity:7278911940347752448/",
      linkText: "View Journey",
    },
    {
      title: "War of Codes Technical Fest - Gold Medalist",
      description:
        "Achieved the Gold Medal at the prestigious War of Codes technical fest hosted by FET Agra College. This competition provided an incredible platform to showcase my coding skills and compete with some of the brightest minds in the tech community.",
      image: "/img/codewars.jpg",
      link: "https://www.linkedin.com/posts/pratham-israni-a6b672275_warofcodes-codingcompetition-goldmedalist-activity-7201857357700554752-JWrB",
      linkText: "View LinkedIn Post",
    },
    {
      title: "HackerRank Certifications",
      description:
        "I've earned certifications in JavaScript (Basic), Problem Solving, and Frontend Development with React from HackerRank. These certifications highlight my solid grasp of JavaScript fundamentals, problem-solving abilities, and expertise in creating interactive front-end applications with React.",
      image: "/img/rc.png",
      links: [
        {
          text: "Problem Solving Certification",
          url: "https://www.hackerrank.com/certificates/iframe/13148a670d27",
        },
        {
          text: "JavaScript Certification",
          url: "https://www.hackerrank.com/certificates/iframe/9e4584e46e53",
        },
        {
          text: "React Certification",
          url: "https://www.hackerrank.com/certificates/iframe/b9157c3f6d35",
        },
      ],
    },
    {
      title: "LeetCode Achievements",
      description:
        "With a commitment to problem-solving, I've completed over 600 questions and maintained a 350+ day streak on LeetCode. My consistent performance earned me a top rank of 1783 / 38868 in Biweekly Contest 134 and a solid standing of 2007 / 33382 in Weekly Contest 413.",
      image: "/img/365Day.gif",
      link: "https://leetcode.com/u/Pratham012/",
      linkText: "View Profile",
    },
  ]

  return (
    <section id="achievements" className="min-h-screen py-20 relative">
      <div className="container mx-auto px-4">
        <SectionHeading>Achievements</SectionHeading>

        {/* Client component for carousel */}
        <AchievementCarousel achievements={achievements} />
      </div>
    </section>
  )
}
