import React from 'react'
const AboutUs: React.FC = () => {
    return (
      <section className="py-20 bg-gray-100 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center md:text-left">
          {/* Background Shape */}
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gray-100 pointer-events-none"></div>
          <div className="absolute top-2 right-0 w-1/2 bottom-3 bg-white pointer-events-none flex justify-center items-center rounded-2xl shadow-lg"></div>
          
          {/* Main About Us Text */}
          <div className='relative w-full'>
            <h2 className="text-3xl text-center font-bold text-gray-900 mb-8 leading-tight">
                Our Purpose
            </h2>
    
            <div className="relative z-10">
                <p className="text-lg text-gray-700 max-w-3xl mb-8 mx-auto md:mx-0">
                At <span className="font-semibold text-blue-600">G.Stream</span>, we believe in revolutionizing the way civil engineering projects are managed. Our goal is to empower engineers, project managers, and contractors to collaborate effortlessly, streamline document workflows, and track progress in real-time.
                </p>
    
                <p className="text-lg text-gray-700 max-w-3xl mb-8 mx-auto md:mx-0">
                Built with precision and attention to detail, our platform ensures your team can focus on what matters most: completing projects on time, within budget, and to the highest standards of quality.
                </p>
    
                {/* Mission Statement - Artistic positioning */}
                <div className="relative mt-12">
                <blockquote className="text-3xl font-semibold italic text-blue-600 max-w-2xl mx-auto md:mx-0">
                    Driving efficiency and innovation in every phase of civil engineering project management.
                </blockquote>
                </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default AboutUs;
  