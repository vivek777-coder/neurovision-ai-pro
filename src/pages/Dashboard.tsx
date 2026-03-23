import { KPICard } from "@/components/KPICard";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { motion } from "framer-motion";
import { Brain, AlertTriangle, Target, Activity, TrendingUp, Zap, Eye, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const chartData = [
  { name: "Mon", predictions: 45, accuracy: 92 },
  { name: "Tue", predictions: 62, accuracy: 88 },
  { name: "Wed", predictions: 78, accuracy: 95 },
  { name: "Thu", predictions: 55, accuracy: 91 },
  { name: "Fri", predictions: 89, accuracy: 97 },
  { name: "Sat", predictions: 72, accuracy: 93 },
  { name: "Sun", predictions: 96, accuracy: 96 },
];

const activityFeed = [
  { icon: Brain, text: "New model trained — 97.2% accuracy", time: "2 min ago", color: "text-primary" },
  { icon: AlertTriangle, text: "Anomaly detected in dataset #42", time: "15 min ago", color: "text-warning" },
  { icon: Eye, text: "Image batch processed — 156 objects", time: "1 hr ago", color: "text-accent" },
  { icon: MessageSquare, text: "Chat assistant updated with new context", time: "3 hrs ago", color: "text-info" },
  { icon: Zap, text: "Automation rule triggered — 12 actions", time: "5 hrs ago", color: "text-success" },
];

const insights = [
  { label: "Model Accuracy", value: 97, color: "success" as const },
  { label: "Data Quality", value: 89, color: "primary" as const },
  { label: "Processing Speed", value: 94, color: "accent" as const },
  { label: "Alert Response", value: 76, color: "warning" as const },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back — here's your AI overview</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Predictions" value="12,847" change="+14.2% from last week" changeType="up" icon={TrendingUp} delay={0} />
        <KPICard title="Active Alerts" value="23" change="-5 resolved today" changeType="down" icon={AlertTriangle} delay={0.1} />
        <KPICard title="Model Accuracy" value="97.2%" change="+2.1% improvement" changeType="up" icon={Target} delay={0.2} />
        <KPICard title="Uptime" value="99.9%" change="All systems operational" changeType="neutral" icon={Activity} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Prediction Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="predictions" stroke="hsl(217, 91%, 60%)" fill="url(#colorPred)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">AI Insights</h3>
          <div className="space-y-4">
            {insights.map((item) => (
              <ConfidenceBar key={item.label} label={item.label} value={item.value} color={item.color} />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4">Activity Feed</h3>
        <div className="space-y-4">
          {activityFeed.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.text}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
