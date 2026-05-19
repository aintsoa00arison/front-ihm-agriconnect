"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

interface NavbarProps {
  setView: Dispatch<SetStateAction<string>>;
}

export default function Navbar({ setView }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('accueil');
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

  const handleNavClick = (id: string) => {
    setView('home');
    setActiveSection(id);
    
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

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 font-sans border-b border-separator/10 select-none shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
        {/* --- LOGO --- */}
        <div
          onClick={() => {
            setView("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center cursor-pointer group"
        >
          <div className="hover:text-primary text-label duration-300 transition-colors font-bold text-2xl flex gap-1 items-center">
            Tsena
          </div>
        </div>

        {/* --- LIENS CENTRAUX (ANCHORS) --- */}
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
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push("/login?mode=login")}
            className="text-label font-bold text-sm hover:text-primary hover:bg-neutral transition-colors outline-none cursor-pointer rounded-xl"
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
        </div>
      </div>
    </nav>
  );
}