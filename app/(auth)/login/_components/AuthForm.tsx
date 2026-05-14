"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Key, Check } from 'lucide-react';

interface AuthFormProps {
  mode: string;
  onSubmit?: (data: any) => void;
}

export default function AuthForm({ mode: initialMode, onSubmit }: AuthFormProps) {
  const router = useRouter();
  const [view, setView] = useState<'auth' | 'forgot' | 'reset'>('auth');
  const [isLogin, setIsLogin] = useState(initialMode !== 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // États des champs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (view === 'auth') {
      if (isLogin) {
        // Simulation de connexion réussie -> Redirection vers le Dashboard
        // onSubmit peut toujours servir pour logger les data en console par exemple
        onSubmit?.({ email, password, mode: 'login' });
        router.push('/dashboard'); 
      } else {
        if (!agreedToTerms) return alert("Veuillez accepter les conditions d'utilisation.");
        setView('forgot'); 
      }
    } 
    else if (view === 'forgot') {
      if (!isLogin) router.push('/register'); 
      else setView('reset');
    }
    else if (view === 'reset') {
      onSubmit?.({ email, newPassword, mode: 'reset_password' });
      // Après un reset réussi, on peut aussi rediriger vers le login ou dashboard
      setIsLogin(true);
      setView('auth');
    }
  };

  // --- VUE 2 & 3 COMPACTÉES (Vérification & Reset) ---
  if (view === 'forgot' || view === 'reset') {
    return (
      <div className="w-full max-w-xl p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-primary leading-tight">
            {view === 'forgot' ? "Vérification" : "Nouveau mot de passe"}
          </h2>
          <p className="text-label text-sm font-medium">
            {view === 'forgot' 
              ? `Nous vous avons envoyé un code à ${email || "votre email"}. Veuillez l'insérer ci-dessous :`
              : "Définissez votre nouveau mot de passe sécurisé."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {view === 'forgot' ? (
            <div className="space-y-2">
              <div className="relative">
                <div className="input-icon-container input-icon-no-label"><Key size={18} /></div>
                <input 
                  type="text" 
                  placeholder="XXXXXXXX" 
                  className="input-auth text-center tracking-[0.5em] font-mono h-12 uppercase"
                  value={verificationCode}
                  maxLength={8}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="text-right">
                <button type="button" className="text-[11px] font-bold text-primary hover:underline transition-all">
                  Renvoyer le code
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1 uppercase">Nouveau mot de passe</label>
                <div className="input-icon-container"><Lock size={18} /></div>
                <input type="password" className="input-auth h-11 focus:bg-white" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1 uppercase">Confirmer</label>
                <div className="input-icon-container"><Lock size={18} /></div>
                <input type="password" className="input-auth h-11 focus:bg-white" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary w-full h-12 mt-2">
            {view === 'forgot' ? "Vérifier" : "Mettre à jour"}
          </button>
          
          <button type="button" onClick={() => setView('auth')} className="text-xs font-bold text-input-element/60 hover:text-primary hover:underline w-full text-center transition-colors">
            Retour
          </button>
        </form>
      </div>
    );
  }

  // --- VUE 1 : AUTHENTIFICATION PRINCIPALE ---
  return (
    <div className="w-full max-w-xl p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-primary leading-tight tracking-tight">AgriConnect</h2>
        <p className="text-label text-sm font-medium">
          {isLogin ? "Bon retour. Veuillez entrer vos identifiants de connexion." : "Bienvenue ! Veuillez fournir les informations demandées."}
        </p>
      </div>

      <div className="flex w-full border-b border-separator/20">
        <button type="button" onClick={() => setIsLogin(true)} className={`flex-1 pb-3 pt-2 text-base font-bold transition-all border-b-2 ${isLogin ? 'text-primary border-primary bg-light-bg/20' : 'text-input-element/40 border-transparent'}`}>Connexion</button>
        <button type="button" onClick={() => setIsLogin(false)} className={`flex-1 pb-3 pt-2 text-base font-bold transition-all border-b-2 ${!isLogin ? 'text-primary border-primary bg-light-bg/20' : 'text-input-element/40 border-transparent'}`}>Inscription</button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <label className="text-[11px] font-bold text-label block ml-1 mb-1 uppercase">Adresse email</label>
          <div className="input-icon-container"><Mail size={18} /></div>
          <input type="email" placeholder="nom@exemple.com" className="input-auth h-11 text-sm focus:bg-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="relative">
          <label className="text-[11px] font-bold text-label block ml-1 mb-1 uppercase">Mot de passe</label>
          <div className="input-icon-container"><Lock size={18} /></div>
          <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="input-auth h-11 text-sm focus:bg-white" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-password-toggle">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {!isLogin && (
          <>
            <div className="relative animate-in slide-in-from-top-1">
              <label className="text-[11px] font-bold text-label block ml-1 mb-1 uppercase">Confirmez le mot de passe</label>
              <div className="input-icon-container"><Lock size={18} /></div>
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="input-auth h-11 text-sm focus:bg-white" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <div className="flex items-start space-x-3 pt-1">
              <label className="flex items-center cursor-pointer group pt-0.5">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer hidden" checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)} />
                  <div className="w-5 h-5 border border-separator/40 rounded peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                  <Check size={12} className="absolute text-white scale-0 peer-checked:scale-100 transition-transform stroke-[3px]" />
                </div>
              </label>
              <span className="text-[11px] text-input-element leading-tight">
                J'accepte les <span className="text-primary font-bold hover:underline cursor-pointer">Conditions d'Utilisation</span> et la <span className="text-primary font-bold hover:underline cursor-pointer">Politique de Confidentialité</span>.
              </span>
            </div>
          </>
        )}

        {isLogin && (
          <div className="text-right">
            <button type="button" onClick={() => setView('forgot')} className="text-[11px] font-bold text-primary hover:underline">Mot de passe oublié ?</button>
          </div>
        )}

        <button type="submit" className="btn-primary w-full h-12 mt-2 text-sm shadow-lg shadow-primary/10 transition-transform active:scale-[0.98]">
          {isLogin ? "Se connecter" : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}