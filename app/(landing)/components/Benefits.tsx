"use client";

import Image from 'next/image';
import { CheckCircle2, ShieldCheck, Search, MessageSquare } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function Benefits() {
  return (
    <section id="solutions" className="w-full bg-background py-16 sm:py-20 md:py-24 font-sans select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 space-y-20 sm:space-y-24 md:space-y-32">
        
        {/* --- SECTION POUR LES FOURNISSEURS --- */}
        <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-24">
          
          {/* Texte - Toujours en premier sur mobile/tablette */}
          <div className="flex-1 space-y-6 sm:space-y-8 order-1 lg:order-2">
            <Badge className="bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-none border-none pointer-events-none w-fit">
              Pour les fournisseurs
            </Badge>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-label tracking-tight leading-tight">
              Touchez plus d'acheteurs, sans tracas.
            </h2>

            <div className="space-y-5 sm:space-y-6">
              <BenefitItem 
                icon={<CheckCircle2 className="text-primary w-5 h-5" />}
                title="Visibilité Globale"
                description="Listez vos produits une seule fois et atteignez des milliers de collecteurs vérifiés dans le monde entier."
              />
              <BenefitItem 
                icon={<CheckCircle2 className="text-primary w-5 h-5" />}
                title="Paiements Sécurisés"
                description="Ne vous souciez plus des retards de paiement. Les fonds sont sécurisés avant l'expédition."
              />
              <BenefitItem 
                icon={<CheckCircle2 className="text-primary w-5 h-5" />}
                title="Gestion de Stock Facilitée"
                description="Un tableau de bord simple pour suivre votre stock, vos commandes et l'état de livraison."
              />
            </div>
          </div>

          {/* Image - En deuxième sur mobile/tablette */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] overflow-hidden shadow-2xl">
              <Image 
                src="/images/landing/fournisseurs.jpg" 
                alt="Producteurs"
                width={640}
                height={432}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* --- SECTION POUR LES COLLECTEURS --- */}
        <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-24">
          
          {/* Texte - Toujours en premier sur mobile/tablette */}
          <div className="flex-1 space-y-6 sm:space-y-8">
            <Badge className="bg-secondary hover:bg-secondary/90 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-none border-none pointer-events-none w-fit">
              Pour les collecteurs
            </Badge>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-label tracking-tight leading-tight">
              S'approvisionner en qualité n'a jamais été aussi simple.
            </h2>

            <div className="space-y-5 sm:space-y-6">
              <BenefitItem 
                icon={<ShieldCheck className="text-secondary w-5 h-5" />}
                title="Fournisseurs Vérifiés"
                description="Chaque producteur sur notre plateforme passe par un processus de vérification rigoureux."
              />
              <BenefitItem 
                icon={<Search className="text-secondary w-5 h-5" />}
                title="Découvrez des Produits de Qualité"
                description="Des filtres avancés pour trouver instantanément des produits bio, locaux ou spécialisés."
              />
              <BenefitItem 
                icon={<MessageSquare className="text-secondary w-5 h-5" />}
                title="Communication Fluide"
                description="Discutez directement avec les producteurs pour organiser la logistique et les besoins spécifiques."
              />
            </div>
          </div>

          {/* Image - En deuxième sur mobile/tablette */}
          <div className="flex-1 w-full">
            <div className="rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] overflow-hidden shadow-2xl">
              <Image 
                src="/images/landing/collecteurs.jpg" 
                alt="Collecteurs"
                width={720}
                height={720}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Composant utilitaire local nettoyé
function BenefitItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-3 sm:gap-4 items-start w-full">
      <div className="flex-shrink-0 mt-0.5 sm:mt-1 flex items-center justify-center">
        {icon}
      </div>
      <div className="space-y-1 w-full">
        <h4 className="text-base sm:text-lg font-black text-label tracking-tight">{title}</h4>
        <p className="text-sm sm:text-base text-input-element leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}