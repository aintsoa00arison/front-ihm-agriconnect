"use client";
import { NotificationMenu } from "@/components/layout/notificationMenu";
import SidebarFournisseur from "@/components/layout/sidebarFournisseur";
import Link from "next/link";

function layout({ children }: { children: React.ReactNode }) {
  return (
    // 1. Hauteur d'écran fixe (h-screen) et overflow-hidden global pour bloquer le scroll de toute la page
    <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-50">
      
      {/* 2. Le Header fixe qui ne rétrécit jamais */}
      <header className="flex-shrink-0 flex justify-between px-4 py-2 h-16 bg-card items-center shadow-sm border-b border-border z-10">
        <Link href="/">
          <h1 className="hover:text-primary text-label duration-300 transition-colors font-bold text-2xl flex gap-1 items-center">
            Tsena
          </h1>
        </Link>
        <div className="flex items-center gap-3">
          <NotificationMenu />
        </div>
      </header>

      {/* 3. Zone du bas qui occupe l'espace restant sans dépasser (grow min-h-0 overflow-hidden) */}
      <div className="grow flex min-h-0 overflow-hidden">
        {/* La Sidebar figée à gauche */}
        <SidebarFournisseur />
        
        {/* 4. Le contenu principal : seul ce bloc a un scroll vertical autonome (overflow-y-auto h-full) */}
        <main className="grow py-4 px-6 overflow-y-auto h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
export default layout;
