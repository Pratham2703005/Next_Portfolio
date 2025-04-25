'use client';
import { projects } from "./project_data";
import {ProjectCard } from './projectcard';

const Projects = () => {
    

  return (
    <section className="text-white px-3 md:px-20 py-10 md:py-40 z-10 select-none max-h-full w-full" id="projects">
      <h2 className="block md:hidden text-5xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">My Work</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 pb-30 gap-6 md:gap-10 ">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            image={project.image}
            title={project.title}
            description={project.description}
            liveLink={project.liveLink}
            repoLink={project.repoLink}
            techStack={project.techStack} // Pass tech stack here
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
