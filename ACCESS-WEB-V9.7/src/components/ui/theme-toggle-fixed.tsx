import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';

export default function ThemeToggleFixed() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('accessweb-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initialIsDark = false;

    if (savedTheme) {
      initialIsDark = savedTheme === 'dark';
    } else {
      initialIsDark = prefersDark;
    }

    setIsDarkMode(initialIsDark);
    updateThemeClasses(initialIsDark);

    console.log('Initializing theme');
    console.log('Theme classes after initialization:', document.documentElement.classList.toString());
  }, []);

  const toggleTheme = () => {
    console.log('Toggling theme');
    console.log('Current dark mode:', isDarkMode);
    console.log('Current classes:', document.documentElement.classList.toString());

    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    updateThemeClasses(newIsDark);

    console.log(newIsDark ? 'Switched to dark mode' : 'Switched to light mode');
    console.log('Updated classes:', document.documentElement.classList.toString());
  };

  const updateThemeClasses = (isDark: boolean) => {
    const root = window.document.documentElement;

    if (isDark) {
      root.classList.remove('light');
      root.classList.add('dark');
      localStorage.setItem('accessweb-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('accessweb-theme', 'light');
    }
  };

  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5 text-[#0fae96]" />
      ) : (
        <MoonIcon className="h-5 w-5 text-[#0fae96]" />
      )}
    </button>
  );
}