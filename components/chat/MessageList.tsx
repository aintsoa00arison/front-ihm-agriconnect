import { mockMessages } from "@/data/message";
import MessageBubble from "./MessageBubble";

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MessageList() {
  return (
    <div className="p-4 overflow-y-auto min-h-0 flex flex-col gap-4">
      {mockMessages.map((group) => (
        <div key={group.date.toISOString()} className="flex flex-col gap-2">
          {/* Séparateur de date */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground px-2 shrink-0">
              {formatDate(group.date)}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Messages du groupe */}
          {group.messages.map((message, index) => {
            const isMe = message.senderId === "me";
            const prevMessage = group.messages[index - 1];
            // Affiche l'avatar/nom seulement au premier message d'un expéditeur consécutif
            const showSender =
              !isMe && prevMessage?.senderId !== message.senderId;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isMe={isMe}
                showSender={showSender}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
