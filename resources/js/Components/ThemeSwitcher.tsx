import React, { useState, useEffect } from 'react';

interface SwicherProps{
  className : string;
}

const ThemeSwitcher: React.FC<SwicherProps> = ({className}) => {
    const [darkMode, setDarkMode] = useState(false);
  
    useEffect(() => {
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDarkMode);
    }, []);
  
    useEffect(() => {
      document.documentElement.classList.toggle('dark', darkMode);
      localStorage.setItem('darkMode', JSON.stringify(darkMode)); 
    }, [darkMode]);
  
    const toggleDarkMode = () => {
      setDarkMode((prevMode) => !prevMode);
    };
  
    return (
        <button
        onClick={toggleDarkMode}
        className={`${className} px-4 py-2 rounded-full ${
          darkMode ? 'bg-yellow-400' : 'bg-gray-800'
        } ${
          darkMode ? 'text-gray-900' : 'text-white'
        } transition-colors duration-200`}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    );
  };
  

export default ThemeSwitcher;