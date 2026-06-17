// app/profile/ProfileView.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ProfileHeader from "./ProfileHeader";
import ProfileReviews from "./ProfileReviews";
import EditCollectorProfileForm from "./Edit/EditCollectorProfileForm";
import EditSupplierProfileForm from "./Edit/EditSupplierProfileForm";
import ProfileAds from "./ProfileAds";
import VisiteAds from "../visite/VisiteAds";
import AdForm from "@/components/annonces/AddForm";
import { useProfile } from "../../app/services/hooks/useProfile";
import { useEvaluations } from "../../app/services/hooks/useEvaluations";
import { getUserId, getUserFromToken, isUUID, getUserRole, normalizeRole } from "../../app/services/lib/auth";
import AboutSection from "./ProfileAbout";

interface ProfileViewProps {
  slug: string;
}
import { extractRepNames } from './../../app/utils/stringHelpers';

export default function ProfileView({ slug }: ProfileViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams?.get("tab") || "annonces";
  const [activeTab, setActiveTabState] = useState(tabFromUrl);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAd, setEditingAd] = useState<any | null>(null);

  const currentUserId = getUserId();
  const userFromToken = getUserFromToken();

  // Récupérer le rôle normalisé
  const userRole = getUserRole();

  const getProfileId = (): string | undefined => {
    if (slug === "me") {
      return currentUserId || undefined;
    }
    if (isUUID(slug)) {
      return slug;
    }
    return undefined;
  };

  const isOwnProfile = slug === "me" || slug === currentUserId;
  const profileId = getProfileId();
  const profileName = !isUUID(slug) && slug !== "me" ? slug : undefined;

  console.log("🔵 ProfileView - slug:", slug);
  console.log("🔵 ProfileView - currentUserId:", currentUserId);
  console.log("🔵 ProfileView - userRole:", userRole);
  console.log("🔵 ProfileView - isOwnProfile:", isOwnProfile);
  console.log("🔵 ProfileView - profileId:", profileId);
  console.log("🔵 ProfileView - profileName:", profileName);

  const {
    profile,
    loading,
    error,
    updateIndividualProfile,
    updateEntrepriseProfile,
    updateProfile,
  } = useProfile(profileId);

  const { 
    loading: evaluationsLoading, 
    getReviewsForProfile,
    averageRating,
    totalReviews,
    loadEvaluations
  } = useEvaluations(profileId);

  const profileWithEvaluations = profile ? {
    ...profile,
    rating: averageRating > 0 ? averageRating : profile.rating,
    reviews: getReviewsForProfile()
  } : null;

  const profileWithOwner = profileWithEvaluations ? { 
    ...profileWithEvaluations, 
    isOwner: isOwnProfile 
  } : null;

  useEffect(() => {
    const newTab = searchParams?.get("tab") || "annonces";
    setActiveTabState(newTab);
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTabState(value);
    router.push(`?tab=${value}`, { scroll: false });
  };

  const handleViewProfile = (userId: string) => {
    if (userId) {
      const userRole = getUserRole();
      const basePath = userRole === 'fournisseur' || userRole === 'provider' ? '/f' : '/c';
      router.push(`${basePath}/profile/${userId}`);
    }
  };

  // 🔥 Récupérer le type de profil pour l'édition
  const getProfileType = (): 'collecteur' | 'fournisseur' => {
    if (profile?.role) return profile.role;
    if (userRole === 'collecteur' || userRole === 'collector') return 'collecteur';
    return 'fournisseur';
  };

  const handleProfileSave = async (data: any) => {
    let result;
    
    if (!profile) {
      toast.error("Profil non chargé");
      return;
    }
    
    const getSafeString = (value: any, defaultValue: string = ''): string => {
      if (value === undefined || value === null) return defaultValue;
      return String(value);
    };

    const getSafeArray = (value: any, defaultValue: any[] = []): any[] => {
      if (value === undefined || value === null) return defaultValue;
      return Array.isArray(value) ? value : defaultValue;
    };

    // 🔥 Déterminer le type de profil à mettre à jour
    const profileType = getProfileType();

    if (profileType === "collecteur") {
      // 🔥 Mise à jour pour collecteur
      result = await updateIndividualProfile({
        id: getSafeString(profile.id),
        last_name: getSafeString(data.last_name || data.nom),
        first_name: getSafeString(data.first_name || data.prenom),
        phone: data.phone ? [getSafeString(data.phone)] : [],
        address: getSafeString(data.address || data.localisation),
        description: getSafeString(data.bio || data.description),
        product_category: getSafeArray(data.productionTypes || data.productions),
      });
    } else if (profile.type === "particulier") {
      // 🔥 Mise à jour pour fournisseur particulier
      result = await updateIndividualProfile({
        id: getSafeString(profile.id),
        last_name: getSafeString(data.last_name || data.nom),
        first_name: getSafeString(data.first_name || data.prenom),
        phone: data.phone ? [getSafeString(data.phone)] : [],
        address: getSafeString(data.address || data.localisation),
        description: getSafeString(data.bio || data.description),
        product_category: getSafeArray(data.productionTypes || data.productions),
      });
    } else {
      // 🔥 Mise à jour pour fournisseur entreprise
      const getRepNames = (nomResponsable: string | undefined) => {
        const safeName = getSafeString(nomResponsable);
        if (!safeName || safeName.trim() === '') {
          return { rep_last_name: '', rep_first_name: '' };
        }
        const parts = safeName.trim().split(' ');
        return {
          rep_last_name: parts[0] || '',
          rep_first_name: parts.slice(1).join(' ') || ''
        };
      };

      const responsableNom = data.nomResponsable || 
                             data.representative?.fullName || 
                             data.representative?.lastName || 
                             '';

      const repNames = getRepNames(responsableNom);

      result = await updateEntrepriseProfile({
        id: getSafeString(profile.id),
        legal_name: getSafeString(data.company?.name || data.nomEntite),
        registered_office: getSafeString(data.company?.address || data.localisationEntite),
        phone: data.company?.phone ? [getSafeString(data.company.phone)] : [],
        rep_last_name: getSafeString(data.representative?.lastName || repNames.rep_last_name),
        rep_first_name: getSafeString(data.representative?.firstName || repNames.rep_first_name),
        rep_cin_number: getSafeString(data.representative?.cin || data.cinResponsable),
        company_description: getSafeString(data.bio || data.description),
        product_category: getSafeArray(data.productionTypes || data.productions),
      });
    }

    if (result?.success) {
      setIsEditing(false);
    } else {
      toast.error(result?.message || "Erreur lors de la mise à jour");
    }
  };

  const handleAdSave = () => {
    setEditingAd(null);
  };

  useEffect(() => {
    if (profileName && !profile && !loading) {
      console.log("🔵 Recherche par nom:", profileName);
    }
  }, [profileName, profile, loading]);

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
            onClick={() => router.push("/login")}
            className="mt-4 text-primary hover:underline"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  // 🔥 Déterminer le type de profil pour l'édition
  const isCollector = profile.role === "collecteur";
  const profileType = getProfileType();

  // 🔥 Déterminer le mode d'annonce
  const adMode = userRole === "fournisseur" || userRole === "provider" ? "annonce" : "demande";

  console.log("🔵 ProfileView - adMode:", adMode);
  console.log("🔵 ProfileView - userRole:", userRole);
  console.log("🔵 ProfileView - profileType:", profileType);
  console.log("🔵 ProfileView - isCollector:", isCollector);

  return (
    <div className="relative min-h-screen bg-white pb-12">
      {isEditing ? (
        // 🔥 Afficher l'éditeur selon le type d'utilisateur
        isCollector ? (
          <EditCollectorProfileForm
            initialData={profile}
            onCancel={() => setIsEditing(false)}
            onSave={handleProfileSave}
          />
        ) : (
          <EditSupplierProfileForm
            type={profile.type || "particulier"}
            initialData={profile}
            onCancel={() => setIsEditing(false)}
            onSave={handleProfileSave}
          />
        )
      ) : editingAd ? (
        <AdForm
          mode={adMode}
          initialData={editingAd}
          onCancel={() => setEditingAd(null)}
          onSave={handleAdSave}
        />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <ProfileHeader
            user={profileWithOwner}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onEditClick={() => setIsEditing(true)}
            isLoading={loading}
          />

          <div className="max-w-7xl mx-auto px-4">
            {activeTab === "annonces" && (
              isOwnProfile ? (
                <ProfileAds key="profile-ads" onEditAd={setEditingAd} />
              ) : (
                <VisiteAds 
                  key={`visite-ads-${profileId}`}
                  userId={profileId || ''} 
                  onViewProfile={handleViewProfile}
                />
              )
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
      )}
    </div>
  );
}