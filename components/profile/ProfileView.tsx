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
import { getUserId, getUserFromToken, isUUID } from "../../app/services/lib/auth";
import AboutSection from "./ProfileAbout";

interface ProfileViewProps {
  slug: string;
}
import { extractRepNames } from './../../app/utils/stringHelpers'; // Assurez-vous d'avoir cette fonction dans utils/profileUtils.ts


export default function ProfileView({ slug }: ProfileViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams?.get("tab") || "annonces";
  const [activeTab, setActiveTabState] = useState(tabFromUrl);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAd, setEditingAd] = useState<any | null>(null);

  // 🔥 Récupérer l'ID utilisateur depuis le token
  const currentUserId = getUserId();
  const userFromToken = getUserFromToken();

  // 🔥 Fonction pour déterminer l'ID à utiliser
  const getProfileId = (): string | undefined => {
    // Si c'est "me", utiliser l'ID du token
    if (slug === "me") {
      return currentUserId || undefined;
    }

    // Si c'est un UUID valide, l'utiliser directement
    if (isUUID(slug)) {
      return slug;
    }

    // Sinon, c'est un nom (slug) - on va chercher par nom
    return undefined;
  };

  // 🔥 Déterminer si c'est le profil de l'utilisateur connecté
  const isOwnProfile = slug === "me" || slug === currentUserId;

  // 🔥 ID utilisateur pour l'appel API
  const profileId = getProfileId();

  // 🔥 Nom pour la recherche par nom (si ce n'est pas un UUID)
  const profileName = !isUUID(slug) && slug !== "me" ? slug : undefined;

  console.log("🔵 ProfileView - slug:", slug);
  console.log("🔵 ProfileView - currentUserId:", currentUserId);
  console.log("🔵 ProfileView - isOwnProfile:", isOwnProfile);
  console.log("🔵 ProfileView - profileId:", profileId);
  console.log("🔵 ProfileView - profileName:", profileName);

  // 🔥 Utiliser le hook useProfile avec l'ID ou undefined
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
  
  // 🔥 Vérifier que profile n'est pas null
  if (!profile) {
    toast.error("Profil non chargé");
    return;
  }
  
  // 🔥 Extraction sécurisée des noms
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
    // 🔥 Gestion sécurisée du nom du responsable
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
    toast.success("Profil mis à jour avec succès !");
  } else {
    toast.error(result?.message || "Erreur lors de la mise à jour");
  }
};
  const handleAdSave = () => {
    setEditingAd(null);
    toast.success("Modification enregistrée avec succès !");
  };

  // 🔥 Si le slug est un nom et qu'on n'a pas d'ID, on essaie de chercher par nom
  useEffect(() => {
    if (profileName && !profile && !loading) {
      // Ici on pourrait appeler un endpoint pour chercher par nom
      console.log("🔵 Recherche par nom:", profileName);
      // TODO: Appeler l'API de recherche par nom si nécessaire
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
          mode={profile?.role === "fournisseur" ? "annonce" : "demande"}
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