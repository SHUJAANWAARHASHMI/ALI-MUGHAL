import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-white pt-20 pb-10 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary flex items-center justify-center font-display font-black text-black text-xl rounded-sm">
              FJ
            </div>
            <div className="font-display font-bold text-xl tracking-tighter">
              FJ BAUSERVICE
            </div>
          </Link>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
            Raum für Neues schaffen. Ihr Partner für präzise Abbrucharbeiten und Kernbohrungen in Rosenheim.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-lg mb-6 uppercase tracking-widest italic">Quick Links</h4>
          <ul className="flex flex-col gap-4">
            {['/', '/about', '/services', '/projects', '/contact'].map((path) => (
              <li key={path}>
                <Link to={path} className="text-neutral-400 hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  {t(`nav.${path === '/' ? 'home' : path.substring(1)}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-display font-bold text-lg mb-6 uppercase tracking-widest italic">Contact</h4>
          <ul className="flex flex-col gap-6">
            <li className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                <Phone size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 font-bold">Call Us</p>
                <a href="tel:+4915906142923" className="text-neutral-300 hover:text-white transition-colors font-bold">0159 06142923</a>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 font-bold">Email Us</p>
                <a href="mailto:amjad.ali@fj-bauservice.com" className="text-neutral-300 hover:text-white transition-colors font-bold text-xs">amjad.ali@fj-bauservice.com</a>
              </div>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-display font-bold text-lg mb-6 uppercase tracking-widest italic">Legal</h4>
          <ul className="flex flex-col gap-4">
            <li><Link to="/impressum" className="text-neutral-400 hover:text-primary transition-colors text-sm">Impressum</Link></li>
            <li><Link to="/privacy" className="text-neutral-400 hover:text-primary transition-colors text-sm">Datenschutz (Privacy)</Link></li>
            <li><Link to="/faq" className="text-neutral-400 hover:text-primary transition-colors text-sm">FAQ</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-20 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-neutral-600 text-[10px] uppercase tracking-widest font-bold">
          © {currentYear} FJ Bauservice Rosenheim.
        </p>
        <div className="flex gap-6 text-neutral-600 text-[10px] uppercase tracking-widest font-bold">
          <span>Rosenheim, DE</span>
          <span className="text-primary hover:underline cursor-pointer">WhatsApp: 0159 06142923</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
