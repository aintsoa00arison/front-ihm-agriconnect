"use client";
import AuthForm from "./_components/AuthForm";

export default function LoginPage() {
  const handleLogin = (data: any) => {
    console.log("Données de connexion :", data);
  };

  return (
    <AuthForm 
      mode="login" 
      onSubmit={handleLogin} 
    />
  );
}