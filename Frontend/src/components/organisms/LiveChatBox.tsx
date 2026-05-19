import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
  isOwn?: boolean;
}

const mockMessages: ChatMessage[] = [
  { id: "1", user: "NDMA Official", text: "Flash flood warning for Swat Valley residents. Please evacuate to higher ground.", time: "2 min ago" },
  { id: "2", user: "Ahmed K.", text: "Water level rising near GT Road bridge, Jhelum. Everyone be careful!", time: "5 min ago" },
  { id: "3", user: "ResQ Bot", text: "3 new shelters opened in Peshawar. Check Shelter Finder for details.", time: "8 min ago" },
  { id: "4", user: "Fatima S.", text: "Road from Islamabad to Murree is clear. Traveled safely 30 mins ago.", time: "12 min ago" },
  { id: "5", user: "Ali R.", text: "Heavy rain expected in Lahore tonight. Stay prepared.", time: "15 min ago" },
];

const LiveChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), user: "You", text: input, time: "Just now", isOwn: true },
    ]);
    setInput("");
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-info text-info-foreground shadow-lg shadow-info/25 transition-transform hover:scale-105 active:scale-95"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-alert text-[10px] font-bold text-alert-foreground">
            {messages.length}
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safety opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-safety" />
              </span>
              <span className="text-sm font-semibold text-foreground">Live Community Chat</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setIsMinimized(!isMinimized)} className="rounded p-1 hover:bg-secondary">
                <MinusCircle className="h-4 w-4 text-muted-foreground" />
              </button>
              <button onClick={() => setIsOpen(false)} className="rounded p-1 hover:bg-secondary">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div ref={scrollRef} className="h-64 space-y-2 overflow-y-auto p-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.isOwn ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 ${msg.isOwn ? "bg-primary text-primary-foreground" : "bg-secondary/50"}`}>
                      {!msg.isOwn && <p className="mb-0.5 text-[10px] font-semibold text-primary">{msg.user}</p>}
                      <p className="text-xs">{msg.text}</p>
                    </div>
                    <span className="mt-0.5 text-[9px] text-muted-foreground">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-border p-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="rounded-xl text-xs"
                  />
                  <Button size="icon" onClick={sendMessage} className="shrink-0 rounded-xl">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChatBox;
