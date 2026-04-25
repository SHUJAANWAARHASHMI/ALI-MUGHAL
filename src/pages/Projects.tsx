import React from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';

const Projects: React.FC = () => {
  const { language } = useLanguage();
  const projects = [
    { title: 'Industriepark Berlin', category: 'Total Demolition', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=600' },
    { title: 'Wohnanlage München', category: 'Interior Gutting', image: 'https://images.unsplash.com/photo-1590644365607-1c5a519a9a37?q=80&w=600' },
    { title: 'Bürokomplex Hamburg', category: 'Dismantling', image: 'https://images.unsplash.com/photo-1503387762-592da580455a?q=80&w=600' },
    { title: 'Alte Fabrik Leipzig', category: 'Industrial', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600' },
  ];

  return (
    <PageTransition>
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-6xl font-display font-black uppercase mb-12">
          {language === 'de' ? 'Projekte' : 'Portfolio'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <div key={i} className="group relative overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <img src={p.image} className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700" alt={p.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform">
                <div className="text-primary text-xs font-bold uppercase tracking-widest mb-2">{p.category}</div>
                <h3 className="text-2xl font-bold text-white">{p.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Projects;
