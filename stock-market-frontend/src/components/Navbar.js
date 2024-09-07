import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 fixed w-full top-0 left-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Placeholder for logo or left content */}
          <div className="flex-1 flex items-center justify-between">
            {/* Empty div for spacing, if you want to add logo or something in the future */}
            <div className="flex-1"></div>

            {/* Navigation Links */}
            <div className="flex space-x-4 ml-auto">
              <Link to="/news-sentiment" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                News Sentiment
              </Link>
              <Link to="/stock-summary" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Stock Summary
              </Link>
              <Link to="/news-topic" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                News Topic
              </Link>
              <Link to="/stock-performance" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Performance
              </Link>
              <Link to="/stock_qa" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                QA
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
