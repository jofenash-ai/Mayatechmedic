import React, { useState } from 'react';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { APP_NAME, LOGO_URL } from '../constants';

const Header: React.FC = () => {
  const { getTotalItems } = useCart();
  const { user, logout, isAdmin } = useAuth(); // Destructure isAdmin
  const navigate = RouterComponents.useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Clear search input
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-4">
        {/* Logo and App Name */}
        <RouterComponents.Link to="/" className="flex items-center space-x-2 mb-4 sm:mb-0">
          <img src={LOGO_URL} alt="Logo" className="h-10 w-10 rounded-full" />
          <span className="text-2xl font-bold text-gray-800 hidden md:block">{APP_NAME}</span>
        </RouterComponents.Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-grow flex justify-center w-full sm:w-auto sm:max-w-xl mx-4 order-3 sm:order-none">
          <input
            type="text"
            placeholder="Search products or courses..."
            className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-orange-500 text-white p-2 rounded-r-md hover:bg-orange-600 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        {/* Navigation Icons/Links */}
        <nav className="flex items-center space-x-4 mt-4 sm:mt-0 order-2 sm:order-none">
          {user ? (
            <div className="relative group">
              <span className="cursor-pointer flex items-center text-gray-700 hover:text-orange-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden md:block">{user.name}</span>
              </span>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block transition-all duration-200 ease-out z-10">
                <RouterComponents.Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Profile
                </RouterComponents.Link>
                <RouterComponents.Link to="/my-courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Courses
                </RouterComponents.Link>
                {isAdmin && ( // Conditionally render Admin Dashboard link
                  <RouterComponents.Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Admin Dashboard
                  </RouterComponents.Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <RouterComponents.Link to="/login" className="flex items-center text-gray-700 hover:text-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden md:block">Login</span>
            </RouterComponents.Link>
          )}

          <RouterComponents.Link to="/cart" className="relative flex items-center text-gray-700 hover:text-orange-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 4a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="ml-1 hidden md:block">Cart</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </RouterComponents.Link>
        </nav>
      </div>
      {/* Secondary Navigation for categories */}
      <nav className="bg-gray-800 text-white py-2 shadow-inner">
        <ul className="container mx-auto flex justify-center space-x-6 text-sm md:text-base">
          <li>
            <RouterComponents.Link to="/products" className="hover:text-orange-400 transition-colors duration-200">
              Electronic Products
            </RouterComponents.Link>
          </li>
          <li>
            <RouterComponents.Link to="/courses" className="hover:text-orange-400 transition-colors duration-200">
              Maintenance Courses
            </RouterComponents.Link>
          </li>
          <li>
            <RouterComponents.Link to="/about" className="hover:text-orange-400 transition-colors duration-200">
              About Us
            </RouterComponents.Link>
          </li>
          <li>
            <RouterComponents.Link to="/contact" className="hover:text-orange-400 transition-colors duration-200">
              Contact Us
            </RouterComponents.Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;