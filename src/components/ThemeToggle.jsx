import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      title={`Switch to ${currentTheme === 'earthy' ? 'Cool' : 'Earthy'} theme`}
      aria-label={`Switch to ${currentTheme === 'earthy' ? 'Cool' : 'Earthy'} theme`}
    >
      {currentTheme === 'earthy' ? (
        // Cool theme icon (snowflake)
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2L9 3m3 3l3-3M12 18v2m0-2l-3 3m3-3l3 3M6 12H4m2 0L3 9m3 3L3 15M18 12h2m-2 0l3-3m-3 3l3 3M9 9l-3-3m0 0v12m0-12h12M15 15l3 3m0 0V6m0 12H6" />
        </svg>
      ) : (
        // Earthy theme icon (sun)
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}