// components/auth/ForgotPasswordForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { validateEmail, analyzeEmailError } from "../../../utils/validation";
import { sendVerificationEmail } from  "../services/authService";
import EmailField from "./EmailField";

interface ForgotPasswordFormProps {
  onCodeSent: (email: string) => void;
  onCancel: () => void;
}

export default function ForgotPasswordForm({ onCodeSent, onCancel }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
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
      const response = await sendVerificationEmail(cleanEmail);
      if (response.success) {
        toast.success(response.message);
        onCodeSent(cleanEmail);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi du code.");
    } finally {
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
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
      >
        {isLoading ? "Envoi en cours..." : "Envoyer le code"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        className="w-full text-xs font-bold text-gray-500 hover:text-primary"
        disabled={isLoading}
      >
        Annuler et retourner à la connexion
      </Button>
    </form>
  );
}