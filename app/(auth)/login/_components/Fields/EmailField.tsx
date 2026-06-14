// components/auth/EmailField.tsx
"use client";

import { Mail } from "lucide-react";
import InputField from "./InputField";

interface EmailFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function EmailField({
  value,
  onChange,
  error,
  disabled,
  required,
}: EmailFieldProps) {
  return (
    <InputField
      label="Adresse email"
      type="email"
      placeholder="nom@exemple.com"
      value={value}
      onChange={onChange}
      icon={<Mail size={18} />}
      error={error}
      disabled={disabled}
      required={required}
    />
  );
}