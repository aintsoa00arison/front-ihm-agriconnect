import { use } from "react";
import ProfileView from "@/components/profile/ProfileView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CollecteurProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <ProfileView slug={resolvedParams.slug} />;
}