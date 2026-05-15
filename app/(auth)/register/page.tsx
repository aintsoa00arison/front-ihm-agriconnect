"use client";

import { useState } from 'react';
import RegisterProfileSelection from './_components/ProfileSelection';
import CollectorForm from './_components/CollectorForm';
import FournisseurForm from './_components/FournisseurForm';
import FinalisationForm from './_components/FinalisationForm';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  
  // États globaux pour le backend
  const [role, setRole] = useState<'fournisseur' | 'collecteur'>('fournisseur');
  const [fournisseurType, setFournisseurType] = useState<'particulier' | 'entreprise'>('particulier');

  // Réception des données du Step 1
  const handleProfileSelection = (
    selectedRole: 'fournisseur' | 'collecteur', 
    selectedSubType: 'particulier' | 'entreprise'
  ) => {
    setRole(selectedRole);
    setFournisseurType(selectedSubType);
    setStep(2);
  };

  const handleFinish = (finalData: any) => {
    // Regroupement de toutes les données collectées pour ton API
    const completePayload = {
      role,
      ...(role === 'fournisseur' && { type_fournisseur: fournisseurType }),
      ...finalData // Contient la bio, photo, et les champs du step 2
    };

    console.log("Données finales prêtes pour l'envoi API :", completePayload);
    // Ton appel Axios/Fetch ici
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center p-4">
      
      {/* ÉTAPE 1 : Sélection du profil */}
      {step === 1 && (
        <RegisterProfileSelection 
          onNext={(selectedRole, selectedSubType) => handleProfileSelection(selectedRole, selectedSubType)} 
        />
      )}

      {/* ÉTAPE 2 : Informations supplémentaires */}
      {step === 2 && (
        <>
          {role === 'collecteur' ? (
            <CollectorForm 
              onBack={() => setStep(1)} 
              onNext={() => setStep(3)} 
            />
          ) : (
            <FournisseurForm 
              type={fournisseurType} // Transmis dynamiquement ('particulier' ou 'entreprise')
              onBack={() => setStep(1)} 
              onNext={() => setStep(3)} 
            />
          )}
        </>
      )}

      {/* ÉTAPE 3 : Finalisation */}
      {step === 3 && (
        <FinalisationForm 
          role={role}
          onBack={() => setStep(2)} 
          onFinish={handleFinish}
        />
      )}
      
    </div>
  );
}