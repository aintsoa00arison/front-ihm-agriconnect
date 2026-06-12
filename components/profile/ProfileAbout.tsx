import { Building2, User, Diamond } from "lucide-react";

interface AboutSectionProps {
  profile: any;
  isLoading?: boolean;
}

export default function AboutSection({ profile, isLoading = false }: AboutSectionProps) {
  
  // --- SKELETON LOADER ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-40 bg-slate-100 rounded-2xl" />
          <div className="h-40 bg-slate-100 rounded-2xl" />
        </div>
        <div className="h-40 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  // --- RENDU NORMAL ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {/* Colonne gauche : Infos */}
      <div className="lg:col-span-2 space-y-6">
        {/* Représentant */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <User className="text-[#0D631B]" size={20} />
            <h3 className="text-base font-bold text-slate-800">Représentant légal</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nom complet</label>
              <p className="text-sm font-bold text-slate-700">{profile.representative?.firstName} {profile.representative?.lastName}</p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Téléphone</label>
              <p className="text-sm font-bold text-slate-700">{profile.representative?.phone}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
              <p className="text-sm font-bold text-slate-700">{profile.representative?.email}</p>
            </div>
          </div>
        </div>

        {/* Entreprise */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-[#0D631B]" size={20} />
            <h3 className="text-base font-bold text-slate-800">Entreprise</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Raison sociale</label>
              <p className="text-sm font-bold text-slate-700">{profile.company?.name}</p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Siège social</label>
              <p className="text-sm font-bold text-slate-700">{profile.company?.address}</p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Téléphone</label>
              <p className="text-sm font-bold text-slate-700">{profile.company?.phone}</p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
              <p className="text-sm font-bold text-slate-700">{profile.company?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne droite : Préférences */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 h-fit space-y-4">
        <div className="flex items-center gap-2">
            <Diamond className="text-[#0D631B]" size={20} />
            <h3 className="text-base font-bold text-slate-800">Types de production</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.productionTypes?.map((type: string, idx: number) => (
            <span key={idx} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 capitalize border border-green-100">
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}