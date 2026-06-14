// components/auth/AuthTabs.tsx
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthTabsProps {
  isLogin: boolean;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export default function AuthTabs({ isLogin, onValueChange, disabled }: AuthTabsProps) {
  return (
    <Tabs
      value={isLogin ? "login" : "register"}
      className="w-full"
      onValueChange={onValueChange}
    >
      <TabsList className="inline-flex bg-transparent border-b border-separator/20 h-auto p-0 rounded-none">
        <TabsTrigger
          value="login"
          disabled={disabled}
          className="px-4 sm:px-6 pb-2 sm:pb-3 pt-1 sm:pt-2 text-sm sm:text-base font-bold transition-all border-b-2 rounded-none data-[state=active]:text-primary data-[state=active]:border-primary data-[state=inactive]:text-input-element/40 data-[state=inactive]:border-transparent bg-transparent"
        >
          Connexion
        </TabsTrigger>
        <TabsTrigger
          value="register"
          disabled={disabled}
          className="px-4 sm:px-6 pb-2 sm:pb-3 pt-1 sm:pt-2 text-sm sm:text-base font-bold transition-all border-b-2 rounded-none data-[state=active]:text-primary data-[state=active]:border-primary data-[state=inactive]:text-input-element/40 data-[state=inactive]:border-transparent bg-transparent"
        >
          Inscription
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}