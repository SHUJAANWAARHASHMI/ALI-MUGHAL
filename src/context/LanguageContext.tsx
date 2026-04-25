import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, dbData?: any) => string;
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

  const [dbSettings, setDbSettings] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    
    // Fetch settings/translations from DB
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*');
      if (data) setDbSettings(data);
    };
    fetchSettings();
  }, [language]);

  const t = (key: string, dbObject?: any) => {
    // 1. If we're translating a DB object (like a project)
    if (dbObject) {
      return dbObject[`${key}_${language}`] || dbObject[key] || '';
    }

    // 2. Check settings table from DB
    const setting = dbSettings.find(s => s.key === key);
    if (setting) {
      return setting[`value_${language}`] || setting.value_de || key;
    }

    // 3. Fallback static translations
    const translations: Record<string, Record<Language, string>> = {
      'nav.home': { de: 'Startseite', en: 'Home' },
      'nav.about': { de: 'Über Uns', en: 'About Us' },
      'nav.services': { de: 'Leistungen', en: 'Services' },
      'nav.projects': { de: 'Projekte', en: 'Projects' },
      'nav.contact': { de: 'Kontakt', en: 'Contact' },
      'hero.title': { de: 'Präzision im Abbruch.', en: 'Precision in Demolition.' },
      'hero.sub': { de: 'Ihr Partner für Abbruch und Rückbau in Deutschland.', en: 'Your partner for demolition and dismantling in Germany.' },
      'cta.quote': { de: 'Angebot anfordern', en: 'Get a Quote' },
      'cta.contact': { de: 'Kontakt aufnehmen', en: 'Contact Us' },
    };

    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
