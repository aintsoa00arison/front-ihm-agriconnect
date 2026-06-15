// components/auth/ForgotPasswordForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { validateEmail, analyzeEmailError } from "../../../utils/validation";
import { useAuth } from "../../../services/hooks/useAuth";
import EmailField from "./Fields/EmailField";

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

export default function ForgotPasswordForm({ onCancel }: ForgotPasswordFormProps) {
  const { sendVerificationEmail, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const { verifyCode } = useAuth();

  const handleSendCode = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!validateEmail(cleanEmail)) {
      toast.error(analyzeEmailError(cleanEmail));
      return;
    }

    const success = await sendVerificationEmail(cleanEmail);
    if (success) {
      setCodeSent(true);
      toast.success("Code de vérification envoyé à votre email.");
    }
  };

  const handleVerifyCode = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const success = await verifyCode(cleanEmail, verificationCode);
    
    if (success) {
      toast.success("Code validé ! Redirection vers la réinitialisation...");
      // Rediriger vers le formulaire de réinitialisation
      setTimeout(() => {
        window.location.href = `/reset-password?email=${encodeURIComponent(cleanEmail)}`;
      }, 1500);
    }
  };

  if (codeSent) {
    return (
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleVerifyCode(); }}>
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/80">
            Code de vérification
          </label>
          <input
            type="text"
            placeholder="XXXXXX"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full bg-muted/30 border-border rounded-xl h-11 px-4 text-center text-lg tracking-widest font-mono"
            maxLength={6}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || verificationCode.length !== 6}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
        >
          {isLoading ? "Vérification..." : "Vérifier le code"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleSendCode}
          className="w-full text-xs font-bold text-gray-500 hover:text-primary"
          disabled={isLoading}
        >
          Renvoyer le code
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCodeSent(false)}
          className="w-full text-xs font-bold text-gray-500 hover:text-primary"
        >
          Retour
        </Button>
      </form>
    );
  }

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSendCode(); }}>
      <EmailField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
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