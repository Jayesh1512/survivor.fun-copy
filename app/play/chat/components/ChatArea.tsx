import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChatMessage } from '@/types/chat';

interface ChatAreaProps {
  messages: ChatMessage[];
}

export default function ChatArea({ messages }: ChatAreaProps) {
  const endRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-4 mt-2">
      {messages.map((m, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-3 ${m.role === "nft" ? "justify-start" : "justify-end"}`}
        >
          {m.role === "nft" && (
            <div className="w-10 h-10 rounded-full bg-purple-400 flex-shrink-0">
              <Image
                src="/assets/characters/two.webp"
                alt="Character"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          )}

          <div className={`max-w-[70%] ${m.role === "nft" ? "order-2" : "order-1"}`}>
            <div
              className={`px-4 py-3 rounded-2xl ${m.role === "nft"
                ? "bg-gray-700 text-white"
                : "bg-white text-black"
                }`}
            >
              {m.text}
            </div>
          </div>

          {m.role === "user" && (
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex-shrink-0 order-2">
              <div className="w-full h-full rounded-full bg-yellow-300 flex items-center justify-center text-black font-bold">
                A
              </div>
            </div>
          )}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
