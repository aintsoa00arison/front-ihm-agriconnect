// app/f/loading.tsx
import { SidebarSkeleton, DashboardSkeleton } from "@/components/ui/custom-skeletons";

export default function FLoading() {
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarSkeleton />
      <main className="flex-1 p-6 overflow-auto">
        <DashboardSkeleton />
      </main>
    </div>
  );
}