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
import AdForm from "@/components/annonces/AddForm";
import { useProfile } from "../../app/services/hooks/useProfile";
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

  // ⭐ Récupérer le rôle normalisé
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

  const profileWithOwner = profile ? { ...profile, isOwner: isOwnProfile } : null;

  useEffect(() => {
    const newTab = searchParams?.get("tab") || "annonces";
    setActiveTabState(newTab);
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTabState(value);
    router.push(`?tab=${value}`, { scroll: false });
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

    if (profile.role === "collecteur") {
      result = await updateProfile(data);
    } else if (profile.type === "particulier") {
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
      // Le toast est géré dans le formulaire
    } else {
      toast.error(result?.message || "Erreur lors de la mise à jour");
    }
  };

  // Suppression du toast dans handleAdSave
  const handleAdSave = () => {
    setEditingAd(null);
    // Le toast est géré dans AdForm
  };

  useEffect(() => {
    if (profileName && !profile && !loading) {
      console.log("🔵 Recherche par nom:", profileName);
    }
  }, [profileName, profile, loading]);

  if (loading) {
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

  const isCollector = profile.role === "collecteur";

  // ⭐ Déterminer le mode en fonction du rôle normalisé
  // Si le rôle est fournisseur → "annonce", sinon → "demande"
  const adMode = userRole === "fournisseur" ? "annonce" : "demande";

  console.log("🔵 ProfileView - adMode calculé:", adMode);
  console.log("🔵 ProfileView - userRole:", userRole);

  return (
    <div className="relative min-h-screen bg-white pb-12">
      {isEditing ? (
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
            {activeTab === "annonces" && <ProfileAds onEditAd={setEditingAd} />}
            {activeTab === "apropos" && <AboutSection profile={profile} />}
            {activeTab === "avis" && (
              <ProfileReviews
                rating={profile.rating}
                reviews={profile.reviews || []}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}