import React from 'react';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; // Import useToast

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = RouterComponents.useNavigate();
  const { showToast } = useToast(); // Use the toast context

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      showToast('info', 'Item removed from cart.');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    showToast('info', `${productName} removed from cart.`);
  };

  const handleClearCart = () => {
    clearCart();
    showToast('info', 'Your cart is now empty.');
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      showToast('info', 'You need to log in before proceeding to checkout.');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-gray-600 mb-8">
          It looks like you haven't added anything to your cart yet.
        </p>
        <RouterComponents.Link to="/products">
          <Button variant="primary" size="lg">
            Start Shopping
          </Button>
        </RouterComponents.Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-3/4 bg-white rounded-lg shadow-md p-6">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 py-4 last:border-b-0"
            >
              <div className="flex items-center w-full sm:w-2/3 mb-4 sm:mb-0">
                <RouterComponents.Link to={`/products/${item.product.id}`} className="flex-shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                </RouterComponents.Link>
                <div className="flex-grow">
                  <RouterComponents.Link to={`/products/${item.product.id}`} className="text-lg font-semibold text-gray-800 hover:text-orange-600 line-clamp-2">
                    {item.product.name}
                  </RouterComponents.Link>
                  <p className="text-gray-600">Price: ${item.product.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md"
                    aria-label={`Decrease quantity of ${item.product.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value))}
                    className="w-16 text-center border-x border-gray-300 focus:outline-none"
                    min="1"
                    aria-label={`Quantity of ${item.product.name}`}
                  />
                  <button
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md"
                    aria-label={`Increase quantity of ${item.product.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
                <span className="text-lg font-semibold text-gray-900 w-24 text-right">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <Button
                  onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50 text-sm p-1"
                  aria-label={`Remove ${item.product.name} from cart`}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-6">
            <Button onClick={handleClearCart} variant="outline" className="text-gray-700 hover:bg-gray-50">
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="flex justify-between items-center text-lg mb-2">
            <span>Subtotal:</span>
            <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg mb-4">
            <span>Shipping:</span>
            <span className="font-semibold">Calculated at checkout</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xl font-bold">
            <span>Order Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <Button onClick={handleProceedToCheckout} variant="primary" size="lg" className="w-full mt-6">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;