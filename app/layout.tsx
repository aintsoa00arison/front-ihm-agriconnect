import { Manrope, Geist } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// Configuration de la police
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

// CONFIGURATION DU NOM DANS L'ONGLET
export const metadata: Metadata = {
  title: "Tsena",
  description: "Plateforme premium pour le secteur agricole à Madagascar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      <body
        className={`${manrope.variable} font-sans antialiased bg-background text-foreground min-h-screen w-full`}
      >
        {children}
        
        {/* Toaster sonner - disponible dans toute l'application */}
        <Toaster 
          position="bottom-right"
          richColors
          closeButton
          duration={6000}
          toastOptions={{
            style: {
              padding: "1rem",
              borderRadius: "1rem",
              fontSize: "0.75rem",
              fontWeight: "600",
            },
            classNames: {
              toast: "border shadow-xl",
              success: "bg-[#e8f5e9] border-[#2e7d32]/30 text-[#1b5e20]",
              error: "bg-red-50 border-red-200 text-red-900",
              info: "bg-amber-50 border-amber-200 text-amber-900",
              closeButton: "text-slate-400 hover:text-slate-600",
            },
          }}
        />
      </body>
    </html>
  );
}