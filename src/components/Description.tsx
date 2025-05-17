import React from 'react';

const Description = () => {
  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Track Your Emotional Journey
        </h2>
        <div className="text-gray-600 space-y-4">
          <p className="text-lg">
            Welcome to MoodTracker, your personal emotional wellness companion. Capture and visualize your daily moods 
            through images, helping you understand and reflect on your emotional journey.
          </p>
          <p>
            Express your feelings visually by uploading images that represent your current mood. Whether it's a 
            serene landscape for peaceful days or vibrant art for energetic moments, let your images tell your story.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Document your daily emotional state with meaningful images</li>
            <li>Build a visual diary of your mood patterns</li>
            <li>Reflect on your emotional journey over time</li>
            <li>Gain insights into your emotional well-being</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Description;
