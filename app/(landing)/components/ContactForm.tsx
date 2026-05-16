"use client";

import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Map
} from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi via Tomail
    console.log('Données soumises via Tomail:', formData);
  };

  return (
    <div className="w-full bg-[#F8F9FA] font-sans text-input-element antialiased selection:bg-primary/10 min-h-screen">
      
      {/* --- SECTION EN-TÊTE (HERO) --- */}
      <div className="w-full bg-gradient-to-b from-[#F3F4F6]/50 to-[#F8F9FA] py-16 px-6 lg:px-16 text-center space-y-4 border-b border-separator/10">
        <p className="text-[11px] font-black uppercase text-primary tracking-widest">
          Contactez-nous
        </p>
        <h1 className="text-3xl lg:text-5xl font-black text-label tracking-tight max-w-4xl mx-auto">
          Cultivons votre succès ensemble
        </h1>
        <p className="text-input-element/80 text-sm lg:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          Vous avez des questions sur nos services ou souhaitez optimiser votre chaîne d'approvisionnement ? Notre équipe d'experts en agronomie moderne est à votre écoute.
        </p>
      </div>

      {/* --- ZONE PRINCIPALE : FORMULAIRE & COORDONNÉES --- */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Colonne Gauche : Formulaire de contact */}
        <div className="col-span-1 lg:col-span-7 bg-white rounded-[24px] p-8 border border-separator/10 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-label tracking-tight">
            Envoyez-nous un message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nom complet */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-label">
                  Nom complet
                </label>
                <input 
                  type="text"
                  placeholder="Ex: Jean Dupont"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-separator/30 text-xs font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white text-label placeholder:text-input-element/30"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-label">
                  Email
                </label>
                <input 
                  type="email"
                  placeholder="jean.dupont@exemple.mg"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-separator/30 text-xs font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white text-label placeholder:text-input-element/30"
                  required
                />
              </div>
            </div>

            {/* Sujet */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-label">
                Sujet
              </label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-separator/30 text-xs font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white text-label cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234A5568%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_16px_center] bg-no-repeat"
                required
              >
                <option value="" disabled hidden>Choisissez un sujet</option>
                <option value="support">Support technique</option>
                <option value="commercial">Partenariat commercial</option>
                <option value="verification">Vérification de compte</option>
                <option value="autre">Autre demande</option>
              </select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-label">
                Message
              </label>
              <textarea 
                rows={5}
                placeholder="Comment pouvons-nous vous aider ?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-separator/30 text-xs font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white text-label placeholder:text-input-element/30 resize-none"
                required
              ></textarea>
            </div>

            {/* Bouton Envoyer via Tomail */}
            <button 
              type="submit"
              className="bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm outline-none"
            >
              <Send size={14} />
              Envoyer via Tomail
            </button>
          </form>
        </div>

        {/* Colonne Droite : Coordonnées & Carte */}
        <div className="col-span-1 lg:col-span-5 space-y-6">
          
          {/* Boîte des coordonnées */}
          <div className="bg-white rounded-[24px] p-8 border border-separator/10 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-label tracking-tight">
              Nos Coordonnées
            </h2>

            <div className="space-y-6">
              {/* Adresse */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                  <MapPin size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-input-element/50 tracking-wider">
                    Adresse
                  </p>
                  <p className="text-xs font-bold text-label leading-relaxed">
                    Immeuble Horizon, 3ème étage<br />
                    Ankorondrano, Antananarivo 101<br />
                    Madagascar
                  </p>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                  <Phone size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-input-element/50 tracking-wider">
                    Téléphone
                  </p>
                  <p className="text-xs font-bold text-label">
                    +261 20 22 123 45
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                  <Mail size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-input-element/50 tracking-wider">
                    Email
                  </p>
                  <a 
                    href="mailto:contact@AgriConnect.mg" 
                    className="text-xs font-bold text-label hover:text-primary hover:underline transition-colors"
                  >
                    contact@AgriConnect.mg
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Carte Illustrative */}
          <div className="relative rounded-[24px] overflow-hidden border border-separator/10 h-[210px] group shadow-sm">
            {/* Image de fond stylisée représentant les parcelles/topographie */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-amber-700/10 bg-[radial-gradient(#1E5E3A_1px,transparent_1px)] [background-size:16px_16px] group-hover:scale-105 transition-transform duration-500"></div>
            
            {/* Overlay décoratif vectoriel pour simuler des zones de parcelles */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-repeat bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,%23000_75%,%23000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,%23000_75%,%23000)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]"></div>

            {/* Badge de localisation central */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md animate-pulse">
              <MapPin size={16} className="text-white" />
            </div>

            {/* Bouton d'action Google Maps */}
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-label hover:bg-white px-4 py-2.5 rounded-xl font-bold text-[11px] flex items-center gap-2 transition-all shadow-sm border border-separator/20"
            >
              <Map size={12} className="text-primary" />
              Voir sur Google Maps
            </a>
          </div>

        </div>
      </div>

      {/* --- BANNIÈRE PARTENAIRES EN PIED DE PAGE --- */}
      <div className="w-full border-t border-separator/10 bg-white py-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 text-center space-y-4">
          <p className="text-[10px] font-black uppercase text-input-element/40 tracking-widest">
            Ils nous font confiance pour leurs échanges agricoles
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40 select-none">
            <span className="font-sans text-base font-black tracking-tight text-label">BioMad</span>
            <span className="font-sans text-base font-black tracking-tight text-label">AgroLink</span>
            <span className="font-sans text-base font-black tracking-tight text-label">EcoFarm</span>
            <span className="font-sans text-base font-black tracking-tight text-label">TerraPlus</span>
          </div>
        </div>
      </div>

    </div>
  );
}