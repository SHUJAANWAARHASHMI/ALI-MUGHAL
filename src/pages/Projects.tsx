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
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  // Fallback data if DB is empty or disconnected
  const displayProjects = projects.length > 0 ? projects : [
    { id: '1', title: 'Industriepark Berlin', category: 'Total Demolition', image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=600' },
    { id: '2', title: 'Wohnanlage München', category: 'Interior Gutting', image_url: 'https://images.unsplash.com/photo-1590644365607-1c5a519a9a37?q=80&w=600' },
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
            {displayProjects.map((p) => (
              <div key={p.id} className="group relative overflow-hidden aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <img 
                  src={p.image_url} 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700" 
                  alt={p.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="text-primary text-[10px] font-black uppercase tracking-widest mb-2 px-2 py-0.5 bg-black w-fit rounded-sm">
                    {p.category}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic leading-tight">{p.title}</h3>
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
