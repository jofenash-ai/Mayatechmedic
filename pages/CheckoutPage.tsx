
import React, { useState } from 'react';
// FIX: Updated react-router-dom imports to use namespace import to address "String literal expected.", "Cannot find name 'from'." and "Cannot find name 'RouterComponents'." errors.
import * as RouterComponents from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { OrderItem, Order, PaymentMethod, ShippingAddress } from '../types';
import { generateUniqueId } from '../services/dataService'; // Assuming you have this helper
import { useToast } from '../context/ToastContext'; // Import useToast

const CheckoutPage: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, addOrderToUserHistory } = useAuth();
  const navigate = RouterComponents.useNavigate();
  const { showToast } = useToast(); // Use the toast context

  const [shippingDetails, setShippingDetails] = useState<ShippingAddress>({
    name: user?.name || '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Ethiopia', // Default country
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock payment details state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState('');

  // Redirect if not logged in or cart is empty
  React.useEffect(() => {
    if (!user) {
      showToast('info', 'You need to log in before proceeding to checkout.');
      navigate('/login', { replace: true });
    } else if (cartItems.length === 0) {
      showToast('info', 'Your cart is empty. Add items before proceeding to checkout.');
      navigate('/cart', { replace: true });
    }
  }, [user, cartItems, navigate, showToast]);


  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (!shippingDetails.name || !shippingDetails.address || !shippingDetails.city || !shippingDetails.zipCode || !shippingDetails.country) {
      showToast('error', 'Please ensure all shipping details are filled.');
      return false;
    }
    if (!selectedPaymentMethod) {
      showToast('error', 'Please select a payment method.');
      return false;
    }

    // Payment method specific validation
    if (selectedPaymentMethod === 'VISA' || selectedPaymentMethod === 'MASTERCARD') {
      if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
        showToast('error', 'Please enter a valid 16-digit card number.');
        return false;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
        showToast('error', 'Please enter a valid expiry date (MM/YY).');
        return false;
      }
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        showToast('error', 'Please enter a valid 3 or 4-digit CVV.');
        return false;
      }
    } else if (['CBE_BIRR', 'TELEBIRR', 'AMOLE'].includes(selectedPaymentMethod)) {
      if (!/^\+?\d{7,15}$/.test(mobileMoneyPhone)) { // Generic international phone format
        showToast('error', 'Please enter a valid phone number for mobile money.');
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || cartItems.length === 0) {
        // These conditions are already handled by useEffect and will redirect.
        // This check is a safeguard.
        return;
    }

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    // Simulate backend order processing
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
      quantity: item.quantity,
    }));

    const newOrder: Order = {
      id: generateUniqueId('o'),
      items: orderItems,
      totalPrice: getTotalPrice(),
      orderDate: new Date().toISOString(),
      status: 'Pending', // Initial status
      paymentMethod: selectedPaymentMethod as PaymentMethod, // Cast as we've validated it
      shippingAddress: shippingDetails,
    };

    addOrderToUserHistory(newOrder); // Update user's order history in AuthContext & localStorage
    clearCart(); // Clear cart after successful order

    setIsLoading(false);
    showToast('success', 'Order placed successfully! Redirecting to confirmation...');
    navigate('/order-confirmation', { state: { order: newOrder } });
  };

  if (!user || cartItems.length === 0) {
    return null; // Render nothing if redirecting due to lack of user or empty cart
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Details & Payment Selection */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={shippingDetails.name}
                onChange={handleShippingChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingDetails.address}
                onChange={handleShippingChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Street address, P.O. Box, Company name, c/o"
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingDetails.city}
                onChange={handleShippingChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={shippingDetails.zipCode}
                onChange={handleShippingChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={shippingDetails.country}
                onChange={handleShippingChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                disabled // Country is defaulted to Ethiopia for this exercise
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-8 border-t pt-6">Select Payment Method</h2>
          <div className="space-y-4">
            {/* Ethiopian Mobile Money */}
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Mobile Money (Ethiopian)</h3>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CBE_BIRR"
                  checked={selectedPaymentMethod === 'CBE_BIRR'}
                  onChange={() => setSelectedPaymentMethod('CBE_BIRR')}
                  className="form-radio h-5 w-5 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 text-base font-medium text-gray-800">CBE Birr</span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Commercial_Bank_of_Ethiopia_logo.svg/1200px-Commercial_Bank_of_Ethiopia_logo.svg.png" alt="CBE Birr" className="h-6 ml-auto" />
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="TELEBIRR"
                  checked={selectedPaymentMethod === 'TELEBIRR'}
                  onChange={() => setSelectedPaymentMethod('TELEBIRR')}
                  className="form-radio h-5 w-5 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 text-base font-medium text-gray-800">Telebirr</span>
                <img src="https://upload.wikimedia.org/wikipedia/en/2/2f/Telebirr_logo.png" alt="Telebirr" className="h-6 ml-auto" />
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="AMOLE"
                  checked={selectedPaymentMethod === 'AMOLE'}
                  onChange={() => setSelectedPaymentMethod('AMOLE')}
                  className="form-radio h-5 w-5 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 text-base font-medium text-gray-800">Amole</span>
                <img src="https://amole.com/assets/img/logo.png" alt="Amole" className="h-6 ml-auto" />
              </label>
              {['CBE_BIRR', 'TELEBIRR', 'AMOLE'].includes(selectedPaymentMethod) && (
                <div className="mt-4">
                  <label htmlFor="mobileMoneyPhone" className="block text-sm font-medium text-gray-700 mb-1">Mobile Money Phone Number</label>
                  <input
                    type="tel"
                    id="mobileMoneyPhone"
                    name="mobileMoneyPhone"
                    value={mobileMoneyPhone}
                    onChange={(e) => setMobileMoneyPhone(e.target.value)}
                    placeholder="e.g., +2519xxxxxxxx"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              )}
            </div>

            {/* International Credit/Debit Cards */}
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">International Cards</h3>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VISA"
                  checked={selectedPaymentMethod === 'VISA'}
                  onChange={() => setSelectedPaymentMethod('VISA')}
                  className="form-radio h-5 w-5 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 text-base font-medium text-gray-800">Visa</span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 ml-auto" />
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="MASTERCARD"
                  checked={selectedPaymentMethod === 'MASTERCARD'}
                  onChange={() => setSelectedPaymentMethod('MASTERCARD')}
                  className="form-radio h-5 w-5 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 text-base font-medium text-gray-800">MasterCard</span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1280px-MasterCard_Logo.svg.png" alt="MasterCard" className="h-6 ml-auto" />
              </label>
              {(selectedPaymentMethod === 'VISA' || selectedPaymentMethod === 'MASTERCARD') && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="col-span-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      maxLength={19} // 16 digits + 3 spaces
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      placeholder="XXX"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Other Digital Wallets & Options */}
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Other Options</h3>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PAYPAL"
                  checked={selectedPaymentMethod === 'PAYPAL'}
                  onChange={() => setSelectedPaymentMethod('PAYPAL')}
                  className="form-radio h-5 w-5 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 text-base font-medium text-gray-800">PayPal</span>
                <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg" alt="PayPal" className="h-6 ml-auto" />
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="APPLE_PAY"
                  checked={selectedPaymentMethod === 'APPLE_PAY'}
                  onChange={() => setSelectedPaymentMethod('APPLE_PAY')}
                  className="form-radio h-5 w-5 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 text-base font-medium text-gray-800">Apple Pay</span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Apple_Pay_logo.svg/1200px-Apple_Pay_logo.svg.png" alt="Apple Pay" className="h-6 ml-auto" />
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={selectedPaymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setSelectedPaymentMethod('BANK_TRANSFER')}
                  className="form-radio h-5 w-5 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 text-base font-medium text-gray-800">Bank Transfer</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 ml-auto text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9H19.5a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25H2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25A2.25 2.25 0 0 1 2.25 9Z" />
                </svg>
              </label>
              {selectedPaymentMethod === 'BANK_TRANSFER' && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                  <p className="font-semibold">Bank Name: MayaTech Bank</p>
                  <p>Account Number: 123-456-7890</p>
                  <p>SWIFT Code: MAYAETAA</p>
                  <p className="mt-2">Please transfer the total amount including your order number as reference.</p>
                </div>
              )}
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH_ON_DELIVERY"
                  checked={selectedPaymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setSelectedPaymentMethod('CASH_ON_DELIVERY')}
                  className="form-radio h-5 w-5 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 text-base font-medium text-gray-800">Cash on Delivery</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 ml-auto text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0Z" />
                </svg>
              </label>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-600 border-t pt-4">
            <span className="font-bold text-red-600">Disclaimer:</span> This is a simulated payment process and not a real transaction. A true commercial website requires a secure backend server and integration with actual payment gateways (e.g., Chapa, Google Pay, Stripe, etc.). No real payments will be processed.
          </p>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-700 line-clamp-1">{item.quantity} x {item.product.name}</span>
              <span className="font-semibold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center text-lg">
            <span>Subtotal:</span>
            <span className="font-semibold">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg mb-4">
            <span>Shipping:</span>
            <span className="font-semibold">FREE (Simulated)</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xl font-bold">
            <span>Order Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-6"
            isLoading={isLoading}
            disabled={!selectedPaymentMethod || cartItems.length === 0}
          >
            {isLoading ? 'Processing order...' : 'Place Order'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;