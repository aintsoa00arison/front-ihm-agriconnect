"use client";

import { useEffect, useState } from 'react';
import { 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Download, 
  HelpCircle,
  Users,
  MessageSquare,
  Star
} from 'lucide-react';

import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', name: 'Introduction' },
    { id: 'obligations', name: "Obligations de l'Utilisateur" },
    { id: 'messagerie-notation', name: 'Messagerie et Système de notation' },
    { id: 'confidentialite', name: 'Confidentialité [RGPD]' },
    { id: 'responsabilite', name: 'Responsabilité et Garanties' },
    { id: 'resiliation', name: 'Résiliation' },
    { id: 'loi', name: 'Loi Applicable' },
  ];

  // Gestion du scroll-spy pour mettre en évidence la section active dans le sommaire
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
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
    sections.forEach((sec) => {
      const element = document.getElementById(sec.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 40;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white font-sans text-input-element antialiased selection:bg-primary/10 select-none">
      
      {/* --- EN-TÊTE PRINCIPAL --- */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 pt-16 pb-12 border-b border-separator/30">
        <h1 className="text-4xl lg:text-5xl font-black text-label tracking-tight mb-4">
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-input-element/80 text-sm font-medium">
          Dernière mise à jour : <span className="font-bold">14 Mai 2026</span>. Ces conditions régissent votre utilisation de la plateforme Tsena et définissent nos engagements mutuels.
        </p>
      </div>

      {/* --- REPARTITION DU CONTENU (SOMMAIRE + CONTENU ASYMETRIQUE) --- */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Sommaire Gauche Sticky */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-10 space-y-6">
          <p className="text-[11px] font-black uppercase text-input-element/50 tracking-widest pl-3">
            Sommaire
          </p>
          <nav className="flex flex-col space-y-1 border-l border-separator/30">
            {sections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`text-left text-sm font-bold py-2.5 px-4 rounded-r-xl transition-all border-l-2 -ml-[1px] outline-none cursor-pointer ${
                    isActive
                      ? "text-primary border-primary bg-primary/5 font-extrabold"
                      : "text-input-element/70 border-transparent hover:text-primary hover:bg-light-bg/30"
                  }`}
                >
                  {sec.name}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Flux de Texte à Droite */}
        <main className="col-span-1 lg:col-span-9 space-y-16 max-w-[850px]">
          
          {/* 1. Introduction */}
          <section id="intro" className="space-y-6 scroll-mt-10">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center">1</span>
              <h2 className="text-2xl font-black text-label tracking-tight">Introduction</h2>
            </div>
            <p className="leading-relaxed text-[15px]">
              Bienvenue sur <span className="font-bold text-label">Tsena</span>. Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions dans lesquelles la plateforme met à la disposition de ses utilisateurs ses services de mise en relation et d'échange agricole.
            </p>
            <p className="leading-relaxed text-[15px]">
              En tant que plateforme d'intermédiation technique, Tsena permet aux professionnels du secteur de répertorier des stocks et d'entrer directement en contact pour organiser leurs partenariats. En accédant à nos services, vous acceptez d'être lié par ces termes.
            </p>

            {/* Note d'information grisée */}
            <div className="bg-light-bg/40 border border-separator/30 rounded-2xl p-5 flex gap-4 items-start text-sm">
              <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="italic text-input-element/80 leading-relaxed">
                <span className="font-bold not-italic text-label">Note :</span> L'utilisation continue de la plateforme après modification des CGU vaut acceptation tacite des nouvelles dispositions.
              </p>
            </div>
          </section>

          {/* 2. Obligations de l'Utilisateur */}
          <section id="obligations" className="space-y-6 scroll-mt-10">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center">2</span>
              <h2 className="text-2xl font-black text-label tracking-tight">Obligations de l'Utilisateur</h2>
            </div>
            <p className="leading-relaxed text-[15px]">
              L'utilisateur s'engage à maintenir un comportement professionnel et intègre. La courtoisie et le respect mutuel sont des conditions obligatoires pour le maintien de l'accès aux services.
            </p>

            {/* Grille de cartes (Exactitude / Sécurité) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="border border-separator/40 rounded-2xl p-6 bg-white shadow-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary text-[15px]">
                  <Users size={18} />
                  <span>Respect de la communauté</span>
                </div>
                <p className="text-xs text-input-element/80 leading-relaxed">
                  Each membre est tenu de respecter les autres utilisateurs. Tout comportement insultant, agressif ou abusif entraînera un bannissement immédiat.
                </p>
              </div>
              <div className="border border-separator/40 rounded-2xl p-6 bg-white shadow-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary text-[15px]">
                  <CheckCircle2 size={18} />
                  <span>Exactitude des annonces</span>
                </div>
                <p className="text-xs text-input-element/80 leading-relaxed">
                  Vous devez fournir des informations réelles et transparentes concernant la nature, la qualité et la disponibilité de vos produits agricoles.
                </p>
              </div>
            </div>

            {/* Liste de checks */}
            <ul className="space-y-3 pt-2 text-sm font-medium">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Honorer les engagements moraux et les rendez-vous fixés avec vos collaborateurs.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Ne pas utiliser de scripts automatisés pour extraire des données ou saturer l'espace d'annonces.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Garantir que les profils et certifications téléversés correspondent à votre situation professionnelle réelle.</span>
              </li>
            </ul>
          </section>

          {/* 3. Messagerie et Système de notation */}
          <section id="messagerie-notation" className="space-y-6 scroll-mt-10">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center">3</span>
              <h2 className="text-2xl font-black text-label tracking-tight">Messagerie et Système de notation</h2>
            </div>
            <p className="leading-relaxed text-[15px]">
              La plateforme met à votre disposition des outils interactifs pour fluidifier vos contacts directs sans s'immiscer dans vos accords privés.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="border border-separator/40 rounded-2xl p-6 bg-white shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-800 text-[15px]">
                  <MessageSquare size={18} />
                  <span>Messagerie Privée</span>
                </div>
                <p className="text-xs text-input-element/80 leading-relaxed">
                  C'est l'espace dédié où les utilisateurs discutent librement, négocient, fixent leurs rendez-vous physiques et s'entendent sur leurs conditions respectives d'échange.
                </p>
              </div>

              <div className="border border-separator/40 rounded-2xl p-6 bg-white shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-800 text-[15px]">
                  <Star size={18} />
                  <span>Système de Notation</span>
                </div>
                <p className="text-xs text-input-element/80 leading-relaxed">
                  Pour garantir la fiabilité de la communauté, un système d'évaluation permet de noter la ponctualité, la courtoisie et la conformité des échanges après une mise en relation.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Confidentialité et Protection des Données */}
          <section id="confidentialite" className="space-y-6 scroll-mt-10">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center">4</span>
              <h2 className="text-2xl font-black text-label tracking-tight">Confidentialité et Protection des Données</h2>
            </div>
            
            <div className="bg-light-bg/30 border border-separator/20 rounded-[32px] p-8 space-y-6">
              <p className="leading-relaxed text-[15px]">
                Tsena accorde une importance capitale à la protection de vos données professionnelles. Conformément au RGPD, nous collectons uniquement les informations nécessaires à la mise en relation et au bon fonctionnement de vos profils.
              </p>
              
              {/* Badges de conformité technique */}
              <div className="flex flex-wrap gap-3">
                <span className="bg-white border border-separator/40 text-label text-[11px] font-bold px-4 py-2 rounded-full shadow-sm">
                  Chiffrement AES-256
                </span>
                <span className="bg-white border border-separator/40 text-label text-[11px] font-bold px-4 py-2 rounded-full shadow-sm">
                  Hébergement UE (DataCenter Vert)
                </span>
                <span className="bg-white border border-separator/40 text-label text-[11px] font-bold px-4 py-2 rounded-full shadow-sm">
                  Droit à l'oubli
                </span>
              </div>
            </div>
          </section>

          {/* 5. Responsabilité et Garanties */}
          <section id="responsabilite" className="space-y-6 scroll-mt-10">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center">5</span>
              <h2 className="text-2xl font-black text-label tracking-tight">Responsabilité et Garanties</h2>
            </div>
            <p className="leading-relaxed text-[15px]">
              Tsena agit exclusivement en tant qu'intermédiaire technologique de mise en relation. En conséquence :
            </p>

            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4">
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-bold text-label text-[15px]">Exclusion de responsabilité</h4>
                  <p className="text-xs text-input-element/80 leading-relaxed">
                    Nous n'intervenons pas dans les accords conclus via la messagerie. Tout litige externe découlant d'un rendez-vous, de conditions fixées de gré à gré ou de la qualité finale des biens n'engage pas la responsabilité de la plateforme.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ShieldAlert size={20} className="text-primary flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-bold text-label text-[15px]">Disponibilité du service</h4>
                  <p className="text-xs text-input-element/80 leading-relaxed">
                    Bien que nous visions une disponibilité de 99.9%, nous ne garantissons pas une absence totale d'interruptions temporaires liées à des maintenances techniques de l'infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Résiliation */}
          <section id="resiliation" className="space-y-4 scroll-mt-10">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center">6</span>
              <h2 className="text-2xl font-black text-label tracking-tight">Résiliation</h2>
            </div>
            <p className="leading-relaxed text-[15px]">
              Tout utilisateur peut clôturer son compte à tout moment depuis ses paramètres. En cas de non-respect avéré des règles de comportement, de signalements répétés via le système de notation ou de détournement frauduleux de la messagerie, Tsena se réserve le droit de restreindre, suspendre ou supprimer le compte unilatéralement et sans préavis.
            </p>
          </section>

          {/* 7. Loi Applicable */}
          <section id="loi" className="space-y-4 scroll-mt-10">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center">7</span>
              <h2 className="text-2xl font-black text-label tracking-tight">Loi Applicable</h2>
            </div>
            <p className="leading-relaxed text-[15px]">
              Les présentes conditions d'utilisation sont régies et interprétées conformément aux lois en vigueur. Tout litige lié à leur application ou à l'utilisation des espaces de mise en relation relève de la compétence exclusive des tribunaux du siège social de l'éditeur.
            </p>
          </section>

          {/* --- BLOC APPEL À L'ACTION INFÉRIEUR --- */}
          <div className="mt-16 p-6 border border-separator/40 rounded-2xl bg-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-label text-sm">Besoin d'aide juridique ?</h4>
                <p className="text-input-element/70 text-xs">Contactez notre département conformité.</p>
              </div>
            </div>
            
            {/* Intégration du Bouton Shadcn Outline personnalisé */}
            <Button 
              variant="outline"
              className="border-2 border-amber-800/80 text-amber-900/90 hover:bg-amber-500/5 px-6 py-2.5 h-auto rounded-xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download size={14} />
              Télécharger en PDF
            </Button>
          </div>

        </main>
      </div>
    </div>
  );
}