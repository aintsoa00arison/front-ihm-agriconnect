"use client";
import { useChat } from "@/app/services/chat/ChatContext";
import Discussion from "./Discussion";

function Discussions() {
  const { discussions } = useChat();

  return (
    <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pr-4">
      {discussions.map((discussion) => {
        // Formater le nom selon si c'est une entreprise ou un particulier
        const name = discussion.entreprise_legal_name
          ? discussion.entreprise_legal_name
          : `${discussion.interlocutor_first_name || ""} ${discussion.interlocutor_last_name || ""}`.trim() ||
            "Inconnu";

        return (
          <Discussion
            key={discussion.id}
            id={discussion.id}
            name={name}
            lastMessage={""} // Le backend ne l'envoie pas actuellement dans ton DTO
            lastMessageDate={new Date()} // Idem
            hasNewMessage={discussion.unread_count > 0}
            isOnline={false} // Pas géré dans le DTO actuel, tu pourras l'ajouter plus tard
          />
        );
      })}

      {discussions.length === 0 && (
        <p className="text-sm text-center text-muted-foreground mt-10">
          Aucune discussion.
        </p>
      )}
    </div>
  );
}

export default Discussions;
