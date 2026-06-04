"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress"; // Assure-toi d'avoir le composant Progress de shadcn/ui

interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  authorAvatar?: string; // Optionnel, si présent dans tes données de profil
}

interface ProfileReviewsProps {
  rating: number;
  reviews: Review[];
}

export default function ProfileReviews({ rating, reviews }: ProfileReviewsProps) {
  const defaultAvatar = "/images/default-avatar.jpg";

  // 1. Calcul de la distribution des notes pour les barres de progression (5 à 1)
  const totalReviews = reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, percentage };
  });

  const renderStars = (count: number, activeClass = "fill-amber-400 text-amber-400", inactiveClass = "text-slate-200") => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < count ? activeClass : inactiveClass}
      />
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* --- BLOC SUPÉRIEUR : Résumé des notes & Répartition --- */}
      <div className="p-6 bg-white rounded-2xl border border-separator/10 shadow-sm flex flex-col md:flex-row items-center gap-8">
        {/* Note globale géante */}
        <div className="text-center md:border-r md:border-slate-100 md:pr-12 flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-5xl font-bold text-slate-800 tracking-tight">
            {rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-0.5 mt-2">
            {renderStars(Math.floor(rating))}
          </div>
        </div>

        {/* Barres de progression (Distribution du score) */}
        <div className="w-full space-y-2">
          {distribution.map(({ stars, percentage }) => (
            <div key={stars} className="flex items-center gap-4 text-xs font-bold text-slate-400">
              <span className="w-3 text-right">{stars}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                {/* Rendu de la barre de progression teintée en ambre/orange comme sur la photo */}
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- LISTE DES AVIS INDIVIDUELS --- */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div 
              key={rev.id} 
              className="p-6 bg-white rounded-2xl border border-separator/10 shadow-sm space-y-4"
            >
              {/* En-tête de l'avis : Auteur, Date à gauche, Étoiles à droite */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Avatar de l'auteur */}
                    
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image
                        src={rev.authorAvatar || defaultAvatar}
                        alt={`Photo de ${rev.authorName}`}
                        fill
                        className="object-cover"
                        unoptimized={true} // 👈 Ajoute ceci explicitement ici pour couper l'optimisation Next.js
                    />
                    </div>
                  {/* Nom et Date */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">
                      {rev.authorName}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium block mt-0.5">
                      {rev.date}
                    </span>
                  </div>
                </div>

                {/* Étoiles alignées à droite comme sur image_4ec064.png */}
                <div className="flex items-center gap-0.5">
                  {renderStars(rev.rating)}
                </div>
              </div>

              {/* Corps du commentaire */}
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {rev.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="p-8 bg-white rounded-2xl border border-separator/10 text-center text-sm text-slate-400 font-medium">
            Aucun avis reçu pour le moment.
          </div>
        )}
      </div>

    </div>
  );
}