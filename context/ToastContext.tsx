import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { ToastContextType, ToastMessage, ToastType } from '../types';

// FIX: Update ToastContextType to include the `toasts` array
// The ToastContextType interface is now defined in types.ts.
// export interface ToastContextType {
//   toasts: ToastMessage[];
//   showToast: (type: ToastType, message: string) => void;
// }

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString(); // Simple unique ID
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  return (
    // FIX: Pass the `toasts` array in the context value
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      {/* Render the NotificationToast component here or in App.tsx */}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};