"use client";
import { useState, useEffect } from "react";
import { NotificationMenu } from "@/components/layout/notificationMenu";
import SidebarCollecteur from "@/components/layout/sidebarCollecteur";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

function layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const isCataloguePage = pathname === "/c";

  // Fonction pour gérer la recherche (à implémenter selon vos besoins)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Ici vous pouvez ajouter la logique de recherche
    // Par exemple, dispatcher un événement ou mettre à jour un contexte
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("catalogueSearch", { detail: value }));
    }
  };

  return (
    // 1. Hauteur d'écran fixe (h-screen) et overflow-hidden global pour bloquer le scroll de toute la page
    <div className="h-screen w-full flex flex-col overflow-hidden bg-neutral">
      
      {/* 2. Le Header fixe qui ne rétrécit jamais */}
      <header className="flex-shrink-0 flex justify-between items-center px-4 py-2 h-16 bg-card shadow-sm border-b border-border z-10">
        <Link href="/">
          <h1 className="hover:text-primary text-label duration-300 transition-colors font-bold text-2xl flex gap-1 items-center">
            Tsena
          </h1>
        </Link>
        
        {/* Barre de recherche - visible uniquement sur la page catalogue */}
        {isCataloguePage && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                type="text"
                placeholder="Rechercher "
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 bg-muted/30 border-border rounded-xl h-10 text-sm focus-visible:ring-primary w-full"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <NotificationMenu />
        </div>
      </header>

      {/* 3. Zone du bas qui occupe l'espace restant sans dépasser (grow min-h-0 overflow-hidden) */}
      <div className="grow flex min-h-0 overflow-hidden">
        {/* La Sidebar figée à gauche */}
        <SidebarCollecteur />
        
        {/* 4. Le contenu principal : seul ce bloc a un scroll vertical autonome (overflow-y-auto h-full) */}
        <main className="grow py-4 px-6 overflow-y-auto h-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default layout;