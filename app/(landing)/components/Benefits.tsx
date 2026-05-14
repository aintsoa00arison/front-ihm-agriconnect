// components/Benefits.tsx
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, Search, MessageSquare } from 'lucide-react';

export default function Benefits() {
  return (
    <section  id="solutions" className="w-full bg-white py-24 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 space-y-32">
        
        {/* --- SECTION POUR LES FOURNISSEURS --- */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Image à gauche */}
          <div className="flex-1 w-full">
            <div className="rounded-[32px] overflow-hidden shadow-2xl">
              <Image 
                src="/produc-img.jpg" // Remplace par ton image de tomates/champs
                alt="Producteurs"
                width={700}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Texte à droite */}
          <div className="flex-1 space-y-8">
            <div className="inline-block px-4 py-1 bg-primary rounded-full">
              <span className="text-white text-xs font-bold uppercase tracking-wider">
                Pour les fournisseurs
              </span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-label">
              Touchez plus d'acheteurs, sans tracas.
            </h2>

            <div className="space-y-6">
              <BenefitItem 
                icon={<CheckCircle2 className="text-primary" />}
                title="Visibilité Globale"
                description="Listez vos produits une seule fois et atteignez des milliers de collecteurs vérifiés dans le monde entier."
              />
              <BenefitItem 
                icon={<CheckCircle2 className="text-primary" />}
                title="Paiements Sécurisés"
                description="Ne vous souciez plus des retards de paiement. Les fonds sont sécurisés avant l'expédition."
              />
              <BenefitItem 
                icon={<CheckCircle2 className="text-primary" />}
                title="Gestion de Stock Facilitée"
                description="Un tableau de bord simple pour suivre votre stock, vos commandes et l'état de livraison."
              />
            </div>
          </div>
        </div>

        {/* --- SECTION POUR LES COLLECTEURS --- */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
          {/* Image à droite */}
          <div className="flex-1 w-full">
            <div className="rounded-[32px] overflow-hidden shadow-2xl">
              <Image 
                src="/collect-img.jpg" // Remplace par ton image d'entrepôt/tablette
                alt="Collecteurs"
                width={700}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Texte à gauche */}
          <div className="flex-1 space-y-8">
            <div className="inline-block px-4 py-1 bg-secondary rounded-full">
              <span className="text-white text-xs font-bold uppercase tracking-wider">
                Pour les collecteurs
              </span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-label">
              S'approvisionner en qualité n'a jamais été aussi simple.
            </h2>

            <div className="space-y-6">
              <BenefitItem 
                icon={<ShieldCheck className="text-secondary" />}
                title="Fournisseurs Vérifiés"
                description="Chaque producteur sur notre plateforme passe par un processus de vérification rigoureux."
              />
              <BenefitItem 
                icon={<Search className="text-secondary" />}
                title="Découvrez des Produits de Qualité"
                description="Des filtres avancés pour trouver instantanément des produits bio, locaux ou spécialisés."
              />
              <BenefitItem 
                icon={<MessageSquare className="text-secondary" />}
                title="Communication Fluide"
                description="Discutez directement avec les producteurs pour organiser la logistique et les besoins spécifiques."
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Petit composant utilitaire pour les lignes de bénéfices
function BenefitItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-bold text-label">{title}</h4>
        <p className="text-input-element leading-relaxed text-sm lg:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}