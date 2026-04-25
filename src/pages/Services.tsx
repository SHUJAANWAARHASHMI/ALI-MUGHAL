import React from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';
import { Hammer, Drill, Building2, HardHat, Zap, ShieldCheck } from 'lucide-react';

const Services: React.FC = () => {
  const { language } = useLanguage();
  const services = [
    { icon: <Hammer size={40} />, title_de: 'Komplettabbruch', title_en: 'Total Demolition', desc: 'Sprengungen und mechanischer Rückbau von Wohnhäusern und Geschäftsgebäuden.' },
    { icon: <Drill size={40} />, title_de: 'Entkernung', title_en: 'Interior Gutting', desc: 'Entfernung aller nicht-tragenden Bauteile zur Vorbereitung von Sanierungen.' },
    { icon: <Building2 size={40} />, title_de: 'Industrieabbruch', title_en: 'Industrial Demolition', desc: 'Rückbau von Hallen, Fabriken und Kraftwerksanlagen.' },
    { icon: <HardHat size={40} />, title_de: 'Schadstoffsanierung', title_en: 'Hazardous Waste', desc: 'Fachgerechte Entsorgung von Asbest, KMF und anderen Gefahrenstoffen.' },
    { icon: <Zap size={40} />, title_de: 'Demontage', title_en: 'Dismantling', desc: 'Demontage von haustechnischen Anlagen und Maschinen.' },
    { icon: <ShieldCheck size={40} />, title_de: 'Erdbau', title_en: 'Earthworks', desc: 'Aushubarbeiten und Baugrundvorbereitung nach dem Abbruch.' },
  ];

  return (
    <PageTransition>
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-6xl font-display font-black uppercase mb-12">
          {language === 'de' ? 'Unsere Leistungen' : 'Our Services'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <div className="text-primary mb-6">{s.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{language === 'de' ? s.title_de : s.title_en}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Services;
