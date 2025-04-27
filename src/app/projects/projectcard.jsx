import { CardContainer, CardBody, CardItem } from "@/components/ui/Card3D";
import { ExpandableDescription } from "./ExpandableDescription";


export function ProjectCard({ image, title, description, liveLink, repoLink, techStack }) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-black relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] border-white/[0.2] w-full h-auto rounded-xl px-6 py-8 md:p-6 border">
        
        {/* Title */}
        <CardItem translateZ="50" className="text-2xl md:text-xl font-bold text-white">
          {title}
        </CardItem>

        {/* Image */}
        <CardItem translateZ="100" className="w-full mt-4 relative">
          <div className="relative h-60 w-full rounded-xl group-hover/card:shadow-xl">
            <img src={image} height={1000} width={1000} className="h-60 w-full object-cover rounded-xl" alt={title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent rounded-xl"></div>
          </div>

          {/* Tech Stack */}
          <div className="absolute flex justify-start gap-2 mt-4 w-full bottom-4 ml-4 z-90">
            {techStack.map((tech, index) => (
              <CardItem key={index} translateZ="60">
                <img src={tech} alt={`tech-${index}`} width={32} height={32} className="object-contain hover:scale-110 transition-transform mr-4" />
              </CardItem>
            ))}
          </div>
        </CardItem>

        {/* Expandable Description */}
        <CardItem translateZ="60">
          <ExpandableDescription description={description} />
        </CardItem>

        {/* Links */}
        <div className="flex justify-between items-center mt-4">
          {liveLink && (
            <CardItem translateZ="20" as="a" href={liveLink} target="_blank" className="text-blue-500 hover:text-blue-400 text-xs font-normal">
              Live Demo →
            </CardItem>
          )}
          {repoLink && (
            <CardItem translateZ="20" as="a" href={repoLink} target="_blank" className="text-blue-500 hover:text-blue-400 text-xs font-normal">
              GitHub Repo →
            </CardItem>
          )}
        </div>

      </CardBody>
    </CardContainer>
  );
}
