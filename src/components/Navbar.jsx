import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-gray-100 p-4">
    <div className="max-w-6xl mx-auto flex gap-6">
      <NavLink to="/dashboard" className="text-gray-700 hover:text-black">Dashboard</NavLink>
      <NavLink to="/reviews" className="text-gray-700 hover:text-black">Reviews</NavLink>
      <NavLink to="/alerts" className="text-gray-700 hover:text-black">Alerts</NavLink>
      <NavLink to="/reports" className="text-gray-700 hover:text-black">Reports</NavLink>
    </div>
  </nav>
);

export default Navbar;
