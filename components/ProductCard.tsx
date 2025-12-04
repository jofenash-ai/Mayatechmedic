import React from 'react';
import { Product } from '../types';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
import Button from './Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <RouterComponents.Link to={`/products/${product.id}`} className="block relative h-48 sm:h-56 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-red-600 bg-opacity-75 flex items-center justify-center">
            <span className="text-white text-lg font-bold">Out of Stock</span>
          </div>
        )}
      </RouterComponents.Link>
      <div className="p-4 flex flex-col flex-grow">
        <RouterComponents.Link to={`/products/${product.id}`} className="text-lg font-semibold text-gray-800 hover:text-orange-600 line-clamp-2 mb-2">
          {product.name}
        </RouterComponents.Link>
        <div className="flex items-center mb-2">
          {renderStars(product.rating)}
          <span className="text-sm text-gray-600 ml-2">({product.reviews} reviews)</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 mt-auto mb-3">
          ${product.price.toFixed(2)}
        </p>
        <Button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="w-full text-sm"
          variant="primary"
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;