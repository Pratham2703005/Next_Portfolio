const Education = () => {
  return (
    <div className="mt-16 space-y-16 w-full md:w-[80%] md:mx-auto select-none">
  

      <h3 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 text-center">
        Education
      </h3>
      {/* College Section */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/3">
          <img
            src="/img/college.jpeg"
            alt="College"
            className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300  w-full"
          />
        </div>
        <div className="w-full md:w-2/3 space-y-4">
         

          <h3 className="inline text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">College</h3>
          <p className="text-lg leading-relaxed">
            I am currently pursuing my <span className="font-semibold text-blue-300">Bachelor&apos;s in Computer Science</span>  at FET Agra College. I am focused on gaining
            deep knowledge of computer science principles, algorithms, and software development.
          </p>
          
            <p className="text-lg font-semibold">
              Current CGPA:{" "}
              <span className="text-cyan-300 text-xl"> 
                7.325
              </span>
              
            </p>
          
        </div>
      </div>

      {/* School Section */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="w-full md:w-2/3 space-y-4 select-none">
         
            <h3 className="inline text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">School</h3>
          
          <p className="text-lg leading-relaxed">
            I completed my schooling at St. Queen Mary&apos;s Public School, where I pursued the <span className="font-semibold text-blue-300">PCM stream</span>. I was actively involved in extracurricular activities and developed a passion for technology and programming during this time.
          </p>
          
            <>
              <p className="text-lg font-semibold">
                12th Grade (PCM): {" "}
                
                  <span className={"!text-cyan-300 !text-xl"}>
                  85%
                  </span>
                
              </p>
              <p className="text-lg font-semibold">
                10th Grade:{" "}
                
                <span className={"!text-cyan-300 !text-xl"}>
                  72.5%
                  </span>
                
              </p>
              
            </>
         
        </div>
        <div className="w-full md:w-1/3">
          <img
            src="/img/school.jpg"
            alt="School"
            className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300  w-full"
          />
        </div>
      </div>

    </div>
  )
}

export default Education
