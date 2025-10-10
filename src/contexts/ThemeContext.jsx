import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme configurations
const themes = {
  earthy: {
    name: 'Earthy',
    colors: {
      // Primary colors
      primary: 'bg-rust-500',
      primaryHover: 'hover:bg-rust-600',
      primaryText: 'text-rust-500',
      primaryTextHover: 'hover:text-rust-600',
      
      // Secondary colors
      secondary: 'bg-terracotta-400',
      secondaryText: 'text-terracotta-400',
      secondaryTextHover: 'hover:text-terracotta-500',
      
      // Background colors
      bgPrimary: 'bg-cream-100',
      bgSecondary: 'bg-white',
      bgAccent: 'bg-terracotta-200',
      
      // Text colors
      textPrimary: 'text-brown-800',
      textSecondary: 'text-brown-700',
      textAccent: 'text-brown-600',
      
      // Border colors
      borderPrimary: 'border-tan-200',
      borderSecondary: 'border-tan-300',
      borderHover: 'hover:border-rust-400',
      
      // Button styles
      btnPrimary: 'bg-rust-500 hover:bg-rust-600 text-white',
      btnSecondary: 'bg-white text-rust-500 border-2 border-rust-500 hover:bg-cream-50',
      
      // Navigation
      navBg: 'bg-cream-100',
      navText: 'text-brown-700',
      navTextHover: 'hover:text-rust-500',
      navActive: 'bg-rust-500 text-white',
      navBorder: 'border-tan-200'
    }
  },
  cool: {
    name: 'Cool',
    colors: {
      // Primary colors
      primary: 'bg-slate-blue',
      primaryHover: 'hover:bg-charcoal-grey',
      primaryText: 'text-slate-blue',
      primaryTextHover: 'hover:text-charcoal-grey',
      
      // Secondary colors
      secondary: 'bg-blue-grey',
      secondaryText: 'text-blue-grey',
      secondaryTextHover: 'hover:text-charcoal-grey',
      
      // Background colors
      bgPrimary: 'bg-pale-lavender',
      bgSecondary: 'bg-white',
      bgAccent: 'bg-cool-grey',
      
      // Text colors
      textPrimary: 'text-charcoal-grey',
      textSecondary: 'text-slate-blue',
      textAccent: 'text-blue-grey',
      
      // Border colors
      borderPrimary: 'border-cool-grey',
      borderSecondary: 'border-blue-grey',
      borderHover: 'hover:border-blue-grey',
      
      // Button styles
      btnPrimary: 'bg-slate-blue hover:bg-charcoal-grey text-white',
      btnSecondary: 'bg-white text-slate-blue border-2 border-slate-blue hover:bg-pale-lavender',
      
      // Navigation
      navBg: 'bg-pale-lavender',
      navText: 'text-charcoal-grey',
      navTextHover: 'hover:text-slate-blue',
      navActive: 'bg-slate-blue text-white',
      navBorder: 'border-cool-grey'
    }
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('earthy');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    
    // Apply theme-specific CSS classes to the document body
    document.body.className = currentTheme === 'cool' ? 'theme-cool' : 'theme-earthy';
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'earthy' ? 'cool' : 'earthy');
  };

  const theme = themes[currentTheme];

  const value = {
    currentTheme,
    theme,
    toggleTheme,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};