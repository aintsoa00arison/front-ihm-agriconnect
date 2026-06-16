"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AdFormMode, AdData, ProductionType, QuantityUnit, convertToDisplay } from "../../app/services/publication/ad";
import BreadcrumbNav from "./BreadcrumbNav";
import ProductionTypeSelect from "./utils/ProductionTypeSelect";
import QuantityInput from "./utils/QuantityInput";
import LocationInput from "./utils/LocationInput";
import DescriptionTextarea from "./utils/DescriptionTextarea";
import MediaUpload from "./utils/MediaUpload";
import AdPreview from "./AdPreview";
import { FormSkeleton, PreviewSkeleton } from "./AdSkeletons";
import { usePublications } from "../../app/services/hooks/usePublication";
import { getUserId, getUserRole } from "../../app/services/lib/auth";

interface AdFormProps {
  mode: AdFormMode;
  initialData?: AdData;
  onCancel: () => void;
  onSave: (data: any) => void;
}

export default function AdForm({ mode, initialData, onCancel, onSave }: AdFormProps) {
  const router = useRouter();
  const isAnnonce = mode === "annonce";
  const isEditMode = !!initialData;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = getUserId();
  const userRole = getUserRole();
  const isCollector = userRole === 'collecteur' || userRole === 'collector';
  const isProvider = userRole === 'fournisseur' || userRole === 'provider';
  
  const { createPublication, updatePublication } = usePublications(userId || undefined);

  // 🔥 États du formulaire
  const [productionType, setProductionType] = useState<ProductionType>("VEGETAL");
  const [productName, setProductName] = useState<string>("");
  const [quantityValue, setQuantityValue] = useState<string>("");
  const [quantityUnit, setQuantityUnit] = useState<QuantityUnit>("tonnes");
  const [price, setPrice] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>(
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (initialData) {
      setProductionType(initialData.productionType || "VEGETAL");
      setProductName(initialData.productName || "");
      setPrice(initialData.price || "");
      setLocation(initialData.location || "");
      setDescription(initialData.description || "");
      if (initialData.mediaUrl) setMediaPreview(initialData.mediaUrl);
      if (initialData.quantityValue && initialData.quantityUnit) {
        setQuantityValue(initialData.quantityValue);
        setQuantityUnit(initialData.quantityUnit);
      } else if (initialData.quantity) {
        const parts = initialData.quantity.trim().split(" ");
        if (parts.length >= 2) {
          setQuantityValue(parts[0]);
          setQuantityUnit(parts.slice(1).join(" ") as QuantityUnit);
        }
      }
    }
  }, [initialData]);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setMediaPreview(reader.result);
      }
    };
    reader.onerror = () => toast.error("Échec du chargement de l'image.");
    reader.readAsDataURL(file);
  };

  const formatPriceInput = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, '');
    return cleaned;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPriceInput(e.target.value);
    setPrice(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName.trim() || !quantityValue.trim() || !location.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (isProvider && !imageFile) {
      toast.error("Veuillez ajouter une photo pour votre annonce.");
      return;
    }

    if (!userId) {
      toast.error("Vous devez être connecté pour publier.");
      return;
    }

    setIsSubmitting(true);

    try {
      const priceNumber = price ? parseFloat(price) : undefined;
      
      const publicationData: any = {
        sender_id: userId,
        titre: productName,
        description: description,
        category: productionType,
        localisation: location,
        quantity: `${quantityValue} ${quantityUnit}`,
        prix: priceNumber,
      };

      if (isProvider && imageFile) {
        publicationData.photo = imageFile;
      }

      console.log('📤 Données envoyées au backend:', publicationData);

      let result;
      if (isEditMode && initialData?.id) {
        // 🔥 Pour la mise à jour, inclure sender_id
        result = await updatePublication(initialData.id, {
          ...publicationData,
          sender_id: userId, // 🔥 Ajouté pour l'update
        });
      } else {
        result = await createPublication(publicationData);
      }

      // 🔥 Le toast est déjà géré dans le hook, on ne le refait pas ici
      if (result.success) {
        const displayType = convertToDisplay(productionType);
        
        onSave({
          id: initialData?.id,
          mode,
          productionType: productionType,
          productionTypeDisplay: displayType,
          productName,
          quantityValue,
          quantityUnit,
          quantity: `${quantityValue} ${quantityUnit}`,
          price: price || "0",
          location,
          description,
          mediaUrl: mediaPreview,
        });

        // 🔥 Redirection sans toast supplémentaire
        setTimeout(() => {
          const redirectPath = isAnnonce ? '/f' : '/c';
          router.push(redirectPath);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Erreur lors de la publication:", error);
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 p-6 animate-in fade-in duration-300">
      <div className="mb-6">
        <BreadcrumbNav mode={mode} isEditMode={isEditMode} onBack={onCancel} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
                  {isEditMode 
                    ? (isAnnonce ? "Modifier mon annonce" : "Modifier ma demande")
                    : (isAnnonce ? "Faire une nouvelle annonce" : "Faire une nouvelle demande")
                  }
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {isEditMode
                    ? `Mettre à jour les informations de votre ${isAnnonce ? "annonce" : "demande"}.`
                    : isAnnonce
                      ? "Décrivez votre offre de manière détaillée pour rassurer et convaincre."
                      : "Spécifiez le type de produit recherché, la quantité exacte et le lieu de livraison."
                  }
                </p>
                {isCollector && (
                  <p className="text-xs text-amber-600 font-medium mt-1">
                    ⚠️ Les collecteurs ne peuvent pas ajouter de photo (demande d'achat).
                  </p>
                )}
                {isProvider && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    ✅ Les fournisseurs doivent ajouter une photo (offre de vente).
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ProductionTypeSelect value={productionType} onChange={setProductionType} />
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-800">Nom du produit</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Ex: Blé de province"
                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl h-11 px-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D631B]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <QuantityInput
                    value={quantityValue}
                    unit={quantityUnit}
                    onValueChange={setQuantityValue}
                    onUnitChange={setQuantityUnit}
                  />
                  <LocationInput mode={mode} value={location} onChange={setLocation} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-800">
                      Prix <span className="font-normal text-slate-400">(en Ar)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        Ar
                      </span>
                      <input
                        type="text"
                        value={price}
                        onChange={handlePriceChange}
                        placeholder="Ex: 15000"
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl h-11 pl-9 pr-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D631B]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Laissez vide si le prix n'est pas défini
                    </p>
                  </div>
                  <div />
                </div>

                <DescriptionTextarea value={description} onChange={setDescription} />
                
                <MediaUpload 
                  onFileSelect={handleFileSelect} 
                  disabled={isCollector}
                />
                {isCollector && (
                  <p className="text-xs text-amber-600 font-medium -mt-2">
                    ⚠️ Les demandes d'achat ne peuvent pas inclure de photo
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="ghost"
                  className="font-bold text-slate-500 hover:bg-slate-100 h-11 px-8 rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || (isProvider && !imageFile)}
                  className="bg-primary hover:opacity-90 text-white font-bold h-11 px-8 rounded-xl shadow-sm gap-2 transition-all disabled:opacity-50"
                >
                  <Check size={18} strokeWidth={2.5} />
                  {isSubmitting ? "En cours..." : (isEditMode ? "Enregistrer" : "Publier")}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-4">
          {isLoading ? (
            <PreviewSkeleton />
          ) : (
            <AdPreview
              mode={mode}
              productionType={convertToDisplay(productionType)}
              productName={productName}
              quantityValue={quantityValue}
              quantityUnit={quantityUnit}
              price={price}
              location={location}
              description={description}
              mediaPreview={mediaPreview}
            />
          )}
        </div>
      </div>
    </div>
  );
}