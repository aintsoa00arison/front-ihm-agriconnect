import { UserProfile } from "../types/profile";

/**
 * Récupère le profil complet d'un utilisateur par son ID ou son Slug
 */
export async function getUserProfile(slug: string): Promise<UserProfile> {
  // 1. Formatage du nom principal depuis le slug (ex: "brooklyn&simmons" -> "Brooklyn Simmons")
  const formattedName = decodeURIComponent(slug)
    .split("&")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // 2. Génération de l'avatar principal du profil
  const mainDicebearAvatar = `https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=${encodeURIComponent(formattedName)}`;

  // On simule une attente réseau de 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulation d'une réponse API Spring Boot complète
  return {
    id: "usr_0123456",
    name: formattedName,
    role: slug.includes("collecteur") || slug.includes("fitahiana") ? "collecteur" : "fournisseur",
    rating: 4.0,
    bio: "This is a sample of biography. This includes detailed account of a person's life, written by another person. It typically covers the individual's life history, achievements, experiences, and significant events. Biographies can be about anyone, from historical figures and celebrities to ordinary people who have made a notable impact in their field or community.",
    avatarUrl: mainDicebearAvatar,
    // bannerUrl reste absent pour laisser le Front-end appliquer son image par défaut
    
    representative: {
      firstName: formattedName.split(" ")[0] || "Brooklyn",
      lastName: formattedName.split(" ")[1] || "Simmons",
      email: `${(formattedName.split(" ")[0] || "brooklyn").toLowerCase()}.${(formattedName.split(" ")[1] || "simmons").toLowerCase()}@example.com`,
      phone: "+261 34 00 000 00",
    },
    company: {
      name: "Simmons Agri Group",
      email: "contact@simmonsagri.mg",
      phone: "+261 20 22 000 00",
    },
    productionTypes: ["Fournisseur", "Producteur Maraîcher", "Grossiste"],
    
    // 📊 Liste d'avis variée pour alimenter la progression des statistiques
    reviews: [
      {
        id: "rev_1",
        authorName: "Sarah Jenkins",
        rating: 5,
        comment: "Absolutely phenomenal quality. The heritage tomatoes arrived in perfect condition, deeply red and incredibly flavorful. Communication with the farm was prompt and professional. Highly recommend for any local restaurants looking for top-tier produce.",
        date: "October 12, 2023",
        authorAvatar: `https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=${encodeURIComponent("Sarah Jenkins")}`
      },
      {
        id: "rev_2",
        authorName: "Albert Flores",
        rating: 4,
        comment: "Absolutely phenomenal quality. The heritage tomatoes arrived in perfect condition, deeply red and incredibly flavorful. Communication with the farm was prompt and professional. Highly recommend for any local restaurants looking for top-tier produce.",
        date: "December 19, 2013",
        authorAvatar: `https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=${encodeURIComponent("Albert Flores")}`
      },
      {
        id: "rev_3",
        authorName: "Jean Dupont",
        rating: 4,
        comment: "Excellente réactivité globale et produits très frais. Livraison dans les temps pour la collecte.",
        date: "02/06/2026",
        authorAvatar: `https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=${encodeURIComponent("Jean Dupont")}`
      },
      {
        id: "rev_4",
        authorName: "Rindra Harison",
        rating: 3,
        comment: "Bonne qualité d'ensemble, mais un léger retard sur la livraison de la dernière cargaison. À renouveler tout de même.",
        date: "28/05/2026",
        authorAvatar: `https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=${encodeURIComponent("Rindra Harison")}`
      }
    ],
  };
}