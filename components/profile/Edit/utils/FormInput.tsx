// components/profile/utils/FormInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import { formatPhone, formatCin } from "../../../../app/utils/validation";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  type?: string;
  maxLength?: number;
  disabled?: boolean;
  numeric?: boolean;
  format?: "phone" | "cin" | "none";
}

export default function FormInput({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  icon,
  error,
  required,
  type = "text",
  maxLength,
  disabled,
  numeric = false,
  format = "none",
}: FormInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Filtrage numérique
    if (numeric) {
      newValue = newValue.replace(/\D/g, "");
    }
    
    // Formatage spécial
    if (format === "phone") {
      newValue = formatPhone(newValue);
    } else if (format === "cin") {
      newValue = formatCin(newValue);
    }
    
    onChange(newValue);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-foreground/80">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          className={`${icon ? "pl-11" : ""} bg-muted/30 border-border rounded-xl h-11 text-sm ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
          inputMode={numeric ? "numeric" : "text"}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}