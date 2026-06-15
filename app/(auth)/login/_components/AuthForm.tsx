"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthTabs from "./AuthTabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

interface AuthFormProps {
  mode: string;
  onSubmit?: (data: any) => void;
}

type ViewState = "login" | "register" | "forgot" | "reset";

export default function AuthForm({ mode: initialMode, onSubmit }: AuthFormProps) {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("login");

  useEffect(() => {
    setView(initialMode === "register" ? "register" : "login");
  }, [initialMode]);

  const getTitle = () => {
    switch (view) {
      case "login": return "Bon retour. Veuillez entrer vos identifiants de connexion.";
      case "register": return "Bienvenue ! Créez votre compte.";
      case "forgot": return "Récupération de compte. Saisissez votre email pour recevoir un code.";
      case "reset": return "Nouveau mot de passe";
      default: return "";
    }
  };

  const getHeaderTitle = () => {
    switch (view) {
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
            onSubmit={onSubmit}
          />
        )}

        {view === "forgot" && (
          <ForgotPasswordForm
            onCancel={() => setView("login")}
          />
        )}

        {view === "reset" && (
          <ResetPasswordForm
            email=""
            onResetComplete={() => setView("login")}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
}