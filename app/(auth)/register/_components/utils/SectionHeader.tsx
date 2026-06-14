// components/register/SectionHeader.tsx
"use client";

interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h3 className="text-[9px] sm:text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">
      {title}
    </h3>
  );
}