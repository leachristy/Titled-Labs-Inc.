/**
 * Theme Context for Application-Wide Theme Management
 * 
 * Provides two theme options: 'earthy' (warm, brown tones) and 'cool' (lavender, blue-grey tones)
 * Persists theme preference to localStorage
 * Applies theme-specific CSS classes to document body
 * 
 * Available themes:
 * - earthy: Warm color palette (rust, cream, brown, terracotta)
 * - cool: Cool color palette (lavender, blue-grey, slate, charcoal)
 * 
 * Available functions:
 * - toggleTheme(): Switch between earthy and cool themes
 * 
 * Available state:
 * - currentTheme: String ('earthy' or 'cool')
 * - theme: Current theme configuration object with color classes
 * - themes: All available theme configurations
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Configuration Objects
 * 
 * Defines all Tailwind CSS classes for each theme
 * Organized by category: primary, secondary, background, text, border, button, navigation
 */
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

// Create Theme Context
const ThemeContext = createContext();

/**
 * Custom Hook: useTheme
 * 
 * Provides easy access to theme context in any component
 * Throws error if used outside ThemeProvider
 * 
 * Usage example:
 * const { currentTheme, toggleTheme, theme } = useTheme();
 * const isEarthy = currentTheme === 'earthy';
 * 
 * @returns {Object} Theme context value with currentTheme, theme config, and toggleTheme function
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * ThemeProvider Component
 * 
 * Wraps the entire app to provide theme state and functions to all child components
 * Manages theme persistence via localStorage
 * Applies theme CSS classes to document body for global styling
 * 
 * @param {ReactNode} children - All components wrapped by this provider
 */
export const ThemeProvider = ({ children }) => {
  // Default theme is 'earthy'
  const [currentTheme, setCurrentTheme] = useState('earthy');

  /**
   * Load saved theme from localStorage on component mount
   * Falls back to 'earthy' if no saved theme exists
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  /**
   * Save theme to localStorage and apply CSS classes when theme changes
   * Adds 'theme-cool' or 'theme-earthy' class to document body
   * This allows for CSS-based theme styling in addition to Tailwind classes
   */
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    
    // Apply theme-specific CSS class to body element for global theme styling
    document.body.className = currentTheme === 'cool' ? 'theme-cool' : 'theme-earthy';
  }, [currentTheme]);

  /**
   * Toggle Theme Function
   * 
   * Switches between 'earthy' and 'cool' themes
   * Automatically triggers localStorage save and CSS class update via useEffect
   */
  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'earthy' ? 'cool' : 'earthy');
  };

  // Get the current theme configuration object
  const theme = themes[currentTheme];

  // Context value provided to all child components
  const value = {
    currentTheme,   // String: 'earthy' or 'cool'
    theme,          // Object: Current theme configuration with all CSS classes
    toggleTheme,    // Function: Switch between themes
    themes          // Object: All available theme configurations
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};