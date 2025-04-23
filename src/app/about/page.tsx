'use client';
import Education from './Education';
import AboutSection from './About';
const About = () => {
  
  return (
    <section className="py-32 md:py-32 text-white h-full w-full overflow-hidden relative select-none">
      <div className="absolute inset-0 pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <AboutSection />

        {/* Education Section */}
        <Education/>    

        {/* skills and Achievements are left */}


      </div>
    </section>
  );
};

export default About;
