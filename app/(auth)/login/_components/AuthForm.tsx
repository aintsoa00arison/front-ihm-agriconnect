"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Key, Check, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { AuthFormData } from '../types/auth';
import { mockLoginService, sendVerificationEmail, verifyCodeService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

interface AuthFormProps {
  mode: string;
  onSubmit?: (data: any) => void;
}

export default function AuthForm({ mode: initialMode, onSubmit }: AuthFormProps) {
  const router = useRouter();
  
  // Récupération de la fonction de mise à jour du store Zustand
  const setRegisterDraft = useAuthStore((state) => state.setRegisterDraft);

  const [view, setView] = useState<'auth' | 'forgot' | 'reset'>('auth');
  const [isLogin, setIsLogin] = useState(initialMode !== 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Permet de savoir si on est en train de demander un reset de mot de passe sur la Vue 1
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);

  // Gestion des notifications de retour
  const [errorNotification, setErrorNotification] = useState<string | null>(null);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // États des champs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Validations en temps réel (Vérification de la correspondance)
  const isRegisterPasswordMismatched = !isLogin && view === 'auth' && confirmPassword.length > 0 && password !== confirmPassword;
  const isResetPasswordMismatched = view === 'reset' && confirmNewPassword.length > 0 && newPassword !== confirmNewPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotification(null);
    setSuccessNotification(null);
    
    // --- VUE 1 : CONNEXION, INSCRIPTION OU DEMANDE DE CODE DE RÉCUPÉRATION ---
    if (view === 'auth') {
      if (isForgotPasswordMode) {
        if (!email.trim()) return setErrorNotification("Veuillez entrer votre adresse email.");
        
        setIsLoading(true);
        try {
          const response = await sendVerificationEmail(email.trim());
          if (response.success) {
            setSuccessNotification(response.message);
            setView('forgot');
          } else {
            setErrorNotification(response.message);
          }
        } catch (error: any) {
          setErrorNotification(error.message || "Erreur lors de l'envoi du code.");
        } finally {
          setIsLoading(false);
        }
      } 
      else if (isLogin) {
        setIsLoading(true);
        try {
          const dataToSend: AuthFormData = { email: email.trim(), password };
          const response = await mockLoginService(dataToSend);
          
          if (response.success && response.user) {
            setSuccessNotification("Connexion réussie ! Vous êtes maintenant connecté.");
            onSubmit?.({ email: dataToSend.email, mode: 'login', role: response.user.role });

            setTimeout(() => {
              router.push('/dashboard'); 
            }, 1500);
          } else {
            setErrorNotification(response.message || "Une erreur est survenue.");
            setIsLoading(false);
          }
        } catch (error: any) {
          setErrorNotification(error.message || "Impossible de joindre le serveur.");
          setIsLoading(false);
        }
      } else {
        // CAS INSCRIPTION
        if (!agreedToTerms) return alert("Veuillez accepter les conditions d'utilisation.");
        if (password !== confirmPassword) return setErrorNotification("Les mots de passe ne correspondent pas.");
        
        setIsLoading(true);
        try {
          const response = await sendVerificationEmail(email.trim());
          if (response.success) {
            setSuccessNotification("Un code de vérification vous a été envoyé. Veuillez le saisir.");
            
            setRegisterDraft({ 
              email: email.trim(), 
              password: password 
            });

            onSubmit?.({ 
              email: email.trim(), 
              password: password, 
              mode: 'register_draft' 
            });

            setView('forgot');
          } else {
            setErrorNotification(response.message);
          }
        } catch (error: any) {
          setErrorNotification(error.message || "Erreur lors de l'envoi du mail de confirmation.");
        } finally {
          setIsLoading(false);
        }
      }
    } 
    
    // --- VUE 2 : VÉRIFICATION DU CODE ---
    else if (view === 'forgot') {
      setIsLoading(true);
      try {
        const response = await verifyCodeService({ email: email.trim(), code: verificationCode });
        
        if (response.success) {
          setSuccessNotification("Code validé avec succès !");
          
          setTimeout(() => {
            if (!isLogin) {
              setRegisterDraft({ code: verificationCode });

              onSubmit?.({ 
                email: email.trim(), 
                code: verificationCode,
                mode: 'register_verified' 
              });

              router.push('/register'); 
            } else {
              setIsLoading(false);
              setSuccessNotification(null);
              setView('reset');
            }
          }, 1500);
        } else {
          setErrorNotification(response.message);
          setIsLoading(false);
        }
      } catch (error: any) {
        setErrorNotification(error.message || "Une erreur est survenue.");
        setIsLoading(false);
      }
    }
    
    // --- VUE 3 : RÉINITIALISATION DU MOT DE PASSE ---
    else if (view === 'reset') {
      if (newPassword !== confirmNewPassword) return setErrorNotification("Les mots de passe ne correspondent pas.");
      
      onSubmit?.({ email, newPassword, mode: 'reset_password' });
      setSuccessNotification("Votre mot de passe a bien été mis à jour.");
      
      setTimeout(() => {
        setIsLogin(true);
        setIsForgotPasswordMode(false);
        setView('auth');
        setSuccessNotification(null);
        setNewPassword("");
        setConfirmNewPassword("");
      }, 1500);
    }
  };

  const handleResendCode = async () => {
    setErrorNotification(null);
    setSuccessNotification(null);
    try {
      const response = await sendVerificationEmail(email.trim());
      if (response.success) setSuccessNotification("Un nouveau code vous a été renvoyé.");
    } catch (error: any) {
      setErrorNotification(error.message || "Impossible de renvoyer le code.");
    }
  };

  // --- RENDU VUE 2 & 3 COMPACTÉES (Vérification & Reset) ---
  if (view === 'forgot' || view === 'reset') {
    return (
      <div className="w-full max-w-xl p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-primary leading-tight">
            {view === 'forgot' ? "Vérification" : "Nouveau mot de passe"}
          </h2>
          <p className="text-label text-sm font-medium">
            {view === 'forgot' 
              ? `Nous vous avons envoyé un code à ${email}. Veuillez l'insérer ci-dessous :`
              : "Définissez votre nouveau mot de passe sécurisé."}
          </p>
        </div>

        {errorNotification && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            <AlertTriangle size={18} className="flex-shrink-0 text-red-500 mt-0.5" />
            <p className="leading-relaxed">{errorNotification}</p>
          </div>
        )}

        {successNotification && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
            <CheckCircle2 size={18} className="flex-shrink-0 text-green-500 mt-0.5" />
            <p className="leading-relaxed">{successNotification}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {view === 'forgot' ? (
            <div className="space-y-2">
              <div className="relative">
                <div className="input-icon-container input-icon-no-label"><Key size={18} /></div>
                <input 
                  type="text" 
                  placeholder="XXXXXXXX" 
                  className="input-auth text-center tracking-[0.5em] font-mono h-12 uppercase focus:bg-white"
                  value={verificationCode}
                  maxLength={8}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="text-right">
                <button type="button" onClick={handleResendCode} className="text-[11px] font-bold text-primary hover:underline transition-all" disabled={isLoading}>
                  Renvoyer le code
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1 uppercase">Nouveau mot de passe</label>
                <div className="input-icon-container"><Lock size={18} /></div>
                <input type="password" className="input-auth h-11 focus:bg-white" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading} required />
              </div>
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1 uppercase">Confirmer</label>
                <div className="input-icon-container"><Lock size={18} /></div>
                <input type="password" className="input-auth h-11 focus:bg-white" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={isLoading} required />
                {/* Message d'erreur en temps réel pour le Reset de mot de passe */}
                {isResetPasswordMismatched && (
                  <p className="text-red-500 text-[10px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in duration-300">
                    <AlertTriangle size={12} /> Les mots de passe ne correspondent pas.
                  </p>
                )}
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={isLoading || isResetPasswordMismatched} 
            className="btn-primary w-full h-12 mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : (view === 'forgot' ? "Vérifier" : "Mettre à jour")}
          </button>
          
          <button 
            type="button" 
            onClick={() => { 
              setView('auth'); 
              setErrorNotification(null); 
              setSuccessNotification(null);
            }} 
            className="text-xs font-bold text-input-element/60 hover:text-primary hover:underline w-full text-center transition-colors" 
            disabled={isLoading}
          >
            Retour
          </button>
        </form>
      </div>
    );
  }

  // --- RENDU VUE 1 : AUTHENTIFICATION PRINCIPALE ---
  return (
    <div className="w-full max-w-xl p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-primary leading-tight tracking-tight">AgriConnect</h2>
        <p className="text-label text-sm font-medium">
          {isForgotPasswordMode 
            ? "Récupération de compte. Saisissez votre email pour recevoir un code."
            : isLogin ? "Bon retour. Veuillez entrer vos identifiants de connexion." : "Bienvenue ! Veuillez fournir les informations demandées."}
        </p>
      </div>

      {!isForgotPasswordMode && (
        <div className="flex w-full border-b border-separator/20">
          <button type="button" onClick={() => { setIsLogin(true); setErrorNotification(null); setSuccessNotification(null); }} className={`flex-1 pb-3 pt-2 text-base font-bold transition-all border-b-2 ${isLogin ? 'text-primary border-primary bg-light-bg/20' : 'text-input-element/40 border-transparent'}`}>Connexion</button>
          <button type="button" onClick={() => { setIsLogin(false); setErrorNotification(null); setSuccessNotification(null); }} className={`flex-1 pb-3 pt-2 text-base font-bold transition-all border-b-2 ${!isLogin ? 'text-primary border-primary bg-light-bg/20' : 'text-input-element/40 border-transparent'}`}>Inscription</button>
        </div>
      )}

      {errorNotification && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          <AlertTriangle size={18} className="flex-shrink-0 text-red-500 mt-0.5" />
          <p className="leading-relaxed">{errorNotification}</p>
        </div>
      )}

      {successNotification && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
          <CheckCircle2 size={18} className="flex-shrink-0 text-green-500 mt-0.5" />
          <p className="leading-relaxed">{successNotification}</p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <label className="text-[11px] font-bold text-label block ml-1 mb-1 uppercase">Adresse email</label>
          <div className="input-icon-container"><Mail size={18} /></div>
          <input type="email" placeholder="nom@exemple.com" className="input-auth h-11 text-sm focus:bg-white" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
        </div>

        {!isForgotPasswordMode && (
          <div className="relative">
            <label className="text-[11px] font-bold text-label block ml-1 mb-1 uppercase">Mot de passe</label>
            <div className="input-icon-container"><Lock size={18} /></div>
            <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="input-auth h-11 text-sm focus:bg-white" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-password-toggle" disabled={isLoading}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}

        {!isLogin && !isForgotPasswordMode && (
          <>
            <div className="relative animate-in slide-in-from-top-1">
              <label className="text-[11px] font-bold text-label block ml-1 mb-1 uppercase">Confirmez le mot de passe</label>
              <div className="input-icon-container"><Lock size={18} /></div>
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="input-auth h-11 text-sm focus:bg-white" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} required />
              {/* Message d'erreur en temps réel pour l'Inscription */}
              {isRegisterPasswordMismatched && (
                <p className="text-red-500 text-[10px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in duration-300">
                  <AlertTriangle size={12} /> Les mots de passe ne correspondent pas.
                </p>
              )}
            </div>

            <div className="flex items-start space-x-3 pt-1">
              <label className="flex items-center cursor-pointer group pt-0.5">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer hidden" checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)} disabled={isLoading} />
                  <div className="w-5 h-5 border border-separator/40 rounded peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                  <Check size={12} className="absolute text-white scale-0 peer-checked:scale-100 transition-transform stroke-[3px]" />
                </div>
              </label>
              <span className="text-[11px] text-input-element toggle-label-terms leading-tight">
                J'accepte les <span className="text-primary font-bold hover:underline cursor-pointer">Conditions d'Utilisation</span> et la <span className="text-primary font-bold hover:underline cursor-pointer">Politique de Confidentialité</span>.
              </span>
            </div>
          </>
        )}

        {isLogin && !isForgotPasswordMode && (
          <div className="text-right">
            <button type="button" onClick={() => { setIsForgotPasswordMode(true); setErrorNotification(null); }} className="text-[11px] font-bold text-primary hover:underline" disabled={isLoading}>Mot de passe oublié ?</button>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading || isRegisterPasswordMismatched}
          className="btn-primary w-full h-12 mt-2 text-sm shadow-lg shadow-primary/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isForgotPasswordMode ? (
            "Envoyer le code"
          ) : isLogin ? (
            "Se connecter"
          ) : (
            "S'inscrire"
          )}
        </button>

        {isForgotPasswordMode && (
          <button 
            type="button" 
            onClick={() => { 
              setIsForgotPasswordMode(false); 
              setErrorNotification(null); 
              setSuccessNotification(null); 
            }} 
            className="text-xs font-bold text-input-element/60 hover:text-primary hover:underline w-full text-center transition-colors block pt-2"
            disabled={isLoading}
          >
            Annuler et retourner à la connexion
          </button>
        )}
      </form>
    </div>
  );
}