import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Brain, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIThinking } from "@/components/AIThinking";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Analyze my dataset for insights",
  "How can I improve my model accuracy?",
  "Generate a performance summary",
  "Suggest optimizations for my AI system",
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content:
        "Hello! I'm your NeuroVision AI assistant 🤖. I can help you analyze data, generate insights, and optimize AI systems. What would you like to explore?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  // 🔥 REAL AI FUNCTION
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "⚠️ Error connecting to AI server",
        },
      ]);
    }

    setIsThinking(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col px-2">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
        <p className="text-muted-foreground mt-1 mb-4">
          Powered by NeuroVision AI
        </p>
      </motion.div>

      {/* CHAT AREA */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "assistant" && (
                <div className="p-2 rounded-xl gradient-primary h-fit">
                  <Brain className="h-4 w-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "gradient-primary text-white"
                    : "glass"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: msg.content.replace(/\n/g, "<br/>"),
                  }}
                />
              </div>

              {msg.role === "user" && (
                <div className="p-2 rounded-xl bg-muted h-fit">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && (
          <AIThinking label="Thinking with advanced AI..." />
        )}
      </div>

      {/* SUGGESTIONS */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-left text-sm p-3 glass rounded-lg hover:glow-primary transition flex items-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask NeuroVision anything..."
          className="flex-1 px-4 py-3 rounded-xl glass text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />

        <Button
          onClick={() => sendMessage(input)}
          className="rounded-xl gradient-primary px-4"
          disabled={!input.trim() || isThinking}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}