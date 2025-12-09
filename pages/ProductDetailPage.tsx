import React, { useState, useEffect } from 'react';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
// FIX: Replaced direct import of `products` with its getter function.
import { getProducts } from '../services/dataService';
import { Product } from '../types';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext'; // Import useToast

const ProductDetailPage: React.FC = () => {
  const { productId } = RouterComponents.useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();
  const { showToast } = useToast(); // Use the toast context

  useEffect(() => {
    // FIX: Use getProducts() to get the product list.
    const foundProduct = getProducts().find((p) => p.id === productId);
    setProduct(foundProduct);
  }, [productId]);

  if (!product) {
    return (
      <div className="container mx-auto py-12 text-center text-lg text-gray-600 min-h-screen">
        Product not found.
        <br />
        <RouterComponents.Link to="/products" className="text-orange-600 hover:underline mt-4 inline-block">
          Back to Products
        </RouterComponents.Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast('success', `${quantity} x ${product.name} added to cart!`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-5 w-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  // FIX: Use getProducts() to get the product list.
  const relatedProducts = getProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4); // Show up to 4 related products

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="flex justify-center items-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>
            <div className="flex items-center mb-4">
              {renderStars(product.rating)}
              <span className="text-gray-600 ml-2">({product.reviews} reviews)</span>
            </div>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Category: <span className="text-orange-600">{product.category}</span>
            </p>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Condition: <span className="text-orange-600">{product.condition}</span>
            </p>
            <p className="text-gray-800 text-lg leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-baseline mb-6 space-x-4">
              <span className="text-5xl font-extrabold text-green-700">
                ${product.price.toFixed(2)}
              </span>
              {product.stock > 0 ? (
                <span className="text-green-600 text-lg font-medium">In Stock: {product.stock}</span>
              ) : (
                <span className="text-red-600 text-lg font-medium">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-8">
              <label htmlFor="quantity" className="text-lg font-medium text-gray-700">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock > 0 ? product.stock : 1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-24 p-2 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={product.stock === 0}
              />
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || quantity > product.stock}
                size="lg"
                variant="primary"
                className="flex-grow max-w-xs"
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <div key={p.id} className="relative group">
                <RouterComponents.Link to={`/products/${p.id}`} className="block">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-48 object-cover rounded-md shadow-md group-hover:shadow-lg transition-shadow duration-200"
                  />
                  <h3 className="mt-3 text-lg font-semibold text-gray-800 group-hover:text-orange-600 line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    ${p.price.toFixed(2)}
                  </p>
                </RouterComponents.Link>
                <Button
                  onClick={() => addToCart(p, 1)}
                  disabled={p.stock === 0}
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  size="sm"
                  variant="primary"
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;