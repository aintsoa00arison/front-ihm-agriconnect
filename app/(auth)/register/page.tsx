"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

// Importation des types et du store d'inscription
import { RegisterStoreData } from './types'; 
import { useRegisterStore } from './registerStore'; 

// Importation du service d'inscription
import { registerAccountService } from './services/registerService';

// Importation des sous-composants des étapes
import RegisterProfileSelection from './_components/ProfileSelection';
import CollectorForm from './_components/CollectorForm';
import FournisseurForm from './_components/FournisseurForm';
import FinalisationForm from './_components/FinalisationForm';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Récupération des données du premier écran (Zustand) et du reset
  const { registerDraft, resetRegisterDraft } = useRegisterStore();
  
  // 1. États de configuration du profil
  const [role, setRole] = useState<'fournisseur' | 'collecteur'>('fournisseur');
  const [fournisseurType, setFournisseurType] = useState<'particulier' | 'entreprise'>('particulier');

  // 2. États de mémoire pour l'Étape 2 (Sauvegarde typée des formulaires)
  const [collectorData, setCollectorData] = useState<Record<string, any> | null>(null);
  const [fournisseurData, setFournisseurData] = useState<Record<string, any> | null>(null);

  // 3. État de mémoire pour l'Étape 3 (Sauvegarde de la finalisation)
  const [finalizationData, setFinalizationData] = useState<{
    image: File | null;
    imageUrl: string | null;
    bio: string;
  }>({
    image: null,
    imageUrl: null,
    bio: ''
  });

  // 4. États pour la soumission et les écrans de feedback finaux
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [apiMessage, setApiMessage] = useState('');
  
  // Sauvegarde locale de l'email pour l'affichage final
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Réception et sécurité des changements de rôles au Step 1
  const handleProfileSelection = (
    selectedRole: 'fournisseur' | 'collecteur', 
    selectedSubType: 'particulier' | 'entreprise'
  ) => {
    // Si l'utilisateur change radicalement d'avis sur le type de compte, on wipe les steps suivants
    if (selectedRole !== role || selectedSubType !== fournisseurType) {
      setCollectorData(null);
      setFournisseurData(null);
      setFinalizationData({ image: null, imageUrl: null, bio: '' });
    }
    setRole(selectedRole);
    setFournisseurType(selectedSubType);
    setStep(2);
  };

  // Traitement et envoi final au backend
  const handleFinish = async (step3Data: typeof finalizationData) => {
    setFinalizationData(step3Data);
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const step2Fields = role === 'collecteur' ? collectorData : fournisseurData;

    // Construction du payload global conforme à ton interface de données
    const completePayload: RegisterStoreData = {
      email: registerDraft.email,
      password: registerDraft.password,
      code: registerDraft.code,
      role,
      ...(role === 'fournisseur' && { type: fournisseurType }),
      ...step2Fields, 
      bio: step3Data.bio,
      photo: step3Data.image 
    };

    setRegisteredEmail(registerDraft.email || '');

    try {
      const response = await registerAccountService(completePayload);
      
      if (response.success) {
        setSubmitStatus('success');
        setApiMessage(response.message);
        resetRegisterDraft(); // Clear du store Zustand uniquement si succès complet
      } else {
        setSubmitStatus('error');
        setApiMessage(response.message || "Une erreur est survenue lors de la validation.");
      }
    } catch (error) {
      setSubmitStatus('error');
      setApiMessage("Une erreur technique est survenue lors de la communication avec le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDU : CHARGEMENT OU FEEDBACKS INTERMÉDIAIRES ---
  if (isSubmitting || submitStatus !== 'idle') {
    return (
      <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-xl bg-white rounded-[20px] sm:rounded-[24px] shadow-xl border border-separator/10 p-4 sm:p-6 md:p-8 text-center space-y-4 sm:space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          {/* ÉCRAN A : CHARGEMENT - Responsive */}
          {isSubmitting && (
            <div className="space-y-3 sm:space-y-4 py-6 sm:py-8 flex flex-col items-center">
              <Loader2 size={40} className="sm:size-12 text-primary animate-spin" />
              <h3 className="text-base sm:text-lg font-bold text-label">Création de votre compte en cours...</h3>
              <p className="text-[11px] sm:text-xs text-input-element max-w-xs sm:max-w-sm">
                Veuillez patienter pendant la configuration de votre profil. Cela peut prendre quelques instants en fonction de votre connexion et du serveur. Merci de votre compréhension.
              </p>
            </div>
          )}

          {/* ÉCRAN B : INSCRIPTION RÉUSSIE - Responsive */}
          {submitStatus === 'success' && (
            <div className="space-y-4 sm:space-y-6 py-4 flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-full border border-green-100">
                <CheckCircle2 size={32} className="sm:size-10 text-green-500" strokeWidth={1.5} />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-800">Inscription réussie !</h3>
                <p className="text-xs sm:text-sm font-medium text-neutral-600 px-4 leading-relaxed">
                  Votre compte de <span className="font-bold text-primary">{role}</span> a été configuré avec succès. <br />
                  Utilisez l'adresse email{" "}
                  <span className="font-bold underline text-neutral-800 break-words">
                    {registeredEmail || "renseignée"}
                  </span>{" "}
                  pour vous connecter.
                </p>
              </div>

              <button 
                onClick={() => router.push('/login')}
                className="btn-primary px-6 sm:px-8 h-10 sm:h-12 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 rounded-xl shadow-md w-full max-w-xs cursor-pointer"
              >
                <span>Accéder à la connexion</span>
                <ArrowRight size={14} className="sm:size-16" />
              </button>
            </div>
          )}

          {/* ÉCRAN C : ERREUR API - Responsive */}
          {submitStatus === 'error' && (
            <div className="space-y-4 sm:space-y-6 py-4 flex flex-col items-center">
              <div className="p-2 sm:p-3 bg-red-50 rounded-full text-red-500 border border-red-100">
                <XCircle size={40} className="sm:size-14 stroke-[1.5]" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-800">Impossible de finaliser l'inscription</h3>
                <p className="text-[11px] sm:text-xs font-semibold text-red-600 bg-red-50 border border-red-100 p-2 sm:p-3 rounded-xl max-w-md mx-auto leading-relaxed break-words">
                  {apiMessage}
                </p>
              </div>
              <button 
                onClick={() => setSubmitStatus('idle')}
                className="px-5 sm:px-6 h-10 sm:h-11 text-[11px] sm:text-xs font-bold border border-separator/30 text-label rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Retourner au formulaire
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // --- RENDU STANDARD DU TUNNEL DES ÉTAPES ---
  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      
      {/* ÉTAPE 1 : Sélection du type de profil */}
      {step === 1 && (
        <RegisterProfileSelection onNext={handleProfileSelection} />
      )}

      {/* ÉTAPE 2 : Formulaires dynamiques selon le rôle */}
      {step === 2 && (
        <>
          {role === 'collecteur' ? (
            <CollectorForm 
              initialData={collectorData} 
              onBack={() => setStep(1)} 
              onNext={(data) => {
                setCollectorData(data); 
                setStep(3);
              }} 
            />
          ) : (
            <FournisseurForm 
              type={fournisseurType}
              initialData={fournisseurData} 
              onBack={() => setStep(1)} 
              onNext={(data) => {
                setFournisseurData(data); 
                setStep(3);
              }} 
            />
          )}
        </>
      )}

      {/* ÉTAPE 3 : Finalisation et Upload photo/bio */}
      {step === 3 && (
        <FinalisationForm 
          role={role}
          initialData={finalizationData} 
          onBack={(currentStep3Data) => {
            setFinalizationData(currentStep3Data); 
            setStep(2);
          }} 
          onFinish={handleFinish}
        />
      )}
      
    </div>
  );
}