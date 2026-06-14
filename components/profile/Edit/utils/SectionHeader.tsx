// components/profile/utils/SectionHeader.tsx
"use client";

interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
}

export default function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="p-5 bg-muted/30 border-b border-border flex items-center gap-3">
      {icon && (
        <div className="p-2 bg-primary/10 text-primary rounded-xl">
          {icon}
        </div>
      )}
      <h2 className="text-base font-bold text-foreground">{title}</h2>
    </div>
  );
}