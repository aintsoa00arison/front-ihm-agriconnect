// app/f/profile/[slug]/page.tsx
import { use } from "react";
import ProfileView from "@/components/profile/ProfileView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function FournisseurProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <ProfileView slug={resolvedParams.slug} />;
}