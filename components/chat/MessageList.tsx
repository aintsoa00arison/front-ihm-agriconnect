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
  const { messages, discussions, activeDiscussionId, currentUserId } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeChat = discussions.find((d) => d.id === activeDiscussionId);
  const interlocutorName =
    activeChat?.entreprise_legal_name ||
    `${activeChat?.interlocutor_first_name || ""} ${activeChat?.interlocutor_last_name || ""}`.trim() ||
    "Interlocuteur";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const groupedMessages = messages.reduce(
    (groups, message) => {
      const dateStr = new Date(message.created_at).toDateString();
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(message);
      return groups;
    },
    {} as Record<string, typeof messages>,
  );

  // Plus de early return sur user.id — on utilise "" comme fallback
  const myId = currentUserId ?? "";

  return (
    <div
      ref={scrollRef}
      className="p-4 overflow-y-auto min-h-0 flex flex-col gap-4"
    >
      {Object.entries(groupedMessages).map(([dateStr, dayMessages]) => (
        <div key={dateStr} className="flex flex-col gap-2">
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground px-2 shrink-0">
              {formatDate(new Date(dateStr))}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          {dayMessages.map((message, index) => {
            const isMe = myId !== "" && message.sender_id === myId;
            const prevMessage = dayMessages[index - 1];
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
