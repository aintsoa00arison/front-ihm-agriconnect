import { Bell } from "lucide-react";
import Image from "next/image";

export default function DashboardNavbar() {
  return (
    <div className="h-full px-8 flex items-center justify-between">
      {/* Gauche : Nom de l'app ou Fil d'ariane */}
      <h2 className="text-lg font-bold text-label">AgriConnect</h2>

      {/* Droite : Actions utilisateur */}
      <div className="flex items-center gap-6">
        {/* Notification avec point rouge */}
        <button className="relative p-2 rounded-full bg-light-bg text-label hover:text-primary transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Avatar Profil */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-separator/30">
            <Image 
              src="/images/avatar-placeholder.jpg" 
              alt="Profil" 
              width={36} 
              height={36} 
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}