"use client";

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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

  const isHome = view === 'home';

  // Fonction pour revenir à l'accueil
  const backToHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      {/* Affichage conditionnel de la Navbar */}
      {isHome && <Navbar setView={setView} />}

      <main className="flex-grow relative">
        
        {/* Affichage de la Landing Page principale */}
        {isHome && (
          <div className="animate-in fade-in duration-300">
            {children}
          </div>
        )}

        {/* Affichage des pages secondaires avec bouton Retour */}
        {!isHome && (
          <div className="pt-10 pb-20 animate-in fade-in duration-200">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-16 space-y-6">
              
              {/* Bouton Retour en haut à gauche */}
              <div className="flex justify-start">
                <button 
                  onClick={backToHome}
                  className="flex items-center gap-2 text-input-element/70 hover:text-primary font-bold text-xs bg-white border border-separator/10 px-4 py-2.5 rounded-xl transition-all shadow-sm outline-none cursor-pointer"
                  title="Revenir à l'accueil"
                >
                  <ArrowLeft size={16} />
                  <span>Retour à l'accueil</span>
                </button>
              </div>

              {/* Rendu dynamique du composant secondaire */}
              <div className="min-h-[70vh] bg-white border border-separator/10 rounded-[24px] overflow-hidden shadow-sm">
                {view === 'privacy' && <PrivacyPolicy />}
                {view === 'terms' && <TermsOfService />}
                {view === 'contact' && <ContactForm />}
                {/* Injection de setView pour permettre la redirection */}
                {view === 'help' && <HelpCenter setView={setView} />}
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Affichage conditionnel du Footer */}
      {isHome && <Footer setView={setView} />}
    </div>
  );
}