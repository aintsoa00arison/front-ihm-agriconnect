"use client";

import { useRef } from "react";
import Image from "next/image";
import { Star, Pencil, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileHeaderProps {
  user: {
    name: string;
    role: "fournisseur" | "collecteur";
    rating: number;
    bio: string;
    avatarUrl?: string;
    bannerUrl?: string;
  } | null; // Notez bien le "| null" ici
  activeTab: string;
  onTabChange: (value: string) => void;
  onEditClick?: () => void;
}

export default function ProfileHeader({ user, activeTab, onTabChange, onEditClick }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PROTECTION CRUCIALE : Si user est null ou undefined, on arrête tout.
  // Cela empêche l'erreur "Cannot read properties of undefined"
  if (!user) {
    return null;
  }

  const getTabValue = (label: string) => {
    switch (label) {
      case "À propos": return "apropos";
      case "Annonces": return "annonces";
      case "Avis": return "avis";
      default: return label.toLowerCase();
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Bannière */}
      <div className="relative w-full h-48 md:h-64 bg-slate-100 overflow-hidden rounded-b-[2rem]">
        <Image 
          src={user?.bannerUrl || "/images/auth/champ.jpeg"} 
          alt="Bannière" 
          fill 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-[#0D631B]/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6 gap-4">
          <div className="flex items-end gap-5">
            <div className="relative w-32 h-32 rounded-full border-4 border-white bg-slate-200 shadow-sm flex-shrink-0">
              {user?.avatarUrl && (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-white p-2 rounded-full border border-slate-100 shadow-sm text-[#0D631B] hover:bg-slate-50"
              >
                <Camera size={16} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                <span className="px-3 py-1 rounded-full border border-[#0D631B]/20 bg-[#E8F5E7] text-[#0D631B] text-xs font-bold capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < (user?.rating || 0) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-600">{(user?.rating || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>

          <Button onClick={onEditClick} className="bg-[#2D6A36] hover:bg-[#23562b] text-white font-bold rounded-lg h-10 px-5 shadow-sm">
            <Pencil size={16} className="mr-2" /> Modifier le profil
          </Button>
        </div>

        <div className="border-b border-slate-100 pb-6 mb-0">
          <p className="text-sm text-slate-500 max-w-full leading-relaxed">{user?.bio}</p>
        </div>

        <div className="w-full sm:w-1/4">
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="flex justify-start bg-transparent p-0 h-auto">
              {["Annonces", "À propos", "Avis"].map((tab, index) => (
                <TabsTrigger 
                  key={tab} 
                  value={getTabValue(tab)} 
                  className={`py-3 text-sm font-bold data-[state=active]:text-[#0D631B] data-[state=active]:border-b-2 data-[state=active]:border-[#0D631B] rounded-none bg-transparent shadow-none
                    ${index === 0 ? "pl-0 pr-6" : "px-6"}`}
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}