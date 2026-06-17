"use client";

import { useState, useEffect, useRef } from "react";
import { NotificationMenu } from "@/components/layout/notificationMenu";
import SidebarCollecteur from "@/components/layout/sidebarCollecteur";
import MobileSidebarCollecteur from "@/components/layout/MobileSidebarCollecteur";
import Link from "next/link";
import { Search, ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { usePublications } from "../../app/services/hooks/usePublication";
import { getUserId } from "../../app/services/lib/auth";

interface LayoutContentProps {
  children: React.ReactNode;
  userSlug: string;
  userName: string;
}

export default function LayoutContent({
  children,
  userSlug,
  userName,
}: LayoutContentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  
  const userId = getUserId();
  const { filterPublications } = usePublications(userId || undefined);

  const isCataloguePage = pathname === "/c";
  const isProfilePage = pathname?.startsWith("/c/profile/") ?? false;
  const isAnnuairePage = pathname === "/c/annuaire";

  const tabParam = searchParams?.get("tab");
  const isProfileAdsTab = isProfilePage && tabParam === "annonces";
  const showSearchBar = isCataloguePage || isProfileAdsTab || isAnnuairePage;

  // 🔥 Gestion de la recherche avec appel API
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (typeof window !== "undefined") {
      // 🔥 Envoyer l'événement selon la page
      if (isCataloguePage) {
        window.dispatchEvent(
          new CustomEvent("catalogueSearch", { detail: value })
        );
      } else if (isAnnuairePage) {
        window.dispatchEvent(
          new CustomEvent("annuaireSearch", { detail: value })
        );
      } else if (isProfileAdsTab) {
        window.dispatchEvent(
          new CustomEvent("profileAdsSearch", { detail: value })
        );
      }
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
      mainElement.addEventListener("scroll", handleScroll);
      return () => mainElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPlaceholder = () => {
    if (isCataloguePage) return "Rechercher une annonce...";
    if (isAnnuairePage) return "Rechercher un membre...";
    if (isProfileAdsTab) return "Rechercher dans mes annonces...";
    return "Rechercher...";
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-neutral">
      <header className="shrink-0 flex flex-wrap md:flex-nowrap justify-between items-center px-4 py-3 min-h-16 bg-card shadow-sm border-b border-border z-10 gap-y-3 gap-x-4">
        <div className="flex items-center gap-3 order-1">
          <MobileSidebarCollecteur userSlug={userSlug} userName={userName} />
          <Link href="/">
            <h1 className="hover:text-primary text-label duration-300 transition-colors font-black text-3xl flex gap-1 items-center">
              Tsena
            </h1>
          </Link>
        </div>

        {/* <div className="flex items-center gap-3 order-2 md:order-3">
          <NotificationMenu />
        </div> */}

        {showSearchBar && (
          <div className="w-full md:w-auto md:flex-1 max-w-none md:max-w-md mx-0 md:mx-8 order-3 md:order-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                type="text"
                placeholder={getPlaceholder()}
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 bg-muted/30 border-border rounded-xl h-10 text-sm focus-visible:ring-primary w-full text-ellipsis"
              />
            </div>
          </div>
        )}
      </header>

      <div className="grow flex min-h-0 overflow-hidden">
        <div className="hidden lg:block h-full">
          <SidebarCollecteur userSlug={userSlug} userName={userName} />
        </div>
        <main ref={mainRef} className="grow overflow-y-auto h-full relative">
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