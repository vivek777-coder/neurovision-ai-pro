import { motion } from "framer-motion";
import { BarChart3, TrendingUp, PieChart as PieIcon } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

const lineData = [
  { month: "Jan", accuracy: 89, predictions: 8200 },
  { month: "Feb", accuracy: 91, predictions: 9100 },
  { month: "Mar", accuracy: 88, predictions: 8800 },
  { month: "Apr", accuracy: 93, predictions: 10500 },
  { month: "May", accuracy: 95, predictions: 11200 },
  { month: "Jun", accuracy: 97, predictions: 12800 },
];

const barData = [
  { name: "Vision", value: 4200 },
  { name: "NLP", value: 3800 },
  { name: "Predict", value: 5100 },
  { name: "Anomaly", value: 2900 },
  { name: "Auto", value: 3400 },
];

const pieData = [
  { name: "Computer Vision", value: 35 },
  { name: "NLP Processing", value: 25 },
  { name: "Predictions", value: 20 },
  { name: "Automation", value: 15 },
  { name: "Other", value: 5 },
];

const COLORS = ["hsl(217, 91%, 60%)", "hsl(262, 83%, 58%)", "hsl(142, 76%, 36%)", "hsl(38, 92%, 50%)", "hsl(199, 89%, 48%)"];

const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" };

export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">In-depth trends and performance metrics</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Accuracy Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[85, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="accuracy" stroke="hsl(217, 91%, 60%)" fill="url(#accGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Module Usage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><PieIcon className="h-5 w-5 text-primary" /> Resource Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Key Insights</h3>
          <div className="space-y-4">
            {[
              { title: "Peak Performance", desc: "Model accuracy reached an all-time high of 97.2% this month", trend: "+2.1%" },
              { title: "Processing Volume", desc: "12,800 predictions processed — highest month on record", trend: "+14.3%" },
              { title: "Cost Efficiency", desc: "Cost per prediction decreased to $0.003 from $0.005", trend: "-40%" },
              { title: "User Engagement", desc: "Average session duration increased to 12.4 minutes", trend: "+18%" },
            ].map((insight, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold">{insight.title}</p>
                  <span className="text-xs font-bold text-success">{insight.trend}</span>
                </div>
                <p className="text-xs text-muted-foreground">{insight.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
