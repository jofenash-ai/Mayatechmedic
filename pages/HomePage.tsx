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
                Shop Electronic Products
              </Button>
            </RouterComponents.Link>
            <RouterComponents.Link to="/courses">
              <Button size="lg" variant="secondary" className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-700">
                Explore Courses
              </Button>
            </RouterComponents.Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <RouterComponents.Link to="/products?category=Microcontrollers" className="group block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <img src="https://picsum.photos/100/100?random=cat1" alt="Microcontrollers" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">Microcontrollers</h3>
          </RouterComponents.Link>
          <RouterComponents.Link to="/products?category=Computer Parts" className="group block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <img src="https://picsum.photos/100/100?random=cat21" alt="Computer Parts" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">Computer Parts</h3>
          </RouterComponents.Link>
          <RouterComponents.Link to="/products?category=Laptop Parts" className="group block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <img src="https://picsum.photos/100/100?random=cat22" alt="Laptop Parts" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">Laptop Parts</h3>
          </RouterComponents.Link>
          <RouterComponents.Link to="/products?category=Printer Parts" className="group block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <img src="https://picsum.photos/100/100?random=cat23" alt="Printer Parts" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">Printer Parts</h3>
          </RouterComponents.Link>
          <RouterComponents.Link to="/products?category=Photocopy Parts" className="group block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <img src="https://picsum.photos/100/100?random=cat24" alt="Photocopy Parts" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">Photocopy Parts</h3>
          </RouterComponents.Link>
          <RouterComponents.Link to="/products?category=General Electronic Components" className="group block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <img src="https://picsum.photos/100/100?random=cat2" alt="General Electronic Components" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">General Electronic Components</h3>
          </RouterComponents.Link>
          <RouterComponents.Link to="/products?category=Tools" className="group block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <img src="https://picsum.photos/100/100?random=cat3" alt="Tools" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">Tools &amp; Equipment</h3>
          </RouterComponents.Link>
          <RouterComponents.Link to="/products?category=Prototyping" className="group block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <img src="https://picsum.photos/100/100?random=cat4" alt="Prototyping" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">Prototyping</h3>
          </RouterComponents.Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Featured Electronic Products
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
          Top Maintenance Courses
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