"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importation du router
import { Mail, Lock, Eye, EyeOff, Key } from 'lucide-react';

interface AuthFormProps {
  mode: string;
  onSubmit?: (data: any) => void;
}

export default function AuthForm({ mode: initialMode, onSubmit }: AuthFormProps) {
  const router = useRouter(); // Initialisation du router
  const [view, setView] = useState<'auth' | 'forgot' | 'reset'>('auth');
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);

  // États des champs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. ÉCRAN ACCUEIL (LOGIN / INSCRIPTION)
    if (view === 'auth') {
      if (!isLogin) {
        setView('forgot'); // Bascule vers vérification pour inscription
        return;
      }
      onSubmit?.({ email, password, mode: 'login' });
    } 
    
    // 2. ÉCRAN VÉRIFICATION CODE
    else if (view === 'forgot') {
      if (onSubmit) {
        onSubmit({ email, code: verificationCode, mode: 'verify' });
      }

      // LOGIQUE DE REDIRECTION
      if (!isLogin) {
        // Si on vient de l'inscription -> Direction page de profil (register)
        router.push('/register'); 
      } else {
        // Si on vient de "Mot de passe oublié" -> Direction reset
        setView('reset');
      }
    }

    // 3. ÉCRAN RÉINITIALISATION
    else if (view === 'reset') {
      onSubmit?.({ email, newPassword, mode: 'reset_password' });
    }
  };

  // --- VUE 2 : VÉRIFICATION DU CODE ---
  if (view === 'forgot') {
    return (
      <div className="w-full max-w-2xl p-8 md:p-10 ml-0 mr-auto space-y-10">
        <div className="space-y-3">
          <h2 className="text-[40px] font-bold text-primary leading-tight">Vérification</h2>
          <p className="text-label text-base font-medium leading-relaxed">
            Nous vous avons envoyé un code à l'adresse email <span className="font-bold">{email || "votre email"}</span>. 
            Veuillez l'insérer dans le champ ci-dessous :
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="input-icon-container input-icon-no-label">
              <Key size={20} />
            </div>
            <input 
              type="text" 
              placeholder="XXXXXXXX" 
              className="input-auth text-center tracking-[0.5em] font-mono focus:bg-white uppercase"
              value={verificationCode}
              maxLength={8}
              onChange={(e) => setVerificationCode(e.target.value.toUpperCase().slice(0, 8))}
              required
            />
            <div className="text-right mt-2">
              <button type="button" className="text-xs font-bold text-primary hover:underline">
                renvoyer le code
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-4">
            Vérifier
          </button>

          <div className="pt-6 border-t border-separator/30">
            <button 
              type="button" 
              onClick={() => setView('auth')}
              className="text-xs font-bold text-primary hover:underline w-full text-center"
            >
              {!isLogin ? "Modifier l'adresse email" : "Retour à la connexion"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- VUE 3 : RÉINITIALISATION (MDP OUBLIÉ UNIQUEMENT) ---
  if (view === 'reset') {
    return (
      <div className="w-full max-w-2xl p-8 md:p-10 ml-0 mr-auto space-y-10">
        <div className="space-y-3">
          <h2 className="text-[40px] font-bold text-primary leading-tight">Nouveau mot de passe</h2>
          <p className="text-label text-base font-medium">
            Définissez votre nouveau mot de passe sécurisé.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="text-sm font-bold text-label block ml-1 mb-2">Mot de passe</label>
            <div className="input-icon-container"><Lock size={20} /></div>
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-auth focus:bg-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-password-toggle">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <label className="text-sm font-bold text-label block ml-1 mb-2">Confirmer le mot de passe</label>
            <div className="input-icon-container"><Lock size={20} /></div>
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-auth focus:bg-white"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">Mettre à jour</button>
        </form>
      </div>
    );
  }

  // --- VUE 1 : AUTHENTIFICATION ---
  return (
    <div className="w-full max-w-2xl p-8 md:p-10 ml-0 mr-auto space-y-10">
      <div className="space-y-3">
        <h2 className="text-[40px] font-bold text-primary leading-tight">AgriConnect</h2>
        <p className="text-label text-base font-medium">
          {isLogin ? "Bon retour. Veuillez entrer vos identifiants." : "Bienvenue ! Veuillez fournir les informations demandées."}
        </p>
      </div>

      <div className="flex w-full border-b border-separator/30">
        <button type="button" onClick={() => setIsLogin(true)} className={`flex-1 pb-4 pt-4 text-lg font-bold transition-all border-b-4 rounded-t-[9px] ${isLogin ? 'text-primary border-primary bg-light-bg' : 'text-input-element/40 border-transparent'}`}>Connexion</button>
        <button type="button" onClick={() => setIsLogin(false)} className={`flex-1 pb-4 pt-4 text-lg font-bold transition-all border-b-4 rounded-t-[9px] ${!isLogin ? 'text-primary border-primary bg-light-bg' : 'text-input-element/40 border-transparent'}`}>Inscription</button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <label className="text-sm font-bold text-label block ml-1 mb-2">Adresse email</label>
          <div className="input-icon-container"><Mail size={20} /></div>
          <input type="email" placeholder="moi@exemple.com" className="input-auth focus:bg-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="relative">
          <label className="text-sm font-bold text-label block ml-1 mb-2">Mot de passe</label>
          <div className="input-icon-container"><Lock size={20} /></div>
          <input type={showPassword ? "text" : "password"} placeholder="••••••••••••" className="input-auth focus:bg-white" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-password-toggle">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
        </div>

        {!isLogin && (
          <div className="relative">
            <label className="text-sm font-bold text-label block ml-1 mb-2">Confirmez le mot de passe</label>
            <div className="input-icon-container"><Lock size={20} /></div>
            <input type={showPassword ? "text" : "password"} placeholder="••••••••••••" className="input-auth focus:bg-white" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
        )}

        {isLogin && (
          <div className="text-right">
            <button type="button" onClick={() => { setIsLogin(true); setView('forgot'); }} className="text-xs font-bold text-primary hover:underline whitespace-nowrap">Mot de passe oublié ?</button>
          </div>
        )}

        <button type="submit" className="btn-primary w-full mt-4">{isLogin ? "Se connecter" : "S'inscrire"}</button>
      </form>
    </div>
  );
}