import { motion } from "framer-motion";
import { Zap, Bell, CheckCircle, Clock, AlertTriangle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const automations = [
  { id: 1, title: "Auto-retrain model on accuracy drop", status: "active", trigger: "Accuracy < 90%", actions: 12, icon: Zap },
  { id: 2, title: "Alert on anomaly detection", status: "active", trigger: "Anomaly score > 0.8", actions: 28, icon: AlertTriangle },
  { id: 3, title: "Batch process overnight", status: "paused", trigger: "Daily at 2:00 AM", actions: 156, icon: Clock },
  { id: 4, title: "Notify on prediction failure", status: "active", trigger: "Error rate > 5%", actions: 3, icon: Bell },
];

const notifications = [
  { id: 1, text: "Model retrained successfully — new accuracy: 97.4%", time: "5 min ago", type: "success" },
  { id: 2, text: "Anomaly detected in prediction batch #847", time: "23 min ago", type: "warning" },
  { id: 3, text: "Automation rule 'Batch Process' completed — 2,340 records", time: "2 hrs ago", type: "info" },
  { id: 4, text: "System update scheduled for maintenance window", time: "4 hrs ago", type: "info" },
  { id: 5, text: "High memory usage detected — consider scaling", time: "6 hrs ago", type: "warning" },
];

export default function Automation() {
  const [rules, setRules] = useState(automations);

  const toggleStatus = (id: number) => {
    setRules(rules.map(r => r.id === id ? { ...r, status: r.status === "active" ? "paused" : "active" } : r));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Automation Panel</h1>
        <p className="text-muted-foreground mt-1">Intelligent automation rules and notifications</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2"><Settings className="h-5 w-5 text-primary" /> Automation Rules</h3>
          {rules.map((rule, i) => (
            <motion.div key={rule.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg gradient-primary">
                    <rule.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{rule.title}</p>
                    <p className="text-xs text-muted-foreground">Trigger: {rule.trigger}</p>
                  </div>
                </div>
                <Badge variant={rule.status === "active" ? "default" : "secondary"} className={rule.status === "active" ? "gradient-primary border-0" : ""}>
                  {rule.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{rule.actions} actions triggered</span>
                <Button variant="ghost" size="sm" onClick={() => toggleStatus(rule.id)} className="text-xs h-7">
                  {rule.status === "active" ? "Pause" : "Activate"}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notifications</h3>
          <div className="glass rounded-xl divide-y divide-border/50">
            {notifications.map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}
                className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${n.type === "success" ? "text-success" : n.type === "warning" ? "text-warning" : "text-info"}`} />
                <div>
                  <p className="text-sm">{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
