"use client";

import { useEffect, useState } from 'react';
import { 
  Download, 
  User, 
  Sprout, 
  Wrench, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Edit3, 
  Trash2, 
  FolderDown,
  HelpCircle,
  MessageSquare,
  Star
} from 'lucide-react';

import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', name: 'Introduction' },
    { id: 'collecte', name: 'Collecte des données' },
    { id: 'utilisation', name: 'Utilisation des données' },
    { id: 'partage', name: 'Partage des données' },
    { id: 'securite', name: 'Sécurité et Chiffrement' },
    { id: 'droits', name: 'Droits des utilisateurs' },
  ];

  // Scroll-spy pour mettre en valeur la section active dans le sommaire au défilement
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
    <div className="w-full bg-[#F8F9FA] font-sans text-input-element antialiased selection:bg-primary/10 select-none">
      
      {/* --- EN-TÊTE DE LA PAGE --- */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 pt-16 pb-12 border-b border-separator/20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
        
          <h1 className="text-4xl lg:text-5xl font-black text-label tracking-tight mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-input-element/80 text-sm font-medium">
            Dernière mise à jour : <span className="font-bold">24 Mai 2024</span>. Nous nous engageons à protéger vos données d'intermédiation et vos informations personnelles avec la plus grande rigueur.
          </p>
        </div>
        
        <Button 
          className="bg-primary text-white hover:bg-[#154329] px-6 py-3 h-auto rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm shrink-0 cursor-pointer border-0"
        >
          <Download size={16} />
          Télécharger en PDF
        </Button>
      </div>

      {/* --- STRUCTURE PRINCIPALE --- */}
      {/* items-start empêche l'aside de s'étirer sur toute la hauteur du grid */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative">
        
        {/* Colonne Gauche : Sommaire Sticky & Boîte d'aide orange */}
        {/* h-fit redonne sa vraie hauteur à l'aside pour permettre le glissement sticky */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-fit space-y-8">
          <div className="space-y-4">
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
                    className={`text-left text-xs font-bold py-2.5 px-4 rounded-r-xl transition-all border-l-2 -ml-[1px] outline-none cursor-pointer ${
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
          </div>

          {/* Boîte d'aide Orange */}
          <div className="bg-[#FFEAD2] border border-[#F4D3B2] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-950 font-black text-xs uppercase tracking-wider">
              <HelpCircle size={16} className="text-amber-900" />
              <span>Besoin d'aide ?</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
              Contactez notre délégué à la protection des données (DPO).
            </p>
            <a 
              href="mailto:privacy@Tsena.com" 
              className="block text-xs font-bold text-amber-950 hover:underline break-all"
            >
              privacy@Tsena.com
            </a>
          </div>
        </aside>

        {/* Colonne Droite : Le Flux de Contenu (Seul bloc qui scrolle) */}
        <main className="col-span-1 lg:col-span-9 space-y-16 max-w-[850px] bg-white rounded-[32px] p-8 md:p-12 border border-separator/10 shadow-sm">
          
          {/* 1. Introduction */}
          <section id="intro" className="space-y-6 scroll-mt-10">
            <h2 className="text-2xl font-black text-label tracking-tight">Introduction</h2>
            <p className="leading-relaxed text-[15px]">
              Bienvenue sur <span className="font-bold text-label">Tsena</span>. La présente Politique de Confidentialité décrit comment nous collectons, utilisons, traitons et protégeons vos informations lorsque vous utilisez notre plateforme de mise en relation et d'échange de produits agricoles.
            </p>
            <p className="leading-relaxed text-[15px]">
              En accédant à Tsena, vous acceptez les pratiques décrites dans cette politique. Nous plaçons la transparence, le respect mutuel et la protection de vos espaces d'échange privés au cœur de notre service.
            </p>
          </section>

          {/* 2. Collecte des données */}
          <section id="collecte" className="space-y-6 scroll-mt-10">
            <h2 className="text-2xl font-black text-label tracking-tight">Collecte des données</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Carte Données Personnelles */}
              <div className="border border-separator/40 rounded-2xl p-6 bg-white space-y-4">
                <div className="flex items-center gap-2 font-bold text-primary text-sm">
                  <User size={18} />
                  <span>Données de profil</span>
                </div>
                <ul className="text-xs text-input-element/90 space-y-2 pl-2 list-disc list-inside">
                  <li>Identité (Nom, Prénom, Raison sociale)</li>
                  <li>Coordonnées professionnelles (Email, Téléphone)</li>
                  <li>Identifiants de connexion sécurisés</li>
                  <li>Contenu des messages privés et évaluations émises/reçues</li>
                </ul>
              </div>

              {/* Carte Données d'exploitation */}
              <div className="border border-separator/40 rounded-2xl p-6 bg-white space-y-4">
                <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                  <Sprout size={18} />
                  <span>Données d'annonces</span>
                </div>
                <ul className="text-xs text-input-element/90 space-y-2 pl-2 list-disc list-inside">
                  <li>Localisation globale ou rayon d'activité</li>
                  <li>Types de cultures et volumes disponibles</li>
                  <li>Historique des publications d'offres</li>
                  <li>Certifications environnementales déclarées</li>
                </ul>
              </div>
            </div>

            <p className="italic text-xs text-input-element/70 pt-2">
              Nous ne collectons que les données strictement indispensables pour mettre en relation les utilisateurs et assurer le suivi de la modération.
            </p>
          </section>

          {/* 3. Utilisation des données */}
          <section id="utilisation" className="space-y-6 scroll-mt-10">
            <h2 className="text-2xl font-black text-label tracking-tight">Utilisation des données</h2>
            <p className="text-sm">Vos données sont traitées exclusivement pour les finalités suivantes :</p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-label text-[15px]">Mise en relation et Messagerie</h4>
                  <p className="text-xs text-input-element/80 leading-relaxed">
                    Permettre l'envoi de messages privés pour vous laisser fixer librement vos rendez-vous physiques, vos conditions d'échange et vos modalités d'organisation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
                  <Star size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-label text-[15px]">Système de Notation et Fiabilité</h4>
                  <p className="text-xs text-input-element/80 leading-relaxed">
                    Calculer et afficher les notes et avis de la communauté afin de s'assurer que chaque membre respecte les autres utilisateurs et les engagements pris de gré à gré.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
                  <Wrench size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-label text-[15px]">Modération et Support technique</h4>
                  <p className="text-xs text-input-element/80 leading-relaxed">
                    Vérifier les signalements en cas de comportement abusif ou irrespectueux sur l'espace de discussion afin de préserver l'intégrité de la plateforme.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Partage des données */}
          <section id="partage" className="space-y-6 scroll-mt-10">
            <h2 className="text-2xl font-black text-label tracking-tight">Partage des données</h2>
            
            <div className="border border-separator/30 rounded-2xl p-6 space-y-4">
              <p className="text-xs font-medium text-input-element/90">
                Tsena n'agit pas comme un intermédiaire commercial et ne vend ni ne transmet jamais vos informations à des tiers à des fins publicitaires. Le partage est strictement restreint à :
              </p>
              
              <ul className="space-y-3 text-xs font-semibold text-label">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span>La publication de vos avis et notes sur les profils publics concernés</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span>L'affichage de votre pseudonyme ou nom lors des discussions privées initiées</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span>Les autorités légales compétentes (uniquement en cas de réquisition réglementaire ou comportement frauduleux avéré)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 5. Sécurité et Chiffrement */}
          <section id="securite" className="space-y-6 scroll-mt-10">
            <h2 className="text-2xl font-black text-label tracking-tight">Sécurité et Chiffrement</h2>
            
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F311D] to-primary p-8 text-white flex flex-col justify-end min-h-[160px] shadow-inner">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-3 font-black text-base tracking-wide">
                  <ShieldCheck size={24} className="text-white" />
                  <span>Espaces d'échange chiffrés</span>
                </div>
                <p className="text-xs text-white/80 font-medium">
                  Vos discussions et données de notation sont chiffrées au stockage et durant leur transit.
                </p>
              </div>
            </div>

            <p className="leading-relaxed text-xs text-input-element/90">
              Nous mettons en œuvre des mesures de protection robustes pour empêcher toute lecture non autorisée de vos conversations privées par des entités tierces.
            </p>
            <p className="leading-relaxed text-xs text-input-element/90">
              Toutes les connexions s'effectuent via le protocole sécurisé TLS 1.3, et l'accès aux bases de données internes est restreint au personnel habilité pour la maintenance ou la modération des signalements.
            </p>
          </section>

          {/* 6. Droits des utilisateurs */}
          <section id="droits" className="space-y-6 scroll-mt-10">
            <h2 className="text-2xl font-black text-label tracking-tight">Droits des utilisateurs</h2>
            <p className="text-sm">Conformément aux réglementations sur la protection des données (RGPD), vous gardez le contrôle total sur votre compte :</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F8F9FA] border border-separator/30 rounded-xl p-4 flex gap-3 items-start">
                <Eye className="text-primary shrink-0 mt-0.5" size={18} />
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-label">Droit d'accès</h5>
                  <p className="text-[11px] text-input-element/80">Consulter l'historique de vos annonces, messages et notes reçues.</p>
                </div>
              </div>

              <div className="bg-[#F8F9FA] border border-separator/30 rounded-xl p-4 flex gap-3 items-start">
                <Edit3 className="text-primary shrink-0 mt-0.5" size={18} />
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-label">Droit de rectification</h5>
                  <p className="text-[11px] text-input-element/80">Modifier à tout moment vos informations de contact et descriptions.</p>
                </div>
              </div>

              <div className="bg-[#F8F9FA] border border-separator/30 rounded-xl p-4 flex gap-3 items-start">
                <Trash2 className="text-primary shrink-0 mt-0.5" size={18} />
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-label">Droit à l'oubli</h5>
                  <p className="text-[11px] text-input-element/80">Supprimer définitivement votre compte, vos messages et vos fiches de la plateforme.</p>
                </div>
              </div>

              <div className="bg-[#F8F9FA] border border-separator/30 rounded-xl p-4 flex gap-3 items-start">
                <FolderDown className="text-primary shrink-0 mt-0.5" size={18} />
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-label">Droit à la portabilité</h5>
                  <p className="text-[11px] text-input-element/80">Exporter vos données de mise en relation sous un format standardisé.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F9FA] border border-separator/30 rounded-xl p-5 text-xs leading-relaxed text-input-element/90">
              Pour exercer vos droits, veuillez nous envoyer une demande signée à <a href="mailto:privacy@Tsena.com" className="font-bold text-label hover:underline">privacy@Tsena.com</a> avec une copie d'une pièce d'identité en cours de validité.
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}