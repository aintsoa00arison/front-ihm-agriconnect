"use client";

import { useState } from 'react';
import { 
  Search, 
  User, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  ChevronDown,
  Headphones,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    {
      icon: <User className="text-primary" size={20} />,
      title: "Mon Compte",
      description: "Gérer votre profil, vos accès et vos configurations."
    },
    {
      icon: <FileText className="text-amber-700" size={20} />,
      title: "Annonces & Offres",
      description: "Comment publier, modifier et optimiser la visibilité de vos stocks."
    },
    {
      icon: <MessageSquare className="text-primary" size={20} />,
      title: "Messagerie",
      description: "Sécurité, réactivité et échanges textuels avec les partenaires."
    },
    {
      icon: <ShieldCheck className="text-primary" size={20} />,
      title: "Sécurité & Qualité",
      description: "Certifications d'exploitation, signalements et modération."
    }
  ];

  const faqs = [
    {
      question: "Comment devenir un fournisseur ou collecteur vérifié ?",
      answer: "Pour obtenir le badge de vérification, vous devez téléverser vos documents professionnels (Kbis, attestation MSA ou certifications environnementales comme Bio/HVE) dans les paramètres de votre compte. Notre équipe examine les pièces sous 48 heures pour valider l'intégrité de votre profil."
    },
    {
      question: "OmniAgri intervient-il dans le paiement ou la livraison ?",
      answer: "Non. OmniAgri agit exclusivement comme un intermédiaire technique de mise en relation de gré à gré. Les négociations tarifaires, le choix du transporteur, la facturation et l'exécution des paiements se font directement entre le fournisseur et le collecteur, en dehors de la plateforme."
    },
    {
      question: "Comment signaler un comportement abusif ou une fausse annonce ?",
      answer: "Si vous constatez des volumes fictifs, des prix manifestement trompeurs ou un comportement inapproprié sur la messagerie, cliquez sur le bouton 'Signaler' présent sur la fiche de l'annonce ou le profil de l'utilisateur. Nos modérateurs interviendront pour appliquer les sanctions prévues par nos CGU."
    },
    {
      question: "Mes coordonnées de localisation précises sont-elles publiques ?",
      answer: "Par défaut, OmniAgri affiche uniquement la région ou le rayon d'action global de vos parcelles sur le catalogue public pour préserver votre sécurité. Vos coordonnées de contact et de localisation précises ne sont partagées qu'une fois que vous engagez volontairement une discussion privée avec un partenaire."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#F8F9FA] font-sans text-input-element antialiased selection:bg-primary/10">
      
      {/* --- SECTION EN-TÊTE & RECHERCHE (HERO SECTION) --- */}
      <div className="w-full bg-gradient-to-b from-[#F3F4F6]/50 to-[#F8F9FA] py-20 px-6 lg:px-16 text-center space-y-6 border-b border-separator/10">
        <h1 className="text-3xl lg:text-5xl font-black text-label tracking-tight">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="text-input-element/80 text-sm lg:text-base max-w-2xl mx-auto font-medium">
          Trouvez des guides, des tutoriels et des réponses concernant les outils de mise en relation de la plateforme.
        </p>
        
        {/* Barre de Recherche */}
        <div className="max-w-2xl mx-auto relative mt-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-input-element/40" size={18} />
          <input 
            type="text"
            placeholder="Rechercher une aide, un guide, une règle de conformité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-separator/30 shadow-sm text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white text-label placeholder:text-input-element/40"
          />
        </div>
      </div>

      {/* --- GRILLE DES CATEGORIES (CONTENU PRINCIPAL) --- */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div 
              key={index}
              className="border border-separator/10 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-4 group cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 bg-[#F8F9FA] rounded-xl flex items-center justify-center border border-separator/20">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-label text-sm group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-input-element/70 leading-relaxed font-medium">
                  {cat.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                <span>Voir les guides</span>
                <ArrowRight size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION ACCORDEONS FAQ --- */}
      <div className="max-w-[850px] mx-auto px-6 lg:px-16 py-12 space-y-8">
        <h2 className="text-2xl font-black text-label text-center tracking-tight mb-10">
          Questions fréquentes
        </h2>

        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="border border-separator/20 rounded-2xl overflow-hidden bg-white shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-xs lg:text-sm text-label outline-none select-none bg-white hover:bg-[#F8F9FA]/50 transition-colors"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown 
                      size={16} 
                      className={`text-input-element/50 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
                    />
                  </button>
                  
                  {isOpen && (
                    <div className="p-6 bg-[#F8F9FA] border-t border-separator/10 text-xs lg:text-sm text-input-element/90 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-xs text-input-element/40 font-medium py-8">
              Aucun résultat trouvé pour votre recherche.
            </p>
          )}
        </div>
      </div>

      {/* --- CTA ALERTE INFERIEURE (SUPPORT ALTERNATIF) --- */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 pb-24 pt-12">
        <div className="relative overflow-hidden rounded-[24px] bg-primary p-8 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          {/* Filigrane décoratif en arrière-plan */}
          <div className="absolute top-0 right-0 left-0 bottom-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
          
          <div className="space-y-2 text-center md:text-left relative z-10">
            <h3 className="text-xl lg:text-2xl font-black tracking-tight">
              Vous n'avez pas trouvé votre réponse ?
            </h3>
            <p className="text-xs lg:text-sm text-white/80 font-medium max-w-xl leading-relaxed">
              Nos experts et notre équipe de modération technique sont disponibles pour vous accompagner dans la prise en main de vos outils d'intermédiation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto relative z-10 shrink-0">
            <button className="w-full sm:w-auto bg-white text-primary hover:bg-[#F3F4F6] px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm outline-none">
              <Headphones size={14} />
              Contacter le support
            </button>
            <button className="w-full sm:w-auto border border-white/40 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all outline-none">
              <MessageCircle size={14} />
              Chat en direct
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}