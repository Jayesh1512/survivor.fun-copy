import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface InputAreaProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  timeUp: boolean;
}

export default function InputArea({ onSend, isLoading, timeUp }: InputAreaProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3 text-white0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type your suggestion..."
          className="flex-1 bg-gray-700 text-white border-gray-600 rounded-xl px-4 py-3 h-[54px]"
          autoFocus
          disabled={timeUp}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || timeUp}
          className="p-0 m-0 h-full bg-transparent border-none inline-flex items-center justify-center"
        >
          <Image
            src="/assets/sendMessage.webp"
            alt="Sound"
            className="w-full h-full object-contain"
            width={48}
            height={48}
          />
        </Button>
      </div>
    </div>
  );
}
