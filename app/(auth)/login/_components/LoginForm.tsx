// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { validateEmail, analyzeEmailError } from "../../../utils/validation";
import { mockLoginService } from  "../services/authService";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";

interface LoginFormProps {
  onForgotPassword: () => void;
  onSubmit?: (data: any) => void;
}

export default function LoginForm({ onForgotPassword, onSubmit }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!validateEmail(cleanEmail)) {
      toast.error(analyzeEmailError(cleanEmail));
      return;
    }

    setIsLoading(true);
    try {
      const response = await mockLoginService({ email: cleanEmail, password });
      if (response.success && response.user) {
        toast.success("Connexion réussie ! Redirection en cours...");
        onSubmit?.({ email: cleanEmail, mode: "login", role: response.user.role });
        setTimeout(() => {
          if (response.user?.role === "collecteur") router.push("/c");
          else if (response.user?.role === "fournisseur") router.push("/f");
          else router.push("/");
        }, 1500);
      } else {
        toast.error(response.message || "Une erreur est survenue.");
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Impossible de joindre le serveur.");
      setIsLoading(false);
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