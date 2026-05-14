// app/(auth)/login/layout.tsx
import AuthSidebar from "./_components/AuthSidebar";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Moitié Gauche */}
      <div className="hidden lg:block w-1/2 h-full ">
        <AuthSidebar />
      </div>

      {/* Moitié Droite centrée sur fond Neutral */}
      <main className="w-full lg:w-1/2 h-full flex items-center justify-center bg-white p-8 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-[600px]">
          {children}
        </div>
      </main>
    </div>
  );
}