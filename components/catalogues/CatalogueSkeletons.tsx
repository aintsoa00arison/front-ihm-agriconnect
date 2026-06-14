// app/catalogue/CatalogueSkeletons.tsx
"use client";

export function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-20 bg-neutral/95 backdrop-blur-sm pb-4 animate-pulse">
      <div className="h-8 bg-muted rounded w-48 mb-2"></div>
      <div className="h-4 bg-muted rounded w-96"></div>
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-3 animate-pulse">
      <div className="flex items-center gap-1.5 border-b border-border pb-1.5">
        <div className="h-3 bg-muted rounded w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-muted rounded w-12"></div>
        <div className="grid grid-cols-3 gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-1.5">
              <div className="size-3.5 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <div className="h-2 bg-muted rounded w-20"></div>
        <div className="h-8 bg-muted rounded-xl"></div>
      </div>
    </div>
  );
}

export function Top5Skeleton() {
  return (
    <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-2.5 animate-pulse">
      <div className="flex items-center justify-between border-b border-border pb-1.5">
        <div className="h-3 bg-muted rounded w-32"></div>
        <div className="h-3 bg-muted rounded w-16"></div>
      </div>
      <div className="divide-y divide-border">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-full bg-muted"></div>
              <div>
                <div className="h-3 bg-muted rounded w-20 mb-1"></div>
                <div className="h-2 bg-muted rounded w-24"></div>
              </div>
            </div>
            <div className="h-3 bg-muted rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-pulse">
      <div className="relative h-56 bg-muted"></div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="flex gap-4">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
            </div>
          </div>
          <div className="text-right">
            <div className="h-6 bg-muted rounded w-28 mb-2"></div>
            <div className="h-3 bg-muted rounded w-20"></div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-full bg-muted"></div>
            <div>
              <div className="h-3 bg-muted rounded w-24 mb-1"></div>
              <div className="h-2 bg-muted rounded w-16"></div>
            </div>
          </div>
          <div className="h-8 bg-muted rounded-xl w-20"></div>
        </div>
      </div>
    </div>
  );
}