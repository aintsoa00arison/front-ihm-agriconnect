// components/HelpCenter.tsx
"use client";

import { Search, BookOpen, Truck, ShieldCheck, CreditCard, MessageCircle, ArrowRight } from 'lucide-react';

export default function HelpCenter() {
  const categories = [
    {
      icon: <BookOpen className="text-primary" size={28} />,
      title: "Premiers pas",
      description: "Apprenez à créer votre profil et à configurer votre compte AgriConnect.",
      links: ["Inscription Producteur", "Vérification de compte", "Guide du débutant"]
    },
    {
      icon: <Truck className="text-secondary" size={28} />,
      title: "Logistique & Ventes",
      description: "Tout sur l'expédition, le suivi des stocks et la gestion des commandes.",
      links: ["Frais de transport", "Délais de livraison", "Gestion des stocks"]
    },
    {
      icon: <CreditCard className="text-primary" size={28} />,
      title: "Paiements",
      description: "Comprendre comment fonctionnent les transactions sécurisées.",
      links: ["Délais de paiement", "Facturation", "Modes de paiement acceptés"]
    },
    {
      icon: <ShieldCheck className="text-secondary" size={28} />,
      title: "Sécurité",
      description: "Comment nous protégeons vos données et vos transactions.",
      links: ["Signaler un litige", "Authentification 2FA", "Confidentialité"]
    }
  ];

  return (
    <section id="help-center" className="w-full bg-neutral py-24 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        
        {/* --- HEADER AVEC RECHERCHE --- */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-8">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-label">
            Comment pouvons-nous <br />
            <span className="text-primary">vous aider ?</span>
          </h1>
          
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-input-element group-focus-within:text-primary transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Rechercher une réponse (ex: 'comment vendre ?')"
              className="w-full bg-white rounded-full py-6 pl-16 pr-8 shadow-xl outline-none border-2 border-transparent focus:border-primary/20 transition-all text-lg"
            />
          </div>
        </div>

        {/* --- GRILLE DE CATÉGORIES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {categories.map((cat, index) => (
            <div key={index} className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm hover:shadow-md transition-shadow border border-separator/50 flex flex-col md:flex-row gap-8">
              <div className="w-16 h-16 bg-neutral rounded-2xl flex items-center justify-center flex-shrink-0">
                {cat.icon}
              </div>
              <div className="space-y-4 flex-1">
                <h3 className="text-2xl font-bold text-label">{cat.title}</h3>
                <p className="text-input-element leading-relaxed">{cat.description}</p>
                <ul className="space-y-3 pt-2">
                  {cat.links.map((link, lIndex) => (
                    <li key={lIndex}>
                      <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm">
                        {link} <ArrowRight size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* --- SECTION CONTACT RAPIDE --- */}
        <div className="bg-primary rounded-[40px] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold">Vous ne trouvez pas votre réponse ?</h2>
            <p className="opacity-90">Notre équipe est disponible 7j/7 pour vous assister.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-primary px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-neutral transition-colors shadow-lg">
              <MessageCircle size={20} /> Discuter avec un agent
            </button>
            <button className="bg-primary-dark border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
              Envoyer un e-mail
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}