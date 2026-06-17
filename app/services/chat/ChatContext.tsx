"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "../hooks/useAuth";

export type DiscussionSummary = {
  id: string;
  unread_count: number;
  interlocutor_last_name?: string;
  interlocutor_first_name?: string;
  entreprise_legal_name?: string;
  last_message?: string;
  is_online?: boolean;
  interlocutor_photo?: string;
  interlocutor_id?: string;
};

export type ChatMessage = {
  id: string;
  discussion_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

interface ChatContextType {
  discussions: DiscussionSummary[];
  messages: ChatMessage[];
  activeDiscussionId: string | null;
  currentUserId: string | null;
  selectDiscussion: (id: string) => void;
  closeDiscussion: () => void;
  sendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<DiscussionSummary[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(
    null,
  );
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${user.id}`);
    ws.current = socket;

    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      const { event: eventName, data } = parsed;

      switch (eventName) {
        case "DISCUSSIONS_LIST":
        case "UPDATE_DISCUSSION_LIST":
          setDiscussions(data);
          const total = data.reduce(
            (sum: number, d: DiscussionSummary) => sum + d.unread_count,
            0,
          );
          localStorage.setItem("total_unread", String(total));
          window.dispatchEvent(new Event("unread_updated"));
          break;
        case "DISCUSSION_HISTORY":
          setMessages([...data].reverse());
          break;
        case "MESSAGE_SENT":
          setMessages((prev) => [...prev, data]);
          setDiscussions((prev) =>
            prev.map((d) =>
              d.id === data.discussion_id
                ? { ...d, last_message: data.content }
                : d,
            ),
          );
          break;
        case "NEW_MESSAGE":
          setMessages((prev) => {
            if (
              prev.length > 0 &&
              prev[0].discussion_id === data.discussion_id
            ) {
              return [...prev, data];
            }
            return prev;
          });
          break;
      }
    };

    return () => socket.close();
  }, [user?.id]);

  const selectDiscussion = (id: string) => {
    setActiveDiscussionId(id);
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ action: "ENTER_DISCUSSION", discussion_id: id }),
      );
    }
  };

  const closeDiscussion = () => {
    setActiveDiscussionId(null);
    setMessages([]);
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: "LEAVE_DISCUSSION" }));
    }
  };

  const sendMessage = (content: string) => {
    if (
      !activeDiscussionId ||
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN
    )
      return;
    ws.current.send(
      JSON.stringify({
        action: "SEND_MESSAGE",
        discussion_id: activeDiscussionId,
        content,
      }),
    );
  };

  return (
    <ChatContext.Provider
      value={{
        discussions,
        messages,
        activeDiscussionId,
        currentUserId: user?.id ?? null,
        selectDiscussion,
        closeDiscussion,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined)
    throw new Error("useChat must be used within a ChatProvider");
  return context;
};
