
import { Manrope } from 'next/font/google';
import "./globals.css";
import type { Metadata } from "next";

// Configuration de la police
const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope', 
});

// CONFIGURATION DU NOM DANS L'ONGLET
export const metadata: Metadata = {
  title: "AgriConnect", 
  description: "Plateforme premium pour le secteur agricole à Madagascar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      {/* On applique la variable de police ici pour qu'elle soit dispo partout */}
      <body className={`${manrope.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}