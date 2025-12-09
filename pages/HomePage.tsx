import React from 'react';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CourseCard from '../components/CourseCard';
import Button from '../components/Button';
// FIX: Replaced direct import of `products` and `courses` with their getter functions.
import { getProducts, getCourses } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { APP_NAME, COMPANY_SLOGAN } from '../constants';

const HomePage: React.FC = () => {
  const { addToCart } = useCart();

  // FIX: Use getter functions to access products and courses.
  const featuredProducts = getProducts().slice(0, 4); // Display first 4 products
  const featuredCourses = getCourses().slice(0, 3); // Display first 3 courses

  const categories = [
    { name: 'Microcontrollers', imageUrl: 'https://picsum.photos/150/150?random=cat1', link: '/products?category=Microcontrollers' },
    { name: 'Computer Parts', imageUrl: 'https://picsum.photos/150/150?random=cat21', link: '/products?category=Computer Parts' },
    { name: 'Laptop Parts', imageUrl: 'https://picsum.photos/150/150?random=cat22', link: '/products?category=Laptop Parts' },
    { name: 'Printer Parts', imageUrl: 'https://picsum.photos/150/150?random=cat23', link: '/products?category=Printer Parts' },
    { name: 'Photocopy Parts', imageUrl: 'https://picsum.photos/150/150?random=cat24', link: '/products?category=Photocopy Parts' },
    { name: 'General Components', imageUrl: 'https://picsum.photos/150/150?random=cat2', link: '/products?category=General Electronic Components' },
    { name: 'Tools & Equipment', imageUrl: 'https://picsum.photos/150/150?random=cat3', link: '/products?category=Tools' },
    { name: 'Prototyping', imageUrl: 'https://picsum.photos/150/150?random=cat4', link: '/products?category=Prototyping' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">
            {APP_NAME}
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">
            {COMPANY_SLOGAN}
          </p>
          <div className="space-x-4 animate-fade-in-up">
            <RouterComponents.Link to="/products">
              <Button size="lg" variant="primary">
                Shop Now
              </Button>
            </RouterComponents.Link>
            <RouterComponents.Link to="/courses">
              <Button size="lg" variant="secondary" className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-700">
                Learn Electronics
              </Button>
            </RouterComponents.Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Explore Our Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <RouterComponents.Link to={category.link} key={category.name} className="group block bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center flex flex-col items-center">
              <img src={category.imageUrl} alt={category.name} className="mx-auto mb-3 h-24 w-24 rounded-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">{category.name}</h3>
            </RouterComponents.Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Top Picks in Electronics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={(p) => addToCart(p, 1)} />
            ))}
          </div>
          <div className="text-center mt-12">
            <RouterComponents.Link to="/products">
              <Button size="lg" variant="secondary">
                View All Electronic Products
              </Button>
            </RouterComponents.Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Enhance Your Skills with Our Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        <div className="text-center mt-12">
          <RouterComponents.Link to="/courses">
            <Button size="lg" variant="secondary">
              Explore All Courses
            </Button>
          </RouterComponents.Link>
        </div>
      </section>

      {/* Call to Action for Learning */}
      <section className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-16 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unleash Your Potential in the World of Electronics!
          </h2>
          <p className="text-lg md:text-xl mb-8">
            From foundational basics to advanced repair techniques, our courses are designed for you.
          </p>
          <RouterComponents.Link to="/courses">
            <Button size="lg" variant="primary" className="bg-white text-green-700 hover:bg-gray-100">
              Start Learning Today
            </Button>
          </RouterComponents.Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;