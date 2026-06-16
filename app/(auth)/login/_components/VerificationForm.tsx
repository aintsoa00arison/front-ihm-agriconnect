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
  userId: string;
  email: string;
  mode: "register" | "reset";
  onVerified: () => void;
}

export default function VerificationForm({
  userId,
  email,
  mode,
  onVerified,
}: VerificationFormProps) {
  const router = useRouter();
  const setRegisterDraft = useRegisterStore((state) => state.setRegisterDraft);
  const { verifyCode, sendVerificationEmail, isLoading } = useAuth();
  const [code, setCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const hasSentCode = useRef(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // 🔥 Envoyer le code UNE SEULE FOIS au montage
  useEffect(() => {
    // 🔥 Vérifier que tout est présent et que le code n'a pas déjà été envoyé
    if (email && userId && !hasSentCode.current) {
      hasSentCode.current = true;
      const sendCode = async () => {
        setIsSending(true);
        try {
          console.log("📧 [VerificationForm] Envoi du code à l'email:", email);
          console.log("📧 [VerificationForm] userId:", userId);
          
          const success = await sendVerificationEmail(email);
          
          if (success) {
            console.log("✅ [VerificationForm] Code envoyé avec succès");
            toast.success(`Code de vérification envoyé à ${email}`);
            startCountdown();
          } else {
            console.error("❌ [VerificationForm] Échec de l'envoi du code");
            toast.error("Erreur lors de l'envoi du code");
          }
        } catch (error) {
          console.error("❌ [VerificationForm] Erreur envoi code:", error);
          toast.error("Erreur lors de l'envoi du code");
        } finally {
          setIsSending(false);
        }
      };
      sendCode();
    } else {
      console.log("ℹ️ [VerificationForm] Conditions non remplies:", {
        email: !!email,
        userId: !!userId,
        hasSentCode: hasSentCode.current
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 🔥 Tableau de dépendances VIDE pour ne s'exécuter qu'une fois

  const startCountdown = () => {
    setCountdown(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast.error("Le code doit contenir 6 chiffres");
      return;
    }
    
    console.log("🔍 Vérification code - userId:", userId);
    console.log("🔍 Vérification code - code:", code);
    
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
    if (!canResend || countdown > 0) {
      toast.warning("Veuillez attendre avant de renvoyer un code");
      return;
    }
    
    setIsSending(true);
    try {
      console.log("📧 [VerificationForm] Renvoi du code à l'email:", email);
      const success = await sendVerificationEmail(email);
      if (success) {
        toast.success("Nouveau code envoyé !");
        startCountdown();
      } else {
        toast.error("Erreur lors de l'envoi du code");
      }
    } catch (error) {
      console.error("❌ Erreur renvoi code:", error);
      toast.error("Erreur lors de l'envoi du code");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-3 sm:px-4 py-4 sm:py-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-[16px] sm:rounded-[20px] shadow-sm border border-separator/10 p-4 sm:p-6 md:p-8">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-label">Vérification email</h2>
            <p className="text-sm text-muted-foreground">
              Un code de vérification a été envoyé à <strong>{email}</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Veuillez entrer le code à 6 chiffres reçu par email
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <VerificationCodeField
              value={code}
              onChange={setCode}
              disabled={isLoading}
              required
            />
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isSending || isLoading || !canResend}
                className="text-xs font-bold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Envoi en cours...
                  </span>
                ) : countdown > 0 ? (
                  `Renvoyer dans ${countdown}s`
                ) : (
                  "Renvoyer le code"
                )}
              </button>
              
              {countdown > 0 && (
                <span className="text-xs text-muted-foreground">
                  {countdown}s
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Vérifier et créer mon compte"}
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              Le code expire après 5 minutes
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}