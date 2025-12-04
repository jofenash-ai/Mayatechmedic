import React, { useMemo } from 'react';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// FIX: Replaced direct import of `courses` with its getter function.
import { getCourses } from '../services/dataService';
import CourseCard from '../components/CourseCard';
import Button from '../components/Button';

const MyCoursesPage: React.FC = () => {
  const { user } = useAuth();

  const enrolledCourses = useMemo(() => {
    if (!user || !user.enrolledCourseIds) {
      return [];
    }
    // FIX: Use getCourses() to get the course list.
    return getCourses().filter((course) => user.enrolledCourseIds.includes(course.id));
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 text-center min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-8">
          You need to log in to view your enrolled courses.
        </p>
        <RouterComponents.Link to="/login">
          <Button variant="primary" size="lg">
            Login
          </Button>
        </RouterComponents.Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        My Enrolled Courses
      </h1>

      {enrolledCourses.length === 0 ? (
        <div className="text-center text-gray-600 text-lg mt-12">
          <p className="mb-4">You haven't enrolled in any courses yet.</p>
          <p className="mb-8">Explore our courses and start your learning journey!</p>
          <RouterComponents.Link to="/courses">
            <Button variant="primary" size="lg">
              View All Courses
            </Button>
          </RouterComponents.Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;