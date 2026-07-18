import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-surface border border-white/10 text-white/60 hover:text-primary transition-all duration-300 shadow-lg flex items-center justify-center overflow-hidden relative"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{
          y: isDarkMode ? 0 : -40,
          opacity: isDarkMode ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Moon size={20} />
      </motion.div>
      <motion.div
        initial={false}
        className="absolute"
        animate={{
          y: isDarkMode ? 40 : 0,
          opacity: isDarkMode ? 0 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Sun size={20} className="text-amber-500" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
