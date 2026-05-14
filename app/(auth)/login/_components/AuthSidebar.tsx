// app/(auth)/login/_components/AuthSidebar.tsx
import Image from 'next/image';

export default function AuthSidebar() {
  return (
    <div className="relative w-full h-full flex flex-col justify-end p-10 lg:p-12 overflow-hidden">
      {/* 1. Image de fond avec overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/fields-bg.jpg" 
          alt="Background fields"
          fill
          priority 
          className="object-cover"
        />
        {/* Overlay primaire  */}
        <div className="absolute inset-0 bg-primary/90" />
      </div>

      {/* 2. Texte en bas à gauche */}
      <div className="relative z-10 space-y-2 max-w-xs animate-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
          Cultivez vos connexions
        </h1>
        <p className="text-white/70 text-sm leading-relaxed">
          Rejoignez un écosystème premium où fournisseurs et collecteurs interagissent avec simplicité et fiabilité.
        </p>
      </div>
    </div>
  );
}