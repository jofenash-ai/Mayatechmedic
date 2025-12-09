export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  condition: 'New' | 'Used' | 'Refurbished'; // New field for Jiji-like functionality
}

export interface CourseModule {
  title: string;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  instructor: string;
  duration: string;
  price: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: CourseModule[];
  learningSchedule: string[]; // New field for structured learning path
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// New: ShippingAddress interface
export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

// Expanded PaymentMethod type
export type PaymentMethod =
  | 'CBE_BIRR'
  | 'TELEBIRR'
  | 'AMOLE'
  | 'PAYPAL'
  | 'APPLE_PAY'
  | 'VISA'
  | 'MASTERCARD'
  | 'BANK_TRANSFER'
  | 'CASH_ON_DELIVERY';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  orderDate: string; // ISO string format
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress; // Added shipping address
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  enrolledCourseIds: string[];
  orders: Order[];
}

export interface UserToken {
  token: string;
  expiresAt: number; // Unix timestamp
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  enrollInCourse: (courseId: string) => void;
  addOrderToUserHistory: (order: Order) => void;
  isAdmin: boolean;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// New: Toast notification types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

// FIX: Updated ToastContextType to include the `toasts` array.
export interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (type: ToastType, message: string) => void;
}