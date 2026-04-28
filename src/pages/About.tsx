import React from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
  const { language } = useLanguage();
  return (
    <PageTransition>
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-6xl font-display font-black uppercase mb-12">
          {language === 'de' ? 'Über Uns' : 'About Us'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
              FJ Bauservice ist ein Fachunternehmen mit Sitz in Rosenheim, das sich auf professionelle Abbrucharbeiten, Entkernung und Kernbohrungen spezialisiert hat.
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 leading-relaxed">
              Unter dem Motto "Raum für Neues schaffen" setzen wir Projekte mit höchster Präzision und Zuverlässigkeit um. Unser Team in Rosenheim steht für Qualität, Termintreue und saubere Ausführung bei jedem Auftrag.
            </p>
          </div>
          <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <img src="https://images.unsplash.com/photo-1503387762-592da580455a?q=80&w=1000" className="w-full h-full object-cover grayscale" alt="Team" />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
