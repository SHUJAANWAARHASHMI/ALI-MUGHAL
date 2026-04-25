import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 flex items-center rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-primary transition-all p-1 cursor-pointer focus:outline-none overflow-hidden"
      aria-label="Toggle Theme"
    >
      <motion.div
        animate={{ 
          x: theme === 'dark' ? 24 : 0,
          rotate: theme === 'dark' ? 180 : 0
        }}
        className="w-4 h-4 bg-white dark:bg-primary rounded-full flex items-center justify-center shadow-sm"
      >
        {theme === 'light' ? (
          <Sun size={12} className="text-zinc-600" />
        ) : (
          <Moon size={12} className="text-black" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
