// components/auth/ResetPasswordForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import PasswordField from "./PasswordField";

interface ResetPasswordFormProps {
  email: string;
  onResetComplete: () => void;
  onSubmit?: (data: any) => void;
}

export default function ResetPasswordForm({ email, onResetComplete, onSubmit }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      onSubmit?.({ email, newPassword, mode: "reset_password" });
      toast.success("Votre mot de passe a bien été mis à jour.");
      setIsLoading(false);
      onResetComplete();
    }, 1500);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <PasswordField
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        label="Nouveau mot de passe"
        disabled={isLoading}
        required
      />
      <PasswordField
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        label="Confirmez le mot de passe"
        error={isMismatch ? "Les mots de passe ne correspondent pas." : undefined}
        disabled={isLoading}
        required
      />
      <Button
        type="submit"
        disabled={isLoading || isMismatch}
        className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
      >
        {isLoading ? "Mise à jour..." : "Mettre à jour"}
      </Button>
    </form>
  );
}