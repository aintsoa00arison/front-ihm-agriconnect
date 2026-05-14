// app/layout.tsx
import { Manrope } from 'next/font/google';
import "./globals.css";

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope', // On crée une variable CSS
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={manrope.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}