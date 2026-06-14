// components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { validateEmail, analyzeEmailError } from "../../../utils/validation";
import { useAuth } from "../../../services/hooks/useAuth";
import { useRegisterStore } from "../../../services/register/store/registerStore";
import EmailField from "./Fields/EmailField";
import PasswordField from "./Fields/PasswordField";

interface RegisterFormProps {
  onCodeSent: (email: string, password: string) => void;
  onSubmit?: (data: any) => void;
}

export default function RegisterForm({ onCodeSent, onSubmit }: RegisterFormProps) {
  const setRegisterDraft = useRegisterStore((state) => state.setRegisterDraft);
  const { sendVerificationEmail, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Fonction pour vérifier la disponibilité de l'email
  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const response = await sendVerificationEmail(email);
      return response;
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Cet email est déjà utilisé.");
        return false;
      }
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!agreedToTerms) {
      toast.error("Veuillez accepter les conditions d'utilisation.");
      return;
    }
    if (!validateEmail(cleanEmail)) {
      toast.error(analyzeEmailError(cleanEmail));
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    const isEmailAvailable = await checkEmailAvailability(cleanEmail);
    if (!isEmailAvailable) return;

    const success = await sendVerificationEmail(cleanEmail);
    
    if (success) {
      setRegisterDraft({ email: cleanEmail, password });
      onSubmit?.({ email: cleanEmail, password, mode: "register_draft" });
      onCodeSent(cleanEmail, password);
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
      <PasswordField
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        label="Confirmez le mot de passe"
        error={isPasswordMismatch ? "Les mots de passe ne correspondent pas." : undefined}
        disabled={isLoading}
        required
      />
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
      <Button
        type="submit"
        disabled={isLoading || isPasswordMismatch}
        className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
      >
        {isLoading ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
}