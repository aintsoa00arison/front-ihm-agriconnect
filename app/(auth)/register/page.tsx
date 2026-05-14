"use client";

import { useState } from 'react';
import RegisterProfileSelection from './_components/ProfileSelection';
import CollectorInfoForm from './_components/CollectorForm';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [profileType, setProfileType] = useState<'fournisseur' | 'collecteur'>('fournisseur');

  const handleProfileSelection = (selectedProfile: 'fournisseur' | 'collecteur') => {
    setProfileType(selectedProfile);
    setStep(2);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center p-4">
      {step === 1 && (
        <RegisterProfileSelection onNext={handleProfileSelection} />
      )}

      {step === 2 && (
        <CollectorInfoForm 
          onBack={() => setStep(1)} 
          onNext={() => setStep(3)} 
        />
      )}

      {step === 3 && (
        <div className="bg-white p-10 rounded-2xl shadow-sm text-center">
          <h2 className="text-2xl font-bold">Étape 3 : Finalisation</h2>
          <p className="text-gray-500 mt-2">Vérification de l'email en cours...</p>
        </div>
      )}
    </div>
  );
}