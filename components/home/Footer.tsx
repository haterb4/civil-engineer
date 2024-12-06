import React from 'react'

import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 py-8 text-center">
      <p className="text-gray-400">
        © {new Date().getFullYear()} Project Management App. All rights reserved.
      </p>
      <div className="mt-4 flex justify-center space-x-6">
        <a href="#" className="text-gray-400 hover:text-white">
          <FaFacebook size={24} />
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <FaTwitter size={24} />
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <FaLinkedin size={24} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
