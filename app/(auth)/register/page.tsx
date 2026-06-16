"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { useRegisterStore } from '../../services/register/store/registerStore';
import { useRegister } from '../../services/hooks/useRegister';
import { useAuth } from '../../services/hooks/useAuth';

import RegisterProfileSelection from './_components/ProfileSelection';
import CollectorForm from './_components/CollectorForm';
import FournisseurForm from './_components/FournisseurForm';
import FinalisationForm from './_components/FinalisationForm';
import VerificationForm from '../login/_components/VerificationForm';

export default function RegisterPage() {
  const router = useRouter();
  const { registerCollector, registerFournisseur } = useRegister();
  const { sendVerificationEmail } = useAuth();
  
  const { registerDraft, setRegisterDraft, resetRegisterDraft } = useRegisterStore();
  
  const [role, setRole] = useState<'fournisseur' | 'collecteur'>('fournisseur');
  const [fournisseurType, setFournisseurType] = useState<'particulier' | 'entreprise'>('particulier');
  const [collectorData, setCollectorData] = useState<Record<string, any> | null>(null);
  const [fournisseurData, setFournisseurData] = useState<Record<string, any> | null>(null);
  const [finalizationData, setFinalizationData] = useState<{
    image: File | null;
    imageUrl: string | null;
    bio: string;
  }>({
    image: null,
    imageUrl: null,
    bio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [apiMessage, setApiMessage] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [tempUserId, setTempUserId] = useState<string>('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [step, setStep] = useState(1);
  const [emailSent, setEmailSent] = useState(false);

  const handleProfileSelection = (
    selectedRole: 'fournisseur' | 'collecteur', 
    selectedSubType: 'particulier' | 'entreprise'
  ) => {
    if (selectedRole !== role || selectedSubType !== fournisseurType) {
      setCollectorData(null);
      setFournisseurData(null);
      setFinalizationData({ image: null, imageUrl: null, bio: '' });
    }
    setRole(selectedRole);
    setFournisseurType(selectedSubType);
    setRegisterDraft({ role: selectedRole, type: selectedSubType });
    setStep(2);
  };

  const handleFinish = async (step3Data: typeof finalizationData) => {
    setFinalizationData(step3Data);
    setIsSubmitting(true);
    setSubmitStatus('idle');

    setRegisterDraft({ 
      bio: step3Data.bio, 
      photo: step3Data.image 
    });

    const email = registerDraft.email || '';
    setRegisteredEmail(email);

    try {
      let success = false;
      let userId = '';

      console.log("🔵 Inscription en cours...");
      
      if (role === 'collecteur') {
        const result = await registerCollector();
        success = result.success;
        userId = result.userId || '';
        console.log("🔵 Résultat inscription collecteur:", { success, userId });
      } else {
        const result = await registerFournisseur(step3Data.bio, step3Data.image);
        success = result.success;
        userId = result.userId || '';
        console.log("🔵 Résultat inscription fournisseur:", { success, userId });
      }

      if (success) {
        console.log("✅ Compte créé avec succès!");
        console.log("📧 Email pour vérification:", email);
        console.log("🆔 userId:", userId);
        
        // 🔥 NE PAS envoyer l'email ici - laisser VerificationForm le faire
        // setEmailSent(false); // Réinitialiser
        
        setTempUserId(userId);
        setIsSubmitting(false);
        setShowVerification(true);
        toast.success("Compte créé ! Veuillez vérifier votre email.");
      } else {
        console.error("🔴 Échec de la création du compte");
        setSubmitStatus('error');
        setApiMessage("Une erreur est survenue lors de l'inscription.");
        setIsSubmitting(false);
      }

    } catch (error: any) {
      console.error("🔴 Exception:", error);
      setSubmitStatus('error');
      setApiMessage(error.response?.data?.detail || error.message || "Une erreur technique est survenue.");
      setIsSubmitting(false);
    }
  };

  const handleVerificationComplete = async () => {
    setSubmitStatus('success');
    setShowVerification(false);
    resetRegisterDraft();
  };

  // Écran de vérification
  if (showVerification) {
    return (
      <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center px-4 py-8 sm:px-6">
        <VerificationForm
          userId={tempUserId}
          email={registeredEmail}
          mode="register"
          onVerified={handleVerificationComplete}
        />
      </div>
    );
  }

  // Écran de succès/erreur
  if (isSubmitting || submitStatus !== 'idle') {
    return (
      <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-xl bg-white rounded-[20px] sm:rounded-[24px] shadow-xl border border-separator/10 p-4 sm:p-6 md:p-8 text-center space-y-4 sm:space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          {isSubmitting && (
            <div className="space-y-3 sm:space-y-4 py-6 sm:py-8 flex flex-col items-center">
              <Loader2 size={40} className="sm:size-12 text-primary animate-spin" />
              <h3 className="text-base sm:text-lg font-bold text-label">Création de votre compte en cours...</h3>
              <p className="text-[11px] sm:text-xs text-input-element max-w-xs sm:max-w-sm">
                Veuillez patienter pendant la configuration de votre profil.
              </p>
            </div>
          )}

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
                <ArrowRight size={14}  />
              </button>
            </div>
          )}

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
                onClick={() => {
                  setSubmitStatus('idle');
                  setStep(3);
                }}
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

  // --- RENDU STANDARD ---
  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      
      {step === 1 && <RegisterProfileSelection onNext={handleProfileSelection} />}

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