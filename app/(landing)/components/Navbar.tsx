// components/Navbar.tsx
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';

interface NavbarProps {
  setView: Dispatch<SetStateAction<string>>;
}

export default function Navbar({ setView }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('accueil');

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

  const handleNavClick = (id: string) => {
    setView('home');
    setActiveSection(id);
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 font-sans ">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-16 py-5">
        
        {/* Logo */}
        <div 
          onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center cursor-pointer group"
        >
          <div className="text-primary font-bold text-2xl flex gap-1 items-center">
             <span className="tracking-tighter group-hover:text-label transition-colors">Agri</span>
             <span className="text-label tracking-tighter group-hover:text-primary transition-colors">Connect</span>
          </div>
        </div>

        {/* Liens Centraux */}
        <div className="hidden lg:flex items-center space-x-12">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;

            return (
              <button 
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-all text-[15px] font-bold pb-1 border-b-2 outline-none ${
                  isActive 
                  ? "text-primary border-primary" 
                  : "text-input-element border-transparent hover:text-primary transition-colors"
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </div>

        {/* Boutons d'action utilisant les classes globales */}
        <div className="flex items-center space-x-8">
          <Link 
            href="/login" 
            className="text-label font-bold text-sm hover:text-primary transition-colors"
          >
            Se connecter
          </Link>
          
          {/* Utilisation de .btn-primary pour l'arrondi de 9px et le style uniforme */}
          <Link 
            href="/login" 
            className="btn-primary !py-3 !px-7 text-sm shadow-none"
          >
            Commencer
          </Link>
        </div>
      </div>
    </nav>
  );
}