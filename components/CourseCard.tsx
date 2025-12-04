import React from 'react';
import { Course } from '../types';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
import Button from './Button';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <RouterComponents.Link to={`/courses/${course.id}`} className="block relative h-48 sm:h-56 overflow-hidden">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </RouterComponents.Link>
      <div className="p-4 flex flex-col flex-grow">
        <RouterComponents.Link to={`/courses/${course.id}`} className="text-xl font-semibold text-gray-800 hover:text-orange-600 line-clamp-2 mb-2">
          {course.title}
        </RouterComponents.Link>
        <p className="text-sm text-gray-600 line-clamp-3 flex-grow mb-3">
          {course.shortDescription}
        </p>
        <div className="flex justify-between items-center mb-3 text-sm">
          <span className="text-gray-700">
            Instructor: <span className="font-medium">{course.instructor}</span>
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
              course.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
            {course.difficulty}
          </span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-gray-900">
            ${course.price.toFixed(2)}
          </span>
          <span className="text-gray-600 text-sm">
            {course.duration}
          </span>
        </div>
        <RouterComponents.Link to={`/courses/${course.id}`}>
          <Button variant="outline" className="w-full text-sm">
            View Details
          </Button>
        </RouterComponents.Link>
      </div>
    </div>
  );
};

export default CourseCard;