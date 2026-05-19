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

  // Gestion des notifications de retour
  const [errorNotification, setErrorNotification] = useState<string | null>(
    null,
  );
  const [successNotification, setSuccessNotification] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // États des champs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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

  // Validations en temps réel (Vérification de la correspondance)
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
    setErrorNotification(null);
    setSuccessNotification(null);

    const cleanEmail = email.trim().toLowerCase();

    // --- VUE 1 : CONNEXION, INSCRIPTION OU DEMANDE DE CODE DE RÉCUPÉRATION ---
    if (view === "auth") {
      if (isForgotPasswordMode) {
        if (!validateEmail(cleanEmail)) {
          return setErrorNotification(analyzeEmailError(cleanEmail));
        }

        setIsLoading(true);
        try {
          const response = await sendVerificationEmail(cleanEmail);
          if (response.success) {
            setSuccessNotification(response.message);
            setView("forgot");
          } else {
            setErrorNotification(response.message);
          }
        } catch (error: any) {
          setErrorNotification(
            error.message || "Erreur lors de l'envoi du code.",
          );
        } finally {
          setIsLoading(false);
        }
      } else if (isLogin) {
        if (!validateEmail(cleanEmail)) {
          return setErrorNotification(analyzeEmailError(cleanEmail));
        }

        setIsLoading(true);
        try {
          const dataToSend: AuthFormData = { email: cleanEmail, password };
          const response = await mockLoginService(dataToSend);

          if (response.success && response.user) {
            setSuccessNotification(
              "Connexion réussie ! Vous êtes maintenant connecté.",
            );
            onSubmit?.({
              email: dataToSend.email,
              mode: "login",
              role: response.user.role,
            });

            setTimeout(() => {
              router.push("/dashboard");
            }, 1500);
          } else {
            setErrorNotification(
              response.message || "Une erreur est survenue.",
            );
            setIsLoading(false);
          }
        } catch (error: any) {
          setErrorNotification(
            error.message || "Impossible de joindre le serveur.",
          );
          setIsLoading(false);
        }
      } else {
        // --- CAS INSCRIPTION ---
        if (!agreedToTerms) {
          return setErrorNotification(
            "Veuillez accepter les conditions d'utilisation et la politique de confidentialité pour continuer.",
          );
        }
        if (!validateEmail(cleanEmail)) {
          return setErrorNotification(analyzeEmailError(cleanEmail));
        }
        if (password !== confirmPassword) {
          return setErrorNotification(
            "Les mots de passe ne correspondent pas.",
          );
        }

        setIsLoading(true);
        try {
          const emailCheck = await checkEmailAvailability(cleanEmail);

          if (!emailCheck.available) {
            setErrorNotification(emailCheck.message);
            setIsLoading(false);
            return;
          }

          const response = await sendVerificationEmail(cleanEmail);
          if (response.success) {
            setSuccessNotification(
              "Un code de vérification vous a été envoyé. Veuillez le saisir.",
            );

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
            setErrorNotification(response.message);
          }
        } catch (error: any) {
          setErrorNotification(
            error.message || "Erreur lors de l'envoi du mail de confirmation.",
          );
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
          setSuccessNotification("Code validé avec succès !");

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
              setSuccessNotification(null);
              setView("reset");
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
    else if (view === "reset") {
      if (newPassword !== confirmNewPassword)
        return setErrorNotification("Les mots de passe ne correspondent pas.");

      onSubmit?.({ email: cleanEmail, newPassword, mode: "reset_password" });
      setSuccessNotification("Votre mot de passe a bien été mis à jour.");

      setTimeout(() => {
        setIsLogin(true);
        setIsForgotPasswordMode(false);
        setView("auth");
        setSuccessNotification(null);
        setNewPassword("");
        setConfirmNewPassword("");
      }, 1500);
    }
  };

  const handleResendCode = async () => {
    setErrorNotification(null);
    setSuccessNotification(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!validateEmail(cleanEmail)) {
      return setErrorNotification(analyzeEmailError(cleanEmail));
    }

    try {
      const response = await sendVerificationEmail(cleanEmail);
      if (response.success)
        setSuccessNotification("Un nouveau code vous a été renvoyé.");
    } catch (error: any) {
      setErrorNotification(error.message || "Impossible de renvoyer le code.");
    }
  };

  // --- RENDU VUE 2 & 3 COMPACTÉES (Vérification & Reset) ---
  if (view === "forgot" || view === "reset") {
    return (
      <div className="w-full max-w-xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-primary leading-tight">
            {view === "forgot" ? "Vérification" : "Nouveau mot de passe"}
          </h2>
          <p className="text-label text-sm font-medium">
            {view === "forgot"
              ? `Nous vous avons envoyé un code à ${email.trim().toLowerCase()}. Veuillez l'insérer ci-dessous :`
              : "Définissez votre nouveau mot de passe sécurisé."}
          </p>
        </div>

        {errorNotification && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            <AlertTriangle
              size={18}
              className="flex-shrink-0 text-red-500 mt-0.5"
            />
            <p className="leading-relaxed">{errorNotification}</p>
          </div>
        )}

        {successNotification && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
            <CheckCircle2
              size={18}
              className="flex-shrink-0 text-green-500 mt-0.5"
            />
            <p className="leading-relaxed">{successNotification}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {view === "forgot" ? (
            <div className="space-y-2">
              <div className="relative">
                <div className="input-icon-no-label">
                  <Key size={18} />
                </div>
                <Input
                  type="text"
                  placeholder="XXXXXXXX"
                  className="input-auth text-center tracking-[0.5em] font-mono h-12 uppercase focus-visible:bg-white"
                  value={verificationCode}
                  maxLength={8}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.toUpperCase())
                  }
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="text-right">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendCode}
                  className="text-[11px] font-bold text-primary p-0 h-auto hover:underline transition-all"
                  disabled={isLoading}
                >
                  Renvoyer le code
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <Label className="text-[11px] font-bold text-label block ml-1 mb-1">
                  Nouveau mot de passe
                </Label>
                <div className="input-icon-container">
                  <Lock size={18} />
                </div>
                <Input
                  type="password"
                  className="input-auth h-11 focus-visible:bg-white"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="relative">
                <Label className="text-[11px] font-bold text-label block ml-1 mb-1">
                  Confirmez le mot de passe
                </Label>
                <div className="input-icon-container">
                  <Lock size={18} />
                </div>
                <Input
                  type="password"
                  className="input-auth h-11 focus-visible:bg-white"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {isResetPasswordMismatched && (
                  <p className="text-red-500 text-[10px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in duration-300">
                    <AlertTriangle size={12} /> Les mots de passe ne correspondent pas.
                  </p>
                )}
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={isLoading || isResetPasswordMismatched}
            className="btn-primary w-full h-12 mt-2"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : view === "forgot" ? (
              "Vérifier"
            ) : (
              "Mettre à jour"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setView("auth");
              setErrorNotification(null);
              setSuccessNotification(null);
            }}
            className="text-xs font-bold text-input-element/60 hover:text-primary hover:underline w-full text-center transition-colors h-10"
            disabled={isLoading}
          >
            Retour
          </Button>
        </form>
      </div>
    );
  }

  // --- RENDU VUE 1 : AUTHENTIFICATION PRINCIPALE ---
  return (
    <div className="w-full max-w-xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-primary leading-tight tracking-tight">
          Tsena
        </h2>
        <p className="text-label text-sm font-medium">
          {isForgotPasswordMode
            ? "Récupération de compte. Saisissez votre email pour recevoir un code."
            : isLogin
              ? "Bon retour. Veuillez entrer vos identifiants de connexion."
              : "Bienvenue ! Veuillez fournir les informations demandées."}
        </p>
      </div>

      {!isForgotPasswordMode && (
        <Tabs
          value={isLogin ? "login" : "register"}
          className="w-full"
          onValueChange={(val) => {
            setIsLogin(val === "login");
            setErrorNotification(null);
            setSuccessNotification(null);
          }}
        >
          <TabsList className="flex w-full bg-transparent border-b border-separator/20 h-auto p-0 rounded-none">
            <TabsTrigger
              value="login"
              className="flex-1 pb-3 pt-2 text-base font-bold transition-all border-b-2 rounded-none data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-light-bg/20 data-[state=inactive]:text-input-element/40 data-[state=inactive]:border-transparent bg-transparent"
            >
              Connexion
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="flex-1 pb-3 pt-2 text-base font-bold transition-all border-b-2 rounded-none data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-light-bg/20 data-[state=inactive]:text-input-element/40 data-[state=inactive]:border-transparent bg-transparent"
            >
              Inscription
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {errorNotification && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-in fade-in duration-300">
          <AlertTriangle
            size={18}
            className="flex-shrink-0 text-red-500 mt-0.5"
          />
          <p className="leading-relaxed">{errorNotification}</p>
        </div>
      )}

      {successNotification && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold animate-in fade-in duration-300">
          <CheckCircle2
            size={18}
            className="flex-shrink-0 text-green-500 mt-0.5"
          />
          <p className="leading-relaxed">{successNotification}</p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <Label className="text-[11px] font-bold text-label block ml-1 mb-1">
            Adresse email
          </Label>
          <div className="input-icon-container">
            <Mail size={18} />
          </div>
          <Input
            type="email"
            placeholder="nom@exemple.com"
            className="input-auth h-11 text-sm focus-visible:bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {!isForgotPasswordMode && (
          <div className="relative">
            <Label className="text-[11px] font-bold text-label block ml-1 mb-1">
              Mot de passe
            </Label>
            <div className="input-icon-container">
              <Lock size={18} />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="input-auth h-11 text-sm focus-visible:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
              className="input-password-toggle h-auto w-auto p-0 hover:bg-transparent"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
        )}

        {!isLogin && !isForgotPasswordMode && (
          <>
            <div className="relative animate-in fade-in duration-300">
              <Label className="text-[11px] font-bold text-label block ml-1 mb-1">
                Confirmez le mot de passe
              </Label>
              <div className="input-icon-container">
                <Lock size={18} />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input-auth h-11 text-sm focus-visible:bg-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              {isRegisterPasswordMismatched && (
                <p className="text-red-500 text-[10px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in duration-300">
                  <AlertTriangle size={12} /> Les mots de passe ne correspondent pas.
                </p>
              )}
            </div>

            <div className="flex items-start space-x-3 pt-1">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                disabled={isLoading}
                className="mt-0.5 border-separator/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor="terms"
                className="text-[11px] text-input-element font-medium leading-tight cursor-pointer select-none"
              >
                J'accepte les{" "}
                <span className="text-primary font-bold hover:underline">
                  Conditions d'Utilisation
                </span>{" "}
                et la{" "}
                <span className="text-primary font-bold hover:underline">
                  Politique de Confidentialité
                </span>
                .
              </Label>
            </div>
          </>
        )}

        {isLogin && !isForgotPasswordMode && (
          <div className="text-right">
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsForgotPasswordMode(true);
                setErrorNotification(null);
              }}
              className="text-[11px] font-bold text-primary p-0 h-auto hover:underline"
              disabled={isLoading}
            >
              Mot de passe oublié ?
            </Button>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || isRegisterPasswordMismatched}
          className="btn-primary w-full h-12 mt-2"
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
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsForgotPasswordMode(false);
              setErrorNotification(null);
              setSuccessNotification(null);
            }}
            className="text-xs font-bold text-input-element/60 hover:text-primary hover:underline w-full text-center transition-colors block pt-2 h-10"
            disabled={isLoading}
          >
            Annuler et retourner à la connexion
          </Button>
        )}
      </form>
    </div>
  );
}