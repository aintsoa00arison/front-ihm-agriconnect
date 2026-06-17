// components/invitation/InviteButton.tsx

"use client";

import { useState } from "react";
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
  const [alreadyExists, setAlreadyExists] = useState(false);
  
  // ⭐ autoLoad = false pour ne pas charger les invitations automatiquement
  const { 
    createInvitation
  } = useInvitations(currentUserId || undefined, false);

  // ⭐ Redirection vers les discussions
  const goToDiscussions = () => {
    router.push('/messages');
  };

  const handleInvite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!currentUserId) {
      toast.error("Veuillez vous connecter pour envoyer une invitation");
      return;
    }

    if (currentUserId === targetUserId) {
      toast.info("Vous ne pouvez pas vous inviter vous-même");
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

  // ⭐ Gérer le clic
  const handleClick = (e: React.MouseEvent) => {
    if (isInvited && alreadyExists) {
      e.stopPropagation();
      e.preventDefault();
      goToDiscussions();
      return;
    }
    handleInvite(e);
  };

  // ⭐ Déterminer l'état du bouton
  const isDisabled = isLoading || isInvited || !currentUserId;
  
  // ⭐ Déterminer les classes CSS
  const getButtonClasses = () => {
    if (isInvited && alreadyExists) {
      return 'bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer';
    }
    if (isInvited) {
      return 'bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer';
    }
    if (isLoading) {
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
    if (!currentUserId) return "Connectez-vous pour inviter";
    return "Inviter cette personne";
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