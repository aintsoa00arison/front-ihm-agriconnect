"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MapPin, Scale, Upload, Check, AlertCircle, Eye, Bell, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Définition des types pour les deux aspects
export type AdFormMode = "annonce" | "demande";

export interface AdData {
  id?: string;
  productionType: string;
  productName: string;
  quantityValue?: string;
  quantityUnit?: string;
  quantity?: string; // Fallback pour le format texte combiné
  location: string;
  description: string;
  mediaUrl?: string;
}

interface AdFormProps {
  mode: AdFormMode;
  initialData?: AdData; // Données initiales facultatives pour activer le mode Modification
  onCancel: () => void;
  onSave: (data: any) => void;
}

interface ToastState {
  id: number;
  message: string;
  type: "success" | "error";
}

export default function AdForm({ mode, initialData, onCancel, onSave }: AdFormProps) {
  const isAnnonce = mode === "annonce";
  const isEditMode = !!initialData; // Vrai si des données initiales sont fournies
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ÉTATS DU FORMULAIRE ---
  const [productionType, setProductionType] = useState<string>("Végétale");
  const [productName, setProductName] = useState<string>("Blé de province");
  const [quantityValue, setQuantityValue] = useState<string>("3");
  const [quantityUnit, setQuantityUnit] = useState<string>("tonnes");
  const [location, setLocation] = useState<string>("Fianarantsoa");
  const [description, setDescription] = useState<string>(
    "Cultivé sous le soleil de Midi sur des terres préservées, ce blé offre des arômes de noisette et une digestibilité optimale. Naturellement riche en minéraux et faible en gluten, il est l'allié parfait d'une cuisine saine et savoureuse."
  );
  
  // Image de l'annonce (Aperçu par défaut)
  const [mediaPreview, setMediaPreview] = useState<string>(
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"
  );

  // État pour les Toasts (Pop-ups de réussite ou d'échec)
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Synchronisation des états avec initialData en mode Modification
  useEffect(() => {
    if (initialData) {
      setProductionType(initialData.productionType || "Végétale");
      setProductName(initialData.productName || "");
      setLocation(initialData.location || "");
      setDescription(initialData.description || "");
      
      if (initialData.mediaUrl) {
        setMediaPreview(initialData.mediaUrl);
      }

      // Gestion intelligente du parsing de la quantité si elle est fournie brute ou séparée
      if (initialData.quantityValue && initialData.quantityUnit) {
        setQuantityValue(initialData.quantityValue);
        setQuantityUnit(initialData.quantityUnit);
      } else if (initialData.quantity) {
        const parts = initialData.quantity.trim().split(" ");
        if (parts.length >= 2) {
          setQuantityValue(parts[0]);
          setQuantityUnit(parts.slice(1).join(" "));
        } else {
          setQuantityValue(initialData.quantity);
        }
      }
    }
  }, [initialData]);

  // Fonction pour déclencher une notification popup
  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  // Gestion du chargement de l'image locale par l'utilisateur
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setMediaPreview(reader.result);
          showToast("Image chargée avec succès.", "success");
        }
      };
      reader.onerror = () => {
        showToast("Échec du chargement de l'image.", "error");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!productName.trim() || !quantityValue.trim() || !location.trim()) {
        showToast("Veuillez remplir tous les champs obligatoires.", "error");
        return;
      }

      onSave({
        id: initialData?.id,
        mode,
        productionType,
        productName,
        quantityValue,
        quantityUnit,
        quantity: `${quantityValue} ${quantityUnit}`,
        location,
        description,
        mediaUrl: mediaPreview,
      });

      // Déclenchement conditionnel du message selon le mode de saisie (Création vs Modification)
      if (isEditMode) {
        showToast("Modification enregistrée avec succès !", "success");
      } else {
        showToast(
          isAnnonce 
            ? "Votre annonce a été publiée avec succès !" 
            : "Votre demande a été publiée avec succès !", 
          "success"
        );
      }
    } catch (error) {
      showToast("Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.", "error");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 animate-in fade-in duration-300 relative">
      
      {/* ================= CONTENEUR DES POP-UPS (NOTIFICATIONS SANS BLEU) ================= */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 w-full max-w-md pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-right-5 duration-300 ${
              t.type === "success" 
                ? "bg-[#e8f5e9] border-[#2e7d32]/30 text-[#1b5e20]" 
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            <div className={`p-1.5 rounded-lg flex-shrink-0 ${
              t.type === "success" 
                ? "bg-[#2e7d32]/10 text-[#2e7d32]" 
                : "bg-red-100 text-red-600"
            }`}>
              <Bell size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold leading-relaxed">{t.message}</p>
            </div>
            <button 
              type="button"
              onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
              className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Grille principale en 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= COLONNE GAUCHE : FORMULAIRE DE SAISIE ================= */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          {/* Titres dynamiques selon le mode */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
              {isEditMode 
                ? (isAnnonce ? "Modifier mon annonce" : "Modifier ma demande")
                : (isAnnonce ? "Faire une nouvelle annonce" : "Faire une nouvelle demande")
              }
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              {isEditMode
                ? `Mettre à jour les informations de votre ${isAnnonce ? "annonce" : "demande"} pour rester attractif pour les autres.`
                : isAnnonce
                  ? "Décrivez votre offre de manière détaillée pour rassurer et convaincre. Une annonce bien structurée est la clé pour rester compétitif et visible."
                  : "Spécifiez le type de produit recherché, la quantité exacte dont vous avez besoin ainsi que le lieu de livraison souhaité. Plus votre demande est précise, plus les propositions seront pertinentes."
              }
            </p>
          </div>

          <div className="space-y-4">
            {/* Ligne 1 : Type de production & Nom du produit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">Type de production</label>
                <div className="relative">
                  <select
                    value={productionType}
                    onChange={(e) => setProductionType(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl h-11 px-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D631B] focus:border-transparent appearance-none"
                  >
                    <option value="Végétale">Végétale</option>
                    <option value="Élevage">Élevage</option>
                    <option value="Rente">Rente</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">Nom du produit</label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Blé de province"
                  className="bg-slate-50/50 border-slate-200/80 rounded-xl h-11 text-sm font-medium focus-visible:ring-[#0D631B]"
                  required
                />
              </div>
            </div>

            {/* Ligne 2 : Quantité & Localisation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">Quantité</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={quantityValue}
                    onChange={(e) => setQuantityValue(e.target.value)}
                    placeholder="Ex: 3"
                    className="bg-slate-50/50 border-slate-200/80 rounded-xl h-11 text-sm font-medium focus-visible:ring-[#0D631B] flex-1"
                    required
                  />
                  <select
                    value={quantityUnit}
                    onChange={(e) => setQuantityUnit(e.target.value)}
                    className="bg-slate-50/50 border border-slate-200/80 rounded-xl h-11 px-3 text-xs font-bold text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0D631B]"
                  >
                    <option value="tonnes">tonnes</option>
                    <option value="Sacs">Sacs</option>
                    <option value="Kg">Kg</option>
                    <option value="Unités">Unités</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">
                  {isAnnonce ? "Localisation" : "Lieu de livraison"}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Fianarantsoa"
                    className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 text-sm font-medium focus-visible:ring-[#0D631B]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Ligne 3 : Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A propos du produit..."
                className="w-full min-h-[140px] bg-slate-50/50 border-slate-200 rounded-xl focus-visible:ring-[#0D631B] p-4 text-sm font-medium resize-none"
                required
              />
            </div>

            {/* Ligne 4 : Zone Média / Upload */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Média de l'annonce</label>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={handleUploadClick}
                className="border-2 border-dashed border-slate-200 hover:border-primary rounded-2xl p-8 text-center bg-slate-50/20 cursor-pointer transition-colors group flex flex-col items-center justify-center space-y-3"
              >
                <div className="p-3 bg-slate-100 rounded-full text-slate-400 group-hover:bg-green-50 group-hover:text-primary transition-colors">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">
                    Cliquez ici pour charger une photo ou glissez votre fichier ici
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1">
                    PNG ou JPG jusqu'à 10Mo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
            <Button
              type="button"
              onClick={onCancel}
              variant="ghost"
              className="font-bold text-slate-500 hover:bg-slate-100 h-11 px-8 rounded-xl"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:opacity-90 text-white font-bold h-11 px-8 rounded-xl shadow-sm gap-2 transition-all flex items-center justify-center"
            >
              <Check size={18} strokeWidth={2.5} />
              {isEditMode ? "Enregistrer les modifications" : "Enregistrer"}
            </Button>
          </div>
        </form>

        {/* ================= COLONNE DROITE : APERÇU EN DIRECT ================= */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-4">
          <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-2xl flex items-start gap-3">
            <div className="p-1.5 bg-amber-100/80 rounded-lg text-amber-700 mt-0.5">
              <AlertCircle size={16} />
            </div>
            <p className="text-xs font-semibold text-amber-900 leading-relaxed">
              Votre profil et votre note s'afficheront en bas de la publication.
            </p>
          </div>

          <div className="rounded-2xl border border-separator/10 overflow-hidden shadow-md bg-white">
            <div className="p-3.5 bg-green-50/80 border-b border-green-100/60 text-xs font-bold text-primary flex items-center gap-2">
              <Eye size={15} />
              {isAnnonce ? "Aperçu actuel de l'annonce" : "Aperçu actuel de la demande"}
            </div>

            <div className="relative w-full h-64 bg-slate-100">
              <img src={mediaPreview} alt="Aperçu récoltes" className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md tracking-wider">
                {productionType}
              </span>
            </div>

            <div className="p-5 space-y-3">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {productName || "Nom du produit"}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Scale size={13} />
                    {quantityValue ? `${quantityValue} ${quantityUnit}` : "Quantité"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {location || "Antananarivo, Madagascar"}
                  </span>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-4">
                {description || "La description du produit s'affichera ici..."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}