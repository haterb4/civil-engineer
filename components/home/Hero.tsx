import React from 'react'

const Hero: React.FC = () => {
    return (
      <section className="relative bg-cover bg-center bg-[url('/images/construction-bg.webp')] h-screen">
        {/* Navigation Bar */}
        <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-6 z-20">
            {/* Logo */}
            <div className="text-white font-bold text-2xl">
            <a href="/">G.Stream</a>
            </div>
            
            {/* Sign In and Sign Up Buttons */}
            <div className="space-x-4">
            <a
                href="/signin"
                className="text-white hover:text-gray-300 transition duration-300"
            >
                Sign In
            </a>
            <a
                href="/signup"
                className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-500 transition duration-300"
            >
                Sign Up
            </a>
            </div>
        </nav>

        {/* Hero Content */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-gray-900 to-black opacity-60"></div>
        <div className="container mx-auto px-6 py-32 text-center relative z-10">
          <h1 className="text-6xl font-extrabold text-white drop-shadow-md">
            Streamline Civil Engineering Project Management
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Collaborate efficiently with your team, manage documents, and sign contracts – all in one platform.
          </p>
          <div className="mt-8 space-x-4">
            <a
              href="/signup"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:from-blue-500 hover:to-blue-300 transition duration-300 ease-in-out"
            >
              Get Started
            </a>
            <a
              href="#about"
              className="inline-block bg-gray-200 text-gray-800 py-3 px-8 rounded-full text-lg font-semibold hover:bg-gray-300 transition duration-300 ease-in-out"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    );
};
  
export default Hero;
  