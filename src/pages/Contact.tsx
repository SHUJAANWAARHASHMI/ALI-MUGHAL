import React from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const { language } = useLanguage();

  return (
    <PageTransition>
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-6xl font-display font-black uppercase mb-12">
          {language === 'de' ? 'Kontakt' : 'Contact'}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              {language === 'de' 
                ? 'Haben Sie ein Projekt im Kopf? Lassen Sie uns darüber sprechen. Unser Expertenteam berät Sie gerne.' 
                : 'Have a project in mind? Let\'s talk. Our expert team is happy to advise you.'}
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-primary flex items-center justify-center text-black rounded-sm shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{language === 'de' ? 'Rufen Sie uns an' : 'Call us'}</h4>
                  <p className="text-zinc-500">0159 06142923</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-primary flex items-center justify-center text-black rounded-sm shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email</h4>
                  <p className="text-zinc-500">amjad.ali@fj-bauservice.com</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-primary flex items-center justify-center text-black rounded-sm shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{language === 'de' ? 'Adresse' : 'Address'}</h4>
                  <p className="text-zinc-500">Bahnhofstraße 9, 83022 Rosenheim, Deutschland</p>
                </div>
              </div>
            </div>
            
            {/* Simple Map Placeholder */}
            <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-bold uppercase tracking-widest">
              Google Maps Interactive View
            </div>
          </div>
          
          <form className="bg-zinc-50 dark:bg-zinc-900 p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 rounded-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest opacity-60">Name</label>
                <input type="text" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest opacity-60">Email</label>
                <input type="email" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest opacity-60">{language === 'de' ? 'Betreff' : 'Subject'}</label>
              <input type="text" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest opacity-60">{language === 'de' ? 'Nachricht' : 'Message'}</label>
              <textarea rows={6} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary transition-colors resize-none"></textarea>
            </div>
            <button className="w-full bg-primary text-black py-4 font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all uppercase tracking-widest">
              {language === 'de' ? 'Nachricht senden' : 'Send Message'}
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
