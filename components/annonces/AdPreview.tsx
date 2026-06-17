"use client";

import { useState } from "react";
import { Eye, Scale, MapPin, AlertCircle, ChevronDown, ChevronUp, Tag } from "lucide-react";
import { AdFormMode } from "../../app/services/publication/ad";
import { ProductionTypeDisplay, formatPrice } from "../../app/services/publication/types";

interface AdPreviewProps {
  mode: AdFormMode;
  productionType: ProductionTypeDisplay;
  productName: string;
  quantityValue: string;
  quantityUnit: string;
  price?: string;
  location: string;
  description: string;
  mediaPreview: string;
}

export default function AdPreview({
  mode,
  productionType,
  productName,
  quantityValue,
  quantityUnit,
  price,
  location,
  description,
  mediaPreview,
}: AdPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLongDescription = description && description.length > 150;
  const displayDescription = description || "La description du produit s'affichera ici...";
  
  const truncatedDescription = hasLongDescription && !isExpanded
    ? displayDescription.slice(0, 150) + "..."
    : displayDescription;

  const displayPrice = price && parseFloat(price) > 0 
    ? `${parseFloat(price).toLocaleString()} Ar`
    : "Gratuit";

  // ⭐ DEBUG : Afficher le mode dans la console
  console.log("🔵 AdPreview - mode:", mode);
  console.log("🔵 AdPreview - est-ce une annonce?", mode === "annonce");

  // ⭐ Déterminer le texte du badge en fonction du mode
  const getPreviewLabel = () => {
    if (mode === "annonce") {
      return "Aperçu actuel de l'annonce";
    }
    return "Aperçu actuel de la demande";
  };

  return (
    <div className="space-y-6">
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
          {getPreviewLabel()}
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
              <span className="flex items-center gap-1 text-[#ffa000]">
                <Tag size={13} />
                {displayPrice}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 leading-relaxed whitespace-pre-wrap break-words">
              {truncatedDescription}
            </p>
            
            {hasLongDescription && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={14} />
                    <span>Voir moins</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    <span>Voir plus</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}