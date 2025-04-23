/* eslint-disable react/prop-types */
import  { useState, useEffect } from "react";
import { CardBody,CardContainer,CardItem } from "@/components/ui/Card3D";

export function ProjectCard({ image, title, description, liveLink, repoLink, techStack }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile screens are 768px or less
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Add listener
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  const handleToggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const charLimit = isMobile ? 150 : 300;

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
        {/* Project Title */}
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {title}
        </CardItem>

        {/* Project Image */}
        <CardItem translateZ="100" className="w-full mt-4 relative">
        <div className="relative h-60 w-full rounded-xl group-hover/card:shadow-xl">
          <img
            src={image}
            height={1000}
            width={1000}
            className="h-60 w-full object-cover rounded-xl"
            alt={title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent rounded-xl"></div>
        </div>

          {/* Tech Stack */}
          
          <CardContainer className="absolute flex justify-start gap-2 mt-4 w-full bottom-4 ml-4 z-90">
            {techStack.map((tech, index) => (
              <CardItem key={index} translateZ="60">
                <img
                  src={tech}
                  alt={`tech-${index}`}
                  width={32}
                  height={32}
                  className="object-contain hover:scale-110 transition-transform mr-4"
                  />
              </CardItem>
            ))}
          </CardContainer>
        </CardItem>
        

        {/* Project Description */}
        <CardItem
          as="p"
          translateZ="60"
          className="w-full text-neutral-500 text-sm mt-2 dark:text-neutral-300 p-5 "
        >
          {isExpanded
            ? description
            : `${description.substring(0, charLimit)}...`}
          <span
            onClick={handleToggleDescription}
            className="text-blue-500 hover:text-blue-400 ml-2 "
          >
            {isExpanded ? "Read Less" : "Read More"}
          </span>
        </CardItem>

        

        {/* Links */}
        <div className="flex justify-between items-center mt-4">
          {liveLink && (
            
            <CardItem
              translateZ="20"
              as={"a"}
              href={liveLink}
              target="_blank"
              className="text-blue-500 hover:text-blue-400 text-xs font-normal"
            >
              {console.log(liveLink)}
              Live Demo →
            </CardItem>
          )}
          {repoLink && (
            <CardItem
              translateZ="20"
              as={"a"}
              href={repoLink}
              target="_blank"
              className="text-blue-500 hover:text-blue-400 text-xs font-normal"
            >
              GitHub Repo →
            </CardItem>
          )}
        </div>
      </CardBody>
    </CardContainer>
  );
}
