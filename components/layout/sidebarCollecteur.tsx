"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Store, MessageCircle, User, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SidebarCollecteur() {
  const [pathname, setPathname] = useState<string>("/c");
  const [userSlug, setUserSlug] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Récupérer le nom de l'utilisateur depuis le localStorage
    const fetchUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.name) {
            const slug = user.name.toLowerCase().replace(/\s+/g, "-");
            setUserSlug(slug);
            return;
          }
        }
        // Valeur par défaut si pas d'utilisateur
        setUserSlug("brooklyn-simmons");
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        setUserSlug("brooklyn-simmons");
      }
    };
    
    fetchUser();
  }, [mounted]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const navItems = [
    { label: "Catalogue", href: "/c", icon: Store, exact: true },
    { label: "Messages", href: "/c/messages", icon: MessageCircle, badgeCount: 3 },
    { label: "Mon profil", href: `/c/profile/${userSlug || "brooklyn-simmons"}?tab=annonces`, icon: User },
  ];

  // Éviter l'erreur d'hydratation en ne rendant pas le contenu dynamique côté serveur
  if (!mounted) {
    return (
      <nav className="w-[292px] flex-shrink-0 bg-white border-r border-border shadow-sm flex flex-col pb-3 h-full overflow-y-auto">
        <div className="px-4 py-4 mb-6 border-b border-border">
          <div className="w-full h-12 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="flex flex-col grow justify-between">
          <div className="flex flex-col gap-1">
            {["Catalogue", "Messages", "Mon profil"].map((label, i) => (
              <div key={i} className="flex items-center pl-6 pr-2 py-4">
                <div className="w-7 h-7 mr-4 bg-slate-100 rounded-full animate-pulse" />
                <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-12 bg-slate-100 rounded-none animate-pulse" />
        </div>
      </nav>
    );
  }

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
              // Vérifier si le chemin correspond
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
            <LogOut className="mr-4" />
            Se déconnecter
          </Button>
        </div>
      </nav>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 text-center space-y-5 border border-slate-100">
            <div className="mx-auto size-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
              <LogOut size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Se déconnecter ?</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed px-4">
                Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowLogoutModal(false)} 
                className="flex-1 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleLogout} 
                className="flex-1 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}