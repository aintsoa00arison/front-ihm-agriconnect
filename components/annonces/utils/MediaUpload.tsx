// components/ad/MediaUpload.tsx
"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";

interface MediaUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function MediaUpload({ onFileSelect, disabled }: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-800">Média de l'annonce</label>
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      <div 
        onClick={disabled ? undefined : handleUploadClick}
        className={`border-2 border-dashed border-slate-200 hover:border-primary rounded-2xl p-8 text-center bg-slate-50/20 transition-colors group flex flex-col items-center justify-center space-y-3 ${!disabled && "cursor-pointer"}`}
      >
        <div className="p-3 bg-slate-100 rounded-full text-slate-400 group-hover:bg-green-50 group-hover:text-primary transition-colors">
          <Upload size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-700">
            Cliquez ici pour charger une photo ou glissez votre fichier ici
          </p>
          <p className="text-[10px] font-semibold text-slate-400 mt-1">
            PNG ou JPG jusqu'à 10Mo
          </p>
        </div>
      </div>
    </div>
  );
}