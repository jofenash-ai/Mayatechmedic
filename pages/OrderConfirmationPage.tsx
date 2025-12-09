import React, { useEffect } from 'react';
import * as RouterComponents from 'react-router-dom';
import Button from '../components/Button';
import { Order, PaymentMethod } from '../types';
import { useToast } from '../context/ToastContext'; // Import useToast

const OrderConfirmationPage: React.FC = () => {
  const location = RouterComponents.useLocation();
  const navigate = RouterComponents.useNavigate();
  const order: Order | undefined = location.state?.order;
  const { showToast } = useToast(); // Use the toast context

  // Redirect if no order data is available (e.g., direct access)
  useEffect(() => {
    if (!order) {
      showToast('error', 'No order information found. Please place an order first.');
      navigate('/', { replace: true });
    }
  }, [order, navigate, showToast]);

  if (!order) {
    return null; // Render nothing while redirecting
  }

  const getPaymentMethodDisplayName = (method: PaymentMethod) => {
    switch (method) {
      case 'CBE_BIRR': return 'CBE Birr';
      case 'TELEBIRR': return 'Telebirr';
      case 'AMOLE': return 'Amole';
      case 'BANK_TRANSFER': return 'Bank Transfer';
      case 'VISA': return 'Visa Card';
      case 'MASTERCARD': return 'MasterCard';
      case 'PAYPAL': return 'PayPal';
      case 'APPLE_PAY': return 'Apple Pay';
      case 'CASH_ON_DELIVERY': return 'Cash on Delivery';
      default: return method;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 text-center max-w-2xl mx-auto">
        <svg
          className="mx-auto h-24 w-24 text-green-500 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Order Confirmed!</h1>
        <p className="text-xl text-gray-600 mb-4">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        <p className="text-lg text-gray-600 mb-8">
            A confirmation email containing your order details has been simulated to be sent to your registered email address.
        </p>

        <div className="text-left bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="2xl font-bold text-gray-800 mb-4">Order Information</h2>
          <div className="space-y-2 text-lg text-gray-700">
            <p><strong>Order Number:</strong> {order.id}</p>
            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString()}</p>
            <p><strong>Total Amount:</strong> <span className="text-green-700 font-bold">${order.totalPrice.toFixed(2)}</span></p>
            <p><strong>Payment Method:</strong> {getPaymentMethodDisplayName(order.paymentMethod)}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="font-semibold mb-2">Shipping Address:</p>
              <ul className="list-none pl-0 space-y-0.5">
                <li>{order.shippingAddress.name}</li>
                <li>{order.shippingAddress.address}</li>
                <li>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</li>
                <li>{order.shippingAddress.country}</li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="font-semibold mb-2">Items:</p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.quantity} x {item.name} (${item.price.toFixed(2)} each)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <RouterComponents.Link to="/profile">
            <Button variant="primary" size="lg">
              View My Orders
            </Button>
          </RouterComponents.Link>
          <RouterComponents.Link to="/products">
            <Button variant="secondary" size="lg">
              Continue Shopping
            </Button>
          </RouterComponents.Link>
        </div>
        <p className="mt-8 text-sm text-gray-500">
            Note: This is a simulated payment process. No real payment has been made.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;