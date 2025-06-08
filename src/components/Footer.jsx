import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-white text-sm mt-8 py-4">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <p>&copy; {new Date().getFullYear()} ORM System</p>
      <div className="flex gap-4">
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        <Link to="/terms" className="hover:underline">Terms</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
