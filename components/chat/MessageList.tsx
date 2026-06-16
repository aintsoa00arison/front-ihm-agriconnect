"use client";
import { useChat } from "@/app/services/chat/ChatContext";
import { useAuth } from "@/app/services/hooks/useAuth";
import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from "react";

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MessageList() {
  // Ajout de discussions et activeDiscussionId pour retrouver le nom de l'interlocuteur
  const { messages, discussions, activeDiscussionId } = useChat();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Déduire le nom de la personne avec qui on parle
  const activeChat = discussions.find((d) => d.id === activeDiscussionId);
  const interlocutorName =
    activeChat?.entreprise_legal_name ||
    `${activeChat?.interlocutor_first_name || ""} ${activeChat?.interlocutor_last_name || ""}`.trim() ||
    "Interlocuteur";

  // Auto-scroll vers le bas quand un nouveau message arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Grouper les messages par date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      // created_at est une string venant du JSON backend
      const dateStr = new Date(message.created_at).toDateString();
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(message);
      return groups;
    },
    {} as Record<string, typeof messages>,
  );

  if (!user?.id) return null;

  return (
    <div
      ref={scrollRef}
      className="p-4 overflow-y-auto min-h-0 flex flex-col gap-4"
    >
      {Object.entries(groupedMessages).map(([dateStr, dayMessages]) => (
        <div key={dateStr} className="flex flex-col gap-2">
          {/* Séparateur de date */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground px-2 shrink-0">
              {formatDate(new Date(dateStr))}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Messages du groupe */}
          {dayMessages.map((message, index) => {
            const isMe = message.sender_id === user.id;
            const prevMessage = dayMessages[index - 1];
            // On vérifie si c'est le même expéditeur pour afficher ou cacher la photo de profil
            const showSender =
              !isMe && prevMessage?.sender_id !== message.sender_id;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isMe={isMe}
                showSender={showSender}
                senderName={isMe ? "Moi" : interlocutorName}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
