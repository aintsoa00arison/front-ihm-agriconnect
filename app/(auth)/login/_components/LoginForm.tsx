// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { validateEmail, analyzeEmailError } from "../../../utils/validation";
import { useAuth } from "../../../services/hooks/useAuth";
import EmailField from "./Fields/EmailField";
import PasswordField from "./Fields/PasswordField";

interface LoginFormProps {
  onForgotPassword: () => void;
  onSubmit?: (data: any) => void;
}

export default function LoginForm({ onForgotPassword, onSubmit }: LoginFormProps) {
  const { login, isLoading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log("🔵 LoginForm rendu"); // Debug

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔵 handleSubmit appelé"); // Debug
    console.log("🔵 Email:", email, "Password:", password); // Debug
    
    const cleanEmail = email.trim().toLowerCase();

    if (!validateEmail(cleanEmail)) {
      toast.error(analyzeEmailError(cleanEmail));
      return;
    }

    console.log("🔵 Appel de login..."); // Debug
    const result = await login({ email: cleanEmail, password });
    console.log("🔵 Résultat du login:", result); // Debug
    
    if (result.success) {
      onSubmit?.({ 
        email: cleanEmail, 
        mode: "login", 
        role: result.role 
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <EmailField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
      />
      <PasswordField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        required
      />
      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-[10px] sm:text-[11px] font-bold text-primary hover:underline"
          disabled={isLoading}
        >
          Mot de passe oublié ?
        </button>
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
      >
        {isLoading ? "Connexion en cours..." : "Se connecter"}
      </Button>
    </form>
  );
}