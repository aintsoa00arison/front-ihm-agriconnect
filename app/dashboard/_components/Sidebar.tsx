"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Store, 
  MessageSquare, 
  Plus, 
  HelpCircle, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();

  const mainMenuItems = [
    { label: "Marketplace", icon: Store, href: "/marketplace" },
    { label: "Messages", icon: MessageSquare, href: "/messages", hasBadge: true, count: 5 },
  ];

  const bottomMenuItems = [
    { label: "Aide & Support", icon: HelpCircle, href: "/aide" },
    { label: "Déconnexion", icon: LogOut, href: "/logout" },
  ];

  return (
    <div className="w-[280px] h-full min-h-full max-h-full bg-white border-r border-separator/10 flex flex-col justify-between p-5 font-sans select-none overflow-hidden">
      
      {/* --- BLOC DU HAUT : BOUTON SHADCN + NAVIGATION PRINCIPALE --- */}
      <div className="space-y-6 pt-10">
        <div className="w-full bg-white">
          {/* Remplacement par le bouton shadcn relié à ta variante primary */}
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white py-6 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm outline-none active:scale-[0.98] cursor-pointer"
          >
            <Plus size={18} />
            <span className="whitespace-nowrap">Nouvelle annonce</span>
          </Button>
        </div>

        <nav className="space-y-1">
          {mainMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group outline-none whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? "bg-primary/5 text-primary" 
                    : "text-input-element/60 hover:bg-neutral hover:text-primary"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon 
                    size={20} 
                    className={`transition-colors ${
                      isActive ? "text-primary" : "text-input-element/60 group-hover:text-primary"
                    }`} 
                  />
                  <span className={`text-[14px] transition-colors ${isActive ? "font-black" : "font-bold"}`}>
                    {item.label}
                  </span>
                </div>

                {item.hasBadge && item.count && (
                  <span className="bg-destructive text-white text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full tracking-tighter animate-in scale-in-50 duration-200">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* --- BLOC DU BAS : RACCORDÉ AU THÈME --- */}
      <div className="space-y-1 pb-8 mt-auto">
        {bottomMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all group outline-none whitespace-nowrap cursor-pointer ${
                isActive 
                  ? "bg-primary/5 text-primary" 
                  : "text-input-element/60 hover:bg-neutral hover:text-primary"
              }`}
            >
              <item.icon 
                size={20} 
                className={`transition-colors ${
                  isActive ? "text-primary" : "text-input-element/60 group-hover:text-primary"
                }`} 
              />
              <span className={`text-[14px] transition-colors ${isActive ? "font-black" : "font-bold"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}