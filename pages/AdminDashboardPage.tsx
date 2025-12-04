import React, { useState } from 'react';
import * as RouterComponents from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import AddCourseForm from '../components/AddCourseForm';
import AddProductForm from '../components/AddProductForm';

const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = RouterComponents.useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'courses'>('products');

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto py-12 px-4 text-center min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-8">
          You do not have administrative privileges to view this page.
        </p>
        <Button onClick={() => navigate('/')} variant="primary" size="lg">
          Go to Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

      <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
        <div className="flex justify-center mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-6 text-lg font-medium ${
              activeTab === 'products'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-orange-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200`}
          >
            Add New Product
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-3 px-6 text-lg font-medium ${
              activeTab === 'courses'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-orange-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200`}
          >
            Add New Course
          </button>
        </div>

        <div>
          {activeTab === 'products' && <AddProductForm />}
          {activeTab === 'courses' && <AddCourseForm />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;