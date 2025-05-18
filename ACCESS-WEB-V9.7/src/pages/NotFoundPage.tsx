import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found page
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        404
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#0fae96] hover:bg-[#0c9a85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96] transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;