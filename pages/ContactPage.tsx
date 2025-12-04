import React, { useState } from 'react';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext'; // Import useToast

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { showToast } = useToast(); // Use the toast context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending form data
    console.log('Form submitted:', formData);
    showToast('success', 'Thank you for your message! We will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
  };

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Information */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Contact Us</h1>
          <p className="text-lg text-gray-700 mb-8">
            Have questions about our products, courses, or need technical assistance?
            We're here to help! Reach out to us using the form below or through our contact information.
          </p>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Office</h3>
              <p>123 Electronics Way</p>
              <p>Tech City, TC 90210</p>
              <p>Ethiopia</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
              <p>
                <a href="mailto:support@mayatech.com" className="text-orange-600 hover:underline">
                  support@mayatech.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 5:00 PM (EAT)</p>
              <p>Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
              ></textarea>
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;