"use client";

import { useRouter } from 'next/navigation';
import { Bell, User, Settings, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const router = useRouter();

  // Données utilisateur
  const user = {
    name: "Jean Dupont",
    role: "Collecteur",
    avatar: "https://i.pravatar.cc/100?u=4"
  };

  return (
    <nav className="w-full bg-white border-b border-separator/10 sticky top-0 z-50 font-sans select-none">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
        
        {/* --- LOGO --- */}
        <div 
          onClick={() => router.push('/marketplace')}
          className="flex items-center cursor-pointer group"
        >
          <div className="text-primary font-bold text-2xl flex gap-1 items-center">
             <span className="tracking-tighter group-hover:text-label transition-colors">Agri</span>
             <span className="text-label tracking-tighter group-hover:text-primary transition-colors">Connect</span>
          </div>
        </div>

        {/* --- PARTIE DROITE --- */}
        <div className="flex items-center gap-6">
          
          {/* Icône Notification */}
          <button className="relative p-2.5 hover:bg-neutral rounded-full text-input-element/70 hover:text-primary transition-all outline-none cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 bg-red-500 w-2 h-2 rounded-full border border-white" />
          </button>

          {/* Séparateur */}
          <div className="h-6 w-[1px] bg-separator/20 hidden sm:block" />

          {/* DROPDOWN SHADCN */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-neutral rounded-xl transition-all outline-none data-[state=open]:bg-neutral">
              
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full border-2 border-primary/10 bg-gray-100 overflow-hidden flex-shrink-0">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Infos texte */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[14px] font-black text-label leading-tight">
                  {user.name}
                </span>
                <span className="text-[12px] font-bold text-primary">
                  {user.role}
                </span>
              </div>

              {/* Flèche pivotante gérée par l'état data-state de shadcn */}
              <ChevronDown 
                size={16} 
                className="text-input-element/60 transition-transform hidden sm:block [[data-state=open]_&]:rotate-180 [[data-state=open]_&]:text-primary" 
              />
            </DropdownMenuTrigger>

            {/* Contenu aligné à droite, utilise tes tokens de bordure et d'arrondi */}
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white border border-separator/10 rounded-xl p-1 shadow-xl z-50"
            >
              <DropdownMenuItem 
                onClick={() => router.push('/profile')}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-input-element/80 rounded-lg cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary outline-none"
              >
                <User size={16} />
                <span>Voir mon profil</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => router.push('/settings')}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-input-element/80 rounded-lg cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary outline-none"
              >
                <Settings size={16} />
                <span>Paramètres</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </nav>
  );
}