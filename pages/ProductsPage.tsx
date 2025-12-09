import React, { useState, useEffect, useMemo } from 'react';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
import ProductCard from '../components/ProductCard';
// FIX: Replaced direct import of `products` with its getter function.
import { getProducts } from '../services/dataService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();
  const location = RouterComponents.useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || 'All');
  const [selectedCondition, setSelectedCondition] = useState<'All' | Product['condition']>('All'); // New state for condition filter
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc'>('name-asc');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  useEffect(() => {
    setSearchTerm(queryParams.get('search') || '');
    setSelectedCategory(queryParams.get('category') || 'All');
  }, [queryParams]);

  const allCategories = useMemo(() => {
    // FIX: Use getProducts() to get the product list.
    const products = getProducts();
    const categories = new Set(products.map((p) => p.category));
    // FIX: Explicitly type `category` in map function to resolve 'unknown' type issues.
    return ['All', ...Array.from(categories)].sort((a: string, b: string) => a.localeCompare(b));
  }, []);

  const allConditions: ('All' | Product['condition'])[] = ['All', 'New', 'Used', 'Refurbished']; // Defined conditions

  const filteredAndSortedProducts = useMemo(() => {
    // FIX: Use getProducts() to get the product list.
    let filtered = getProducts().filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesCondition = selectedCondition === 'All' || product.condition === selectedCondition; // New condition filter
      const matchesMinPrice = minPrice === '' || product.price >= minPrice;
      const matchesMaxPrice = maxPrice === '' || product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesCondition && matchesMinPrice && matchesMaxPrice;
    });

    switch (sortOrder) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sort (e.g., by name-asc)
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return filtered;
  }, [searchTerm, selectedCategory, selectedCondition, sortOrder, minPrice, maxPrice]); // Added new filter dependencies

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Electronic Products
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 mb-8 bg-white p-6 rounded-lg shadow-md">
        {/* Search Input */}
        <div className="flex-grow">
          <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
            Search Product
          </label>
          <input
            type="text"
            id="search-input"
            placeholder="Search by name or description..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-1/5">
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category-select"
            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {allCategories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8 bg-white p-6 rounded-lg shadow-md">
        {/* Condition Filter (New) */}
        <div className="w-full lg:w-1/5">
          <label htmlFor="condition-select" className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            id="condition-select"
            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value as typeof selectedCondition)}
          >
            {allConditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filters (New) */}
        <div className="w-full lg:w-2/5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="w-full lg:w-1/5">
          <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort-select"
            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="rating-desc">Rating (High to Low)</option>
          </select>
        </div>
      </div>


      {filteredAndSortedProducts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-12">No products matching your criteria were found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={(p) => addToCart(p, 1)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;