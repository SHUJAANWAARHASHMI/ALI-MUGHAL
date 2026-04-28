import React, { useEffect, useState } from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

const Projects: React.FC = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Fetch timed out')), 2000)
        );
        const fetchPromise = supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
        
        if (result && result.data && result.data.length > 0) {
          setProjects(result.data);
        }
      } catch (err) {
        console.error('Fetch projects error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Fallback data if DB is empty or disconnected
  const displayProjects = projects.length > 0 ? projects : [
    { id: '1', title_de: 'Abbruch Rosenheim', title_en: 'Demolition Rosenheim', category_de: 'Abbrucharbeiten', category_en: 'Demolition', image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=600' },
    { id: '2', title_de: 'Kernbohrung Gewerbebau', title_en: 'Core Drilling Commercial', category_de: 'Kernbohrungen', category_en: 'Core Drilling', image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600' },
    { id: '3', title_de: 'Entkernung Stadtvilla', title_en: 'Interior Gutting Villa', category_de: 'Entkernungsarbeiten', category_en: 'Interior Gutting', image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600' },
  ];

  return (
    <PageTransition>
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-10">
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter italic">
            {language === 'de' ? 'Projekte' : 'Portfolio'}
          </h1>
          <p className="text-neutral-500 mt-4 max-w-2xl text-lg">
            {language === 'de' 
              ? 'Ein Einblick in unsere erfolgreich abgeschlossenen Abbruch- und Rückbauprojekte in ganz Deutschland.'
              : 'A glimpse into our successfully completed demolition and dismantling projects across Germany.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((p: any) => (
              <div key={p.id} className="group relative overflow-hidden aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <img 
                  src={p.image_url} 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700" 
                  alt={p.title_de || p.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="text-primary text-[10px] font-black uppercase tracking-widest mb-2 px-2 py-0.5 bg-black w-fit rounded-sm">
                    {language === 'de' ? (p.category_de || p.category) : (p.category_en || p.category || p.category_de)}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic leading-tight">
                    {language === 'de' ? (p.title_de || p.title) : (p.title_en || p.title || p.title_de)}
                  </h3>
                  <div className="mt-4 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Projects;
