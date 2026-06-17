"use client";

import { Dispatch, SetStateAction } from 'react';
import { FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Button } from "@/components/ui/button";

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-background py-12 font-sans border-t border-separator/10 relative z-10 select-none">
      <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* --- LOGO ET COPYRIGHT --- */}
          <div className="space-y-4 max-w-sm">
            {/* Les 5 petits points aux couleurs primaires */}
            <div className="flex items-center gap-1 ml-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-primary rounded-full" />
              ))}
            </div>
            <p className="text-input-element text-sm leading-relaxed">
              © {currentYear} Tsena. Autonomiser l&apos;écosystème agricole
              grâce à l&apos;innovation numérique et à la confiance.
            </p>
          </div>

          {/* --- LIENS DE NAVIGATION (BUTTON SHADCN) --- */}
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-2">
            {footerLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                onClick={() => handleNavigation(link.view)}
                className="text-label font-bold text-sm hover:text-primary hover:bg-neutral transition-colors cursor-pointer px-3 py-2 rounded-xl h-auto"
              >
                {link.name}
              </Button>
            ))}
          </nav>

          {/* --- RÉSEAUX SOCIAUX --- */}
          <div className="flex gap-4">
            <Button
              asChild
              variant="ghost"
              className="w-10 h-10 hover:scale-110 bg-neutral hover:bg-primary text-label hover:text-white rounded-full flex items-center justify-center p-0 transition-all shadow-sm cursor-pointer"
            >
              <a href="#" aria-label="Twitter">
                <FaTwitter className="w-4 h-4 fill-current" />
              </a>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="w-10 h-10 hover:scale-110 bg-neutral hover:bg-primary text-label hover:text-white rounded-full flex items-center justify-center p-0 transition-all shadow-sm cursor-pointer"
            >
              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn className="w-4 h-4 fill-current" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}