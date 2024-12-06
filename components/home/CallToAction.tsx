import React from 'react'

const CallToAction: React.FC = () => {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white">Ready to streamline your projects?</h2>
          <p className="mt-4 text-blue-100">
            Sign up today and get started with our project management solution tailored for civil engineering.
          </p>
          <a
            href="/signup"
            className="mt-8 inline-block bg-white text-blue-600 py-3 px-8 rounded-full font-semibold hover:bg-gray-100 shadow-lg transition-all transform hover:scale-105 duration-300"
          >
            Get Started for Free
          </a>
        </div>
      </section>
    );
  };
  
  export default CallToAction;
  