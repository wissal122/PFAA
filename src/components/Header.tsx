import React from 'react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-md">
            {/* Use emoji instead of icon */}
            <span role="img" aria-label="camera" className="text-white text-xl">📷</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">MoodTracker</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
