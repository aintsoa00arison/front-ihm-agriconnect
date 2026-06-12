"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import ProfileReviews from "./ProfileReviews"; 
import EditCollectorProfileForm from "./EditCollectorProfileForm";
import ProfileAds from "./ProfileAds"; 
import AdForm from "@/components/annonces/AddForm"; 
import { getUserProfile } from "./services/profileService";
import { UserProfile } from "./types/profile";
import { Bell, X } from "lucide-react"; 
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
  const [globalToast, setGlobalToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const data = await getUserProfile(slug);
        setProfile(data);
      } catch (error) {
        console.error("Erreur:", error);
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

  const showGlobalNotification = (msg: string, type: "success" | "error" = "success") => {
    setGlobalToast({ message: msg, type });
    setTimeout(() => setGlobalToast(null), 4000);
  };

  return (
    <div className="relative min-h-screen pb-12">
      {/* 1. TOAST EN BAS À DROITE */}
      {globalToast && (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-md animate-in slide-in-from-right-5 duration-300">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 bg-white ${
            globalToast.type === "success" ? "border-[#2e7d32]/30 text-[#1b5e20]" : "border-red-200 text-red-900"
          }`}>
            <Bell size={16} className={globalToast.type === "success" ? "text-[#2e7d32]" : "text-red-600"} />
            <p className="text-xs font-bold flex-1">{globalToast.message}</p>
            <button onClick={() => setGlobalToast(null)}><X size={14} /></button>
          </div>
        </div>
      )}

      {/* 2. ÉDITION CONDITIONNELLE OU VUE PRINCIPALE */}
      {isEditing ? (
        <EditCollectorProfileForm
          initialData={profile}
          onCancel={() => setIsEditing(false)}
          onSave={(data) => {
            setProfile((prev) => (prev ? { ...prev, ...data } : null));
            setIsEditing(false);
            showGlobalNotification("Profil mis à jour !");
          }}
        />
      ) : editingAd ? (
        <AdForm
          mode={profile?.role === "fournisseur" ? "annonce" : "demande"}
          initialData={editingAd}
          onCancel={() => setEditingAd(null)}
          onSave={() => {
            setEditingAd(null);
            showGlobalNotification("Modification enregistrée !");
          }}
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