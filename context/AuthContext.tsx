import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { AuthContextType, User, Order } from '../types';
import { authenticateUser, registerUser, _getUsersFromLocalStorage, _saveUsersToLocalStorage } from '../services/dataService'; // Import mock backend functions
import { useToast } from './ToastContext'; // Import useToast

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { showToast } = useToast(); // Use the toast context

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    if (storedUser && storedToken) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser({
        ...parsedUser,
        role: parsedUser.role || 'user',
        enrolledCourseIds: parsedUser.enrolledCourseIds || [],
        orders: parsedUser.orders || [],
      });
      setToken(storedToken);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { user: loggedInUser, token: authToken } = await authenticateUser(email, password);
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      localStorage.setItem('authToken', authToken);
      showToast('success', `Welcome back, ${loggedInUser.name}!`);
      return true;
    } catch (error: any) {
      showToast('error', `Login failed: ${error.message}`);
      return false;
    }
  }, [showToast]);

  const register = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { user: registeredUser, token: authToken } = await registerUser(email, password, name);
      setUser(registeredUser);
      setToken(authToken);
      localStorage.setItem('currentUser', JSON.stringify(registeredUser));
      localStorage.setItem('authToken', authToken);
      showToast('success', `Account created successfully! Welcome, ${registeredUser.name}!`);
      console.log(`[SIMULATED EMAIL] Welcome to MayaTech! You have successfully registered with email ${email}.`);
      return true;
    } catch (error: any) {
      showToast('error', `Registration failed: ${error.message}`);
      return false;
    }
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    showToast('info', 'You have been logged out.');
  }, [showToast]);

  const enrollInCourse = useCallback((courseId: string) => {
    setUser((prevUser) => {
      if (!prevUser) {
        showToast('error', 'You need to log in to enroll in a course.');
        return null;
      }

      if (prevUser.enrolledCourseIds.includes(courseId)) {
        showToast('info', 'You are already enrolled in this course.');
        return prevUser;
      }

      const updatedEnrolledCourseIds = Array.from(new Set([...prevUser.enrolledCourseIds, courseId]));
      const updatedUser = { ...prevUser, enrolledCourseIds: updatedEnrolledCourseIds };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Also update in the mock backend (localStorage users array)
      const users = _getUsersFromLocalStorage();
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], enrolledCourseIds: updatedEnrolledCourseIds };
        _saveUsersToLocalStorage(users);
      }
      showToast('success', 'Successfully enrolled in the course!');
      console.log(`[SIMULATED EMAIL] Course Enrollment Confirmation: You have successfully enrolled in course ID ${courseId}.`);
      return updatedUser;
    });
  }, [showToast]);

  const addOrderToUserHistory = useCallback((order: Order) => {
    setUser((prevUser) => {
      if (!prevUser) {
        showToast('error', 'User not logged in. Cannot place order.');
        return null;
      }

      const updatedOrders = [...prevUser.orders, order];
      const updatedUser = { ...prevUser, orders: updatedOrders };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Also update in the mock backend (localStorage users array)
      const users = _getUsersFromLocalStorage();
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], orders: updatedOrders };
        _saveUsersToLocalStorage(users);
      }
      showToast('success', `Order ${order.id} placed successfully!`);
      console.log(`[SIMULATED EMAIL] Order Confirmation for Order ID: ${order.id}\nTotal: $${order.totalPrice.toFixed(2)}\nItems: ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}\nShipping To: ${order.shippingAddress.name}, ${order.shippingAddress.address}, ${order.shippingAddress.city}\nPayment Method: ${order.paymentMethod}`);
      return updatedUser;
    });
  }, [showToast]);

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  const authContextValue = useMemo(() => ({
    user,
    token,
    login,
    register,
    logout,
    enrollInCourse,
    addOrderToUserHistory,
    isAdmin,
  }), [user, token, login, register, logout, enrollInCourse, addOrderToUserHistory, isAdmin]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};