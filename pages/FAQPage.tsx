import React from 'react';
import { FAQ_CONTENT, APP_NAME } from '../constants';

const FAQPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-10 prose prose-lg max-w-none">
        {/* dangerouslySetInnerHTML is used here to render the markdown-like content from constants.ts */}
        <div dangerouslySetInnerHTML={{ __html: FAQ_CONTENT }} />
      </div>
    </div>
  );
};

export default FAQPage;