import AuthSidebar from "./_components/AuthSidebar";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden select-none">
      {/* Moitié Gauche */}
      <div className="hidden lg:block w-1/2 h-full">
        <AuthSidebar />
      </div>

      {/* Moitié Droite centrée sur fond Neutral sans aucun scroll possible */}
      <main className="w-full lg:w-1/2 h-full flex items-center justify-center bg-white p-6 md:p-8 lg:p-12 overflow-hidden relative">
        <div className="w-full max-w-[600px] h-full flex items-center justify-center overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}