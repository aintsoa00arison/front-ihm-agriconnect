"use client";

import { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileReviews from "./ProfileReviews"; 
import EditCollectorProfileForm from "./EditCollectorProfileForm";
import ProfileAds from "./ProfileAds"; 
import AdForm from "@/components/annonces/AddForm"; 
import { getUserProfile } from "./services/profileService";
import { UserProfile } from "./types/profile";
import { Bell, X } from "lucide-react"; 

interface ProfileViewProps {
  slug: string;
}

export default function ProfileView({ slug }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState("annonces");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAd, setEditingAd] = useState<any | null>(null);
  
  // 👈 État global pour gérer les notifications sur la vue Profil
  const [globalToast, setGlobalToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        const data = await getUserProfile(slug);
        setProfile(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [slug]);

  // Fonction utilitaire pour afficher un toast persistant au démontage
  const showGlobalNotification = (msg: string, type: "success" | "error" = "success") => {
    setGlobalToast({ message: msg, type });
    setTimeout(() => {
      setGlobalToast(null);
    }, 4000);
  };

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-slate-400 font-medium animate-pulse">
        Chargement des données du profil...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 bg-red-50 text-red-500 rounded-2xl border border-red-200 text-center font-bold">
        Erreur : Impossible de charger le profil de {slug}.
      </div>
    );
  }

  // 🔄 Condition 1 : Modification du profil complet
  if (isEditing) {
    return (
      <EditCollectorProfileForm
        initialData={profile}
        onCancel={() => setIsEditing(false)}
        onSave={(updatedData) => {
          setProfile((prev) => (prev ? { ...prev, ...updatedData } : null));
          setIsEditing(false);
          showGlobalNotification("Profil mis à jour avec succès !");
        }}
      />
    );
  }

  // 🔄 Condition 2 : Modification d'une annonce
  if (editingAd) {
    return (
      <div className="animate-in fade-in duration-200">
        <AdForm
          mode={profile.role === "fournisseur" ? "annonce" : "demande"}
          initialData={editingAd}
          onCancel={() => setEditingAd(null)}
          onSave={async (updatedAdData) => {
            // Ici, vous ferez votre appel API de mise à jour (ex: await updateAd(updatedAdData))
            console.log("Annonce modifiée enregistrée :", updatedAdData);
            
            // 1. Fermer le formulaire d'édition
            setEditingAd(null);
            
            // 2. Déclencher le toast persistant au niveau global
            showGlobalNotification("Modification enregistrée avec succès !", "success");
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300 relative">
      
      {/* ================= CONTENEUR DU POP-UP PARENT ================= */}
      {globalToast && (
        <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 w-full max-w-md animate-in slide-in-from-right-5 duration-300">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 bg-white ${
            globalToast.type === "success" 
              ? "bg-[#e8f5e9] border-[#2e7d32]/30 text-[#1b5e20]" 
              : "bg-red-50 border-red-200 text-red-900"
          }`}>
            <div className={`p-1.5 rounded-lg flex-shrink-0 ${
              globalToast.type === "success" ? "bg-[#2e7d32]/10 text-[#2e7d32]" : "bg-red-100 text-red-600"
            }`}>
              <Bell size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold leading-relaxed">{globalToast.message}</p>
            </div>
            <button 
              type="button"
              onClick={() => setGlobalToast(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <ProfileHeader
        user={{
          name: profile.name,
          role: profile.role,
          rating: profile.rating,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          bannerUrl: profile.bannerUrl,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onEditClick={() => setIsEditing(true)}
      />

      {/* Contenu dynamique des Onglets */}
      <div className="mt-6">
        {activeTab === "annonces" && (
          <div className="space-y-6">
            <ProfileAds onEditAd={(ad) => setEditingAd(ad)} />
          </div>
        )}

        {activeTab === "apropos" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-separator/10 space-y-4">
                <h3 className="text-base font-bold text-primary">Représentant légal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Nom et prénom(s)</label>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {profile.representative.firstName} {profile.representative.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Téléphone</label>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{profile.representative.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Email</label>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{profile.representative.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm border border-separator/10 space-y-4">
                <h3 className="text-base font-bold text-primary">Entreprise</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Nom de la structure</label>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{profile.company.name}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Téléphone</label>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{profile.company.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Email professionnel</label>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{profile.company.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-sm border border-separator/10 h-fit space-y-4">
              <h3 className="text-base font-bold text-primary">Type de production</h3>
              <div className="flex flex-wrap gap-2">
                {profile.productionTypes.map((type, idx) => (
                  <span key={idx} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary/10 text-primary capitalize">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "avis" && (
          <ProfileReviews rating={profile.rating} reviews={profile.reviews} />
        )}
      </div>
    </div>
  );
}