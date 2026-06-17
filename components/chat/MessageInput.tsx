"use client";
import { useState } from 'react';
import AutoResizeTextarea from './AutoResizeTextarea';
import Image from 'next/image';
import { useChat } from '@/app/services/chat/ChatContext';

function MessageInput() {
  const [content, setContent] = useState("");
  const { sendMessage, activeDiscussionId } = useChat();

  const handleSend = () => {
    if (content.trim()) {
      sendMessage(content);
      setContent(""); // On vide le champ une fois envoyé
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeDiscussionId) return null; // On cache si aucune discussion n'est ouverte

  return (
    <div className="p-4 bg-card min-w-0 flex items-end gap-3 border-t border-border">
      <AutoResizeTextarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        disabled={!content.trim()}
        className="size-10 flex items-center justify-center hover:bg-neutral-200/50 px-2 hover:cursor-pointer rounded-lg transition-colors duration-300 disabled:opacity-50"
        aria-label="Envoyer"
      >
        <Image src="/icons/envoyer.png" alt="Envoyer" width={24} height={24} />
      </button>
    </div>
  );
}

export default MessageInput;