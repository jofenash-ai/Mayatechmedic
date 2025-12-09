import React from 'react';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
import { APP_NAME } from '../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">{APP_NAME}</h3>
          <p className="text-sm">
            Your online marketplace for electronics and premier destination for electronics education.
            Empowering innovation through shopping, learning and essential resources.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><RouterComponents.Link to="/" className="hover:text-orange-400 transition-colors duration-200 text-sm">Home</RouterComponents.Link></li>
            <li><RouterComponents.Link to="/products" className="hover:text-orange-400 transition-colors duration-200 text-sm">Electronic Products</RouterComponents.Link></li>
            <li><RouterComponents.Link to="/courses" className="hover:text-orange-400 transition-colors duration-200 text-sm">Maintenance Courses</RouterComponents.Link></li>
            <li><RouterComponents.Link to="/cart" className="hover:text-orange-400 transition-colors duration-200 text-sm">Shopping Cart</RouterComponents.Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li><RouterComponents.Link to="/contact" className="hover:text-orange-400 transition-colors duration-200 text-sm">Contact Us</RouterComponents.Link></li>
            <li><RouterComponents.Link to="/faq" className="hover:text-orange-400 transition-colors duration-200 text-sm">FAQ</RouterComponents.Link></li>
            <li><RouterComponents.Link to="/returns" className="hover:text-orange-400 transition-colors duration-200 text-sm">Returns &amp; Refunds</RouterComponents.Link></li>
            <li><RouterComponents.Link to="/shipping" className="hover:text-orange-400 transition-colors duration-200 text-sm">Shipping Information</RouterComponents.Link></li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
              <img src="https://picsum.photos/24/24?random=soc1" alt="Facebook" className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
              <img src="https://picsum.photos/24/24?random=soc2" alt="Twitter" className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
              <img src="https://picsum.photos/24/24?random=soc3" alt="LinkedIn" className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
              <img src="https://picsum.photos/24/24?random=soc4" alt="Instagram" className="h-6 w-6" />
            </a>
          </div>
          <p className="text-sm mt-4">
            Sign up for our newsletter for updates!
          </p>
          {/* Newsletter signup - placeholder */}
          <div className="mt-2 flex">
            <input
              type="email"
              placeholder="Your Email"
              className="p-2 rounded-l-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 flex-grow"
            />
            <button className="bg-orange-500 text-white p-2 rounded-r-md hover:bg-orange-600 transition-colors duration-200 text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
        <p>&copy; {currentYear} {APP_NAME}. All rights reserved.</p>
        <p className="mt-2">
          <RouterComponents.Link to="/privacy" className="hover:text-orange-400 transition-colors duration-200 mx-2">Privacy Policy</RouterComponents.Link> |
          <RouterComponents.Link to="/terms" className="hover:text-orange-400 transition-colors duration-200 mx-2">Terms of Service</RouterComponents.Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;