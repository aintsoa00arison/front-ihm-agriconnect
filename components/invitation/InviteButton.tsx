// components/invitation/InviteButton.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Loader2, CheckCircle, MessageCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useInvitations } from "../../app/services/hooks/useInvitations";
import { getUserId } from "../../app/services/lib/auth";
import { useRouter } from "next/navigation";

interface InviteButtonProps {
  targetUserId: string;
  targetName: string;
  adTitle?: string;
  publicationId?: string;
  onInviteSent?: () => void;
  className?: string;
}

export function InviteButton({ 
  targetUserId, 
  targetName, 
  adTitle, 
  publicationId,
  onInviteSent,
  className = ""
}: InviteButtonProps) {
  const router = useRouter();
  const currentUserId = getUserId();
  const [isInvited, setIsInvited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const hasCheckedRef = useRef(false);
  
  const { 
    createInvitation, 
    pendingInvitations,
    loadInvitations,
    loading: invitationsLoading
  } = useInvitations(currentUserId || undefined);

  // Vérifier les invitations existantes
  useEffect(() => {
    const checkExistingInvitation = async () => {
      if (!currentUserId || !targetUserId) {
        setIsChecking(false);
        return;
      }

      if (hasCheckedRef.current) {
        return;
      }

      try {
        if (pendingInvitations.length === 0) {
          await loadInvitations();
        }
        
        const existing = pendingInvitations.some(inv => 
          inv.sender_id === currentUserId && 
          inv.receiver_id === targetUserId &&
          (inv.publication_id === publicationId || !publicationId)
        );
        
        setIsInvited(existing);
        setAlreadyExists(existing);
        hasCheckedRef.current = true;
      } catch (error) {
        console.error('❌ Erreur vérification invitation:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkExistingInvitation();
  }, [currentUserId, targetUserId, publicationId, pendingInvitations, loadInvitations]);

  // ⭐ Redirection vers les discussions
  const goToDiscussions = () => {
    router.push('/discussions');
  };

  const handleInvite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUserId) {
      toast.error("Veuillez vous connecter pour envoyer une invitation");
      return;
    }

    if (currentUserId === targetUserId) {
      toast.info("Vous ne pouvez pas vous inviter vous-même");
      return;
    }

    // Vérifier à nouveau avant d'envoyer
    const alreadyExistsCheck = pendingInvitations.some(inv => 
      inv.sender_id === currentUserId && 
      inv.receiver_id === targetUserId &&
      (inv.publication_id === publicationId || !publicationId)
    );

    if (alreadyExistsCheck) {
      toast.info(
        `💬 Vous pouvez déjà discuter avec ${targetName}.`,
        {
          duration: 5000,
          icon: "💬",
          action: {
            label: "Voir les discussions",
            onClick: goToDiscussions,
          },
        }
      );
      setIsInvited(true);
      setAlreadyExists(true);
      return;
    }

    setIsLoading(true);
    try {
      const message = adTitle 
        ? `Je suis intéressé par votre annonce "${adTitle}"`
        : "J'aimerais entrer en contact avec vous.";
      
      const result = await createInvitation({
        sender_id: currentUserId,
        receiver_id: targetUserId,
        publication_id: publicationId,
        message: message
      });
      
      // ⭐ Gestion basée sur le status retourné
      if (result.success) {
        setIsInvited(true);
        toast.success(
          `📧 Une invitation par email a été envoyée à ${targetName}. Vous pourrez discuter quand il/elle acceptera.`,
          {
            duration: 6000,
            icon: "💌",
          }
        );
        if (onInviteSent) onInviteSent();
      } else {
        // ⭐ Gestion du conflit 409
        if (result.status === 409) {
          toast.info(
            `💬 Vous pouvez déjà discuter avec ${targetName}.`,
            {
              duration: 5000,
              icon: "💬",
              action: {
                label: "Voir les discussions",
                onClick: goToDiscussions,
              },
            }
          );
          setIsInvited(true);
          setAlreadyExists(true);
        } else {
          toast.error(result.message || "Erreur lors de l'envoi de l'invitation");
        }
      }
    } catch (error: any) {
      // ⭐ Gestion du conflit 409 via l'erreur
      if (error?.response?.status === 409) {
        toast.info(
          `💬 Vous pouvez déjà discuter avec ${targetName}.`,
          {
            duration: 5000,
            icon: "💬",
            action: {
              label: "Voir les discussions",
              onClick: goToDiscussions,
            },
          }
        );
        setIsInvited(true);
        setAlreadyExists(true);
      } else {
        toast.error(error?.response?.data?.detail || "Erreur lors de l'envoi de l'invitation");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ⭐ Déterminer l'état du bouton
  const isDisabled = isLoading || isInvited || isChecking || !currentUserId;
  
  // ⭐ Déterminer les classes CSS
  const getButtonClasses = () => {
    if (isInvited && alreadyExists) {
      return 'bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer';
    }
    if (isInvited) {
      return 'bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer';
    }
    if (isLoading || isChecking) {
      return 'bg-slate-200 text-slate-400 cursor-wait';
    }
    if (!currentUserId) {
      return 'bg-slate-200 text-slate-400 cursor-not-allowed';
    }
    return 'bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-white hover:scale-105 hover:text-red-500';
  };

  // ⭐ Déterminer le tooltip
  const getTooltipText = () => {
    if (isInvited && alreadyExists) return "Déjà en discussion - Voir les messages";
    if (isInvited) return "Invitation envoyée";
    if (isLoading) return "Envoi en cours...";
    if (isChecking) return "Vérification...";
    if (!currentUserId) return "Connectez-vous pour inviter";
    return "Inviter cette personne";
  };

  // ⭐ Gérer le clic pour rediriger vers les discussions si déjà invité
  const handleClick = (e: React.MouseEvent) => {
    if (isInvited && alreadyExists) {
      e.stopPropagation();
      goToDiscussions();
      return;
    }
    handleInvite(e);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            disabled={isDisabled && !(isInvited && alreadyExists)}
            className={`p-2.5 rounded-full shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${getButtonClasses()} ${className}`}
            aria-label="Inviter"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : isInvited && alreadyExists ? (
              <MessageCircle size={20} className="text-green-600" />
            ) : isInvited ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <Heart size={20} />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="text-xs font-medium">
          {getTooltipText()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}