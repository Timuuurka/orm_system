import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-gray-100 dark:bg-gray-800 py-4 shadow">
    <div className="max-w-6xl mx-auto flex justify-center space-x-8">
      {["/dashboard"].map((path, i) => (
        <NavLink
          key={i}
          to={path}
          className={({ isActive }) =>
            `text-lg font-medium transition-colors ${
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            }`
          }
        >
          {path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default Navbar;
