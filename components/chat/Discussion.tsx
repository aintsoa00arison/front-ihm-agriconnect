import Image from "next/image";

type DiscussionProps = {
  name: string;
  lastMessage: string;
  lastMessageDate: Date;
  hasNewMessage: boolean;
};

// Fonction utilitaire pour connaître le temps écoulé depuis le dernier message
function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `${diffMins} mn`;
  if (diffHours < 24) return `${diffHours} h`;
  if (diffDays < 7) return `${diffDays} j`;
  return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
}

function Discussion({
  name,
  lastMessage,
  lastMessageDate,
  hasNewMessage,
}: DiscussionProps) {
  return (
    <div className="flex items-center gap-3 p-2 px-4 rounded-lg hover:bg-muted cursor-pointer">
      {/* Avatar */}
      <div className="shrink-0">
        <Image
          src="/images/default-avatar.jpg"
          alt={name}
          width={50}
          height={50}
          className="rounded-full"
        />
      </div>

      {/* Nom + dernier message */}
      <div className="min-w-0 flex-1">
        <h3
          className={`text-sm truncate ${hasNewMessage ? "font-black" : "font-semibold"}`}
        >
          {name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm truncate ${hasNewMessage ? "font-black" : "text-muted-foreground"}`}
          >
            {lastMessage}
          </p>
          <small className="text-xs text-muted-foreground shrink-0">
            {formatRelativeTime(lastMessageDate)}
          </small>
        </div>
      </div>

      {/* Indicateur nouveau message */}
      <span
        className={`rounded-full bg-primary size-2 ${hasNewMessage ? "block" : "hidden"}`}
      />
    </div>
  );
}

export default Discussion;
