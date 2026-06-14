// components/register/utils/FormInput.tsx
"use client";

import { Input } from "@/components/ui/input";

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
  numeric?: boolean; // Nouvelle prop pour les champs numériques
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
}: FormInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    if (numeric) {
      // Ne garder que les chiffres
      newValue = newValue.replace(/\D/g, "");
    }
    
    onChange(newValue);
  };

  return (
    <div className="flex flex-col">
      <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-input-element/60 pointer-events-none">
            {icon}
          </div>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          className={`${icon ? "pl-9" : ""} h-10 sm:h-11 text-sm ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
          inputMode={numeric ? "numeric" : "text"}
          pattern={numeric ? "[0-9]*" : undefined}
        />
      </div>
      {error && (
        <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
          {error}
        </p>
      )}
    </div>
  );
}