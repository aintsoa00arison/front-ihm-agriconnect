"use client";

import { useState } from 'react';
import { X } from 'lucide-react'; // Import de l'icône X
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ContactForm from './components/ContactForm';
import HelpCenter from './components/HelpCenter';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [view, setView] = useState('home');

  // Fonction pour fermer et revenir à l'accueil
  const closeView = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar setView={setView} />

      <main className="flex-grow relative">
        
        {/* Affichage de la Landing Page */}
        {view === 'home' && (
          <div className="animate-in fade-in duration-500">
            {children}
          </div>
        )}

        {/* Affichage des pages secondaires avec bouton de fermeture */}
        {view !== 'home' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 py-12 lg:py-20">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-16 relative">
              
              {/* Bouton Fermer (Le X) */}
              <button 
                onClick={closeView}
                className="fixed top-24 right-6 lg:right-16 z-50 bg-neutral hover:bg-primary hover:text-white text-label p-3 rounded-full transition-all shadow-md group flex items-center gap-2"
                title="Fermer et revenir à l'accueil"
              >
                <span className="text-xs font-bold pl-1 hidden group-hover:block transition-all">Fermer</span>
                <X size={24} />
              </button>

              {/* Rendu dynamique du composant */}
              <div className="min-h-[60vh]">
                {view === 'privacy' && <PrivacyPolicy />}
                {view === 'terms' && <TermsOfService />}
                {view === 'contact' && <ContactForm />}
                {view === 'help' && <HelpCenter />}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer setView={setView} />
    </div>
  );
}