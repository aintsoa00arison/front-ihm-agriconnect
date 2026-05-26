"use client";
import { Button } from "@/components/ui/button";
import { Plus, Store, MessageCircle, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SidebarCollecteur() {
  const pathname = usePathname();

  // Lien de navigation
  const navItems = [
    {
      label: "Catalogue",
      href: "/c",
      icon: Store,
    },
    {
      label: "Messages",
      href: "/c/messages",
      icon: MessageCircle,
      badgeCount: 3,
    },
    {
      label: "Mon profil",
      href: "/c/:id",
      icon: User,
    },
  ];

  return (
    <nav className="w-73 bg-white border-r border-border shadow-sm flex flex-col pb-3">
      {/* Bouton Nouvelle Annonce */}
      <div className="px-4 py-4 mb-6 border-b border-border">
        <Button className="w-full h-12 shadow-sm font-bold gap-2">
          <Plus className="w-6 h-6" strokeWidth={2.5} />
          Nouvelle annonce
        </Button>
      </div>

      <div className="flex flex-col grow justify-between">
        {/* Liste de Navigation */}
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center pl-6 pr-2 py-4 transition-all duration-200 relative",
                  isActive
                    ? "bg-light-bg text-primary"
                    : "text-label hover:bg-neutral",
                )}
              >
                {/* Icône */}
                <item.icon
                  className={cn(
                    "w-7 h-7 mr-4",
                    isActive ? "text-primary" : "text-input-element",
                  )}
                  strokeWidth={1.8}
                />
                {/* Texte */}
                <span
                  className={cn(
                    "font-bold grow",
                    isActive ? "text-primary" : "text-label",
                  )}
                >
                  {item.label}
                </span>
                {/* Bulle de notification*/}
                {item.badgeCount && item.badgeCount > 0 && (
                  <span className="mr-2 flex size-5 text-xs items-center justify-center rounded-full bg-red-500 font-bold text-white shadow-sm">
                    <p>{item.badgeCount}</p>
                  </span>
                )}
                {/* Barre latérale droite active */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 rounded-l-md bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <Button
          variant="ghost"
          className="text-destructive font-semibold hover:text-destructive hover:bg-destructive/10 w-full flex items-center justify-start py-6 rounded-none px-4"
        >
          <LogOut />
          Se déconnecter
        </Button>
      </div>
    </nav>
  );
}
