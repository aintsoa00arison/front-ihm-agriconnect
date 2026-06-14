// components/ad/AdSkeletons.tsx
"use client";

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-slate-200 rounded-lg w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><div className="h-4 bg-slate-200 rounded w-32"></div><div className="h-11 bg-slate-200 rounded-xl"></div></div>
          <div className="space-y-2"><div className="h-4 bg-slate-200 rounded w-32"></div><div className="h-11 bg-slate-200 rounded-xl"></div></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><div className="h-4 bg-slate-200 rounded w-24"></div><div className="h-11 bg-slate-200 rounded-xl"></div></div>
          <div className="space-y-2"><div className="h-4 bg-slate-200 rounded w-32"></div><div className="h-11 bg-slate-200 rounded-xl"></div></div>
        </div>
        <div className="space-y-2"><div className="h-4 bg-slate-200 rounded w-24"></div><div className="h-32 bg-slate-200 rounded-xl"></div></div>
        <div className="space-y-2"><div className="h-4 bg-slate-200 rounded w-36"></div><div className="h-32 bg-slate-200 rounded-2xl"></div></div>
      </div>
      <div className="flex items-center justify-center gap-4 pt-4">
        <div className="h-11 bg-slate-200 rounded-xl w-28"></div>
        <div className="h-11 bg-slate-200 rounded-xl w-40"></div>
      </div>
    </div>
  );
}

export function PreviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-amber-200 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-amber-200 rounded w-full"></div>
            <div className="h-3 bg-amber-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-separator/10 overflow-hidden shadow-md bg-white">
        <div className="p-3.5 bg-green-50/80 border-b border-green-100/60">
          <div className="h-3 bg-green-200 rounded w-32"></div>
        </div>
        <div className="w-full h-64 bg-slate-200"></div>
        <div className="p-5 space-y-3">
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="flex gap-3">
              <div className="h-3 bg-slate-200 rounded w-20"></div>
              <div className="h-3 bg-slate-200 rounded w-28"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-full"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}