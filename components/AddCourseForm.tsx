import React, { useState } from 'react';
import Button from './Button';
import { addCourse } from '../services/dataService';
import { CourseModule } from '../types';
import { useToast } from '../context/ToastContext'; // Import useToast

const AddCourseForm: React.FC = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    imageUrl: '',
    instructor: '',
    duration: '',
    price: 0,
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    modules: [{ title: '', content: '' }] as CourseModule[],
  });
  const { showToast } = useToast(); // Use the toast context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleModuleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedModules = courseData.modules.map((module, i) =>
      i === index ? { ...module, [name]: value } : module
    );
    setCourseData((prev) => ({ ...prev, modules: updatedModules }));
  };

  const addModule = () => {
    setCourseData((prev) => ({
      ...prev,
      modules: [...prev.modules, { title: '', content: '' }],
    }));
  };

  const removeModule = (index: number) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseData.title || !courseData.shortDescription || !courseData.longDescription || !courseData.imageUrl || !courseData.instructor || !courseData.duration || courseData.price <= 0 || !courseData.difficulty) {
      showToast('error', 'Please ensure all course fields are filled and price is greater than 0.');
      return;
    }
    if (courseData.modules.some(m => !m.title || !m.content)) {
      showToast('error', 'Please ensure all module titles and content are filled.');
      return;
    }

    addCourse(courseData);
    showToast('success', 'Course added successfully!');
    setCourseData({
      title: '',
      shortDescription: '',
      longDescription: '',
      imageUrl: '',
      instructor: '',
      duration: '',
      price: 0,
      difficulty: 'Beginner',
      modules: [{ title: '', content: '' }],
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={courseData.shortDescription}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
          <textarea
            id="longDescription"
            name="longDescription"
            value={courseData.longDescription}
            onChange={handleChange}
            rows={5}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={courseData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
          <input
            type="text"
            id="instructor"
            name="instructor"
            value={courseData.instructor}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={courseData.duration}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., 4 Months, 10 Hours"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={courseData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            id="difficulty"
            name="difficulty"
            value={courseData.difficulty}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="border-t pt-6 mt-6 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Course Modules</h3>
          {courseData.modules.map((module, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div>
                <label htmlFor={`moduleTitle-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Module {index + 1} Title</label>
                <input
                  type="text"
                  id={`moduleTitle-${index}`}
                  name="title"
                  value={module.title}
                  onChange={(e) => handleModuleChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label htmlFor={`moduleContent-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Module {index + 1} Content</label>
                <textarea
                  id={`moduleContent-${index}`}
                  name="content"
                  value={module.content}
                  onChange={(e) => handleModuleChange(index, e)}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                ></textarea>
              </div>
              {courseData.modules.length > 1 && (
                <div className="md:col-span-2 flex justify-end">
                  <Button type="button" onClick={() => removeModule(index)} variant="danger" size="sm">
                    Remove Module
                  </Button>
                </div>
              )}
            </div>
          ))}
          <Button type="button" onClick={addModule} variant="secondary" className="mt-4">
            Add Another Module
          </Button>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full mt-6">
          Add Course
        </Button>
      </form>
    </div>
  );
};

export default AddCourseForm;