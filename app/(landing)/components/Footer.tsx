"use client";

import { Dispatch, SetStateAction } from 'react';
import { FaTwitter, FaLinkedinIn } from 'react-icons/fa';

interface FooterProps {
  setView: Dispatch<SetStateAction<string>>;
}

export default function Footer({ setView }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Politique de Confidentialité', view: 'privacy' },
    { name: 'Conditions d’Utilisation', view: 'terms' },
    { name: 'Contactez-nous', view: 'contact' },
    { name: 'Centre d’Aide', view: 'help' },
  ];

  const handleNavigation = (viewName: string) => {
    setView(viewName);
    // On remonte en haut pour que l'utilisateur voit le début de la page affichée
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white py-12 font-sans border-t border-neutral relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Logo et Copyright */}
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-primary rounded-full" />
              ))}
            </div>
            <p className="text-input-element text-sm leading-relaxed">
              © {currentYear} AgriConnect. Autonomiser l'écosystème agricole grâce à l'innovation numérique et à la confiance.
            </p>
          </div>

          {/* Liens de navigation avec setView */}
          <nav className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-bold text-label">
            {footerLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => handleNavigation(link.view)}
                className="hover:text-primary transition-colors cursor-pointer outline-none"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Réseaux Sociaux */}
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-neutral rounded-full flex items-center justify-center text-label hover:bg-primary hover:text-white transition-all shadow-sm">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-neutral rounded-full flex items-center justify-center text-label hover:bg-primary hover:text-white transition-all shadow-sm">
              <FaLinkedinIn size={18} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}