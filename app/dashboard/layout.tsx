// app/dashboard/layout.tsx
import Sidebar from "./_components/Sidebar";
import DashboardNavbar from "./_components/DashboardNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* 1. Navbar : Etalée sur toute la largeur (Top: 0) */}
      <header className="h-[61px] min-h-[61px] w-full border-b border-separator/10 bg-white z-30 flex-shrink-0">
        <DashboardNavbar />
      </header>

      {/* 2. Conteneur principal (Sous la Navbar) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar : À gauche, sous la Navbar */}
        <aside className="w-[292px] h-full border-r border-separator/10 bg-white hidden lg:block flex-shrink-0 overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Contenu : À droite de la Sidebar, défilement indépendant */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}