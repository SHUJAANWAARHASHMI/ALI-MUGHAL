import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.projects'), path: '/projects' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Admin trigger
  const [logoClicks, setLogoClicks] = useState(0);
  const handleLogoClick = (e: React.MouseEvent) => {
    setLogoClicks(prev => prev + 1);
    if (logoClicks >= 4) {
      setLogoClicks(0);
      window.location.href = '/admin/login';
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b flex items-center',
        scrolled
          ? 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-neutral-200 dark:border-neutral-800 h-20'
          : 'bg-transparent border-transparent h-24'
      )}
    >
      <div className="max-w-7xl mx-auto w-full px-4 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center font-display font-black text-black text-xl transition-transform group-hover:rotate-6">
            AM
          </div>
          <div className="font-display font-bold text-2xl tracking-tighter hidden sm:block">
            ALI-MUGHAL
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'font-medium text-sm transition-colors hover:text-primary',
                  location.pathname === link.path ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="px-4 py-8 flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'text-2xl font-display font-bold flex items-center justify-between group',
                      location.pathname === link.path ? 'text-primary' : 'text-zinc-600 dark:text-zinc-400'
                    )}
                  >
                    {link.name}
                    <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              ))}
              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                <span className="text-sm font-medium opacity-60">Language</span>
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
