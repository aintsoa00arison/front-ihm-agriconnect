import { Store, MessageSquare, Megaphone, Plus } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const menuItems = [
    { label: "Marketplace", icon: Store, href: "/marketplace" },
    { label: "Messages", icon: MessageSquare, href: "/messages" },
    { label: "Mes annonces", icon: Megaphone, href: "/annonces" },
  ];

  return (
    <div className="flex flex-col h-full p-6">
      {/* Bouton Nouvelle Annonce */}
      <button className="btn-primary w-full py-3 flex items-center justify-center gap-2 mb-8 shadow-sm">
        <Plus size={18} />
        <span className="text-sm font-bold">Nouvelle annonce</span>
      </button>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 text-label hover:bg-light-bg rounded-[9px] transition-colors group"
          >
            <item.icon size={22} className="text-input-element group-hover:text-primary" />
            <span className="font-bold text-[15px]">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}