import React from 'react';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MyCoursesPage from './pages/MyCoursesPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; // Import the new Admin page
import CheckoutPage from './pages/CheckoutPage'; // Import the new CheckoutPage
import ProfilePage from './pages/ProfilePage'; // Import the new ProfilePage
import OrderConfirmationPage from './pages/OrderConfirmationPage'; // Import the new OrderConfirmationPage
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // New
import TermsOfServicePage from './pages/TermsOfServicePage'; // New
import ShippingInfoPage from './pages/ShippingInfoPage'; // New
import ReturnsPage from './pages/ReturnsPage'; // New
import FAQPage from './pages/FAQPage'; // New

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext'; // Import ToastProvider
import NotificationToast from './components/NotificationToast'; // Import NotificationToast

const App: React.FC = () => {
  return (
    <ToastProvider> {/* Wrap with ToastProvider */}
      <AuthProvider>
        <CartProvider>
          <RouterComponents.HashRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <RouterComponents.Routes>
                  <RouterComponents.Route path="/" element={<HomePage />} />
                  <RouterComponents.Route path="/products" element={<ProductsPage />} />
                  <RouterComponents.Route path="/products/:productId" element={<ProductDetailPage />} />
                  <RouterComponents.Route path="/courses" element={<CoursesPage />} />
                  <RouterComponents.Route path="/courses/:courseId" element={<CourseDetailPage />} />
                  <RouterComponents.Route path="/my-courses" element={<MyCoursesPage />} />
                  <RouterComponents.Route path="/cart" element={<CartPage />} />
                  <RouterComponents.Route path="/checkout" element={<CheckoutPage />} /> {/* New Checkout route */}
                  <RouterComponents.Route path="/order-confirmation" element={<OrderConfirmationPage />} /> {/* New Order Confirmation route */}
                  <RouterComponents.Route path="/profile" element={<ProfilePage />} /> {/* New Profile route */}
                  <RouterComponents.Route path="/login" element={<LoginPage />} />
                  <RouterComponents.Route path="/about" element={<AboutPage />} />
                  <RouterComponents.Route path="/contact" element={<ContactPage />} />
                  <RouterComponents.Route path="/admin" element={<AdminDashboardPage />} /> {/* New Admin route */}
                  {/* New Legal and Info Routes */}
                  <RouterComponents.Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <RouterComponents.Route path="/terms" element={<TermsOfServicePage />} />
                  <RouterComponents.Route path="/shipping" element={<ShippingInfoPage />} />
                  <RouterComponents.Route path="/returns" element={<ReturnsPage />} />
                  <RouterComponents.Route path="/faq" element={<FAQPage />} />
                  <RouterComponents.Route path="*" element={<NotFoundPage />} />
                </RouterComponents.Routes>
              </main>
              <Footer />
            </div>
            <NotificationToast /> {/* Render NotificationToast outside of main layout but inside router */}
          </RouterComponents.HashRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;