import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, AlertTriangle, CheckCircle, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { AIThinking } from "@/components/AIThinking";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface PredictionResult {
  score: number;
  risk: "Low" | "Medium" | "High";
  recommendations: string[];
}

export default function Predictions() {
  const [form, setForm] = useState({ studyHours: "6", attendance: "85", assignments: "90", sleepHours: "7" });
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const predict = () => {
    setPredicting(true);
    setResult(null);
    setTimeout(() => {
      const score = Math.min(99, Math.round(
        Number(form.studyHours) * 5 + Number(form.attendance) * 0.3 + Number(form.assignments) * 0.2 + Number(form.sleepHours) * 2
      ));
      const risk: "Low" | "Medium" | "High" = score >= 80 ? "Low" : score >= 60 ? "Medium" : "High";
      const recommendations = [
        score < 80 ? "Increase study hours by 2 hours/week" : "Maintain current study routine",
        Number(form.attendance) < 80 ? "Improve class attendance to above 85%" : "Great attendance record",
        Number(form.sleepHours) < 7 ? "Aim for 7-8 hours of sleep for better retention" : "Sleep schedule is optimal",
      ];
      setResult({ score, risk, recommendations });
      setPredicting(false);
    }, 2000);
  };

  const riskColor = result?.risk === "Low" ? "text-success" : result?.risk === "Medium" ? "text-warning" : "text-destructive";
  const radialData = result ? [{ value: result.score, fill: "hsl(var(--primary))" }] : [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Prediction System</h1>
        <p className="text-muted-foreground mt-1">AI-powered academic performance prediction</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2"><BarChart className="h-5 w-5 text-primary" /> Input Parameters</h3>
          {[
            { key: "studyHours", label: "Study Hours/Week", max: "40" },
            { key: "attendance", label: "Attendance (%)", max: "100" },
            { key: "assignments", label: "Assignment Score (%)", max: "100" },
            { key: "sleepHours", label: "Sleep Hours/Night", max: "12" },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium">{field.label}</label>
              <input
                type="number"
                max={field.max}
                min="0"
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg glass text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent"
              />
            </div>
          ))}
          <Button onClick={predict} disabled={predicting} className="w-full gradient-primary rounded-xl">
            <TrendingUp className="h-4 w-4 mr-2" /> Generate Prediction
          </Button>
        </motion.div>

        <div className="space-y-4">
          {predicting && <AIThinking label="Running prediction model..." />}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Prediction Result</h3>
                  <span className={`text-sm font-bold ${riskColor}`}>Risk: {result.risk}</span>
                </div>

                <div className="flex justify-center">
                  <ResponsiveContainer width={200} height={200}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
                      <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "hsl(var(--muted))" }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute flex items-center justify-center" style={{ width: 200, height: 200 }}>
                    <div className="text-center">
                      <p className="text-4xl font-bold gradient-text">{result.score}%</p>
                      <p className="text-xs text-muted-foreground">Predicted Score</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <ConfidenceBar label="Academic Performance" value={result.score} color={result.risk === "Low" ? "success" : result.risk === "Medium" ? "warning" : "destructive"} />
                  <ConfidenceBar label="Consistency Score" value={Math.min(99, result.score + 5)} color="primary" />
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">AI Recommendations</h4>
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-muted/50">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
