import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Drill, Hammer, Building2, ShieldCheck, Zap, HardHat, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/PageTransition';

const Home: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <PageTransition>
      <div className="relative overflow-hidden">
        {/* Hero & Stats Grid */}
        <section className="pt-32 pb-6 px-4 md:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Main Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-8 bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-8 md:p-16 flex flex-col justify-end relative overflow-hidden border border-neutral-200 dark:border-neutral-800 min-h-[500px]"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
                <Building2 size={400} />
              </div>
              <div className="relative z-10">
                <span className="bg-primary text-black text-[10px] font-black px-2 py-1 uppercase tracking-widest mb-6 inline-block rounded-sm">
                  {language === 'de' ? 'Expertise in Deutschland' : 'Expertise in Germany'}
                </span>
                <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 uppercase">
                  {language === 'de' ? (
                    <>PRÄZISION IM <br /><span className="text-primary">ABBRUCH.</span></>
                  ) : (
                    <>PRECISION IN <br /><span className="text-primary">DEMOLITION.</span></>
                  )}
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-md text-lg leading-relaxed mb-8">
                  {t('hero.sub')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-primary text-black px-8 py-4 font-bold rounded-sm uppercase tracking-wider hover:bg-white transition-all active:scale-95 flex items-center gap-2 group">
                    {t('cta.quote')}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Stats Panel */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="flex-1 bg-neutral-100/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 flex flex-col justify-center group hover:border-primary/30 transition-colors">
                <div className="text-5xl font-black text-primary mb-2">15+</div>
                <div className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
                  {language === 'de' ? 'Jahre Erfahrung' : 'Years Experience'}
                </div>
              </div>
              <div className="flex-1 bg-neutral-100/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 flex flex-col justify-center group hover:border-primary/30 transition-colors">
                <div className="text-5xl font-black text-primary mb-2">500+</div>
                <div className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
                  {language === 'de' ? 'Abgeschlossene Projekte' : 'Completed Projects'}
                </div>
              </div>
              <Link to="/contact" className="flex-1 bg-primary rounded-2xl p-8 flex flex-col justify-center group cursor-pointer hover:shadow-xl hover:shadow-primary/10 transition-all active:scale-[0.98]">
                <div className="flex justify-between items-center">
                  <div className="text-black font-black text-2xl uppercase italic leading-tight">
                    {language === 'de' ? 'Jetzt Kontaktieren' : 'Contact Now'}
                  </div>
                  <ArrowRight className="w-8 h-8 text-black" strokeWidth={3} />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Teaser */}
        <section className="py-24 px-4 md:px-10 bg-white dark:bg-neutral-950">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase italic">
                  {language === 'de' ? 'Unsere Leistungen' : 'Our Services'}
                </h2>
              </div>
              <Link to="/services" className="group flex items-center gap-2 font-bold text-primary hover:text-black dark:hover:text-white transition-colors uppercase text-sm tracking-widest">
                {language === 'de' ? 'Alle Leistungen' : 'View all services'}
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: '01', title_de: 'Totalabbruch', title_en: 'Total Demolition', desc: 'Komplette Beseitigung von Gebäuden und Industrieanlagen.' },
                { id: '02', title_de: 'Entkernung', title_en: 'Interior Gutting', desc: 'Fachgerechter Rückbau bis auf die statischen Grundelemente.' },
                { id: '03', title_de: 'Erdarbeiten', title_en: 'Earthworks', desc: 'Baugrubenaushub und Geländeregulierung für Ihr Fundament.' },
                { id: '04', title_de: 'Sanierung', title_en: 'Sanitation', desc: 'Entfernung von Asbest und KMF nach TRGS 519/521.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl hover:border-primary transition-colors group"
                >
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-3 italic uppercase">
                    <span className="text-primary">{item.id}</span> 
                    {language === 'de' ? item.title_de : item.title_en}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="py-32 overflow-hidden bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <div className="absolute -top-20 -left-20 text-[200px] font-display font-black opacity-[0.03] select-none uppercase">
                  TRUST
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter mb-12 uppercase leading-tight">
                  {language === 'de' 
                    ? 'Warum Ali-Mughal? Weil Qualität keine Zufälle kennt.' 
                    : 'Why Ali-Mughal? Because quality is not an accident.'}
                </h2>
                
                <div className="space-y-10">
                  {[
                    { t_de: 'Zertifizierter Fachbetrieb', t_en: 'Certified Company', d: 'Wir erfüllen alle gesetzlichen Auflagen und Sicherheitsstandards.' },
                    { t_de: 'Moderner Maschinenpark', t_en: 'Modern Equipment', d: 'Effizientes Arbeiten durch High-Tech-Ausrüstung.' },
                    { t_de: 'Termintreue Garantie', t_en: 'Punctuality Guarantee', d: 'Wir halten unsere Fristen – ohne Wenn und Aber.' },
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">{language === 'de' ? feat.t_de : feat.t_en}</h4>
                        <p className="text-zinc-500 text-sm">{feat.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-zinc-900 p-8 rounded-sm grid grid-cols-2 gap-8 border border-zinc-800">
                <div className="space-y-8">
                  <div className="aspect-square bg-zinc-800 rounded-sm overflow-hidden border border-zinc-700">
                    <img src="https://images.unsplash.com/photo-1590644365607-1c5a519a9a37?q=80&w=500" className="w-full h-full object-cover grayscale" alt="Worker" />
                  </div>
                  <div className="aspect-[4/3] bg-primary rounded-sm p-6 flex flex-col justify-end">
                    <div className="text-black font-display font-black text-4xl">100%</div>
                    <div className="text-black/60 text-xs font-bold uppercase tracking-widest mt-1">Sustainability</div>
                  </div>
                </div>
                <div className="space-y-8 pt-12">
                  <div className="aspect-[4/3] bg-zinc-800 rounded-sm overflow-hidden border border-zinc-700">
                     <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=500" className="w-full h-full object-cover grayscale" alt="Safety" />
                  </div>
                  <div className="aspect-square bg-zinc-100 rounded-sm p-6 flex flex-col justify-end">
                    <div className="text-black font-display font-black text-4xl">24/7</div>
                    <div className="text-black/40 text-xs font-bold uppercase tracking-widest mt-1">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Teaser */}
        <section className="py-24 bg-primary">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-black text-black tracking-tighter uppercase mb-4">
                {language === 'de' ? 'Bereit für den nächsten Schritt?' : 'Ready for the next step?'}
              </h2>
              <p className="text-black/70 text-lg max-w-xl font-medium">
                {language === 'de' 
                  ? 'Kontaktieren Sie uns noch heute für ein unverbindliches Erstgespräch und ein kostenloses Angebot.' 
                  : 'Contact us today for a non-binding initial consultation and a free quote.'}
              </p>
            </div>
            <button className="bg-black text-white px-10 py-6 font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shrink-0 border-4 border-white shadow-[10px_10px_0px_#fff]">
              {t('cta.contact')}
            </button>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
