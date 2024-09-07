import React from 'react';

const HomePage = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/wallpaper.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full bg-black bg-opacity-50 text-white">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to the Stock Market Dashboard
        </h1>
        <p className="text-xl mb-2 drop-shadow-md">
          Get the latest insights, news sentiment, stock performance, and more!
        </p>
        <p className="text-lg drop-shadow-md">
          Use the navigation above to explore the features of this application.
        </p>
      </div>

      {/* Optional overlay for darkening the video */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
    </div>
  );
};

export default HomePage;
