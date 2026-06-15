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
import { getUserId } from "../../app/services/lib/auth";
import AboutSection from "./ProfileAbout";

interface ProfileViewProps {
  slug: string;
}

export default function ProfileView({ slug }: ProfileViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams?.get("tab") || "annonces";
  const [activeTab, setActiveTabState] = useState(tabFromUrl);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAd, setEditingAd] = useState<any | null>(null);

  const {
    profile,
    loading,
    error,
    updateCollectorProfile,
    updateFournisseurProfile,
  } = useProfile(slug);

  // Vérifier si c'est le profil de l'utilisateur connecté
  const currentUserId = getUserId();
  const isOwner = profile?.id === currentUserId || slug === "me";

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
    if (profile?.role === "collecteur") {
      result = await updateCollectorProfile(data);
    } else {
      result = await updateFournisseurProfile(data);
    }

    if (result.success) {
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès !");
    } else {
      toast.error(result.message);
    }
  };

  const handleAdSave = () => {
    setEditingAd(null);
    toast.success("Modification enregistrée avec succès !");
  };

  if (loading) {
    return null; // Ne rien afficher pendant le chargement
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

  // Ajouter isOwner au profil pour le composant ProfileHeader
  const profileWithOwner = { ...profile, isOwner };

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
