import React, { useState } from 'react';
import Button from './Button';
import { addProduct } from '../services/dataService';
import { useToast } from '../context/ToastContext'; // Import useToast

const AddProductForm: React.FC = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    stock: 0,
    rating: 0,
    reviews: 0,
  });
  const { showToast } = useToast(); // Use the toast context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: ['price', 'stock', 'rating', 'reviews'].includes(name) ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData.name || !productData.description || !productData.imageUrl || !productData.category || productData.price <= 0 || productData.stock <= 0) {
      showToast('error', 'Please ensure all product fields are filled and price/stock are greater than 0.');
      return;
    }
    addProduct(productData);
    showToast('success', 'Product added successfully!');
    setProductData({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      stock: 0,
      rating: 0,
      reviews: 0,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={productData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5, optional)</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={productData.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label htmlFor="reviews" className="block text-sm font-medium text-gray-700 mb-1">Number of Reviews (optional)</label>
          <input
            type="number"
            id="reviews"
            name="reviews"
            value={productData.reviews}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full mt-6">
          Add Product
        </Button>
      </form>
    </div>
  );
};

export default AddProductForm;