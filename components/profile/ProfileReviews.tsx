"use client";

import Image from "next/image";
import { Star } from "lucide-react";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  authorAvatar?: string;
}

interface ProfileReviewsProps {
  rating?: number | string | null;
  reviews?: Review[] | null;
  isLoading?: boolean;
}

export default function ProfileReviews({ rating, reviews, isLoading }: ProfileReviewsProps) {
  const defaultAvatar = "/images/default-avatar.jpg";

  // 🔥 Fonction pour formater le rating de manière robuste
  const formatRating = (value: number | string | null | undefined): number => {
    if (value === null || value === undefined) return 0;
    
    let numRating: number;
    if (typeof value === 'string') {
      // Nettoyer la chaîne
      const cleaned = value.replace(/[^0-9.]/g, '');
      numRating = parseFloat(cleaned);
    } else {
      numRating = value;
    }
    
    if (typeof numRating !== 'number' || isNaN(numRating)) return 0;
    return Math.min(Math.max(numRating, 0), 5);
  };

  // 🔥 Rendu des étoiles
  const renderStars = (count: number) => (
    Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < count ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"} 
      />
    ))
  );

  // 🔥 Rendu des petites étoiles pour la distribution
  const renderSmallStars = (count: number) => (
    Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < count ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"} 
      />
    ))
  );

  // --- COMPOSANT LOADER (Skeleton) ---
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton du bloc résumé */}
        <div className="p-6 bg-white rounded-xl border border-slate-100 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-slate-100 rounded-xl" />
          <div className="w-full space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2 bg-slate-100 rounded-full w-full" />
            ))}
          </div>
        </div>
        {/* Skeleton des cartes avis */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 bg-white rounded-xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-3 w-32 bg-slate-100 rounded" />
                  <div className="h-2 w-20 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-16 w-full bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🔥 Si pas de reviews, afficher un message
  if (!reviews || reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:border-r md:border-slate-100 md:pr-12 flex flex-col items-center">
            <span className="text-5xl font-bold text-slate-800 tracking-tight">
              {formatRating(rating).toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5 mt-2">
              {renderStars(Math.floor(formatRating(rating)))}
            </div>
            <span className="text-xs text-slate-400 mt-1">Aucun avis</span>
          </div>
          <div className="w-full space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-4 text-xs font-bold text-slate-400">
                <span className="w-3 text-right">{stars}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-8 bg-white rounded-xl border border-slate-100 text-center text-sm text-slate-400">
          Aucun avis reçu pour le moment.
        </div>
      </div>
    );
  }

  // 🔥 Calcul de la distribution
  const totalReviews = reviews.length;
  const formattedRating = formatRating(rating);
  
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* --- BLOC SUPÉRIEUR --- */}
      <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="text-center md:border-r md:border-slate-100 md:pr-12 flex flex-col items-center">
          <span className="text-5xl font-bold text-slate-800 tracking-tight">
            {formattedRating.toFixed(1)}
          </span>
          <div className="flex items-center gap-0.5 mt-2">
            {renderStars(Math.floor(formattedRating))}
          </div>
          <span className="text-xs text-slate-400 mt-1">
            {totalReviews} avis
          </span>
        </div>

        <div className="w-full space-y-2">
          {distribution.map(({ stars, percentage }) => (
            <div key={stars} className="flex items-center gap-4 text-xs font-bold text-slate-400">
              <div className="flex items-center gap-1 w-12">
                {renderSmallStars(stars)}
              </div>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500" 
                  style={{ width: `${percentage}%` }} 
                />
              </div>
              <span className="w-8 text-right text-slate-500">
                {percentage > 0 ? `${Math.round(percentage)}%` : '0%'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- LISTE DES AVIS --- */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                  {rev.authorAvatar ? (
                    <Image 
                      src={rev.authorAvatar} 
                      alt={rev.authorName} 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0D631B] to-[#2D6A36] flex items-center justify-center text-white font-bold text-sm">
                      {rev.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{rev.authorName}</h4>
                  <span className="text-xs text-slate-400 font-medium">{rev.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {renderStars(Math.floor(rev.rating))}
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}