import { motion } from "framer-motion";
import { User, Mail, Shield, Bell, Palette, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center">
            <User className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Alex Johnson</h2>
            <p className="text-sm text-muted-foreground">AI Research Engineer</p>
            <Badge className="mt-2 gradient-primary border-0">Pro Plan</Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Mail, label: "Email", value: "alex@neurovision.ai" },
          { icon: Shield, label: "Role", value: "Administrator" },
          { icon: Bell, label: "Notifications", value: "Enabled" },
          { icon: Palette, label: "Theme", value: "System Default" },
          { icon: Brain, label: "API Usage", value: "12,847 / 50,000" },
          { icon: Shield, label: "2FA", value: "Enabled" },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-muted">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-3">
        <Button className="gradient-primary rounded-xl">Save Changes</Button>
        <Button variant="outline" className="rounded-xl">Cancel</Button>
      </motion.div>
    </div>
  );
}
