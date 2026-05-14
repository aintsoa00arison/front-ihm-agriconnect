"use client";

import { useState } from 'react';
import RegisterProfileSelection from './_components/ProfileSelection';
import CollectorForm from './_components/CollectorForm';
import FournisseurForm from './_components/FournisseurForm';
import FinalisationForm from './_components/FinalisationForm';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  
  // État pour le rôle global
  const [role, setRole] = useState<'fournisseur' | 'collecteur'>('fournisseur');
  
  // État spécifique pour le fournisseur (à récupérer via ton ProfileSelection si besoin)
  const [fournisseurType, setFournisseurType] = useState<'particulier' | 'entreprise'>('particulier');

  const handleProfileSelection = (selectedRole: 'fournisseur' | 'collecteur') => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleFinish = (data: any) => {
    console.log("Données finales du profil :", data);
    // Logique d'inscription finale ici (Appel API, etc.)
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center p-4">
      
      {/* ÉTAPE 1 : Sélection du profil */}
      {step === 1 && (
        <RegisterProfileSelection 
          onNext={(selectedRole) => handleProfileSelection(selectedRole as 'fournisseur' | 'collecteur')} 
        />
      )}

      {/* ÉTAPE 2 : Informations supplémentaires (Dynamique selon le rôle) */}
      {step === 2 && (
        <>
          {role === 'collecteur' ? (
            <CollectorForm 
              onBack={() => setStep(1)} 
              onNext={() => setStep(3)} 
            />
          ) : (
            <FournisseurForm 
              type={fournisseurType} // 'particulier' ou 'entreprise'
              onBack={() => setStep(1)} 
              onNext={() => setStep(3)} 
            />
          )}
        </>
      )}

      {/* ÉTAPE 3 : Finalisation (Photo & Biographie) */}
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