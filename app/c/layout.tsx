// app/c/layout.tsx
import { Suspense } from "react";
import { getUserData } from "@/components/layout/actions";
import LayoutContent from "./LayoutContent";

export default async function CLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getUserData();

  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <LayoutContent userSlug={userData.slug} userName={userData.name}>
        {children}
      </LayoutContent>
    </Suspense>
  );
}

// Skeleton pendant le chargement
function LayoutSkeleton() {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-neutral">
      <div className="flex-shrink-0 h-16 bg-card shadow-sm border-b border-border animate-pulse" />
      <div className="grow flex min-h-0 overflow-hidden">
        <div className="w-[292px] bg-white border-r border-border animate-pulse" />
        <div className="grow bg-gray-50 animate-pulse" />
      </div>
    </div>
  );
}