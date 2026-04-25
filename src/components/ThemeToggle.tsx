import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-primary transition-all group overflow-hidden"
      aria-label="Toggle Theme"
    >
      <motion.div
        animate={{ y: theme === 'light' ? 0 : 40 }}
        className="absolute"
      >
        <Sun size={20} className="text-zinc-600" />
      </motion.div>
      <motion.div
        initial={{ y: -40 }}
        animate={{ y: theme === 'dark' ? 0 : -40 }}
        className="absolute"
      >
        <Moon size={20} className="text-zinc-400" />
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
