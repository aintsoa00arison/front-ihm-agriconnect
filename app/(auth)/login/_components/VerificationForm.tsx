// components/auth/VerificationForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { verifyCodeService, sendVerificationEmail } from "../services/authService";
import { useRegisterStore } from "../../register/registerStore";
import VerificationCodeField from "./VerificationCodeField";

interface VerificationFormProps {
  email: string;
  mode: "register" | "reset"; // Ajout de la propriété mode
  onVerified: () => void;
}

export default function VerificationForm({
  email,
  mode,
  onVerified,
}: VerificationFormProps) {
  const router = useRouter();
  const setRegisterDraft = useRegisterStore((state) => state.setRegisterDraft);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await verifyCodeService({ email, code });
      if (response.success) {
        toast.success("Code validé avec succès !");
        
        setTimeout(() => {
          if (mode === "register") {
            // Cas inscription : sauvegarde le code et redirige vers la suite
            setRegisterDraft({ code });
            router.push("/register");
          } else {
            // Cas reset password : passe à l'étape suivante
            onVerified();
          }
        }, 1500);
      } else {
        toast.error(response.message);
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue.");
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await sendVerificationEmail(email);
      if (response.success) toast.success("Un nouveau code vous a été renvoyé.");
    } catch (error: any) {
      toast.error(error.message || "Impossible de renvoyer le code.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <VerificationCodeField
        value={code}
        onChange={setCode}
        disabled={isLoading}
        required
      />
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
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
      >
        {isLoading ? "Vérification..." : "Vérifier"}
      </Button>
    </form>
  );
}