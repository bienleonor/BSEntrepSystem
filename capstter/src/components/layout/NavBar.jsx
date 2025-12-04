import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <header className="w-full bg-white bg-opacity-90 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              DHO - Business Dashboard
            </Link>
          </div>  
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-800 hover:text-blue-600 font-medium">
              Login
            </Link>
            <Link to="/register" className="text-gray-800 hover:text-red-600 font-medium">
              Register
            </Link>
          </div>
        </div>
      </nav>
    </header>

  );
};

export default NavBar;
