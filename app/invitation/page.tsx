// app/invitation/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function InvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRefusing, setIsRefusing] = useState(false);
  
  const invitationId = searchParams?.get('invitation_id') || null;

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!invitationId) {
        setError("ID d'invitation manquant");
        setLoading(false);
        return;
      }

      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/invitation/${invitationId}`);
        
        if (!response.ok) {
          throw new Error("Invitation non trouvée");
        }
        
        const data = await response.json();
        console.log('🔵 Données invitation:', data);
        setInvitationData(data);
        
      } catch (err: any) {
        console.error("❌ Erreur:", err);
        setError(err.message || "Erreur lors du chargement de l'invitation");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [invitationId]);

  // ⭐ Accepter - utiliser receiver_id
  const handleAccept = async () => {
    if (!invitationId || !invitationData) {
      toast.error("Données d'invitation manquantes");
      return;
    }
    
    const receiverId = invitationData.receiver_id;
    
    if (!receiverId) {
      toast.error("Destinataire non identifié");
      return;
    }
    
    // ⭐ Vérifier si déjà traité
    if (invitationData.status === 'accepted' || invitationData.status === 'ACCEPTED') {
      toast.info("Cette invitation a déjà été acceptée");
      return;
    }
    if (invitationData.status === 'refused' || invitationData.status === 'REFUSED') {
      toast.info("Cette invitation a déjà été refusée");
      return;
    }
    
    setIsAccepting(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(
        `${backendUrl}/invitation/accept/${invitationId}?receiver_id=${receiverId}`,
        { method: 'POST' }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Erreur lors de l'acceptation");
      }
      
      // ⭐ Mettre à jour le statut localement
      setInvitationData({ ...invitationData, status: 'accepted' });
      
      toast.success("✅ Vous avez accepté l'invitation. Un email de confirmation a été envoyé.");
      
    } catch (error: any) {
      console.error("❌ Erreur:", error);
      toast.error(error.message || "Erreur lors de l'acceptation");
    } finally {
      setIsAccepting(false);
    }
  };

  // ⭐ Refuser - utiliser receiver_id
  const handleRefuse = async () => {
    if (!invitationId || !invitationData) {
      toast.error("Données d'invitation manquantes");
      return;
    }
    
    const receiverId = invitationData.receiver_id;
    
    if (!receiverId) {
      toast.error("Destinataire non identifié");
      return;
    }
    
    // ⭐ Vérifier si déjà traité
    if (invitationData.status === 'accepted' || invitationData.status === 'ACCEPTED') {
      toast.info("Cette invitation a déjà été acceptée");
      return;
    }
    if (invitationData.status === 'refused' || invitationData.status === 'REFUSED') {
      toast.info("Cette invitation a déjà été refusée");
      return;
    }
    
    setIsRefusing(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(
        `${backendUrl}/invitation/refuse/${invitationId}?receiver_id=${receiverId}`,
        { method: 'POST' }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Erreur lors du refus");
      }
      
      // ⭐ Mettre à jour le statut localement
      setInvitationData({ ...invitationData, status: 'refused' });
      
      toast.info("❌ Vous avez refusé l'invitation. Un email de confirmation a été envoyé.");
      
    } catch (error: any) {
      console.error("❌ Erreur:", error);
      toast.error(error.message || "Erreur lors du refus");
    } finally {
      setIsRefusing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e5631] mx-auto mb-4" />
          <p className="text-slate-500">Chargement de l'invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Invitation invalide</h1>
          <p className="text-slate-500">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-[#1e5631] text-white rounded-lg hover:bg-[#2e7d32] transition"
          >
            Accueil
          </button>
        </div>
      </div>
    );
  }

  const isProcessed = invitationData?.status === 'accepted' || 
                      invitationData?.status === 'ACCEPTED' ||
                      invitationData?.status === 'refused' || 
                      invitationData?.status === 'REFUSED';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-[#1e5631] p-6 text-center">
          <h1 className="text-2xl font-bold text-white">📩 Invitation</h1>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-slate-600">
              {isProcessed ? (
                <span className="text-amber-600 font-medium">
                  Cette invitation a déjà été {invitationData?.status === 'accepted' || invitationData?.status === 'ACCEPTED' ? 'acceptée ✅' : 'refusée ❌'}
                </span>
              ) : (
                <>
                  <span className="font-semibold text-slate-800">
                    {invitationData?.sender_object?.pseudonyme || 
                     invitationData?.sender_object?.name || 
                     'Quelqu\'un'}
                  </span>
                  <span className="text-slate-500"> souhaite entrer en contact avec vous.</span>
                </>
              )}
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              disabled={isAccepting || isProcessed || !invitationData}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                isProcessed || !invitationData
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : isAccepting
                    ? 'bg-[#1e5631] opacity-70 cursor-wait'
                    : 'bg-[#1e5631] hover:bg-[#2e7d32] active:scale-95'
              }`}
            >
              {isAccepting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Traitement...
                </div>
              ) : (
                '✅ Accepter l\'invitation'
              )}
            </button>
            
            <button
              onClick={handleRefuse}
              disabled={isRefusing || isProcessed || !invitationData}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                isProcessed || !invitationData
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : isRefusing
                    ? 'bg-red-600 opacity-70 cursor-wait'
                    : 'bg-red-600 hover:bg-red-700 active:scale-95'
              }`}
            >
              {isRefusing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Traitement...
                </div>
              ) : (
                '❌ Refuser l\'invitation'
              )}
            </button>
          </div>
          
          {isProcessed && (
            <p className="text-center text-sm text-slate-400">
              Cette invitation a déjà été traitée
            </p>
          )}
        </div>
        
        <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
          Tsena - Le pont du monde agricole
        </div>
      </div>
    </div>
  );
}