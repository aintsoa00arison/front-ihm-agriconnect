import { Message } from "@/data/message";
import Image from "next/image";

type Props = {
  message: Message;
  showSender: boolean;
  isMe: boolean;
};

const statusLabel: Record<NonNullable<Message["status"]>, string> = {
  envoyé: "Envoyé",
  distribué: "Distribué",
  lu: "Lu",
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message, showSender, isMe }: Props) {
  if (isMe) {
    return (
      <div className="flex items-end gap-2 max-w-[75%] self-end flex-row-reverse">
        <div className="flex flex-col gap-1 items-end">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2.5">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <div className="flex items-center gap-1.5 mr-1">
            <span className="text-xs text-muted-foreground">
              {formatTime(message.sentAt)}
            </span>
            {message.status && (
              <span className="text-xs text-primary font-medium">
                {statusLabel[message.status]}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 max-w-[75%]">
      {showSender ? (
        <Image
          src="/images/default-avatar.jpg"
          alt={message.senderName}
          width={30}
          height={30}
          className="rounded-full shrink-0 mb-5"
        />
      ) : (
        <div className="w-7.5 shrink-0" />
      )}
      <div className="flex flex-col gap-1">
        {showSender && (
          <span className="text-xs text-muted-foreground ml-1">
            {message.senderName}
          </span>
        )}
        <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground ml-1">
          {formatTime(message.sentAt)}
        </span>
      </div>
    </div>
  );
}
