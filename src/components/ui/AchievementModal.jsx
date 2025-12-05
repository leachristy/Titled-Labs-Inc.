import React, { useEffect } from 'react';
import { useAchievements } from '../../contexts/AchievementContext';

const AchievementModal = () => {
  const { currentNotification, closeNotification } = useAchievements();

  if (!currentNotification) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
      {/* Modal Card */}
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100 animate-bounce-in">
        
        {/* Badge Icon */}
        <div className="mx-auto w-24 h-24 flex items-center justify-center mb-4">
           <img 
             src={currentNotification.badge} 
             alt={currentNotification.title} 
             className="w-full h-full object-contain drop-shadow-md animate-pulse"
           />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Achievement Unlocked!
        </h2>
        
        <h3 className="text-xl text-purple-600 font-semibold mb-2">
          {currentNotification.title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {currentNotification.description}
        </p>

        <button
          onClick={closeNotification}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};

export default AchievementModal;