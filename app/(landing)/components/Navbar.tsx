"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  setView: Dispatch<SetStateAction<string>>;
}

export default function Navbar({ setView }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('accueil');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { name: 'Accueil', id: 'accueil' },
    { name: 'Services', id: 'features' },    
    { name: 'Solutions', id: 'solutions' },  
    { name: 'À propos', id: 'about' },        
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', 
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    navLinks.forEach((link) => {
      const section = document.getElementById(link.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Fermer le menu quand on clique sur un lien
  const handleNavClick = (id: string) => {
    setView('home');
    setActiveSection(id);
    setIsMenuOpen(false);
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 50);
  };

  // Empêcher le scroll quand le menu est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 font-sans border-b border-separator/10 select-none shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-16 py-4">
          {/* --- LOGO --- */}
          <div
            onClick={() => {
              setView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
              setIsMenuOpen(false);
            }}
            className="flex items-center cursor-pointer group"
          >
            <div className="hover:text-primary text-label duration-300 transition-colors font-bold text-2xl flex gap-1 items-center">
              Tsena
            </div>
          </div>

          {/* --- LIENS CENTRAUX (DESKTOP) --- */}
          <div className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-all text-[15px] font-bold pb-1 border-b-2 outline-none cursor-pointer ${
                    isActive
                      ? "text-primary border-primary"
                      : "text-input-element border-transparent hover:text-primary"
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </div>

          {/* --- ACTIONS DROITE : BUTTONS SHADCN --- */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => router.push("/login?mode=login")}
              className="text-label font-bold text-sm hover:text-primary hover:bg-neutral transition-colors outline-none cursor-pointer rounded-xl hidden sm:flex"
            >
              Se connecter
            </Button>

            <Button
              size="lg"
              onClick={() => router.push("/login?mode=register")}
              className="text-sm font-bold shadow-none outline-none cursor-pointer h-auto"
            >
              Commencer
            </Button>

            {/* --- BOUTON HAMBURGER (MOBILE) --- */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-label" />
              ) : (
                <Menu className="w-6 h-6 text-label" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MENU MOBILE (OVERLAY) --- */}
      <div
        className={`fixed inset-0 bg-white z-40 lg:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '73px' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-8 px-6">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-left text-lg font-bold py-3 px-4 rounded-lg transition-all ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-input-element hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </button>
                );
              })}
              
              {/* Bouton Se connecter pour mobile */}
              <button
                onClick={() => {
                  router.push("/login?mode=login");
                  setIsMenuOpen(false);
                }}
                className="text-left text-lg font-bold py-3 px-4 rounded-lg text-input-element hover:text-primary hover:bg-gray-50 transition-all"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}