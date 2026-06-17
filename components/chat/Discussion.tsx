"use client";
import Image from "next/image";
import { useChat } from "@/app/services/chat/ChatContext";

type DiscussionProps = {
  id: string;
  name: string;
  photo?: string;
  lastMessage: string;
  lastMessageDate: Date;
  hasNewMessage: boolean;
  isOnline: boolean;
};

// Fonction utilitaire pour connaître le temps écoulé depuis le dernier message
// function formatRelativeTime(date: Date): string {
//   const diffMs = Date.now() - date.getTime();
//   const diffMins = Math.floor(diffMs / (1000 * 60));
//   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//   if (diffMins < 1) return "À l'instant";
//   if (diffMins < 60) return `${diffMins} mn`;
//   if (diffHours < 24) return `${diffHours} h`;
//   if (diffDays < 7) return `${diffDays} j`;
//   return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
// }

function Discussion({
  id,
  name,
  lastMessage,
  lastMessageDate,
  photo,
  hasNewMessage,
  isOnline,
}: DiscussionProps) {
  const { selectDiscussion, activeDiscussionId } = useChat();
  const isActive = activeDiscussionId === id;

  return (
    <div
      onClick={() => selectDiscussion(id)}
      className={`flex items-center gap-3 p-2 px-4 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-neutral-100" : "hover:bg-muted"}`}
    >
      {/* Avatar */}
      <div className="shrink-0 relative">
        <img
          src={photo || "/images/default-avatar.jpg"}
          alt={name}
          className="rounded-full object-cover size-14"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full" />
        )}
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
