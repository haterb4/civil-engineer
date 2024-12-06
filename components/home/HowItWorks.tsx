import React from 'react'

const HowItWorks: React.FC = () => {
    const steps = [
      {
        title: 'Create a Project',
        description: 'Easily set up a project and invite team members with assigned roles.',
      },
      {
        title: 'Manage Documents',
        description: 'Upload important documents, manage versions, and track signatures.',
      },
      {
        title: 'Track Progress',
        description: 'Keep track of document sign-offs and project updates in real-time.',
      },
    ];
  
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800">How it Works</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
                return (
                    <div
                        key={index}
                        className="p-6 bg-white border rounded-lg shadow-md transition-opacity duration-500 animate-fadeIn"
                        style={{ animationDelay: `${index * 0.3}s` }}
                    >
                        <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                        <p className="mt-4 text-gray-600">{step.description}</p>
                    </div>
                )
            })}
          </div>
        </div>
      </section>
    );
};
  
export default HowItWorks;
  