"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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
        console.log('Données invitation:', data);
        setInvitationData(data);
        
      } catch (err: any) {
        console.error("Erreur:", err);
        setError(err.message || "Erreur lors du chargement de l'invitation");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [invitationId]);

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
      
      setInvitationData({ ...invitationData, status: 'accepted' });
      
      toast.success("Vous avez accepté l'invitation. Un email de confirmation a été envoyé.");
      
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error(error.message || "Erreur lors de l'acceptation");
    } finally {
      setIsAccepting(false);
    }
  };

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
      
      setInvitationData({ ...invitationData, status: 'refused' });
      
      toast.info("Vous avez refusé l'invitation. Un email de confirmation a été envoyé.");
      
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error(error.message || "Erreur lors du refus");
    } finally {
      setIsRefusing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-sans select-none">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground tracking-wide">
            Chargement de l'invitation...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-sans select-none">
        <div className="max-w-md w-full mx-4 p-8 bg-white rounded-2xl shadow-sm border border-border/40 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-black text-label tracking-tight">
            Invitation invalide
          </h1>
          <p className="text-sm text-muted-foreground">
            {error}
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-8 py-2.5 bg-primary text-white text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors rounded-full"
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
    <div className="min-h-screen bg-background flex items-center justify-center font-sans select-none p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-border/40 overflow-hidden">
        <div className="border-b border-border/40 px-8 pt-8 pb-6">
          <h1 className="text-xl font-black text-label tracking-tight">
            Invitation
          </h1>
        </div>
        
        <div className="px-8 pt-8 pb-6 space-y-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isProcessed ? (
                <span className="text-muted-foreground">
                  Cette invitation a déjà été{' '}
                  {invitationData?.status === 'accepted' || invitationData?.status === 'ACCEPTED' 
                    ? 'acceptée' 
                    : 'refusée'}
                </span>
              ) : (
                <>
                  <span className="text-label font-bold">
                    {invitationData?.sender_object?.pseudonyme || 
                     invitationData?.sender_object?.name || 
                     'Un membre'}
                  </span>
                  <span className="text-muted-foreground"> souhaite entrer en contact avec vous.</span>
                </>
              )}
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              disabled={isAccepting || isProcessed || !invitationData}
              className={`w-full py-3 rounded-full text-sm font-bold tracking-wide transition-colors ${
                isProcessed || !invitationData
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : isAccepting
                    ? 'bg-primary text-white opacity-70 cursor-wait'
                    : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {isAccepting ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Traitement...
                </span>
              ) : (
                'Accepter l\'invitation'
              )}
            </button>
            
            <button
              onClick={handleRefuse}
              disabled={isRefusing || isProcessed || !invitationData}
              className={`w-full py-3 rounded-full text-sm font-bold tracking-wide transition-colors ${
                isProcessed || !invitationData
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : isRefusing
                    ? 'bg-secondary text-white opacity-70 cursor-wait'
                    : 'bg-secondary text-white hover:bg-secondary/90'
              }`}
            >
              {isRefusing ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Traitement...
                </span>
              ) : (
                'Refuser l\'invitation'
              )}
            </button>
          </div>
          
          {isProcessed && (
            <p className="text-center text-xs text-muted-foreground/60 tracking-wide">
              Cette invitation a déjà été traitée
            </p>
          )}
        </div>
        
        <div className="border-t border-border/40 px-8 py-4">
          <p className="text-center text-[11px] text-muted-foreground/50 tracking-wider uppercase font-black">
            Tsena
          </p>
        </div>
      </div>
    </div>
  );
}