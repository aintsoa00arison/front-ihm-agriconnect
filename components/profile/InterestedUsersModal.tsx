"use client";

import { X, Star, Check } from "lucide-react";

interface InterestedUser {
  id: string;
  name: string;
  role: string;
  rating: number;
  avatar: string;
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
  if (!ad) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-800">Liste des Intéressés</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4">
          {ad.interestedUsers.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-400 font-bold">Aucun profil restant.</p>
          ) : (
            ad.interestedUsers.map((usr) => (
              <div key={usr.id} className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full overflow-hidden bg-slate-100 border">
                    <img src={usr.avatar} alt={usr.name} className="size-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{usr.name}</h4>
                    <p className="text-[10px] font-medium text-slate-400">{usr.role}</p>
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
                <div className="flex items-center gap-3">
                  <button className="text-xs font-bold text-[#ffa000] hover:underline">Profil</button>
                  <button
                    onClick={() => onAccept(usr, ad.productName)}
                    className="p-2 bg-emerald-50 text-[#2e7d32] rounded-xl hover:bg-[#e8f5e9]"
                  >
                    <Check size={14} strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => onReject(usr)}
                    className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}