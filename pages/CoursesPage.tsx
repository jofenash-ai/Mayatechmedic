import React, { useState, useMemo } from 'react';
import CourseCard from '../components/CourseCard';
// FIX: Replaced direct import of `courses` with its getter function.
import { getCourses } from '../services/dataService';
import { Course } from '../types';

const CoursesPage: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | Course['difficulty']>('All');
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc'>('price-asc');

  const filteredCourses = useMemo(() => {
    // FIX: Use getCourses() to get the course list.
    let courses = getCourses().filter((course) =>
      selectedDifficulty === 'All' || course.difficulty === selectedDifficulty
    );

    switch (sortOrder) {
      case 'price-asc':
        courses.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        courses.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return courses;
  }, [selectedDifficulty, sortOrder]);

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Our Maintenance Courses
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
        {/* Difficulty Filter */}
        <div className="w-full md:w-1/3 mx-auto">
          <label htmlFor="difficulty-select" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Difficulty
          </label>
          <select
            id="difficulty-select"
            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as typeof selectedDifficulty)}
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Price Sort */}
        <div className="w-full md:w-1/3 mx-auto">
          <label htmlFor="price-sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort by Price
          </label>
          <select
            id="price-sort"
            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
          >
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-12">No courses matching your criteria were found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;