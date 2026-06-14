// app/c/LayoutContent.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { NotificationMenu } from "@/components/layout/notificationMenu";
import SidebarCollecteur from "@/components/layout/sidebarCollecteur";
import Link from "next/link";
import { Search, ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";

interface LayoutContentProps {
  children: React.ReactNode;
  userSlug: string;
  userName: string;
}

export default function LayoutContent({ children, userSlug, userName }: LayoutContentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  
  const isCataloguePage = pathname === "/c";
  const isProfilePage = pathname?.startsWith("/c/profile/") ?? false;
  
  const tabParam = searchParams?.get("tab");
  const isProfileAdsTab = isProfilePage && tabParam === "annonces";
  const showSearchBar = isCataloguePage || isProfileAdsTab;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("catalogueSearch", { detail: value }));
      window.dispatchEvent(new CustomEvent("profileAdsSearch", { detail: value }));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        setShowScrollButton(mainRef.current.scrollTop > 300);
      }
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      return () => mainElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-neutral">
      <header className="flex-shrink-0 flex justify-between items-center px-4 py-2 h-16 bg-card shadow-sm border-b border-border z-10">
        <Link href="/">
          <h1 className="hover:text-primary text-label duration-300 transition-colors font-bold text-2xl flex gap-1 items-center">
            Tsena
          </h1>
        </Link>
        
        {showSearchBar && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                type="text"
                placeholder="Rechercher une annonce, un produit, un collecteur..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 bg-muted/30 border-border rounded-xl h-10 text-sm focus-visible:ring-primary w-full"
              />
            </div>
          </div>
        )}
        
        {!showSearchBar && <div className="flex-1 max-w-md mx-8" />}
        
        <div className="flex items-center gap-3">
          <NotificationMenu />
        </div>
      </header>

      <div className="grow flex min-h-0 overflow-hidden">
        <SidebarCollecteur userSlug={userSlug} userName={userName} />
        <main ref={mainRef} className="grow overflow-y-auto h-full">
          {children}
        </main>
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 animate-in fade-in zoom-in cursor-pointer"
          aria-label="Remonter en haut"
        >
          <ArrowUp size={24} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}