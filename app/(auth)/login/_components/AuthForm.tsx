"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Key,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
  Bell,
} from "lucide-react";
import { AuthFormData } from "../types/auth";
import {
  mockLoginService,
  sendVerificationEmail,
  verifyCodeService,
} from "../services/authService";
import { checkEmailAvailability } from "../../register/services/registerService";
import { useRegisterStore } from "../../register/registerStore";

// Importation des composants Shadcn UI
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Importation de la validation et de l'analyse précise des emails
import { validateEmail, analyzeEmailError } from "../../../utils/validation";

interface ToastState {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface AuthFormProps {
  mode: string;
  onSubmit?: (data: any) => void;
}

export default function AuthForm({
  mode: initialMode,
  onSubmit,
}: AuthFormProps) {
  const router = useRouter();

  // Récupération de la fonction de mise à jour du store Zustand
  const setRegisterDraft = useRegisterStore((state) => state.setRegisterDraft);

  // --- ÉTATS DU COMPOSANT ---
  const [view, setView] = useState<"auth" | "forgot" | "reset">("auth");
  const [isLogin, setIsLogin] = useState(initialMode !== "register");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // États des champs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Fonction pour afficher un toast
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  // --- SYNCHRONISATION AVEC LA PROP INITIALMODE ---
  useEffect(() => {
    if (initialMode === "register") {
      setIsLogin(false);
      setIsForgotPasswordMode(false);
      setView("auth");
    } else if (initialMode === "login") {
      setIsLogin(true);
      setIsForgotPasswordMode(false);
      setView("auth");
    }
  }, [initialMode]);

  // Validations en temps réel
  const isRegisterPasswordMismatched =
    !isLogin &&
    view === "auth" &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;
  const isResetPasswordMismatched =
    view === "reset" &&
    confirmNewPassword.length > 0 &&
    newPassword !== confirmNewPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    // --- VUE 1 : CONNEXION, INSCRIPTION OU DEMANDE DE CODE DE RÉCUPÉRATION ---
    if (view === "auth") {
      if (isForgotPasswordMode) {
        if (!validateEmail(cleanEmail)) {
          return showToast(analyzeEmailError(cleanEmail), "error");
        }

        setIsLoading(true);
        try {
          const response = await sendVerificationEmail(cleanEmail);
          if (response.success) {
            showToast(response.message, "success");
            setView("forgot");
          } else {
            showToast(response.message, "error");
          }
        } catch (error: any) {
          showToast(error.message || "Erreur lors de l'envoi du code.", "error");
        } finally {
          setIsLoading(false);
        }
      } else if (isLogin) {
        if (!validateEmail(cleanEmail)) {
          return showToast(analyzeEmailError(cleanEmail), "error");
        }

        setIsLoading(true);
        try {
          const dataToSend: AuthFormData = { email: cleanEmail, password };
          const response = await mockLoginService(dataToSend);

          if (response.success && response.user) {
            showToast("Connexion réussie ! Redirection en cours...", "success");
            
            onSubmit?.({
              email: dataToSend.email,
              mode: "login",
              role: response.user.role,
            });

            setTimeout(() => {
              if (response.user?.role === "collecteur") {
                router.push("/c");
              } else if (response.user?.role === "fournisseur") {
                router.push("/f");
              } else {
                router.push("/");
              }
            }, 1500);
          } else {
            showToast(response.message || "Une erreur est survenue.", "error");
            setIsLoading(false);
          }
        } catch (error: any) {
          showToast(error.message || "Impossible de joindre le serveur.", "error");
          setIsLoading(false);
        }
      } else {
        // --- CAS INSCRIPTION ---
        if (!agreedToTerms) {
          return showToast(
            "Veuillez accepter les conditions d'utilisation et la politique de confidentialité.",
            "error"
          );
        }
        if (!validateEmail(cleanEmail)) {
          return showToast(analyzeEmailError(cleanEmail), "error");
        }
        if (password !== confirmPassword) {
          return showToast("Les mots de passe ne correspondent pas.", "error");
        }

        setIsLoading(true);
        try {
          const emailCheck = await checkEmailAvailability(cleanEmail);

          if (!emailCheck.available) {
            showToast(emailCheck.message, "error");
            setIsLoading(false);
            return;
          }

          const response = await sendVerificationEmail(cleanEmail);
          if (response.success) {
            showToast("Un code de vérification vous a été envoyé.", "success");

            setRegisterDraft({
              email: cleanEmail,
              password: password,
            });

            onSubmit?.({
              email: cleanEmail,
              password: password,
              mode: "register_draft",
            });

            setView("forgot");
          } else {
            showToast(response.message, "error");
          }
        } catch (error: any) {
          showToast(error.message || "Erreur lors de l'envoi du mail.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    }

    // --- VUE 2 : VÉRIFICATION DU CODE ---
    else if (view === "forgot") {
      setIsLoading(true);
      try {
        const response = await verifyCodeService({
          email: cleanEmail,
          code: verificationCode,
        });

        if (response.success) {
          showToast("Code validé avec succès !", "success");

          setTimeout(() => {
            if (!isLogin) {
              setRegisterDraft({ code: verificationCode });

              onSubmit?.({
                email: cleanEmail,
                code: verificationCode,
                mode: "register_verified",
              });

              router.push("/register");
            } else {
              setIsLoading(false);
              setView("reset");
            }
          }, 1500);
        } else {
          showToast(response.message, "error");
          setIsLoading(false);
        }
      } catch (error: any) {
        showToast(error.message || "Une erreur est survenue.", "error");
        setIsLoading(false);
      }
    }

    // --- VUE 3 : RÉINITIALISATION DU MOT DE PASSE ---
    else if (view === "reset") {
      if (newPassword !== confirmNewPassword) {
        return showToast("Les mots de passe ne correspondent pas.", "error");
      }

      onSubmit?.({ email: cleanEmail, newPassword, mode: "reset_password" });
      showToast("Votre mot de passe a bien été mis à jour.", "success");

      setTimeout(() => {
        setIsLogin(true);
        setIsForgotPasswordMode(false);
        setView("auth");
        setNewPassword("");
        setConfirmNewPassword("");
      }, 1500);
    }
  };

  const handleResendCode = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!validateEmail(cleanEmail)) {
      return showToast(analyzeEmailError(cleanEmail), "error");
    }

    try {
      const response = await sendVerificationEmail(cleanEmail);
      if (response.success) {
        showToast("Un nouveau code vous a été renvoyé.", "success");
      }
    } catch (error: any) {
      showToast(error.message || "Impossible de renvoyer le code.", "error");
    }
  };

  // Composant Toast réutilisable et responsive
// Composant Toast réutilisable et responsive
const ToastContainer = () => (
  <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2 sm:gap-3 w-[calc(100%-2rem)] sm:w-auto max-w-[calc(100%-2rem)] sm:max-w-md">
    {toasts.map((t) => (
      <div 
        key={t.id} 
        className={`pointer-events-auto p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border flex items-start gap-2 sm:gap-3 animate-in slide-in-from-right-5 duration-300 ${
          t.type === "success" 
            ? "bg-[#e8f5e9] border-[#2e7d32]/30 text-[#1b5e20]" 
            : t.type === "error"
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
        }`}
      >
        <div className={`p-1 sm:p-1.5 rounded-lg flex-shrink-0 ${
          t.type === "success" 
            ? "bg-[#2e7d32]/10 text-[#2e7d32]" 
            : t.type === "error"
              ? "bg-red-100 text-red-600"
              : "bg-amber-100 text-amber-600"
        }`}>
          <Bell size={14} className="sm:size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] sm:text-xs font-bold leading-relaxed break-words">{t.message}</p>
        </div>
        <button 
          onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
          className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
        >
          <X size={12} className="sm:size-3" />
        </button>
      </div>
    ))}
  </div>
);
  // --- RENDU VUE 2 & 3 ---
  if (view === "forgot" || view === "reset") {
    return (
      <>
        <ToastContainer />
        <div className="min-h-screen flex items-center justify-center bg-light-bg/10 px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-xl mx-auto space-y-5 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
                {view === "forgot" ? "Vérification" : "Nouveau mot de passe"}
              </h2>
              <p className="text-xs sm:text-sm text-label font-medium break-words">
                {view === "forgot"
                  ? `Nous vous avons envoyé un code à ${email.trim().toLowerCase()}.`
                  : "Définissez votre nouveau mot de passe sécurisé."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {view === "forgot" ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="XXXXXXXX"
                      className="pl-9 text-center tracking-[0.3em] sm:tracking-[0.5em] font-mono h-10 sm:h-12"
                      value={verificationCode}
                      maxLength={8}
                      onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendCode}
                      className="text-[10px] sm:text-[11px] font-bold text-primary"
                      disabled={isLoading}
                    >
                      Renvoyer le code
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <Label className="text-[10px] sm:text-[11px] font-bold">
                      Nouveau mot de passe
                    </Label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="password"
                        className="pl-9 h-10 sm:h-11"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] sm:text-[11px] font-bold">
                      Confirmez le mot de passe
                    </Label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="password"
                        className="pl-9 h-10 sm:h-11"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    {isResetPasswordMismatched && (
                      <p className="text-red-500 text-[8px] sm:text-[10px] flex items-center gap-1 mt-1">
                        <AlertTriangle size={10} /> Les mots de passe ne correspondent pas.
                      </p>
                    )}
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isLoading || isResetPasswordMismatched}
                className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : view === "forgot" ? "Vérifier" : "Mettre à jour"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setView("auth")}
                className="w-full text-xs font-bold text-gray-500 hover:text-primary"
                disabled={isLoading}
              >
                Retour
              </Button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // --- RENDU VUE 1 : AUTHENTIFICATION PRINCIPALE ---
  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-light-bg/10 px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-xl mx-auto space-y-5 sm:space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary leading-tight tracking-tight">
              Tsena
            </h2>
            <p className="text-sm sm:text-base text-label">
              {isForgotPasswordMode
                ? "Récupération de compte. Saisissez votre email pour recevoir un code."
                : isLogin
                  ? "Bon retour. Veuillez entrer vos identifiants de connexion."
                  : "Bienvenue ! Veuillez fournir les informations demandées."}
            </p>
          </div>

          {!isForgotPasswordMode && (
            <div className="flex justify-start">
              <Tabs
                value={isLogin ? "login" : "register"}
                className="w-full"
                onValueChange={(val) => {
                  setIsLogin(val === "login");
                  setToasts([]);
                }}
              >
                <TabsList className="inline-flex bg-transparent border-b border-separator/20 h-auto p-0 rounded-none">
                  <TabsTrigger
                    value="login"
                    className="px-4 sm:px-6 pb-2 sm:pb-3 pt-1 sm:pt-2 text-sm sm:text-base font-bold transition-all border-b-2 rounded-none data-[state=active]:text-primary data-[state=active]:border-primary data-[state=inactive]:text-input-element/40 data-[state=inactive]:border-transparent bg-transparent"
                  >
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="px-4 sm:px-6 pb-2 sm:pb-3 pt-1 sm:pt-2 text-sm sm:text-base font-bold transition-all border-b-2 rounded-none data-[state=active]:text-primary data-[state=active]:border-primary data-[state=inactive]:text-input-element/40 data-[state=inactive]:border-transparent bg-transparent"
                  >
                    Inscription
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label className="text-[10px] sm:text-[11px] font-bold">
                Adresse email
              </Label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="nom@exemple.com"
                  className="pl-9 h-10 sm:h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {!isForgotPasswordMode && (
              <div className="space-y-1">
                <Label className="text-[10px] sm:text-[11px] font-bold">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 h-10 sm:h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && !isForgotPasswordMode && (
              <>
                <div className="space-y-1">
                  <Label className="text-[10px] sm:text-[11px] font-bold">
                    Confirmez le mot de passe
                  </Label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 h-10 sm:h-11"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {isRegisterPasswordMismatched && (
                    <p className="text-red-500 text-[8px] sm:text-[10px] flex items-center gap-1 mt-1">
                      <AlertTriangle size={10} /> Les mots de passe ne correspondent pas.
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-[10px] sm:text-[11px] text-gray-600 cursor-pointer">
                    J'accepte les{" "}
                    <span className="text-primary font-bold">Conditions d'Utilisation</span>{" "}
                    et la{" "}
                    <span className="text-primary font-bold">Politique de Confidentialité</span>
                  </Label>
                </div>
              </>
            )}

            {isLogin && !isForgotPasswordMode && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordMode(true)}
                  className="text-[10px] sm:text-[11px] font-bold text-primary hover:underline"
                  disabled={isLoading}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || isRegisterPasswordMismatched}
              className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
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
            </Button>

            {isForgotPasswordMode && (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordMode(false);
                  setToasts([]);
                }}
                className="w-full text-center text-xs text-gray-500 hover:text-primary transition-colors"
                disabled={isLoading}
              >
                Annuler et retourner à la connexion
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}