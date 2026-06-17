"use client";

import { useChat } from "@/app/services/chat/ChatContext";
import Discussions from "./Discussions";
import Header from "./Header";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import {  ArrowLeft } from "lucide-react";

export default function MessagesPage() {
  const { activeDiscussionId, closeDiscussion } = useChat();

  return (
    <div className="flex gap-5 h-full overflow-hidden p-4">
      {/* Sidebar discussions — cachée sur mobile si une discussion est ouverte */}
      <aside
        className={`
          rounded-lg bg-white shadow-sm p-4 px-2 pr-0 flex flex-col min-h-0 shrink-0
          w-full sm:w-sm
          ${activeDiscussionId ? "hidden sm:flex" : "flex"}
        `}
      >
        <div className="mb-4 shrink-0 px-4">
          <h2 className="text-3xl font-bold mb-4">Discussions</h2>
          {/* <InputGroup>
            <InputGroupInput placeholder="Rechercher..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup> */}
        </div>
        <Discussions />
      </aside>

      {/* Zone messages — cachée sur mobile si aucune discussion ouverte */}
      <main
        className={`
          flex-1 bg-white rounded-lg shadow-sm overflow-hidden grid grid-rows-[auto_1fr_auto] min-w-0
          ${activeDiscussionId ? "flex flex-col" : "hidden sm:grid"}
        `}
      >
        {/* Bouton retour mobile */}
        <div className="sm:hidden flex items-center gap-2 px-4 py-2 border-b border-border">
          <button
            onClick={closeDiscussion}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <Header />
        <MessageList />
        <MessageInput />
      </main>
    </div>
  );
}