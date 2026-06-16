// app/c/profile/[slug]/page.tsx
import { use } from "react";
import ProfileView from "@/components/profile/ProfileView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CollecteurProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  // 🔥 Passer le slug directement à ProfileView
  return <ProfileView slug={resolvedParams.slug} />;
}