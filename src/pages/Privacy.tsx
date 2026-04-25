import React from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';

const Privacy: React.FC = () => {
  const { language } = useLanguage();
  return (
    <PageTransition>
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 md:px-8 prose dark:prose-invert">
        <h1 className="text-4xl font-display font-black uppercase mb-8">
          {language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
        </h1>
        <p className="text-zinc-500">Last updated: April 2026</p>
        
        <h2>1. Einführung</h2>
        <p>Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
        
        <h2>2. Verantwortlicher</h2>
        <p>Ali-Mughal Abbruch & Demontage<br />Musterstraße 123<br />10117 Berlin<br />info@ali-mughal.de</p>
        
        <h2>3. Datenerfassung auf unserer Website</h2>
        <p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>
        
        <p className="italic text-zinc-400">Note: This is a simplified privacy policy for demonstration purposes.</p>
      </div>
    </PageTransition>
  );
};

export default Privacy;
