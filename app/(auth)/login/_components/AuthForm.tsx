// components/auth/AuthForm.tsx
"use client";

import { useState, useEffect } from "react";
import AuthTabs from "./AuthTabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import VerificationForm from "./VerificationForm";
import ResetPasswordForm from "./ResetPasswordForm";

interface AuthFormProps {
  mode: string;
  onSubmit?: (data: any) => void;
}

type ViewState = "login" | "register" | "forgot" | "verify" | "reset";

export default function AuthForm({ mode: initialMode, onSubmit }: AuthFormProps) {
  const [view, setView] = useState<ViewState>("login");
  const [tempEmail, setTempEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [verifyMode, setVerifyMode] = useState<"register" | "reset">("register");

  useEffect(() => {
    setView(initialMode === "register" ? "register" : "login");
  }, [initialMode]);

  // Pour l'inscription : après envoi du code
  const handleRegisterCodeSent = (email: string, password: string) => {
    setTempEmail(email);
    setTempPassword(password);
    setVerifyMode("register");
    setView("verify");
  };

  // Pour le reset password : après envoi du code
  const handleResetCodeSent = (email: string) => {
    setTempEmail(email);
    setVerifyMode("reset");
    setView("verify");
  };

  const handleVerified = () => {
    if (verifyMode === "reset") {
      setView("reset");
    }
    // Pour register, on redirige directement dans VerificationForm
  };

  const handleResetComplete = () => {
    setView("login");
  };

  const getTitle = () => {
    switch (view) {
      case "login": return "Bon retour. Veuillez entrer vos identifiants de connexion.";
      case "register": return "Bienvenue ! Veuillez fournir les informations demandées.";
      case "forgot": return "Récupération de compte. Saisissez votre email pour recevoir un code.";
      case "verify": return "Vérification du code. Entrez le code envoyé à votre adresse email.";
      case "reset": return "Nouveau mot de passe";
      default: return "";
    }
  };

  const getHeaderTitle = () => {
    switch (view) {
      case "verify": return "Saisissez le code de vérification";
      case "reset": return "Nouveau mot de passe";
      default: return "Tsena";
    }
  };

  const showTabs = view === "login" || view === "register";

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg/10 px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-xl mx-auto space-y-5 sm:space-y-6">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary leading-tight tracking-tight">
            {getHeaderTitle()}
          </h2>
          <p className="text-sm sm:text-base text-label">{getTitle()}</p>
        </div>

        {showTabs && (
          <div className="flex justify-start">
            <AuthTabs
              isLogin={view === "login"}
              onValueChange={(val) => setView(val === "login" ? "login" : "register")}
            />
          </div>
        )}

        {view === "login" && (
          <LoginForm
            onForgotPassword={() => setView("forgot")}
            onSubmit={onSubmit}
          />
        )}

        {view === "register" && (
          <RegisterForm
            onCodeSent={handleRegisterCodeSent}
            onSubmit={onSubmit}
          />
        )}

        {view === "forgot" && (
          <ForgotPasswordForm
            onCodeSent={handleResetCodeSent}
            onCancel={() => setView("login")}
          />
        )}

        {view === "verify" && (
          <VerificationForm
            email={tempEmail}
            mode={verifyMode}
            onVerified={handleVerified}
          />
        )}

        {view === "reset" && (
          <ResetPasswordForm
            email={tempEmail}
            onResetComplete={handleResetComplete}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
}