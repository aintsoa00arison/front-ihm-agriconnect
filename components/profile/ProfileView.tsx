"use client";

import { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileReviews from "./ProfileReviews"; 
import { getUserProfile } from "./services/profileService";
import { UserProfile } from "./types/profile";

interface ProfileViewProps {
  slug: string;
}

export default function ProfileView({ slug }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState("apropos");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
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
        onEditClick={() => console.log("Modifier le profil cliqué")}
      />

      {/* Contenu dynamique des Onglets */}
      <div className="mt-6">
        
        {/* --- Onglet Annonces --- */}
        {activeTab === "annonces" && (
          <div className="p-6 bg-white rounded-2xl border border-separator/10 shadow-sm text-sm text-slate-500">
            {profile.role === "fournisseur" 
              ? "Liste des offres et produits disponibles (Fleurs, cultures, récoltes)..." 
              : "Liste des demandes de collecte ou besoins en cours..."}
          </div>
        )}

        {/* --- Onglet À Propos --- */}
        {activeTab === "apropos" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-separator/10 space-y-4">
                <h3 className="text-base font-bold text-[#0D631B]">Représentant légal</h3>
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
                <h3 className="text-base font-bold text-[#0D631B]">Entreprise</h3>
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
              <h3 className="text-base font-bold text-[#0D631B]">Type de production</h3>
              <div className="flex flex-wrap gap-2">
                {profile.productionTypes.map((type, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#0D631B]/10 text-[#0D631B] capitalize"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- Onglet Avis (Maintenant modulé et propre grâce au fichier à part) --- */}
        {activeTab === "avis" && (
          <ProfileReviews 
            rating={profile.rating} 
            reviews={profile.reviews} 
          />
        )}
      </div>
    </div>
  );
}