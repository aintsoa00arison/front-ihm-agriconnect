"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Store,
  MessageCircle,
  User,
  LogOut,
  Menu,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import LogoutModal from "./LogoutModal";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useUnreadCount } from "@/app/services/hooks/useUnreadCount";

interface SidebarCollecteurProps {
  userSlug: string;
  userName: string;
}

export default function MobileSidebarCollecteur({
  userSlug,
  userName,
}: SidebarCollecteurProps) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const totalUnread = useUnreadCount();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const navItems = [
    { label: "Catalogue", href: "/c", icon: Store, exact: true },
    {
      label: "Messages",
      href: "/c/messages",
      icon: MessageCircle,
      badgeCount: totalUnread,
    },
    {
      label: "Mon profil",
      href: `/c/profile/${userSlug}?tab=annonces`,
      icon: User,
    },
    {
      label: "Les Fournisseurs",
      href: `/c/annuaire`,
      icon: Star,
    },
  ];

  return (
    <>
      <Drawer
        direction="left"
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      >
        {/* Menu Hamburger */}
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="w-5 h-5" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </DrawerTrigger>

        <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-72 rounded-none flex flex-col border-border border-r">
          <DrawerHeader className="text-left border-b border-border pb-6 pt-4">
            <DrawerTitle className="sr-only">Menu de navigation</DrawerTitle>
            <DrawerDescription className="sr-only">
              Accédez à votre catalogue, messages et profil.
            </DrawerDescription>

            <Button
              onClick={() => {
                setIsDrawerOpen(false);
                window.location.href = "/c?action=new";
              }}
              className="w-full h-12 mt-4 shadow-sm font-bold gap-2 bg-[#0D631B] hover:bg-[#094713] text-white transition-all"
            >
              <Plus className="w-6 h-6" strokeWidth={2.5} />
              Nouvelle annonce
            </Button>
          </DrawerHeader>

          <div className="flex flex-col grow justify-between overflow-y-auto no-scrollbar">
            <div className="flex flex-col gap-1 py-4">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href.split("?")[0]);

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsDrawerOpen(false)} // Ferme le drawer lors de la navigation
                    className={cn(
                      "group flex items-center pl-6 pr-2 py-4 transition-all duration-200 relative",
                      isActive
                        ? "bg-light-bg text-[#0D631B]"
                        : "text-label hover:bg-neutral",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-7 h-7 mr-4",
                        isActive ? "text-[#0D631B]" : "text-input-element",
                      )}
                      strokeWidth={1.8}
                    />
                    <span
                      className={cn(
                        "font-bold grow",
                        isActive ? "text-[#0D631B]" : "text-label",
                      )}
                    >
                      {item.label}
                    </span>
                    {(item.badgeCount ?? 0) > 0 && (
                      <span className="mr-2 flex size-5 text-xs items-center justify-center rounded-full bg-red-500 font-bold text-white shadow-sm">
                        <p>{item.badgeCount}</p>
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 rounded-l-md bg-[#0D631B]" />
                    )}
                  </a>
                );
              })}
            </div>

            <div className="pb-6">
              <Button
                variant="ghost"
                onClick={() => {
                  // On ferme le menu avant d'ouvrir la modale
                  setIsDrawerOpen(false);
                  setShowLogoutModal(true);
                }}
                className="text-destructive font-semibold hover:text-destructive hover:bg-destructive/10 w-full flex items-center justify-start py-6 rounded-none px-4"
              >
                <LogOut className="mr-4 pl-2" size={18} />
                Se déconnecter
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
