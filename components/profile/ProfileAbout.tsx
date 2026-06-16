import { Building2, User, Diamond, MapPin, Phone, Mail, Store, UserCircle, Briefcase } from "lucide-react";

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
  if (!profile) {
    return (
      <div className="text-center py-12 text-slate-400">
        Aucune information disponible
      </div>
    );
  }

  // 🔥 LOG pour voir le profil complet
  console.log('🔍 AboutSection - profil complet:', profile);
  console.log('🔍 AboutSection - product_category:', profile.product_category);

  // 🔥 Fonction pour afficher une valeur ou "Non renseigné"
  const displayValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'Non renseigné';
    return String(value);
  };

  // 🔥 Extraire les données du profil
  const firstName = profile.first_name || '';
  const lastName = profile.last_name || '';
  const fullName = profile.name || `${firstName} ${lastName}`.trim() || 'Non renseigné';
  
  // 🔥 Email
  const email = typeof profile.email === 'string' 
    ? profile.email 
    : profile.email?.value || '';
  
  // 🔥 Téléphone
  let phone = 'Non renseigné';
  if (Array.isArray(profile.phone) && profile.phone.length > 0) {
    phone = profile.phone
      .map((p: any) => typeof p === 'string' ? p : p.value || '')
      .filter(Boolean)
      .join(', ');
  }
  
  // 🔥 Adresse
  const address = profile.address || '';
  
  // 🔥 Description
  const description = profile.description || '';
  
  // 🔥 CIN Number
  const cinNumber = profile.cin_number?.value || profile.cin_number || '';
  
  // 🔥 Types de production - utiliser product_category du profil
  const productionTypes = profile.product_category || [];
  
  // 🔥 Log pour vérifier
  console.log('🔍 productionTypes récupérés:', productionTypes);
  
  // 🔥 Détecter automatiquement le type d'utilisateur
  const hasCompanyInfo = profile.legal_name || 
                         profile.company?.name || 
                         profile.company?.legal_name ||
                         profile.entreprise_name;
  
  const isProvider = !!hasCompanyInfo;
  const isCollector = !isProvider;
  
  const companyName = profile.legal_name || 
                      profile.company?.name || 
                      profile.company?.legal_name || 
                      profile.entreprise_name || 
                      '';

  const profileType = isProvider ? 'entreprise' : 'particulier';

  // 🔥 Conversion des types de production
  const typeMap: Record<string, string> = {
    'VEGETAL': 'Végétale',
    'ANIMAL': 'Élevage',
    'CEREAL': 'Rente'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {/* Colonne gauche : Infos */}
      <div className="lg:col-span-2 space-y-6">
        {/* Informations personnelles / Représentant */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            {isProvider ? (
              <UserCircle className="text-[#0D631B]" size={20} />
            ) : (
              <User className="text-[#0D631B]" size={20} />
            )}
            <h3 className="text-base font-bold text-slate-800">
              {isProvider ? 'Représentant légal' : 'Informations personnelles'}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isProvider ? 'Nom complet du représentant' : 'Nom complet'}
              </label>
              <p className="text-sm font-bold text-slate-700">
                {fullName}
              </p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Téléphone</label>
              <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Phone size={14} className="text-slate-400" />
                {displayValue(phone)}
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
              <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Mail size={14} className="text-slate-400" />
                {displayValue(email)}
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Adresse</label>
              <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" />
                {displayValue(address)}
              </p>
            </div>
            {cinNumber && (
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CIN / NIF</label>
                <p className="text-sm font-bold text-slate-700">{displayValue(cinNumber)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Entreprise - visible seulement si fournisseur */}
        {isProvider && (
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="text-[#0D631B]" size={20} />
              <h3 className="text-base font-bold text-slate-800">Entreprise</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Raison sociale</label>
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Store size={14} className="text-slate-400" />
                  {displayValue(companyName)}
                </p>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Siège social</label>
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" />
                  {displayValue(address)}
                </p>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Téléphone</label>
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  {displayValue(phone)}
                </p>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  {displayValue(email)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bio / Description */}
        {description && (
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-800">À propos</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
          </div>
        )}
      </div>

      {/* Colonne droite : Types de production */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 h-fit space-y-4">
        <div className="flex items-center gap-2">
          <Diamond className="text-[#0D631B]" size={20} />
          <h3 className="text-base font-bold text-slate-800">Types de production</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {productionTypes && productionTypes.length > 0 ? (
            productionTypes.map((type: string, idx: number) => {
              const displayType = typeMap[type] || type;
              return (
                <span key={idx} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 capitalize border border-green-100">
                  {displayType}
                </span>
              );
            })
          ) : (
            <span className="text-xs text-slate-400">Aucun type de production renseigné</span>
          )}
        </div>
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Briefcase size={14} />
            <span>Profil {profileType}</span>
          </div>
        </div>
      </div>
    </div>
  );
}