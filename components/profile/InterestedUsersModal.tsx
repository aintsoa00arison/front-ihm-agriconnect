// components/InterestedUsersModal.tsx

"use client";

import { useState, useEffect } from "react";
import { X, Star, Check, Loader2, User, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useInvitations } from "../../app/services/hooks/useInvitations";
import { getUserId } from "../../app/services/lib/auth";
import type { Invitation } from "../../app/services/invitation/types";

interface InterestedUser {
  id: string;
  name: string;
  role: string;
  rating: number;
  avatar: string;
  email?: string;
}

interface AdItem {
  id: string;
  productName: string;
  interestedCount: number;
  interestedUsers: InterestedUser[];
}

interface InterestedUsersModalProps {
  ad: AdItem | null;
  onClose: () => void;
  onAccept: (user: InterestedUser, adName: string) => void;
  onReject: (user: InterestedUser) => void;
}

export default function InterestedUsersModal({
  ad,
  onClose,
  onAccept,
  onReject,
}: InterestedUsersModalProps) {
  const router = useRouter();
  const currentUserId = getUserId();
  
  const [loading, setLoading] = useState(false);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  
  const { 
    pendingInvitations, 
    loading: invitationsLoading,
    acceptInvitation,
    refuseInvitation,
    refreshInvitations,
    loadInvitations
  } = useInvitations(currentUserId || undefined);

  // ⭐ Transformer les invitations en utilisateurs intéressés
  const interestedUsers: InterestedUser[] = pendingInvitations.map((inv: Invitation) => {
    const sender = inv.sender_object || {};
    return {
      id: inv.sender_id,
      name: sender.pseudonyme || 
            (sender.email ? sender.email.split('@')[0] : 'Utilisateur'),
      email: sender.email || '',
      role: 'utilisateur',
      rating: 0,
      avatar: sender.photo || 
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };
  });

  // ⭐ Voir le profil du sender
  const handleViewProfile = (userId: string) => {
    if (userId) {
      router.push(`/visite/profil/${userId}`);
    }
  };

  // ⭐ Accepter l'invitation
  const handleAcceptInvitation = async (user: InterestedUser) => {
    if (!currentUserId) {
      toast.error("Veuillez vous connecter");
      return;
    }

    const invitation = pendingInvitations.find((inv: Invitation) => inv.sender_id === user.id);
    
    if (!invitation) {
      toast.error("Invitation non trouvée");
      return;
    }

    setProcessingUserId(user.id);
    setLoading(true);
    try {
      const result = await acceptInvitation(invitation.id);
      
      if (result.success) {
        onAccept(user, ad?.productName || '');
        toast.success(`✅ Invitation de ${user.name} acceptée !`);
        await refreshInvitations();
      } else {
        toast.error(result.message || "Erreur lors de l'acceptation");
      }
    } catch (error) {
      console.error('❌ Erreur acceptation:', error);
      toast.error("Erreur lors de l'acceptation");
    } finally {
      setLoading(false);
      setProcessingUserId(null);
    }
  };

  // ⭐ Refuser l'invitation
  const handleRejectInvitation = async (user: InterestedUser) => {
    if (!currentUserId) {
      toast.error("Veuillez vous connecter");
      return;
    }

    const invitation = pendingInvitations.find((inv: Invitation) => inv.sender_id === user.id);
    
    if (!invitation) {
      toast.error("Invitation non trouvée");
      return;
    }

    setProcessingUserId(user.id);
    setLoading(true);
    try {
      const result = await refuseInvitation(invitation.id);
      
      if (result.success) {
        onReject(user);
        toast.info(`❌ Invitation de ${user.name} refusée`);
        await refreshInvitations();
      } else {
        toast.error(result.message || "Erreur lors du refus");
      }
    } catch (error) {
      console.error('❌ Erreur refus:', error);
      toast.error("Erreur lors du refus");
    } finally {
      setLoading(false);
      setProcessingUserId(null);
    }
  };

  // ⭐ Recharger les invitations quand le modal s'ouvre
  useEffect(() => {
    if (ad && currentUserId) {
      loadInvitations();
    }
  }, [ad, currentUserId, loadInvitations]);

  if (!ad) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-base font-extrabold text-slate-800">
            {invitationsLoading ? "Chargement..." : `Liste des Intéressés (${interestedUsers.length})`}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto space-y-4">
          {invitationsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-[#1e5631]" />
              <span className="ml-2 text-sm text-slate-500">Chargement...</span>
            </div>
          ) : interestedUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={28} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">
                Aucun intéressé pour l'instant
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Les invitations en attente apparaîtront ici
              </p>
            </div>
          ) : (
            interestedUsers.map((usr) => (
              <div 
                key={usr.id} 
                className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="size-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    {usr.avatar ? (
                      <img 
                        src={usr.avatar} 
                        alt={usr.name} 
                        className="size-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.className = 'size-10 rounded-full overflow-hidden bg-gradient-to-br from-[#1e5631] to-[#2e7d32] flex items-center justify-center text-white font-bold text-sm';
                            parent.innerHTML = usr.name.charAt(0).toUpperCase();
                          }
                        }}
                      />
                    ) : (
                      <div className="size-full bg-gradient-to-br from-[#1e5631] to-[#2e7d32] flex items-center justify-center text-white font-bold text-sm">
                        {usr.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{usr.name}</h4>
                    <p className="text-[10px] font-medium text-slate-400 capitalize truncate">{usr.role}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={10}
                          className={idx < Math.floor(usr.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleViewProfile(usr.id)}
                    className="p-1.5 text-[#ffa000] hover:bg-amber-50 rounded-lg transition-colors"
                    title="Voir le profil"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleAcceptInvitation(usr)}
                    disabled={loading && processingUserId === usr.id}
                    className="p-1.5 bg-emerald-50 text-[#2e7d32] rounded-lg hover:bg-[#e8f5e9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Accepter"
                  >
                    {loading && processingUserId === usr.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} strokeWidth={3} />
                    )}
                  </button>
                  <button
                    onClick={() => handleRejectInvitation(usr)}
                    disabled={loading && processingUserId === usr.id}
                    className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refuser"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {interestedUsers.length > 0 && !invitationsLoading && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
            <p className="text-[10px] text-slate-400">
              {interestedUsers.length} {interestedUsers.length > 1 ? 'personnes intéressées' : 'personne intéressée'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}