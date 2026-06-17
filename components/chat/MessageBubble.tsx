"use client";

import Image from "next/image";
import { ChatMessage } from "@/app/services/chat/ChatContext";

type Props = {
  message: ChatMessage;
  showSender: boolean;
  isMe: boolean;
  senderName: string;
  senderPhoto?: string;
};

// Fonction pour formater une date ISO string (ex: "2024-09-12T09:12:00Z")
function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({
  message,
  showSender,
  isMe,
  senderName,
  senderPhoto,
}: Props) {
  if (isMe) {
    return (
      <div className="flex items-end gap-2 max-w-[75%] self-end flex-row-reverse">
        <div className="flex flex-col gap-1 items-end">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2.5">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <div className="flex items-center gap-1.5 mr-1">
            <span className="text-xs text-muted-foreground">
              {formatTime(message.created_at)}
            </span>
            {/* Si un jour on rajoute le statut de lecture côté Backend, on pourra le remettre ici */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 max-w-[75%]">
      {showSender ? (
        <img
          src={senderPhoto || "/images/default-avatar.jpg"}
          alt={senderName}
          className="rounded-full shrink-0 mb-5 object-cover size-8"
        />
      ) : (
        <div className="w-7.5 shrink-0" />
      )}
      <div className="flex flex-col gap-1">
        {showSender && (
          <span className="text-xs text-muted-foreground ml-1">
            {senderName}
          </span>
        )}
        <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground ml-1">
          {formatTime(message.created_at)}
        </span>
      </div>
    </div>
  );
}
