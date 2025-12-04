import React, { useEffect, useState } from 'react';
// FIX: Updated react-router-dom imports to use namespace import to address "Module has no exported member" errors.
import * as RouterComponents from 'react-router-dom';
// FIX: Replaced direct import of `courses` with its getter function.
import { getCourses } from '../services/dataService';
import { Course } from '../types';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; // Import useToast

const CourseDetailPage: React.FC = () => {
  const { courseId } = RouterComponents.useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const { user, enrollInCourse } = useAuth();
  const navigate = RouterComponents.useNavigate();
  const { showToast } = useToast(); // Use the toast context

  const isEnrolled = user?.enrolledCourseIds.includes(courseId || '') || false;

  useEffect(() => {
    // FIX: Use getCourses() to get the course list.
    const foundCourse = getCourses().find((c) => c.id === courseId);
    setCourse(foundCourse);
  }, [courseId]);

  if (!course) {
    return (
      <div className="container mx-auto py-12 text-center text-lg text-gray-600 min-h-screen">
        Course not found.
        <br />
        <RouterComponents.Link to="/courses" className="text-orange-600 hover:underline mt-4 inline-block">
          Back to Courses
        </RouterComponents.Link>
      </div>
    );
  }

  const handleEnroll = () => {
    if (!user) {
      showToast('info', 'You need to log in to enroll in a course.');
      navigate('/login');
    } else if (courseId) {
      enrollInCourse(courseId);
      // Toast message for success is handled inside AuthContext's enrollInCourse
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Course Image & Basic Info */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full max-w-md h-auto rounded-lg shadow-lg mb-6"
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              {course.title}
            </h2>
            <p className="text-2xl font-extrabold text-green-700 mb-4">
              ${course.price.toFixed(2)}
            </p>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-gray-700 font-medium">
                Instructor: {course.instructor}
              </span>
              <span className="text-gray-700 font-medium">
                Duration: {course.duration}
              </span>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                course.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
              Difficulty: {course.difficulty}
            </span>
            <Button
              onClick={handleEnroll}
              size="lg"
              variant={isEnrolled ? "secondary" : "primary"}
              className="w-full max-w-xs"
              disabled={isEnrolled}
            >
              {isEnrolled ? 'Enrolled' : 'Enroll Now'}
            </Button>
          </div>

          {/* Course Description & Modules */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Course Overview
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {course.longDescription}
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              What You'll Learn
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8 text-lg">
              {course.modules.map((module, index) => (
                <li key={index} className="flex items-start">
                  <span className="font-semibold text-orange-600 mr-2">Module {index + 1}:</span>
                  <div>
                    <span className="font-semibold">{module.title}:</span> {module.content}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-lg text-gray-700">
                    Ready to start your electronics journey?
                    Click "{isEnrolled ? 'Enrolled' : 'Enroll Now'}" to begin!
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;