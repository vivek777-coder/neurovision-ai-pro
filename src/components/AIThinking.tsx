import { Brain } from "lucide-react";
import { motion } from "framer-motion";

export function AIThinking({ label = "AI is thinking..." }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-4 glass rounded-xl"
    >
      <Brain className="h-5 w-5 text-primary animate-pulse" />
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex gap-1">
        <span className="thinking-dot w-2 h-2 rounded-full bg-primary inline-block" />
        <span className="thinking-dot w-2 h-2 rounded-full bg-primary inline-block" />
        <span className="thinking-dot w-2 h-2 rounded-full bg-primary inline-block" />
      </div>
    </motion.div>
  );
}
