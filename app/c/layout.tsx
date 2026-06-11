"use client";
import { NotificationMenu } from "@/components/layout/notificationMenu";
import SidebarCollecteur from "@/components/layout/sidebarCollecteur";
import Link from "next/link";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex flex-col">
      <header className="flex justify-between px-4 py-2 h-16 bg-card items-center shadow-sm border-b border-border">
        <Link href="/">
          <h1 className="hover:text-primary text-label duration-300 transition-colors font-bold text-2xl flex gap-1 items-center">
            Tsena
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          <NotificationMenu />
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <SidebarCollecteur />
        <main className="flex-1 py-4 px-6 min-h-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default layout;
