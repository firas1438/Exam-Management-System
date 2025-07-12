// components/AlertPopup.tsx
"use client";

import { useState, useEffect } from 'react';

const AlertPopup = ({ message }: { message: string }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 9000); // 9 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 bg-white p-3 rounded-md shadow-lg max-w-xs z-40 border border-gray-200 border-l-4 border-l-red-500 animate-fade-in-up">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <img 
            src="/warning.png" 
            alt="Warning icon" 
            className="w-5 h-5"
            aria-hidden="true"
          />
          <h3 className="text-md font-semibold">Alerte</h3>
        </div>
        <button 
          onClick={handleClose} 
          className="text-gray-500 hover:text-gray-700 text-lg"
          aria-label="Close alert"
        >
          &times;
        </button>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default AlertPopup;