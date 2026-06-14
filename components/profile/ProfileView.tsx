// app/profile/ProfileView.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ProfileHeader from "./ProfileHeader";
import ProfileReviews from "./ProfileReviews"; 
import EditCollectorProfileForm from "./Edit/EditCollectorProfileForm";
import ProfileAds from "./ProfileAds"; 
import AdForm from "@/components/annonces/AddForm"; 
import { getUserProfile } from "./services/profileService";
import { UserProfile } from "./types/profile";
import AboutSection from "./ProfileAbout";

interface ProfileViewProps {
  slug: string;
}

export default function ProfileView({ slug }: ProfileViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Récupérer l'onglet depuis l'URL ou utiliser "annonces" par défaut
  const tabFromUrl = searchParams?.get("tab") || "annonces";
  const [activeTab, setActiveTabState] = useState(tabFromUrl);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAd, setEditingAd] = useState<any | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const data = await getUserProfile(slug);
        setProfile(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors du chargement du profil");
      }
    }
    fetchProfileData();
  }, [slug]);

  // Synchroniser l'état avec l'URL quand elle change
  useEffect(() => {
    const newTab = searchParams?.get("tab") || "annonces";
    setActiveTabState(newTab);
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTabState(value);
    // Mettre à jour l'URL sans recharger la page
    router.push(`?tab=${value}`, { scroll: false });
  };

  const handleProfileSave = (data: any) => {
    setProfile((prev) => (prev ? { ...prev, ...data } : null));
    setIsEditing(false);
    toast.success("Profil mis à jour avec succès !");
  };

  const handleAdSave = () => {
    setEditingAd(null);
    toast.success("Modification enregistrée avec succès !");
  };

  return (
    <div className="relative min-h-screen pb-12">
      {/* ÉDITION CONDITIONNELLE OU VUE PRINCIPALE */}
      {isEditing ? (
        <EditCollectorProfileForm
          initialData={profile}
          onCancel={() => setIsEditing(false)}
          onSave={handleProfileSave}
        />
      ) : editingAd ? (
        <AdForm
          mode={profile?.role === "fournisseur" ? "annonce" : "demande"}
          initialData={editingAd}
          onCancel={() => setEditingAd(null)}
          onSave={handleAdSave}
        />
      ) : (
        /* VUE PRINCIPALE */
        <div className="space-y-6 animate-in fade-in duration-300">
          <ProfileHeader
            user={profile}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onEditClick={() => setIsEditing(true)}
          />
          
          {/* Contenu affiché seulement si le profil existe */}
          {profile && (
            <div className="max-w-7xl mx-auto px-4">
              {activeTab === "annonces" && <ProfileAds onEditAd={setEditingAd} />}
              {activeTab === "apropos" && <AboutSection profile={profile} />}
              {activeTab === "avis" && <ProfileReviews rating={profile.rating} reviews={profile.reviews} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}