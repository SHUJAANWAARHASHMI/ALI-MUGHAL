import React, { useEffect, useState } from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';
import { Hammer, Drill, Building2, HardHat, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const iconMap: Record<string, any> = {
  Hammer: <Hammer size={40} />,
  Drill: <Drill size={40} />,
  Building2: <Building2 size={40} />,
  HardHat: <HardHat size={40} />,
  Zap: <Zap size={40} />,
  ShieldCheck: <ShieldCheck size={40} />,
};

const Services: React.FC = () => {
  const { language } = useLanguage();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Fetch timed out')), 2000)
        );
        const fetchPromise = supabase
          .from('services')
          .select('*')
          .order('sort_order', { ascending: true });
        
        const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
        
        if (result && result.data && result.data.length > 0) {
          setServices(result.data);
        }
      } catch (err) {
        console.error('Fetch services error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const defaultServices = [
    { icon: 'Hammer', title_de: 'Abbrucharbeiten', title_en: 'Demolition Works', description_de: 'Fachgerechter Abbruch von Gebäuden und Strukturen jeder Art.' },
    { icon: 'Drill', title_de: 'Entkernungsarbeiten', title_en: 'Interior Gutting', description_de: 'Vorbereitung von Renovierungen durch Entfernung nicht-tragender Elemente.' },
    { icon: 'Zap', title_de: 'Kernbohrungen', title_en: 'Core Drilling', description_de: 'Präzisionsbohrungen in Beton und Mauerwerk.' },
    { icon: 'Building2', title_de: 'Betonschneiden', title_en: 'Concrete Cutting', description_de: 'Exakte Schnitte in harten Baustoffen mit moderner Technik.' },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <PageTransition>
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-6xl font-display font-black uppercase mb-12">
          {language === 'de' ? 'Unsere Leistungen' : 'Our Services'}
        </h1>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((s, i) => (
              <div key={i} className="p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm hover:border-primary transition-colors">
                <div className="text-primary mb-6">{iconMap[s.icon] || <Hammer size={40} />}</div>
                <h3 className="text-2xl font-bold mb-4">{language === 'de' ? s.title_de : (s.title_en || s.title_de)}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{language === 'de' ? s.description_de : (s.description_en || s.description_de)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Services;
