// app/profile/VisiteProfileView.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import VisiteHeader from "./VisiteHeader";
import ProfileReviews from "../profile/ProfileReviews";
import VisiteAds from "./VisiteAds";
import AboutSection from "../profile/ProfileAbout";
import { useProfile } from "../../app/services/hooks/useProfile";
import { useEvaluations } from "../../app/services/hooks/useEvaluations";
import { getUserId, getUserRole } from "../../app/services/lib/auth";

interface VisiteProfileViewProps {
  userId: string;
}

export default function VisiteProfileView({ userId }: VisiteProfileViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("annonces");
  
  const currentUserId = getUserId();

  // ⭐ Si c'est le profil de l'utilisateur connecté, rediriger vers son profil
  useEffect(() => {
    if (userId === currentUserId) {
      const userRole = getUserRole();
      const basePath = userRole === 'fournisseur' || userRole === 'provider' ? '/f' : '/c';
      router.replace(`${basePath}/profile/me`);
    }
  }, [userId, currentUserId, router]);

  const {
    profile,
    loading,
    error,
  } = useProfile(userId);

  // Hook pour les évaluations
  const { 
    loading: evaluationsLoading, 
    getReviewsForProfile,
    averageRating,
  } = useEvaluations(userId);

  // Combiner les données du profil avec les évaluations
  const profileWithEvaluations = profile ? {
    ...profile,
    rating: averageRating > 0 ? averageRating : profile.rating,
    reviews: getReviewsForProfile()
  } : null;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // ⭐ Fonction pour rediriger vers le profil avec l'ID
  const handleViewProfile = (profileUserId: string) => {
    if (profileUserId) {
      const userRole = getUserRole();
      const basePath = userRole === 'fournisseur' || userRole === 'provider' ? '/f' : '/c';
      router.push(`${basePath}/profile/${profileUserId}`);
    }
  };

  if (loading || evaluationsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-md px-4">
          <div className="h-8 bg-slate-100 rounded w-32 mx-auto"></div>
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || "Profil non trouvé"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-primary hover:underline"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white pb-12">
      <div className="space-y-6 animate-in fade-in duration-300">
        <VisiteHeader
          user={profileWithEvaluations}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isLoading={loading}
        />

        <div className="max-w-7xl mx-auto px-4">
       {activeTab === "annonces" && (
  <VisiteAds 
    userId={userId} 
    onViewProfile={handleViewProfile}
  />
)}
          {activeTab === "apropos" && <AboutSection profile={profile} />}
          {activeTab === "avis" && (
            <ProfileReviews
              rating={profileWithEvaluations?.rating || profile.rating}
              reviews={profileWithEvaluations?.reviews || []}
              isLoading={evaluationsLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}