import { Manrope, Geist } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// Configuration de la police
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

// CONFIGURATION DU NOM DANS L'ONGLET
export const metadata: Metadata = {
  title: "AgriConnect",
  description: "Plateforme premium pour le secteur agricole à Madagascar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      {/* On applique la variable de police ici pour qu'elle soit dispo partout */}
      <body
        className={`${manrope.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
