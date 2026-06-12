"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AuthForm from "./_components/AuthForm";

function LoginContent() {
  const searchParams = useSearchParams();
  
  // On récupère le mode ("register" ou "login")
  const mode = searchParams.get("mode") === "register" ? "register" : "login";

  const handleLogin = (data: any) => {
    console.log("Données reçues :", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg/10 px-4 sm:px-6 py-8 sm:py-12">
      {/* Container responsive avec gestion de la largeur */}
      <div className="w-full max-w-[480px] mx-auto">
        <AuthForm key={mode} mode={mode} onSubmit={handleLogin} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}