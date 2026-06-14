// app/c/components/SidebarCollecteur.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Store, MessageCircle, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import LogoutModal from "./LogoutModal";

interface SidebarCollecteurProps {
  userSlug: string;
  userName: string;
}

export default function SidebarCollecteur({ userSlug, userName }: SidebarCollecteurProps) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const navItems = [
    { label: "Catalogue", href: "/c", icon: Store, exact: true },
    { label: "Messages", href: "/c/messages", icon: MessageCircle, badgeCount: 3 },
    { label: "Mon profil", href: `/c/profile/${userSlug}?tab=annonces`, icon: User },
  ];

  return (
    <>
      <nav className="w-[292px] flex-shrink-0 bg-white border-r border-border shadow-sm flex flex-col pb-3 h-full overflow-y-auto">
        <div className="px-4 py-4 mb-6 border-b border-border">
          <Button 
            onClick={() => window.location.href = "/c?action=new"}
            className="w-full h-12 shadow-sm font-bold gap-2 bg-[#0D631B] hover:bg-[#094713] text-white transition-all"
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
            Nouvelle annonce
          </Button>
        </div>

        <div className="flex flex-col grow justify-between">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href.split('?')[0]);
              
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center pl-6 pr-2 py-4 transition-all duration-200 relative",
                    isActive ? "bg-light-bg text-[#0D631B]" : "text-label hover:bg-neutral",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-7 h-7 mr-4",
                      isActive ? "text-[#0D631B]" : "text-input-element",
                    )}
                    strokeWidth={1.8}
                  />
                  <span className={cn("font-bold grow", isActive ? "text-[#0D631B]" : "text-label")}>
                    {item.label}
                  </span>
                  {item.badgeCount && item.badgeCount > 0 && (
                    <span className="mr-2 flex size-5 text-xs items-center justify-center rounded-full bg-red-500 font-bold text-white shadow-sm">
                      {item.badgeCount}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 rounded-l-md bg-[#0D631B]" />
                  )}
                </a>
              );
            })}
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowLogoutModal(true)}
            className="text-destructive font-semibold hover:text-destructive hover:bg-destructive/10 w-full flex items-center justify-start py-6 rounded-none px-4"
          >
            <LogOut className="mr-4" size={18} />
            Se déconnecter
          </Button>
        </div>
      </nav>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}