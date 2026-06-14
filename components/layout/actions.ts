// app/c/actions.ts
"use server";

import { cookies } from "next/headers";
import { cache } from "react";

export interface UserData {
  slug: string;
  name: string;
  isLoggedIn: boolean;
}

export const getUserData = cache(async (): Promise<UserData> => {
  try {
    // Next.js 15 - await est obligatoire
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    
    if (userCookie?.value) {
      try {
        const user = JSON.parse(userCookie.value);
        const slug = user.name?.toLowerCase().replace(/\s+/g, "-") || "brooklyn-simmons";
        return {
          slug,
          name: user.name || "Utilisateur",
          isLoggedIn: true,
        };
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        return {
          slug: "brooklyn-simmons",
          name: "Utilisateur",
          isLoggedIn: false,
        };
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'accès aux cookies:", error);
  }
  
  return {
    slug: "brooklyn-simmons",
    name: "Invité",
    isLoggedIn: false,
  };
});