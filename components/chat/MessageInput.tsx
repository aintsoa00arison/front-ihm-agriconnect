"use client";
import AutoResizeTextarea from './AutoResizeTextarea';
import Image from 'next/image';

function MessageInput() {
  return (
    <div className="p-4 bg-card min-w-0 flex items-end gap-3">
      <AutoResizeTextarea />
      <button
        className="size-10 flex items-center justify-center hover:bg-neutral-200/50 px-2 hover:cursor-pointer rounded-lg transition-colors duration-300"
        aria-label="Envoyer"
      >
        <Image src="/icons/envoyer.png" alt="Envoyer" width={24} height={24} />
      </button>
    </div>
  );
}

export default MessageInput