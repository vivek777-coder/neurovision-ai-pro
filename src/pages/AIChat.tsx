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
  "Analyze my latest dataset for anomalies",
  "What patterns do you see in user behavior?",
  "Generate a performance report summary",
  "Suggest optimizations for my ML pipeline",
];

const mockResponses: Record<string, string> = {
  default: "Based on my analysis, I've identified several key patterns in your data. The prediction accuracy has improved by 12.3% over the last week, with notable improvements in the computer vision module. I recommend:\n\n1. **Increase training data** for edge cases\n2. **Fine-tune hyperparameters** for the NLP model\n3. **Enable automated retraining** on a weekly schedule\n\nWould you like me to elaborate on any of these recommendations?",
  anomalies: "I've scanned your latest dataset and found **3 potential anomalies**:\n\n- **Record #4,521**: Unusual spike in prediction latency (2.3s vs 0.4s avg)\n- **Record #8,103**: Missing feature values in 12% of samples\n- **Record #12,890**: Outlier confidence score (0.12 vs 0.89 avg)\n\nRecommended action: Review data pipeline for records with missing features. The latency spike correlates with a memory pressure event at 14:32 UTC.",
  patterns: "Analyzing user behavior patterns reveals:\n\n📊 **Peak Usage**: 9-11 AM and 2-4 PM\n📈 **Growth Trend**: 23% increase in API calls this month\n🔄 **Session Duration**: Average 12.4 minutes (+18%)\n\nKey insight: Users who interact with the AI chat feature show **2.7x higher retention** compared to dashboard-only users.",
  report: "## Performance Report Summary\n\n| Metric | This Week | Last Week | Change |\n|--------|-----------|-----------|--------|\n| Predictions | 12,847 | 11,234 | +14.3% |\n| Accuracy | 97.2% | 95.1% | +2.1% |\n| Latency | 0.34s | 0.41s | -17% |\n| Uptime | 99.9% | 99.7% | +0.2% |\n\nOverall system health: **Excellent** ✅",
  optimizations: "Here are my top optimization suggestions:\n\n🚀 **Model Compression**: Apply quantization to reduce inference time by ~40%\n💾 **Caching Layer**: Implement Redis caching for repeated predictions\n⚡ **Batch Processing**: Group similar requests to reduce overhead\n🔧 **Feature Selection**: Remove 3 low-importance features to speed training\n\nEstimated improvement: **35% faster inference**, **20% lower costs**",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("anomal")) return mockResponses.anomalies;
  if (lower.includes("pattern") || lower.includes("behavior")) return mockResponses.patterns;
  if (lower.includes("report") || lower.includes("summary")) return mockResponses.report;
  if (lower.includes("optim") || lower.includes("pipeline")) return mockResponses.optimizations;
  return mockResponses.default;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", content: "Hello! I'm your NeuroVision AI assistant. I can help you analyze data, generate reports, and optimize your AI pipelines. What would you like to explore?" },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const response: Message = { id: Date.now() + 1, role: "assistant", content: getResponse(text) };
      setMessages((prev) => [...prev, response]);
      setIsThinking(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
        <p className="text-muted-foreground mt-1 mb-4">Powered by NeuroVision Intelligence</p>
      </motion.div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="shrink-0 p-2 rounded-xl gradient-primary h-fit">
                  <Brain className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "gradient-primary text-primary-foreground" : "glass"}`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="shrink-0 p-2 rounded-xl bg-muted h-fit">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isThinking && <AIThinking />}
      </div>

      {messages.length <= 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {suggestions.map((s) => (
            <button key={s} onClick={() => sendMessage(s)} className="text-left text-sm p-3 glass rounded-lg hover:glow-primary transition-all flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask NeuroVision anything..."
          className="flex-1 px-4 py-3 rounded-xl glass text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent"
        />
        <Button onClick={() => sendMessage(input)} className="rounded-xl gradient-primary px-4" disabled={!input.trim() || isThinking}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
