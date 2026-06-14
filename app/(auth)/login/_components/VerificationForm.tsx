// components/auth/VerificationForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../services/hooks/useAuth";
import { useRegisterStore } from "../../../services/register/store/registerStore";
import VerificationCodeField from "./Fields/VerificationCodeField";

interface VerificationFormProps {
  email: string;
  mode: "register" | "reset";
  onVerified: () => void;
}

export default function VerificationForm({
  email,
  mode,
  onVerified,
}: VerificationFormProps) {
  const router = useRouter();
  const setRegisterDraft = useRegisterStore((state) => state.setRegisterDraft);
  const { verifyCode, sendVerificationEmail, isLoading } = useAuth();
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await verifyCode(email, code);
    
    if (success) {
      setTimeout(() => {
        if (mode === "register") {
          setRegisterDraft({ code });
          router.push("/register");
        } else {
          onVerified();
        }
      }, 1500);
    }
  };

  const handleResendCode = async () => {
    await sendVerificationEmail(email);
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