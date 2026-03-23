import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

export function KPICard({ title, value, change, changeType, icon: Icon, delay = 0 }: KPICardProps) {
  const changeColor = changeType === "up" ? "text-success" : changeType === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-xl p-6 hover:glow-primary transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <p className={`text-sm font-medium ${changeColor}`}>{change}</p>
        </div>
        <div className="p-3 rounded-xl gradient-primary group-hover:scale-110 transition-transform">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
