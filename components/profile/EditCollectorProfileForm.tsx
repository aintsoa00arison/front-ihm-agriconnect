"use client";

import { useState } from "react";
import { Building2, Diamond, User, Mail, Phone, FileText, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditCollectorProfileFormProps {
  initialData?: any; // Tu pourras l'associer à ton type UserProfile plus tard
  onCancel: () => void;
  onSave: (data: any) => void;
}

export default function EditCollectorProfileForm({
  initialData,
  onCancel,
  onSave,
}: EditCollectorProfileFormProps) {
  // --- États du Formulaire ---
  // 1. Informations de l'entreprise
  const [companyName, setCompanyName] = useState(initialData?.company?.name || "");
  const [companyAddress, setCompanyAddress] = useState(initialData?.company?.address || "");
  const [companyEmail, setCompanyEmail] = useState(initialData?.company?.email || "");
  const [companyPhone, setCompanyPhone] = useState(initialData?.company?.phone || "");
  const [companyNif, setCompanyNif] = useState(initialData?.company?.nif || "");
  const [companyStat, setCompanyStat] = useState(initialData?.company?.stat || "");

  // 2. Préférences de produits (Types de production recherchés)
  const [productionTypes, setProductionTypes] = useState<{ [key: string]: boolean }>({
    vegetale: initialData?.productionTypes?.includes("Végétale") || false,
    elevage: initialData?.productionTypes?.includes("Élevage") || false,
    Rente: initialData?.productionTypes?.includes("Rente") || true, // Actif par défaut sur la maquette
  });

  // 3. Informations du représentant légal
  const [repLastName, setRepLastName] = useState(initialData?.representative?.lastName || "");
  const [repFirstName, setRepFirstName] = useState(initialData?.representative?.firstName || "");
  const [repEmail, setRepEmail] = useState(initialData?.representative?.email || "");
  const [repPhone, setRepPhone] = useState(initialData?.representative?.phone || "");
  const [repCin, setRepCin] = useState(initialData?.representative?.cin || "");

  const handleCheckboxChange = (key: string) => {
    setProductionTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      company: {
        name: companyName,
        address: companyAddress,
        email: companyEmail,
        phone: companyPhone,
        nif: companyNif,
        stat: companyStat,
      },
      productionTypes: Object.keys(productionTypes).filter((key) => productionTypes[key]),
      representative: {
        lastName: repLastName,
        firstName: repFirstName,
        email: repEmail,
        phone: repPhone,
        cin: repCin,
      },
    };
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* ================= HEADER DU FORMULAIRE ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4  p-6 ">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Modifier le profil</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Mettre à jour les informations de votre entreprise et de votre représentant légal.
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-center">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-50 px-6 h-11"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="rounded-xl font-bold bg-[#0D631B] hover:bg-[#094713] text-white px-6 h-11 transition-all"
          >
            Enregistrer
          </Button>
        </div>
      </div>

      {/* ================= SECTION 1 : INFORMATIONS DE L'ENTREPRISE ================= */}
      <div className="bg-white rounded-2xl border border-separator/10 shadow-sm overflow-hidden">
        {/* Entête de Section */}
        <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-green-50 text-[#0D631B] rounded-xl">
            <Building2 size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-800">Informations de l'entreprise</h2>
        </div>

        {/* Corps de Section */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Raison sociale */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Raison sociale</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nom de l'entreprise"
                  className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 focus-visible:ring-[#0D631B] text-sm font-medium"
                />
              </div>
            </div>

            {/* Siège social */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Siège social</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="2118 Thornridge Cir. Syracuse, Connecticut 35624"
                  className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 focus-visible:ring-[#0D631B] text-sm font-medium"
                />
              </div>
            </div>

            {/* Adresse e-mail */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Adresse e-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="email@monentreprise.com"
                  className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 focus-visible:ring-[#0D631B] text-sm font-medium"
                />
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Numéro de téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  type="tel"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="+261 34 xx xxx xx"
                  className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 focus-visible:ring-[#0D631B] text-sm font-medium"
                />
              </div>
            </div>

            {/* NIF */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">NIF</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={companyNif}
                  onChange={(e) => setCompanyNif(e.target.value)}
                  placeholder="XXXXXXXXXX"
                  className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 focus-visible:ring-[#0D631B] text-sm font-medium"
                />
              </div>
            </div>

            {/* STAT */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">STAT</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={companyStat}
                  onChange={(e) => setCompanyStat(e.target.value)}
                  placeholder="XXXXX XX XXXX X XXXXX"
                  className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 focus-visible:ring-[#0D631B] text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2 : PRÉFÉRENCES DE PRODUITS ================= */}
      <div className="bg-white rounded-2xl border border-separator/10 shadow-sm overflow-hidden">
        {/* Entête de Section */}
        <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-green-50 text-[#0D631B] rounded-xl">
            <Diamond size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-800">Préférences de produits</h2>
        </div>

        {/* Corps de Section */}
        <div className="p-6 space-y-3">
          <span className="text-xs font-bold text-slate-700 block">Type de production recherchés</span>
          
          {/* Grille de cases à cocher stylisées (Bouton d'état) comme sur image_4d6e66.png */}
          <div className="flex flex-wrap gap-3">
            {Object.keys(productionTypes).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleCheckboxChange(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  productionTypes[key]
                    ? "bg-green-50/80 border-emerald-500 text-emerald-800"
                    : "bg-slate-50/40 border-slate-200 text-slate-400 hover:bg-slate-50"
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                  productionTypes[key]
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-slate-300 bg-white"
                }`}>
                  {productionTypes[key] && <span className="text-[10px]">✓</span>}
                </div>
                <span className="capitalize">{key === "Rente" ? "Rente" : key === "vegetale" ? "Végétale" : "Élevage"}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SECTION 3 : INFORMATIONS DU REPRÉSENTANT LÉGAL ================= */}
      <div className="bg-white rounded-2xl border border-separator/10 shadow-sm overflow-hidden">
        {/* Entête de Section */}
        <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-green-50 text-[#0D631B] rounded-xl">
            <User size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-800">Informations du représentant légal</h2>
        </div>

        {/* Corps de Section */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nom</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={repLastName}
                  onChange={(e) => setRepLastName(e.target.value)}
                  placeholder="RAKOTO"
                  className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 focus-visible:ring-[#0D631B] text-sm font-medium"
                />
              </div>
            </div>

            {/* Prénom */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Prénom</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={repFirstName}
                  onChange={(e) => setRepFirstName(e.target.value)}
                  placeholder="Bakoto"
                  className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 focus-visible:ring-[#0D631B] text-sm font-medium"
                />
              </div>
            </div>

            {/* Adresse e-mail */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Adresse e-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  type="email"
                  value={repEmail}
                  onChange={(e) => setRepEmail(e.target.value)}
                  placeholder="email@monentreprise.com"
                  className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 focus-visible:ring-[#0D631B] text-sm font-medium"
                />
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Numéro de téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  type="tel"
                  value={repPhone}
                  onChange={(e) => setRepPhone(e.target.value)}
                  placeholder="+261 34 xx xxx xx"
                  className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 focus-visible:ring-[#0D631B] text-sm font-medium"
                />
              </div>
            </div>

            {/* Numéro CIN */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Numéro CIN</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={repCin}
                  onChange={(e) => setRepCin(e.target.value)}
                  placeholder="XXX XXX XXX XXX"
                  className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 focus-visible:ring-[#0D631B] text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </form>
  );
}