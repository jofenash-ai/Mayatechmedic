import React from 'react';
import { APP_NAME, COMPANY_SLOGAN } from '../constants';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          About {APP_NAME}
        </h1>

        <div className="text-lg text-gray-700 leading-relaxed space-y-6">
          <p>
            Welcome to <span className="font-semibold text-orange-600">{APP_NAME}</span>, your online marketplace for
            high-quality electronic spare parts and comprehensive maintenance courses.
            We are dedicated to empowering individuals and businesses with the tools and knowledge
            necessary to thrive in the ever-evolving world of electronics.
          </p>
          <p>
            Our mission is simple: <span className="font-bold">{COMPANY_SLOGAN}</span>.
            Whether you're a hobbyist working on your next project, a student eager to learn,
            or a professional technician in need of reliable components, we've got you covered.
          </p>

          <h2 className="text-3xl font-bold text-gray-800 pt-8 mb-4">Our Story</h2>
          <p>
            Founded by a team of experienced electronics engineers and educators, {APP_NAME}
            began with a vision to bridge the gap between theoretical knowledge and practical application in electronics.
            We understood the challenges many face in accessing authentic components and
            quality education. Thus, {APP_NAME} was born – a platform bringing together
            a curated selection of products and expert-led courses.
          </p>

          <h2 className="3xl font-bold text-gray-800 pt-8 mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="font-semibold text-orange-600">Premium Electronic Parts:</span>
              &nbsp;From microcontrollers and sensors to resistors and capacitors,
              we stock a wide array of genuine, high-performance electronic components.
              Each product is sourced from trusted manufacturers, ensuring reliability and longevity.
            </li>
            <li>
              <span className="font-semibold text-orange-600">Expert Maintenance Courses:</span>
              &nbsp;Our courses are designed by industry professionals and educators.
              They cover a spectrum of topics from beginner basics to advanced repair techniques,
              including Arduino programming, Raspberry Pi projects, PCB design,
              and general electronics troubleshooting. Learn at your own pace with hands-on exercises and real-world examples.
            </li>
            <li>
              <span className="font-semibold text-orange-600">Community &amp; Support:</span>
              &nbsp;We believe in fostering a vibrant community of learners and makers.
              Our platform provides resources and support to help you on your journey.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-800 pt-8 mb-4">Our Commitment</h2>
          <p>
            At {APP_NAME}, we are committed to quality, affordability, and customer satisfaction.
            We strive to provide an unparalleled shopping and learning experience,
            backed by excellent customer service and technical support.
            Join us in making electronic knowledge accessible to everyone.
          </p>

          <p className="pt-6 italic text-gray-600 text-center">
            Thank you for choosing {APP_NAME}. We look forward to helping you shop, learn, and innovate!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;