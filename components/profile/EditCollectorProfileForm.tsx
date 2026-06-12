"use client";

import { useState } from "react";
import { Building2, Diamond, User, Mail, Phone, FileText, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditCollectorProfileFormProps {
  initialData?: any;
  onCancel: () => void;
  onSave: (data: any) => void;
}

export default function EditCollectorProfileForm({
  initialData,
  onCancel,
  onSave,
}: EditCollectorProfileFormProps) {
  const [companyName, setCompanyName] = useState(initialData?.company?.name || "");
  const [companyAddress, setCompanyAddress] = useState(initialData?.company?.address || "");
  const [companyEmail, setCompanyEmail] = useState(initialData?.company?.email || "");
  const [companyPhone, setCompanyPhone] = useState(initialData?.company?.phone || "");
  const [companyNif, setCompanyNif] = useState(initialData?.company?.nif || "");
  const [companyStat, setCompanyStat] = useState(initialData?.company?.stat || "");

  const [productionTypes, setProductionTypes] = useState<{ [key: string]: boolean }>({
    vegetale: initialData?.productionTypes?.includes("Végétale") || false,
    elevage: initialData?.productionTypes?.includes("Élevage") || false,
    Rente: initialData?.productionTypes?.includes("Rente") || true,
  });

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
    <div className="w-full h-full bg-neutral p-4 md:p-8 overflow-hidden">
      <div className="max-w-5xl mx-auto h-full flex flex-col">
        
        {/* HEADER STICKY - exactement comme CataloguePage */}
        <div className="sticky top-0 z-20 bg-neutral/95 backdrop-blur-sm pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Modifier le profil</h1>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Mettre à jour les informations de votre entreprise et de votre représentant légal.
              </p>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="rounded-xl font-bold border-border text-muted-foreground hover:bg-muted px-6 h-11"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                form="profile-form"
                className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-11 transition-all"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </div>

        {/* ZONE SCROLLABLE */}
        <div className="flex-1 overflow-y-auto pb-10">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            {/* SECTION 1 : INFORMATIONS DE L'ENTREPRISE */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 bg-muted/30 border-b border-border flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Building2 size={20} />
                </div>
                <h2 className="text-base font-bold text-foreground">Informations de l'entreprise</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Raison sociale</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Nom de l'entreprise"
                        className="pl-11 bg-muted/30 border-border rounded-xl h-11 focus-visible:ring-primary text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Siège social</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        placeholder="Adresse du siège"
                        className="pl-11 bg-muted/30 border-border rounded-xl h-11 focus-visible:ring-primary text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Adresse e-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        type="email"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        placeholder="email@monentreprise.com"
                        className="pl-11 bg-muted/30 border-border rounded-xl h-11 focus-visible:ring-primary text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Numéro de téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        type="tel"
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                        placeholder="+261 34 xx xxx xx"
                        className="pl-11 bg-muted/30 border-border rounded-xl h-11 focus-visible:ring-primary text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">NIF</label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        value={companyNif}
                        onChange={(e) => setCompanyNif(e.target.value)}
                        placeholder="XXXXXXXXXX"
                        className="pl-11 bg-muted/30 border-border rounded-xl h-11 focus-visible:ring-primary text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">STAT</label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        value={companyStat}
                        onChange={(e) => setCompanyStat(e.target.value)}
                        placeholder="XXXXX XX XXXX X XXXXX"
                        className="pl-11 bg-muted/30 border-border rounded-xl h-11 focus-visible:ring-primary text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2 : PRÉFÉRENCES DE PRODUITS */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 bg-muted/30 border-b border-border flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Diamond size={20} />
                </div>
                <h2 className="text-base font-bold text-foreground">Préférences de produits</h2>
              </div>

              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-foreground/80 block">Type de production recherchés</span>
                <div className="flex flex-wrap gap-3">
                  {Object.keys(productionTypes).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleCheckboxChange(key)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        productionTypes[key]
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-muted/20 border-border text-muted-foreground hover:bg-muted/30"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        productionTypes[key]
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border bg-card"
                      }`}>
                        {productionTypes[key] && <span className="text-[10px]">✓</span>}
                      </div>
                      <span className="capitalize">{key === "Rente" ? "Rente" : key === "vegetale" ? "Végétale" : "Élevage"}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3 : INFORMATIONS DU REPRÉSENTANT LÉGAL */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 bg-muted/30 border-b border-border flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <User size={20} />
                </div>
                <h2 className="text-base font-bold text-foreground">Informations du représentant légal</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Nom</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        value={repLastName}
                        onChange={(e) => setRepLastName(e.target.value)}
                        placeholder="RAKOTO"
                        className="pl-11 bg-muted/30 border-border rounded-xl h-11 focus-visible:ring-primary text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        value={repFirstName}
                        onChange={(e) => setRepFirstName(e.target.value)}
                        placeholder="Bakoto"
                        className="pl-11 bg-muted/30 border-border rounded-xl h-11 focus-visible:ring-primary text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Adresse e-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        type="email"
                        value={repEmail}
                        onChange={(e) => setRepEmail(e.target.value)}
                        placeholder="email@monentreprise.com"
                        className="pl-11 bg-muted/30 border-border rounded-xl h-11 focus-visible:ring-primary text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Numéro de téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        type="tel"
                        value={repPhone}
                        onChange={(e) => setRepPhone(e.target.value)}
                        placeholder="+261 34 xx xxx xx"
                        className="pl-11 bg-muted/30 border-border rounded-xl h-11 focus-visible:ring-primary text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Numéro CIN</label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        value={repCin}
                        onChange={(e) => setRepCin(e.target.value)}
                        placeholder="XXX XXX XXX XXX"
                        className="pl-11 bg-muted/30 border-border rounded-xl h-11 focus-visible:ring-primary text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}