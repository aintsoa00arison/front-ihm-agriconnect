type StarProps = {
  rating: number;
};

// Icône étoile
function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`w-5 h-5 shrink-0 ${className || ""}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
    </svg>
  );
}

function StarAffichage({ rating }: StarProps) {
  // Sécuriser la note entre 0 et 5
  const safeRating = Math.max(0, Math.min(5, rating));

  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => {
          // Calcul du pourcentage de remplissage *uniquement pour cette étoile*
          // Ex pour 3.5 : i=0 (100%), i=1 (100%), i=2 (100%), i=3 (50%), i=4 (0%)
          const fillPercentage = Math.max(0, Math.min(1, safeRating - i)) * 100;

          return (
            <div key={i} className="relative w-5 h-5">
              {/* 1. Étoile de fond (grise) */}
              <StarIcon className="text-gray-300" />{" "}
              {/* Remplace par text-fg-disabled si ta classe fonctionne */}
              {/* 2. Étoile de premier plan (jaune) rognée par le conteneur */}
              <div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                {/* max-w-none est CRUCIAL pour que l'SVG garde ses 20px (w-5) et soit coupé au lieu d'être compressé */}
                <StarIcon className="text-yellow-400 max-w-none" />{" "}
                {/* Remplace par text-fg-yellow */}
              </div>
            </div>
          );
        })}
      </div>

      <p className="ms-2 text-sm font-medium text-body">
        ({safeRating.toFixed(1)})
      </p>
    </div>
  );
}

export default StarAffichage;
