"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../../services/hooks/useAuth";
import { useRegisterStore } from "../../../services/register/store/registerStore";
import VerificationCodeField from "./Fields/VerificationCodeField";

interface VerificationFormProps {
  userId: string;  // 🔥 userId au lieu d'email
  mode: "register" | "reset";
  onVerified: () => void;
}

export default function VerificationForm({
  userId,
  mode,
  onVerified,
}: VerificationFormProps) {
  const router = useRouter();
  const setRegisterDraft = useRegisterStore((state) => state.setRegisterDraft);
  const { verifyCode, sendVerificationEmail, isLoading } = useAuth();
  const [code, setCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const hasSentCode = useRef(false);

// components/auth/VerificationForm.tsx
useEffect(() => {
  if (userId && !hasSentCode.current) {
    hasSentCode.current = true;
    const sendCode = async () => {
      setIsSending(true);
      await sendVerificationEmail(userId); // 🔥 Utiliser userId
      setIsSending(false);
      toast.success("Code de vérification envoyé à votre email");
    };
    sendCode();
  }
}, [userId, sendVerificationEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast.error("Le code doit contenir 6 chiffres");
      return;
    }
    
    // 🔥 Vérifier avec userId et code
    const success = await verifyCode(userId, code);
    
    if (success) {
      toast.success("Email vérifié avec succès !");
      setTimeout(() => {
        if (mode === "register") {
          setRegisterDraft({ code });
          onVerified();
        } else {
          onVerified();
        }
      }, 1000);
    }
  };

  const handleResendCode = async () => {
    setIsSending(true);
    await sendVerificationEmail(userId);
    setIsSending(false);
    toast.success("Nouveau code envoyé !");
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-3 sm:px-4 py-4 sm:py-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-[16px] sm:rounded-[20px] shadow-sm border border-separator/10 p-4 sm:p-6 md:p-8">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-label">Vérification email</h2>
            <p className="text-sm text-muted-foreground">
              Un code de vérification a été envoyé à votre email
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <VerificationCodeField
              value={code}
              onChange={setCode}
              disabled={isLoading}
              required
            />
            
            <div className="text-right">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isSending || isLoading}
                className="text-xs font-bold text-primary hover:underline"
              >
                {isSending ? "Envoi en cours..." : "Renvoyer le code"}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Vérifier et créer mon compte"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}