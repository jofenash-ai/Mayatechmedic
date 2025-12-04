import React from 'react';
import { useToast } from '../context/ToastContext';
// FIX: Import ToastType and ToastMessage from types.ts
import { ToastType, ToastMessage } from '../types';

const NotificationToast: React.FC = () => {
  // FIX: Access both `toasts` and `showToast` from the useToast hook
  const { toasts, showToast } = useToast();

  const getToastClasses = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-700';
      case 'error':
        return 'bg-red-500 border-red-700';
      case 'info':
        return 'bg-blue-500 border-blue-700';
      case 'warning':
        return 'bg-yellow-500 border-yellow-700';
      default:
        return 'bg-gray-500 border-gray-700';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-lg text-white max-w-xs transition-transform transform translate-x-0 ${getToastClasses(toast.type)}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <p className="text-sm font-medium">{toast.message}</p>
          {/* Optional: Add a close button */}
          {/* <button
            onClick={() => removeToast(toast.id)} // This would require removeToast from context
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button> */}
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;