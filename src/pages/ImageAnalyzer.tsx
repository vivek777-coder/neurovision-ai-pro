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

const mockResults: DetectedObject[] = [
  { label: "Person", confidence: 97, color: "primary" },
  { label: "Laptop", confidence: 94, color: "accent" },
  { label: "Desk", confidence: 89, color: "success" },
  { label: "Coffee Cup", confidence: 82, color: "warning" },
  { label: "Monitor", confidence: 91, color: "primary" },
  { label: "Keyboard", confidence: 88, color: "accent" },
];

export default function ImageAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<DetectedObject[] | null>(null);

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
      setResults(null);
      analyzeImage();
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResults(mockResults);
      setAnalyzing(false);
    }, 2500);
  };

  const reset = () => {
    setImage(null);
    setResults(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Image Analyzer</h1>
        <p className="text-muted-foreground mt-1">Upload an image to detect objects using AI</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {!image ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="glass rounded-xl p-12 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer min-h-[300px]"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div className="p-4 rounded-full bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-medium">Drop an image here or click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">PNG, JPG, WebP up to 10MB</p>
              </div>
              <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
          ) : (
            <div className="relative glass rounded-xl overflow-hidden">
              <img src={image} alt="Uploaded" className="w-full h-auto max-h-[400px] object-contain" />
              <Button variant="ghost" size="icon" onClick={reset} className="absolute top-2 right-2 rounded-full bg-card/80 backdrop-blur">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          {analyzing && <AIThinking label="Analyzing image with computer vision..." />}

          <AnimatePresence>
            {results && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl gradient-primary">
                    <ScanEye className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Detection Results</h3>
                    <p className="text-sm text-muted-foreground">{results.length} objects detected</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {results.map((obj, i) => (
                    <motion.div key={obj.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                      <ConfidenceBar label={obj.label} value={obj.confidence} color={obj.color} />
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {results.slice(0, 4).map((obj) => (
                    <div key={obj.label} className="p-3 rounded-lg bg-muted/50 text-center">
                      <ImageIcon className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs font-medium">{obj.label}</p>
                      <p className="text-xs text-muted-foreground">{obj.confidence}%</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!image && !analyzing && (
            <div className="glass rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
              <ScanEye className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Upload an image to see AI analysis results</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
