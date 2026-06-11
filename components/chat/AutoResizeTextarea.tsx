"use client";
import { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function AutoResizeTextarea({
  ...props
}: React.ComponentProps<typeof Textarea>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto"; 
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`; // 200px = max avant scroll
  };

  return (
    <Textarea
      ref={ref}
      onInput={handleInput}
      placeholder="Votre message..."
      className="border-border bg-neutral/30 resize-none min-h-10 max-h-30 overflow-y-auto w-full textAreaScrollBar"
      rows={1}
      {...props}
    />
  );
}
