import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const FAQ: React.FC = () => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { 
      q_de: 'Wie lange dauert ein Hausabbruch?', 
      q_en: 'How long does a house demolition take?',
      a_de: 'In der Regel dauert ein kompletter Abbruch eines Einfamilienhauses inklusive Keller und Entsorgung etwa 2 bis 5 Tage, abhängig von der Materialbeschaffenheit und der Lage.',
      a_en: 'Typically, a complete demolition of a single-family home including the basement and disposal takes about 2 to 5 days, depending on material properties and location.'
    },
    { 
      q_de: 'Muss ich den Abbruch genehmigen lassen?', 
      q_en: 'Do I need a permit for demolition?',
      a_de: 'Ja, in Deutschland ist für die meisten Abbrucharbeiten eine offizielle Genehmigung oder eine Anzeige bei der Bauaufsichtsbehörde erforderlich. Wir unterstützen Sie gerne bei der Abwicklung.',
      a_en: 'Yes, in Germany, an official permit or notification to the building supervisory authority is required for most demolition work. We are happy to assist you with the process.'
    },
    { 
      q_de: 'Was passiert mit dem Abbruchmaterial?', 
      q_en: 'What happens to the demolition materials?',
      a_de: 'Wir legen großen Wert auf Nachhaltigkeit. Materialien werden direkt vor Ort sortiert und fachgerecht dem Recyclingkreislauf zugeführt oder bei zertifizierten Entsorgern abgegeben.',
      a_en: 'We place great value on sustainability. Materials are sorted directly on-site and professionally fed into the recycling cycle or delivered to certified disposal companies.'
    },
  ];

  return (
    <PageTransition>
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 md:px-8">
        <h1 className="text-6xl font-display font-black uppercase mb-12 text-center">
          FAQ
        </h1>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <span className="font-bold text-lg">{language === 'de' ? f.q_de : f.q_en}</span>
                <ChevronDown className={cn("transition-transform", openIndex === i ? "rotate-180" : "")} />
              </button>
              {openIndex === i && (
                <div className="p-6 pt-0 text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-black">
                  {language === 'de' ? f.a_de : f.a_en}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default FAQ;
