import React from 'react';
import * as RouterComponents from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { PaymentMethod } from '../types';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = RouterComponents.useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 text-center min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-8">
          You need to log in to view your profile.
        </p>
        <RouterComponents.Link to="/login">
          <Button variant="primary" size="lg">
            Login
          </Button>
        </RouterComponents.Link>
      </div>
    );
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
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">My Profile</h1>

      <div className="bg-white rounded-lg shadow-xl p-6 md:p-10 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <div>
            <span className="font-semibold text-gray-700">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Role:</span> <span className="capitalize">{user.role}</span>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <RouterComponents.Link to="/my-courses">
            <Button variant="secondary" size="md">
              View My Courses ({user.enrolledCourseIds.length})
            </Button>
          </RouterComponents.Link>
          {user.role === 'admin' && (
            <RouterComponents.Link to="/admin">
              <Button variant="secondary" size="md">
                Admin Dashboard
              </Button>
            </RouterComponents.Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Order History</h2>
        {user.orders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-8">
            <p className="mb-4">You haven't placed any orders yet.</p>
            <RouterComponents.Link to="/products">
              <Button variant="primary" size="md">
                Start Shopping
              </Button>
            </RouterComponents.Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ship To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {user.orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {getPaymentMethodDisplayName(order.paymentMethod)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <p>{order.shippingAddress.name}</p>
                      <p className="text-gray-500 text-xs">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <ul className="list-disc list-inside space-y-1">
                        {order.items.map((item) => (
                          <li key={item.productId} className="text-gray-600">
                            {item.quantity} x {item.name} (${item.price.toFixed(2)} each)
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;