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
  rating?: number;
  reviews?: Review[] | null;
  isLoading?: boolean;
}

export default function ProfileReviews({ rating, reviews, isLoading }: ProfileReviewsProps) {
  const defaultAvatar = "/images/default-avatar.jpg";

  // --- COMPOSANT LOADER (Skeleton) ---
  if (isLoading || !reviews) {
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

  const totalReviews = reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, percentage };
  });

  const renderStars = (count: number) => (
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={16} className={i < count ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
    ))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* --- BLOC SUPÉRIEUR --- */}
      <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="text-center md:border-r md:border-slate-100 md:pr-12 flex flex-col items-center">
          <span className="text-5xl font-bold text-slate-800 tracking-tight">
            {(rating || 0).toFixed(1)}
          </span>
          <div className="flex items-center gap-0.5 mt-2">
            {renderStars(Math.floor(rating || 0))}
          </div>
        </div>

        <div className="w-full space-y-2">
          {distribution.map(({ stars, percentage }) => (
            <div key={stars} className="flex items-center gap-4 text-xs font-bold text-slate-400">
              <span className="w-3 text-right">{stars}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- LISTE DES AVIS --- */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                    <Image src={rev.authorAvatar || defaultAvatar} alt={rev.authorName} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{rev.authorName}</h4>
                    <span className="text-xs text-slate-400 font-medium">{rev.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">{renderStars(rev.rating)}</div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{rev.comment}</p>
            </div>
          ))
        ) : (
          <div className="p-8 bg-white rounded-xl border border-slate-100 text-center text-sm text-slate-400">
            Aucun avis reçu pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}