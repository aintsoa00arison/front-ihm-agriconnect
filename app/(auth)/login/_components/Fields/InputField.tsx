// components/auth/InputField.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  id?: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function InputField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  rightIcon,
  error,
  disabled,
  required,
  className,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[10px] sm:text-[11px] font-bold">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${icon ? "pl-9" : ""} ${rightIcon ? "pr-10" : ""} h-10 sm:h-11 text-sm ${className || ""}`}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-[8px] sm:text-[10px] flex items-center gap-1 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}