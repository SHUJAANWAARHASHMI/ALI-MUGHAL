import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'de';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    // Basic translations - will be merged with database content later
    const translations: Record<string, Record<Language, string>> = {
      'nav.home': { de: 'Startseite', en: 'Home' },
      'nav.about': { de: 'Über Uns', en: 'About Us' },
      'nav.services': { de: 'Leistungen', en: 'Services' },
      'nav.projects': { de: 'Projekte', en: 'Projects' },
      'nav.contact': { de: 'Kontakt', en: 'Contact' },
      'hero.title': { de: 'Präzision im Abbruch. Stärke im Aufbau.', en: 'Precision in Demolition. Strength in Construction.' },
      'hero.sub': { de: 'Ali-Mughal – Ihr zuverlässiger Partner für Abbruch und Rückbau in Deutschland.', en: 'Ali-Mughal – Your reliable partner for demolition and dismantling in Germany.' },
      'cta.quote': { de: 'Angebot anfordern', en: 'Get a Quote' },
      'cta.contact': { de: 'Kontaktieren Sie uns', en: 'Contact Us' },
    };

    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
