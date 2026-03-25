import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, CheckCircle, BarChart } from "lucide-react";
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
  const [form, setForm] = useState({
    studyHours: "6",
    attendance: "85",
    assignments: "90",
    sleepHours: "7",
  });

  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // 🔥 REAL BACKEND CONNECT
  const predict = async () => {
    setPredicting(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hours: Number(form.studyHours),
          attendance: Number(form.attendance),
          assignments: Number(form.assignments),
          sleep: Number(form.sleepHours),
        }),
      });

      const data = await res.json();

      setResult({
        score: data.score,
        risk: data.risk,
        recommendations: data.recommendations,
      });
    } catch (error) {
      console.error(error);
    }

    setPredicting(false);
  };

  const riskColor =
    result?.risk === "Low"
      ? "text-success"
      : result?.risk === "Medium"
      ? "text-warning"
      : "text-destructive";

  const radialData = result
    ? [{ value: result.score, fill: "hsl(var(--primary))" }]
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-2">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Prediction System</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered academic performance prediction
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* INPUT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 space-y-6"
        >
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Input Parameters
          </h3>

          {[
            { key: "studyHours", label: "Study Hours/Week" },
            { key: "attendance", label: "Attendance (%)" },
            { key: "assignments", label: "Assignment Score (%)" },
            { key: "sleepHours", label: "Sleep Hours/Night" },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium">{field.label}</label>
              <input
                type="number"
                value={form[field.key as keyof typeof form]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg glass text-sm focus:ring-2 focus:ring-primary/50"
              />
            </div>
          ))}

          <Button
            onClick={predict}
            disabled={predicting}
            className="w-full gradient-primary rounded-xl"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Generate Prediction
          </Button>
        </motion.div>

        {/* RESULT */}
        <div className="space-y-4">
          {predicting && (
            <AIThinking label="Running advanced AI prediction model..." />
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-xl p-6 space-y-6"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">Prediction Result</h3>
                  <span className={`font-bold ${riskColor}`}>
                    {result.risk} Risk
                  </span>
                </div>

                {/* SCORE */}
                <div className="flex justify-center relative">
                  <ResponsiveContainer width={200} height={200}>
                    <RadialBarChart
                      data={radialData}
                      startAngle={90}
                      endAngle={-270}
                      innerRadius="60%"
                      outerRadius="90%"
                    >
                      <RadialBar dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>

                  <div className="absolute w-[200px] h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold gradient-text">
                        {result.score}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Predicted Score
                      </p>
                    </div>
                  </div>
                </div>

                {/* BARS */}
                <div className="space-y-3">
                  <ConfidenceBar
                    label="Performance"
                    value={result.score}
                    color={
                      result.risk === "Low"
                        ? "success"
                        : result.risk === "Medium"
                        ? "warning"
                        : "destructive"
                    }
                  />
                  <ConfidenceBar
                    label="Consistency"
                    value={Math.min(99, result.score + 5)}
                    color="primary"
                  />
                </div>

                {/* RECOMMENDATIONS */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">
                    AI Recommendations
                  </h4>

                  {result.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex gap-2 p-3 bg-muted/50 rounded-lg text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
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