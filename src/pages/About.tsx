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
              Ali-Mughal ist ein familiengeführtes Unternehmen mit Sitz in Deutschland, das sich auf professionelle Abbrucharbeiten, Entkernung und Demontage spezialisiert hat.
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 leading-relaxed">
              Seit unserer Gründung haben wir uns durch Zuverlässigkeit, Präzision und höchste Sicherheitsstandards einen Namen in der Branche gemacht. Unser Team besteht aus erfahrenen Fachkräften, die jedes Projekt – egal ob klein oder groß – mit größter Sorgfalt planen und ausführen.
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
