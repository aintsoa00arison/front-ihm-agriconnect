"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Building2, User, Mail, Phone, FileText, MapPin, 
  Diamond, Calendar, Image as ImageIcon, PenTool 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export type FournisseurType = 'particulier' | 'entreprise';

interface EditSupplierProfileFormProps {
  type: FournisseurType;
  initialData?: any;
  onCancel: () => void;
  onSave: (data: any) => void;
}

export default function EditSupplierProfileForm({
  type,
  initialData,
  onCancel,
  onSave,
}: EditSupplierProfileFormProps) {
  const isEntreprise = type === 'entreprise';

  // --- ÉTATS DU FORMULAIRE ---
  // Communs & Particulier
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || "");
  const [birthPlace, setBirthPlace] = useState(initialData?.birthPlace || "");
  const [personalPhone, setPersonalPhone] = useState(initialData?.phone || "");
  const [personalEmail, setPersonalEmail] = useState(initialData?.email || "");
  const [personalAddress, setPersonalAddress] = useState(initialData?.address || "");
  const [personalCin, setPersonalCin] = useState(initialData?.cin || "");

  // Entreprise
  const [companyName, setCompanyName] = useState(initialData?.company?.name || "");
  const [companyAddress, setCompanyAddress] = useState(initialData?.company?.address || "");
  const [companyEmail, setCompanyEmail] = useState(initialData?.company?.email || "");
  const [companyPhone, setCompanyPhone] = useState(initialData?.company?.phone || "");
  const [companyNif, setCompanyNif] = useState(initialData?.company?.nif || "");
  const [companyStat, setCompanyStat] = useState(initialData?.company?.stat || "");

  // Communs (Préférences de produits, Bio, Avatar)
  const [productionTypes, setProductionTypes] = useState<{ [key: string]: boolean }>({
    vegetale: initialData?.productionTypes?.includes("Végétale") || false,
    elevage: initialData?.productionTypes?.includes("Élevage") || false,
    Rente: initialData?.productionTypes?.includes("Rente") || true,
  });
  const [bio, setBio] = useState(initialData?.bio || "");
  const [avatarSrc, setAvatarSrc] = useState(initialData?.avatarUrl || "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=defaultSupplier");

  const handleCheckboxChange = (key: string) => {
    setProductionTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs requis
    if (isEntreprise) {
      if (!companyName.trim()) {
        toast.error("Veuillez saisir la raison sociale de l'entreprise");
        return;
      }
      if (!companyAddress.trim()) {
        toast.error("Veuillez saisir l'adresse du siège social");
        return;
      }
      if (!companyEmail.trim()) {
        toast.error("Veuillez saisir l'email de l'entreprise");
        return;
      }
      if (!companyPhone.trim()) {
        toast.error("Veuillez saisir le téléphone de l'entreprise");
        return;
      }
      if (!lastName.trim()) {
        toast.error("Veuillez saisir le nom du représentant");
        return;
      }
      if (!firstName.trim()) {
        toast.error("Veuillez saisir le prénom du représentant");
        return;
      }
    } else {
      if (!lastName.trim()) {
        toast.error("Veuillez saisir votre nom");
        return;
      }
      if (!firstName.trim()) {
        toast.error("Veuillez saisir votre prénom");
        return;
      }
      if (!personalPhone.trim()) {
        toast.error("Veuillez saisir votre numéro de téléphone");
        return;
      }
      if (!personalEmail.trim()) {
        toast.error("Veuillez saisir votre adresse email");
        return;
      }
    }

    const commonData = {
      type,
      bio,
      avatarUrl: avatarSrc,
      productionTypes: Object.keys(productionTypes).filter((key) => productionTypes[key]),
    };

    const finalData = isEntreprise 
      ? {
          ...commonData,
          company: { name: companyName, address: companyAddress, email: companyEmail, phone: companyPhone, nif: companyNif, stat: companyStat },
          representative: { lastName, firstName, email: personalEmail, phone: personalPhone, cin: personalCin }
        }
      : {
          ...commonData,
          lastName,
          firstName,
          birthDate,
          birthPlace,
          phone: personalPhone,
          email: personalEmail,
          address: personalAddress,
          cin: personalCin
        };

    onSave(finalData);
    toast.success("Profil mis à jour avec succès");
  };

  return (
    <div className="w-full h-full bg-neutral p-4 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        
        {/* ================= HEADER STICKY ================= */}
        <div className="sticky top-0 z-20 bg-neutral/95 backdrop-blur-sm pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Modifier le profil</h1>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {isEntreprise 
                  ? "Mettre à jour les informations de votre entreprise et de votre représentant légal."
                  : "Mettre à jour les informations de votre compte particulier."}
              </p>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
              <Button type="button" onClick={onCancel} variant="outline" className="rounded-xl font-bold border-border text-muted-foreground hover:bg-muted px-6 h-11">
                Annuler
              </Button>
              <Button type="submit" form="supplier-form" className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-11 transition-all">
                Enregistrer
              </Button>
            </div>
          </div>
        </div>

        {/* ================= ZONE SCROLLABLE ================= */}
        <div className="flex-1 overflow-y-auto pb-10">
          <form id="supplier-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* --- COLONNE GAUCHE (FORMULAIRES DE SAISIE) --- */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* VERSION ENTREPRISE : Bloc Informations Société */}
              {isEntreprise && (
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-5 bg-muted/30 border-b border-border flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl"><Building2 size={20} /></div>
                    <h2 className="text-base font-bold text-foreground">Informations de l'entreprise</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/80">Raison sociale</label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Mon Entreprise" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/80">Siège social</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="2118 Thornridge Cir. Syracuse, Connecticut 35624" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground/80">Adresse e-mail</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="email@monentreprise.com" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground/80">Numéro de téléphone</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="+261 xx xx xxx xx" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground/80">NIF</label>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input value={companyNif} onChange={(e) => setCompanyNif(e.target.value)} placeholder="XXXXXXXXXX" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground/80">STAT</label>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input value={companyStat} onChange={(e) => setCompanyStat(e.target.value)} placeholder="XXXXX XX XXXX X XXXXX" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOC REPRÉSENTANT (ENTREPRISE) OU BLOC IDENTITÉ UNIQUE (PARTICULIER) */}
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {!isEntreprise && (
                  <div className="p-5 bg-muted/30 border-b border-border flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl"><User size={20} /></div>
                    <h2 className="text-base font-bold text-foreground">Informations personnelles</h2>
                  </div>
                )}
                {isEntreprise && (
                  <div className="p-5 bg-muted/30 border-b border-border flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl"><User size={20} /></div>
                    <h2 className="text-base font-bold text-foreground">Informations du représentant légal</h2>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/80">Nom</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="RAKOTO" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/80">Prénom</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jean" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                      </div>
                    </div>

                    {/* Date et Lieu de naissance : Uniquement visible en mode Particulier */}
                    {!isEntreprise && (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground/80">Date de naissance</label>
                          <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input type="text" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="15/02/2001" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground/80">Lieu de naissance</label>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder="Fianarantsoa" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/80">Numéro de téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input value={personalPhone} onChange={(e) => setPersonalPhone(e.target.value)} placeholder="+261 xx xx xxx xx" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/80">Adresse e-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} placeholder="email@example.com" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                      </div>
                    </div>

                    <div className={`${!isEntreprise ? "sm:col-span-2" : ""} space-y-1.5`}>
                      <label className="text-xs font-bold text-foreground/80">{isEntreprise ? "Numéro CIN" : "Adresse physique"}</label>
                      <div className="relative">
                        {isEntreprise ? <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /> : <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />}
                        <Input 
                          value={isEntreprise ? personalCin : personalAddress} 
                          onChange={(e) => isEntreprise ? setPersonalCin(e.target.value) : setPersonalAddress(e.target.value)} 
                          placeholder={isEntreprise ? "XXX XXX XXX XXX" : "Fianarantsoa"} 
                          className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" 
                        />
                      </div>
                    </div>

                    {/* Numéro CIN décalé en bas pour le particulier */}
                    {!isEntreprise && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground/80">Numéro CIN</label>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input value={personalCin} onChange={(e) => setPersonalCin(e.target.value)} placeholder="XXX XXX XXX XXX" className="pl-11 bg-muted/30 border-border rounded-xl h-11 text-sm" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Grille de type de production basculée à gauche uniquement pour le particulier */}
              {!isEntreprise && (
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
                  <div className="flex items-center gap-2 text-foreground font-bold text-base">
                    <Diamond size={18} className="text-primary"/>
                    <h3>Préférences de produits</h3>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground block">Type de production recherchés</span>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(productionTypes).map((key) => (
                      <button key={key} type="button" onClick={() => handleCheckboxChange(key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${productionTypes[key] ? "bg-primary/10 border-primary text-primary" : "bg-muted/20 border-border text-muted-foreground"}`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${productionTypes[key] ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border"}`}>{productionTypes[key] && "✓"}</div>
                        <span className="capitalize">{key === "Rente" ? "Rente" : key === "vegetale" ? "Végétale" : "Élevage"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* --- COLONNE DROITE (WIDGETS LOGO / BIO / PRODUCTION ENTREPRISE) --- */}
            <div className="space-y-6">
              
              {/* Bloc Type de production latéral pour Entreprise */}
              {isEntreprise && (
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
                  <div className="flex items-center gap-2 text-foreground font-bold text-base">
                    <Diamond size={18} className="text-primary" />
                    <h3>Type de production</h3>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed">Sélectionnez tous les types de productions gérés par l'entreprise</p>
                  <div className="flex flex-col gap-2">
                    {Object.keys(productionTypes).map((key) => (
                      <button key={key} type="button" onClick={() => handleCheckboxChange(key)} className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${productionTypes[key] ? "bg-primary/10 border-primary text-primary" : "bg-muted/20 border-border text-muted-foreground"}`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${productionTypes[key] ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border"}`}>{productionTypes[key] && "✓"}</div>
                        <span className="capitalize">{key === "Rente" ? "Rente" : key === "vegetale" ? "Végétale" : "Élevage"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bloc Biographie commun */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 text-foreground font-bold text-base">
                  {isEntreprise ? <Diamond size={18} className="text-primary" /> : <PenTool size={18} className="text-primary" />}
                  <h3>Biographie</h3>
                </div>
                <span className="text-xs font-bold text-muted-foreground block">{isEntreprise ? "Présentation de l'entreprise" : "Présentation personnelle"}</span>
                <Textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  placeholder="À propos..." 
                  className="w-full min-h-[140px] bg-muted/30 border-border rounded-xl focus-visible:ring-primary p-4 text-xs font-medium resize-none"
                />
              </div>

              {/* Bloc Photo de profil / Logo */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center text-center justify-center space-y-4">
                <div className="relative w-28 h-28 rounded-full overflow-hidden bg-muted border">
                  <Image src={avatarSrc} alt="Aperçu du logo ou avatar" fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{isEntreprise ? "Logo de l'entreprise" : "Photo de profil"}</h4>
                  <p className="text-[10px] font-medium text-muted-foreground mt-1">PNG ou JPG jusqu'à 10Mo</p>
                </div>
                <button type="button" className="text-xs font-bold text-primary hover:underline mt-2">Changer le logo</button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}