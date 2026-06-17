// app/visite/profil/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import VisiteProfileView from "@/components/visite/VisiteProfileView";
import { profileService } from "../../../../../app/services/profile/profileService";

export default function VisiteProfilPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserBySlug = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Chercher l'utilisateur par pseudonyme
        const users = await profileService.searchUsersByName(slug);
        
        if (users && users.length > 0) {
          const user = users[0];
          setUserId(user.id);
        } else {
          setError("Utilisateur non trouvé");
        }
      } catch (err) {
        console.error("❌ Erreur lors de la recherche:", err);
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBySlug();
  }, [slug]);

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

  if (error || !userId) {
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

  return <VisiteProfileView userId={userId} />;
}