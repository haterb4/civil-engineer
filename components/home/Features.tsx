import React from 'react'
import { FaUserShield, FaFileSignature, FaProjectDiagram } from 'react-icons/fa';

const Features: React.FC = () => {
  const features = [
    {
      icon: FaUserShield,
      title: 'Role-Based Access Control',
      description:
        'Assign specific roles to each team member and control their permissions for project actions and document handling.',
    },
    {
      icon: FaFileSignature,
      title: 'Document Versioning and Signatures',
      description:
        'Upload, manage, and sign documents while keeping track of every version and signature process.',
    },
    {
      icon: FaProjectDiagram,
      title: 'Real-Time Project Updates',
      description:
        'Get real-time notifications for project tasks, documents, and signing status, keeping you always up to date.',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-100 via-white to-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800">Features</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white border rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300 ease-in-out"
            >
              <div className="text-4xl text-blue-600 mb-4">
                <feature.icon />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="mt-4 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;