// app/c/loading.tsx
import { SidebarSkeleton, DashboardSkeleton } from "@/components/ui/custom-skeletons";

export default function CLoading() {
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarSkeleton />
      <main className="flex-1 p-6 overflow-auto">
        <DashboardSkeleton />
      </main>
    </div>
  );
}