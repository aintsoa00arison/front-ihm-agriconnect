// app/catalogue/components/AnnuaireSkeletons.tsx
"use client";

export function AnnuaireCardSkeleton() {
  return (
    <div className="bg-card p-5 rounded-2xl border border-border shadow-sm animate-pulse">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="flex gap-3">
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full"></div>
          <div className="h-3 bg-muted rounded w-5/6"></div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3 mt-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="size-3 bg-muted rounded"></div>
          ))}
        </div>
        <div className="h-8 bg-muted rounded-xl w-32"></div>
      </div>
    </div>
  );
}