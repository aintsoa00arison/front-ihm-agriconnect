"use client";

import { useState } from 'react';
import { Camera, ChevronLeft, Check, Info } from 'lucide-react';

interface Props {
  role: 'collecteur' | 'fournisseur'; 
  initialData: { image: File | null; imageUrl: string | null; bio: string };
  onBack: (currentData: { image: File | null; imageUrl: string | null; bio: string }) => void;
  onFinish: (currentData: { image: File | null; imageUrl: string | null; bio: string }) => void;
}

export default function FinalisationForm({ role, initialData, onBack, onFinish }: Props) {
  // Initialisation des états avec les données déjà existantes dans le parent
  const [imageFile, setImageFile] = useState<File | null>(initialData.image);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData.imageUrl);
  const [bio, setBio] = useState<string>(initialData.bio);
  
  const isCollecteur = role === 'collecteur'; 

  // Regroupement des données actuelles à chaque action de navigation
  const getCurrentData = () => ({
    image: imageFile,
    imageUrl: previewUrl,
    bio: isCollecteur ? '' : bio // On nettoie la bio si c'est un collecteur
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 space-y-6 h-fit animate-in fade-in duration-500">
      
      {/* Stepper Final */}
      <div className="flex items-center justify-between px-6 mb-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm">1</div>
          <span className="text-[10px] font-bold text-primary mt-1">Type de profil</span>
        </div>
        <div className="flex-1 h-[1px] bg-primary mx-4 -mt-4"></div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm">2</div>
          <span className="text-[10px] font-bold text-primary mt-1">Informations supplémentaires</span>
        </div>
        <div className="flex-1 h-[1px] bg-primary mx-4 -mt-4"></div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold ring-4 ring-primary/10">3</div>
          <span className="text-[10px] font-bold text-primary mt-1">Finalisation du profil</span>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-separator/10 p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-label uppercase tracking-wider">Finalisation</h2>
        </div>

        <div className="space-y-10">
          {/* SECTION PHOTO DE PROFIL */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800">Photo de profil</h3>
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-separator/50 bg-neutral-50 flex items-center justify-center overflow-hidden transition-colors group-hover:border-primary/50">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={28} className="text-input-element/40" />
                  )}
                </div>
                <label className="absolute inset-0 cursor-pointer">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </label>
              </div>
              
              <div className="space-y-1">
                <p className="font-bold text-sm text-neutral-800">Importer une photo claire</p>
                <p className="text-[11px] text-input-element italic">JPG, PNG - 5Mo maximum</p>
                <label className="text-xs font-bold text-primary hover:underline cursor-pointer block pt-1">
                  Choisir une photo
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </label>
              </div>
            </div>
          </div>

          {/* SECTION BIOGRAPHIE */}
          {!isCollecteur ? (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-400">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-800">Biographie</h3>
                <p className="text-xs text-input-element">
                  Présentez brièvement votre activité, vos spécialités et vos années d'expérience.
                </p>
              </div>
              <textarea 
                placeholder="Nous sommes une société qui traite..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-32 p-4 rounded-xl border border-separator/20 bg-neutral-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none"
                required
              ></textarea>
            </div>
          ) : (
            <div className="flex items-start space-x-3 p-4 bg-neutral-50 rounded-xl border border-separator/10">
              <Info size={18} className="text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-label">Prêt à commencer</p>
                <p className="text-xs text-input-element">Votre profil de collecteur ne nécessite pas de biographie publique. Vous pouvez finaliser votre inscription dès maintenant.</p>
              </div>
            </div>
          )}

          {/* NAVIGATION */}
          <div className="flex items-center justify-between pt-6 border-t border-separator/10">
            <button 
              type="button" 
              onClick={() => onBack(getCurrentData())} // Sauvegarde l'état actuel avant de reculer
              className="px-8 py-2.5 rounded-xl border border-separator/30 text-sm font-bold text-label hover:bg-neutral-50 transition-all flex items-center space-x-2"
            >
              <ChevronLeft size={18} />
              <span>Précédent</span>
            </button>
            <button 
              type="button"
              onClick={() => onFinish(getCurrentData())}
              className="btn-primary px-10 py-2.5 text-sm flex items-center space-x-2 shadow-lg shadow-primary/20"
            >
              <Check size={18} />
              <span>Terminé</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}