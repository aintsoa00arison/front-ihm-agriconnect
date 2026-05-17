"use client";

import { useState } from 'react';
import { Camera, ChevronLeft, Check, Info } from 'lucide-react';

// Importations des composants racines Shadcn
import { Stepper } from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";

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
  const registerSteps = ["Type de profil", "Informations supplémentaires", "Finalisation du profil"];

  // Regroupement des données actuelles à chaque action de navigation
  const getCurrentData = () => ({
    image: imageFile,
    imageUrl: previewUrl,
    bio: isCollecteur ? '' : bio // Nettoyage de la bio si c'est un collecteur
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
      
      {/* Stepper positionné sur la 3ème et dernière étape */}
      <Stepper steps={registerSteps} currentStep={3} />

      <div className="bg-white rounded-[20px] shadow-sm border border-separator/10 p-8 space-y-8">
        
        {/* Titre centré */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-label uppercase tracking-wider font-manrope">Finalisation</h2>
        </div>

        <div className="space-y-10">
          
          {/* SECTION PHOTO DE PROFIL */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-label uppercase tracking-wider border-b border-separator/10 pb-1">Photo de profil</h3>
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border border-dashed border-separator/60 bg-neutral-50 flex items-center justify-center overflow-hidden transition-colors group-hover:border-primary/50">
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
                <p className="font-bold text-sm text-label">Importer une photo claire</p>
                <p className="text-[11px] text-input-element italic">JPG, PNG - 5Mo maximum</p>
                <label className="text-xs font-bold text-primary hover:underline cursor-pointer block pt-1 select-none">
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

          {/* SECTION BIOGRAPHIE / MESSAGE D'INFORMATION */}
          {!isCollecteur ? (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-400">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-label uppercase tracking-wider border-b border-separator/10 pb-1">Biographie</h3>
                <p className="text-xs text-input-element pt-1">
                  Présentez brièvement votre activité, vos spécialités et vos années d'expérience.
                </p>
              </div>
              <Textarea 
                placeholder="Nous sommes une société qui traite..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="h-32 resize-none"
                required
              />
            </div>
          ) : (
            <div className="flex items-start space-x-3 p-4 bg-neutral-50 rounded-xl border border-separator/10 animate-in slide-in-from-top-2 duration-400">
              <Info size={18} className="text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-label">Prêt à commencer</p>
                <p className="text-xs text-input-element">
                  Votre profil de collecteur ne nécessite pas de biographie publique. Vous pouvez finaliser votre inscription dès maintenant.
                </p>
              </div>
            </div>
          )}

          {/* NAVIGATION */}
          <div className="flex items-center justify-between pt-6 border-t border-separator/10">
            <button 
              type="button" 
              onClick={() => onBack(getCurrentData())}
              className="px-8 py-2.5 rounded-xl border border-separator/30 text-sm font-bold text-label hover:bg-neutral-50 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <ChevronLeft size={18} />
              <span>Précédent</span>
            </button>
            <button 
              type="button"
              onClick={() => onFinish(getCurrentData())}
              className="btn-primary px-10 py-2.5 text-xs flex items-center space-x-2 shadow-lg shadow-primary/10 cursor-pointer"
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