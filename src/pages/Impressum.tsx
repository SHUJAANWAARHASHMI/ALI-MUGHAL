import React from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';

const Impressum: React.FC = () => {
  const { language } = useLanguage();
  return (
    <PageTransition>
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 md:px-8 prose dark:prose-invert">
        <h1 className="text-4xl font-display font-black uppercase mb-8">
          Impressum
        </h1>
        
        <p>Angaben gemäß § 5 TMG</p>
        
        <h2>Kontakt</h2>
        <p>
          Ali-Mughal Abbruch & Demontage<br />
          Inhaber: Ali Mughal<br />
          Musterstraße 123<br />
          10117 Berlin
        </p>
        
        <p>
          Telefon: +49 123 4567890<br />
          E-Mail: info@ali-mughal.de
        </p>
        
        <h2>Umsatzsteuer-ID</h2>
        <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />DE 123 456 789</p>
        
        <h2>EU-Streitschlichtung</h2>
        <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr.</p>
      </div>
    </PageTransition>
  );
};

export default Impressum;
