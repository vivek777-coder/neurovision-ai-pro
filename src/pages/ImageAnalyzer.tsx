import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, ScanEye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { AIThinking } from "@/components/AIThinking";

interface DetectedObject {
  label: string;
  confidence: number;
  color: "primary" | "accent" | "success" | "warning";
}

export default function ImageAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<DetectedObject[] | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) processFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      analyzeImage(file);
    };
    reader.readAsDataURL(file);
  };

  // 🔥 REAL AI API CALL
  const analyzeImage = async (file: File) => {
    setAnalyzing(true);
    setResults(null);
    setSummary(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const formatted = data.objects.map((item: any, index: number) => ({
        label: item.label,
        confidence: Math.round(item.score * 100),
        color: ["primary", "accent", "success", "warning"][index % 4],
      }));

      setResults(formatted);
      setSummary(data.summary);

    } catch (err) {
      setError("❌ Failed to analyze image. Try again.");
    }

    setAnalyzing(false);
  };

  const reset = () => {
    setImage(null);
    setResults(null);
    setSummary(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-2">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Image Analyzer</h1>
        <p className="text-muted-foreground mt-1">
          Upload an image to detect objects and get AI-powered insights
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {!image ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="glass rounded-xl p-10 flex flex-col items-center justify-center gap-4 border-2 border-dashed hover:border-primary/50 transition cursor-pointer min-h-[280px]"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">Upload Image</p>
              <p className="text-sm text-muted-foreground">Drag & drop or click</p>
              <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
          ) : (
            <div className="relative glass rounded-xl overflow-hidden">
              <img
                src={image}
                alt="Uploaded"
                className="w-full h-[250px] md:h-[350px] object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={reset}
                className="absolute top-2 right-2 bg-white/70"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

          {analyzing && (
            <AIThinking label="Analyzing image with advanced AI vision..." />
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <AnimatePresence>
            {results && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

                {/* TOP RESULT */}
                <div className="glass p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground">Top Detection</p>
                  <h3 className="text-lg font-bold">{results[0].label}</h3>
                  <p className="text-xs">{results[0].confidence}% confidence</p>
                </div>

                {/* FULL RESULTS */}
                <div className="glass rounded-xl p-4 space-y-3">
                  {results.map((obj, i) => (
                    <motion.div key={obj.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                      <ConfidenceBar label={obj.label} value={obj.confidence} color={obj.color} />
                    </motion.div>
                  ))}
                </div>

                {/* AI SUMMARY */}
                {summary && (
                  <div className="glass p-4 rounded-xl">
                    <h3 className="font-semibold mb-2">AI Insight</h3>
                    <p className="text-sm text-muted-foreground">{summary}</p>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

          {!image && !analyzing && (
            <div className="glass rounded-xl p-6 text-center">
              <ScanEye className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload an image to get real-time AI detection & insights
              </p>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}