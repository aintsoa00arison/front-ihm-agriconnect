// components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { validateEmail, analyzeEmailError } from "../../../utils/validation";
import { sendVerificationEmail } from "../services/authService";
import { checkEmailAvailability } from "../../register/services/registerService";
import { useRegisterStore } from "../../register/registerStore";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";

interface RegisterFormProps {
  onCodeSent: (email: string, password: string) => void;
  onSubmit?: (data: any) => void;
}

export default function RegisterForm({ onCodeSent, onSubmit }: RegisterFormProps) {
  const setRegisterDraft = useRegisterStore((state) => state.setRegisterDraft);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

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

    setIsLoading(true);
    try {
      const emailCheck = await checkEmailAvailability(cleanEmail);
      if (!emailCheck.available) {
        toast.error(emailCheck.message);
        setIsLoading(false);
        return;
      }
      const response = await sendVerificationEmail(cleanEmail);
      if (response.success) {
        toast.success("Un code de vérification vous a été envoyé.");
        setRegisterDraft({ email: cleanEmail, password });
        onSubmit?.({ email: cleanEmail, password, mode: "register_draft" });
        onCodeSent(cleanEmail, password);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi du mail.");
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