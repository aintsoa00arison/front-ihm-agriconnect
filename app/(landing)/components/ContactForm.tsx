// components/ContactForm.tsx
"use client";

import { useState } from 'react';
import { Send, Mail, User, MessageSquare } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construction du lien mailto pour ouvrir Outlook
    const mailtoUrl = `mailto:contact@agriconnect.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Nom: ${formData.name}\n\n${formData.message}`)}`;
    
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" className="w-full bg-white py-24 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 flex flex-col lg:flex-row gap-16">
        
        {/* --- TEXTE D'ACCOMPAGNEMENT --- */}
        <div className="flex-1 space-y-8">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-label leading-tight">
            Une question ? <br />
            <span className="text-primary">Contactez notre équipe.</span>
          </h2>
          <p className="text-input-element text-lg max-w-md">
            Que vous soyez producteur ou collecteur, nous sommes là pour vous accompagner dans votre transition numérique.
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4 text-label font-semibold">
              <div className="w-10 h-10 bg-neutral rounded-full flex items-center justify-center text-primary">
                <Mail size={20} />
              </div>
              support@agriconnect.com
            </div>
          </div>
        </div>

        {/* --- FORMULAIRE --- */}
        <div className="flex-1">
          <form 
            onSubmit={handleSubmit}
            className="bg-neutral p-8 md:p-12 rounded-[40px] shadow-sm space-y-6"
          >
            {/* Nom */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-label ml-2">Nom complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-input-element" size={18} />
                <input 
                  type="text"
                  required
                  placeholder="Jean Dupont"
                  className="w-full bg-white border border-transparent focus:border-primary rounded-2xl py-4 pl-12 pr-4 outline-none transition-all"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            {/* Sujet */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-label ml-2">Sujet</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-input-element" size={18} />
                <input 
                  type="text"
                  required
                  placeholder="Demande de partenariat"
                  className="w-full bg-white border border-transparent focus:border-primary rounded-2xl py-4 pl-12 pr-4 outline-none transition-all"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-label ml-2">Votre message</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-6 text-input-element" size={18} />
                <textarea 
                  required
                  rows={4}
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="w-full bg-white border border-transparent focus:border-primary rounded-2xl py-4 pl-12 pr-4 outline-none transition-all resize-none"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
            >
              Ouvrir Outlook <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}