// app/c/visite/profil/[slug]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import VisiteProfileView from "@/components/visite/VisiteProfileView";
import { profileService } from "../../../../../app/services/profile/profileService";
import { authService } from "../../../../../app/services/auth/authService";
import { setToken, setUserRole, getUserId, getUserRole, isUUID } from "../../../../../app/services/lib/auth";

export default function VisiteProfilPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const invitationToken = searchParams?.get('token') || null;
  const invitationId = searchParams?.get('invitation_id') || null;
  const publicationId = searchParams?.get('publication_id') || null;

  // ⭐ Fonction pour rediriger vers le profil
  const redirectToProfile = (userId: string) => {
    if (!userId) return;
    
    const userRole = getUserRole();
    const basePath = userRole === 'fournisseur' || userRole === 'provider' ? '/f' : '/c';
    const profilePath = `${basePath}/profile/${userId}`;
    
    console.log(`🔵 Redirection vers: ${profilePath}`);
    router.replace(profilePath);
  };

  useEffect(() => {
    const authenticateAndFetch = async () => {
      // ⭐ Si un token d'invitation est présent
      if (invitationToken) {
        setIsAuthenticating(true);
        try {
          // 1. Authentifier l'utilisateur
          const response = await authService.authenticateWithInvitation(invitationToken);
          
          if (response.success && response.data?.access_token) {
            // Stocker le token
            setToken(response.data.access_token);
            
            const userType = response.data.user?.user_type || 
                            response.data.user?.userType || 
                            'collecteur';
            setUserRole(userType);
            
            toast.success("✅ Authentification réussie !");
            
            // ⭐ Méthode 1: Utiliser l'invitationId pour récupérer le sender
            if (invitationId) {
              try {
                const invResponse = await fetch(`/api/invitations/${invitationId}`);
                if (invResponse.ok) {
                  const invData = await invResponse.json();
                  console.log('🔵 Invitation récupérée:', invData);
                  
                  if (invData.sender_id) {
                    // ⭐ Récupérer le profil du sender
                    const senderProfile = await profileService.getUserById(invData.sender_id);
                    if (senderProfile) {
                      console.log('🔵 Sender trouvé:', senderProfile);
                      redirectToProfile(senderProfile.id);
                      return;
                    }
                  }
                }
              } catch (err) {
                console.error("❌ Erreur récupération invitation:", err);
              }
            }
            
            // ⭐ Méthode 2: Si le slug est un UUID, l'utiliser directement
            if (slug && isUUID(slug)) {
              console.log(`🔵 slug est un UUID: ${slug}`);
              redirectToProfile(slug);
              return;
            }
            
            // ⭐ Méthode 3: Rechercher par nom (fallback)
            if (slug) {
              try {
                const users = await profileService.searchUsersByName(slug);
                if (users && users.length > 0) {
                  redirectToProfile(users[0].id);
                  return;
                }
              } catch (err) {
                console.error("❌ Erreur recherche:", err);
              }
            }
            
            // ⭐ Dernier fallback: rediriger vers le profil de l'utilisateur connecté
            const currentUserId = getUserId();
            if (currentUserId) {
              redirectToProfile(currentUserId);
              return;
            }
            
            setLoading(false);
          } else {
            toast.error(response.message || "Erreur d'authentification");
            setLoading(false);
          }
        } catch (error) {
          console.error("❌ Erreur authentification:", error);
          toast.error("Erreur lors de l'authentification");
          setLoading(false);
        } finally {
          setIsAuthenticating(false);
        }
        return;
      }

      // ⭐ Pas de token, charger le profil normalement (pour les visites sans invitation)
      if (!slug) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // ⭐ Si c'est un UUID, l'utiliser directement
        if (isUUID(slug)) {
          setTargetUserId(slug);
        } else {
          const users = await profileService.searchUsersByName(slug);
          if (users && users.length > 0) {
            setTargetUserId(users[0].id);
          } else {
            setError("Utilisateur non trouvé");
          }
        }
      } catch (err) {
        console.error("❌ Erreur lors de la recherche:", err);
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    authenticateAndFetch();
  }, [slug, invitationToken, invitationId]);

  if (loading || isAuthenticating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e5631] mx-auto mb-4" />
          <p className="text-slate-500">
            {isAuthenticating ? "Authentification en cours..." : "Chargement du profil..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !targetUserId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || "Profil non trouvé"}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-primary hover:underline"
          >
            Accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <VisiteProfileView 
      userId={targetUserId} 
      invitationId={invitationId}
      publicationId={publicationId}
    />
  );
}