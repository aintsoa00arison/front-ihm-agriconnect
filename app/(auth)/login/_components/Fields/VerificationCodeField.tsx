// components/auth/VerificationCodeField.tsx
"use client";

import { Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VerificationCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function VerificationCodeField({
  value,
  onChange,
  disabled,
  required,
}: VerificationCodeFieldProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="XXXXXXXX"
          className="pl-9 text-center tracking-[0.3em] sm:tracking-[0.5em] font-mono h-10 sm:h-12 text-sm sm:text-base uppercase"
          value={value}
          maxLength={8}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          disabled={disabled}
          required={required}
        />
      </div>
    </div>
  );
}