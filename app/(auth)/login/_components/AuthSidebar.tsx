// app/(auth)/login/_components/AuthSidebar.tsx
import Image from 'next/image';

export default function AuthSidebar() {
  return (
    <div className="relative w-full h-full flex flex-col justify-end p-12 lg:p-20 overflow-hidden">
      {/* 1. Image de fond avec overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/fields-bg.jpg" 
          alt="Background fields"
          fill
          priority // Pour charger l'image plus vite
          className="object-cover"
        />
        {/* Overlay dégradé pour que le texte soit bien blanc et lisible sur le vert/terre */}
        <div className="absolute inset-0 bg-primary" />
      </div>

      {/* 2. Texte en bas (Positionné avec z-10 pour être au-dessus de l'image) */}
      <div className="relative z-10 space-y-4">
        <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">
          Cultivez vos  connexions
        </h1>
        <p className="text-white/80 text-lg max-w-sm leading-relaxed">
          Rejoignez un écosystème premium où fournisseur et collecteurs interagissent avec simplicité et fiabilité.
        </p>
      </div>
    </div>
  );
}