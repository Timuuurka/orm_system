import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-gray-900 text-white p-4 shadow-md">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-white">ORM System</Link>
      <nav className="hidden md:flex gap-4">
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/blog" className="hover:underline">Blog</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
      </nav>
    </div>
  </header>
);

export default Header;
