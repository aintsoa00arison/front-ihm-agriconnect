// components/PrivacyPolicy.tsx
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <ShieldCheck className="text-primary" size={24} />,
      title: "Protection des Données",
      content: "AgriConnect met en œuvre des mesures de sécurité robustes pour protéger vos informations personnelles contre tout accès non autorisé."
    },
    {
      icon: <Eye className="text-primary" size={24} />,
      title: "Utilisation des Informations",
      content: "Vos données sont uniquement utilisées pour faciliter les transactions entre producteurs et collecteurs au sein de l'écosystème AgriConnect."
    },
    {
      icon: <Lock className="text-primary" size={24} />,
      title: "Confidentialité",
      content: "Nous ne vendons ni n'échangeons vos informations personnelles identifiables à des tiers sans votre consentement explicite."
    }
  ];

  return (
    <section id="privacy" className="w-full bg-neutral py-24 font-sans">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-16">
        
        {/* En-tête */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
            <FileText className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-label">
            Politique de Confidentialité
          </h1>
          <p className="text-input-element text-lg max-w-2xl mx-auto">
            Dernière mise à jour : 14 Mai 2026. Votre vie privée est la priorité absolue d'AgriConnect.
          </p>
        </div>

        {/* Contenu Principal */}
        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-separator">
            {sections.map((section, index) => (
              <div key={index} className="space-y-4">
                <div className="w-12 h-12 bg-light-bg rounded-xl flex items-center justify-center">
                  {section.icon}
                </div>
                <h3 className="font-bold text-label text-xl">{section.title}</h3>
                <p className="text-input-element text-sm leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="prose prose-green max-w-none text-input-element space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-label">1. Collecte des informations</h2>
              <p className="leading-relaxed">
                AgriConnect recueille des informations lors de votre inscription, notamment pour authentifier votre statut de producteur ou de collecteur. Cela inclut votre identité, vos coordonnées professionnelles et les données relatives à vos produits ou besoins d'achat.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-label">2. Utilisation et Consentement</h2>
              <p className="leading-relaxed">
                En utilisant AgriConnect, vous consentez à ce que nous utilisions vos informations pour optimiser la mise en relation commerciale. Nous utilisons également vos données pour renforcer la sécurité des échanges et prévenir les fraudes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-label">3. Sécurité de l'Écosystème</h2>
              <p className="leading-relaxed">
                L'intégrité d'AgriConnect repose sur la confiance. Nous utilisons des protocoles de chiffrement avancés pour garantir que chaque transaction entre un producteur et un collecteur reste confidentielle et sécurisée.
              </p>
            </section>
          </div>

          {/* Contact */}
          <div className="mt-12 p-8 bg-light-bg rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-label">Des questions sur vos données ?</h4>
              <p className="text-input-element text-sm">L'équipe support d'AgriConnect est à votre disposition.</p>
            </div>
            <button className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all">
              Contacter AgriConnect
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}