import React from 'react';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
import Button from '../components/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-lg w-full">
        <h1 className="text-6xl font-extrabold text-orange-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <RouterComponents.Link to="/">
          <Button variant="primary" size="lg">
            Go to Homepage
          </Button>
        </RouterComponents.Link>
      </div>
    </div>
  );
};

export default NotFoundPage;