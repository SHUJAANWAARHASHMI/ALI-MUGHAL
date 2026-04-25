import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800">
      {(['de', 'en'] as const).map(lang => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={cn(
            'px-3 py-1 rounded-md text-xs font-bold transition-all uppercase',
            language === lang
              ? 'bg-primary text-black'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
