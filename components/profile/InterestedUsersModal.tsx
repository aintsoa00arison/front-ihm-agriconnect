"use client";

import { useState, useEffect } from "react";
import { X, Star, Check, Loader2, User, Eye, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface InterestedUser {
  id: string;
  name: string;
  role: string;
  rating: number;
  avatar: string;
  email?: string;
  phone?: string;
  invitation_id?: string;
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
  
  const [loading, setLoading] = useState(false);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<InterestedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 Simuler le chargement des données (toujours vide)
  useEffect(() => {
    if (ad) {
      setIsLoading(true);
      // Simuler un petit délai de chargement
      const timer = setTimeout(() => {
        // 🔥 Liste toujours vide
        setUsers([]);
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [ad]);

  // 🔥 Voir le profil
  const handleViewProfile = (userId: string) => {
    toast.info(`👤 Consultation du profil`);
    if (userId) {
      router.push(`/visite/profil/${userId}`);
    }
  };

  // 🔥 Accepter l'invitation
  const handleAcceptInvitation = async (user: InterestedUser) => {
    setProcessingUserId(user.id);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`✅ Invitation de ${user.name} acceptée avec succès !`);
      onAccept(user, ad?.productName || '');
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (error) {
      toast.error("❌ Erreur lors de l'acceptation");
    } finally {
      setLoading(false);
      setProcessingUserId(null);
    }
  };

  // 🔥 Refuser l'invitation
  const handleRejectInvitation = async (user: InterestedUser) => {
    setProcessingUserId(user.id);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.info(`❌ Invitation de ${user.name} refusée`);
      onReject(user);
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (error) {
      toast.error("❌ Erreur lors du refus");
    } finally {
      setLoading(false);
      setProcessingUserId(null);
    }
  };

  if (!ad) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        {/* En-tête */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-base font-extrabold text-slate-800">
            {isLoading ? "Chargement..." : "Liste des Intéressés (0)"}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-[#1e5631]" />
              <span className="ml-2 text-sm text-slate-500">Chargement...</span>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-slate-300" />
              </div>
              <p className="text-base font-semibold text-slate-600 mb-1">
                Aucun intéressé
              </p>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Les personnes intéressées par cette annonce apparaîtront ici.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}