import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wand2,
  Sparkles,
  Video,
  Lightbulb,
  Upload,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GenerationData } from "@/types/generation";

interface DirectPromptModeProps {
  onProceed: (data: GenerationData) => void;
  /** model comes from the URL (sora | veo | wan) */
  model?: "sora" | "veo" | "wan";
}

const examplePrompts = [
  {
    icon: Video,
    title: "Cinematic Scene",
    prompt:
      "A futuristic cityscape at sunset with flying cars zooming between towering skyscrapers, neon lights reflecting off glass buildings",
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    icon: Sparkles,
    title: "Nature Beauty",
    prompt:
      "A serene mountain landscape with a crystal clear lake, surrounded by pine trees, as morning mist rolls over the water",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Lightbulb,
    title: "Abstract Art",
    prompt:
      "Colorful paint splashing in slow motion against a black background, creating vibrant patterns and abstract shapes",
    color: "from-orange-500/20 to-pink-500/20",
  },
];

/* ------------------------------------------------------------------ */
/*  Helper – read model from query string (fallback to sora)           */
/* ------------------------------------------------------------------ */
const useModelFromUrl = (): "sora" | "veo" | "wan" => {
  const [model, setModel] = useState<"sora" | "veo" | "wan">("sora");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get("model");
    if (m === "veo" || m === "wan") setModel(m);
    else setModel("sora");
  }, []);
  return model;
};

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export const DirectPromptMode = ({
  onProceed,
  model: modelProp,
}: DirectPromptModeProps) => {
  const model = modelProp ?? useModelFromUrl();
  const { toast } = useToast();

  /* ---------- UI state ---------- */
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<File[]>([]); // up to 3
  const [startFrame, setStartFrame] = useState<File | null>(null);
  const [endFrame, setEndFrame] = useState<File | null>(null);
  const [resolution, setResolution] = useState<"720p" | "1080p" | "480p">(
    model === "wan" ? "480p" : "1080p"
  );
  const [duration, setDuration] = useState<"5s" | "8s" | "10s">(
    model === "veo" ? "8s" : "5s"
  );
  const [audio, setAudio] = useState(false);
  const [proMode, setProMode] = useState(false);

  /* ---------- Credits cost ---------- */
  const baseCredits = model === "wan" ? 150 : model === "veo" ? 400 : 300;
  const proMultiplier = proMode ? 1.5 : 1;
  const creditsPerSec = Math.round(baseCredits * proMultiplier);

  /* ---------- Image helpers ---------- */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newImgs = [...images, ...files].slice(0, 3);
    setImages(newImgs);
  };
  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleStartFrame = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setStartFrame(e.target.files[0]);
  };
  const handleEndFrame = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setEndFrame(e.target.files[0]);
  };

  /* ---------- Validation & submit ---------- */
  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({ title: "Prompt required", description: "Enter a description.", variant: "destructive" });
      return;
    }
    if (model === "veo" && images.length === 0) {
      toast({ title: "Image required", description: "Veo needs at least one product image.", variant: "destructive" });
      return;
    }

    onProceed({
      mode: "direct_prompt",
      directPromptText: prompt,
      model,
      images,
      startFrame: startFrame ?? undefined,
      endFrame: endFrame ?? undefined,
      resolution,
      duration,
      audio,
      proMode,
    });
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    toast({ title: "Example loaded", description: "Edit as you wish." });
  };

  /* ------------------------------------------------------------------ */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 md:p-8 border border-border/50"
    >
      {/* ---------- Model badge ---------- */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-primary" />
          Direct Prompt – {model.toUpperCase()}
        </h2>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">
          {model === "sora" ? "Sora 2.5" : model === "veo" ? "Veo 3.1" : "Wan 2.2"}
        </span>
      </div>

      {/* ---------- Example Cards ---------- */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Example Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {examplePrompts.map((ex, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleExampleClick(ex.prompt)}
              className={`group relative p-4 rounded-xl border border-border/50 bg-gradient-to-br ${ex.color} hover:border-primary/50 transition-all duration-300 text-left overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <ex.icon className="w-5 h-5 mb-2 text-primary" />
                <h4 className="font-medium text-sm mb-2">{ex.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-3">{ex.prompt}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ---------- Prompt textarea ---------- */}
      <div className="space-y-4 mb-6">
        <Label htmlFor="prompt">Your Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Describe the video you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[180px] resize-none bg-background/50 border-border/50 focus:border-primary"
        />
        <p className="text-xs text-muted-foreground">{prompt.length} characters</p>
      </div>

      {/* ---------- Image upload (Veo needs it) ---------- */}
      {model === "veo" && (
        <div className="mb-6">
          <Label>Upload Product Images (up to 3)</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-destructive/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <label className="w-20 h-20 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>
      )}

      {/* ---------- Start / End frames (Sora & Wan) ---------- */}
      {(model === "sora" || model === "wan") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Start Frame (optional)</Label>
            <label className="mt-1 flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50">
              {startFrame ? (
                <img src={URL.createObjectURL(startFrame)} alt="start" className="h-full rounded-lg" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleStartFrame} />
            </label>
          </div>

          <div>
            <Label>End Frame (optional)</Label>
            <label className="mt-1 flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50">
              {endFrame ? (
                <img src={URL.createObjectURL(endFrame)} alt="end" className="h-full rounded-lg" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleEndFrame} />
            </label>
          </div>
        </div>
      )}

      {/* ---------- Settings row ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Resolution */}
        <div>
          <Label>Resolution</Label>
          <Select value={resolution} onValueChange={(v) => setResolution(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {model === "wan" ? (
                <SelectItem value="480p">480p</SelectItem>
              ) : (
                <>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div>
          <Label>Duration</Label>
          <Select value={duration} onValueChange={(v) => setDuration(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5s">5s</SelectItem>
              <SelectItem value="8s">8s</SelectItem>
              {model !== "wan" && <SelectItem value="10s">10s</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        {/* Audio */}
        <div className="flex items-center space-x-2">
          <Switch id="audio" checked={audio} onCheckedChange={setAudio} />
          <Label htmlFor="audio" className="flex items-center gap-1 cursor-pointer">
            {audio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            Generate Audio
          </Label>
        </div>
      </div>

      {/* ---------- Pro mode (Wan only) ---------- */}
      {model === "wan" && (
        <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-primary/5">
          <div className="flex items-center gap-2">
            <Switch id="pro" checked={proMode} onCheckedChange={setProMode} />
            <Label htmlFor="pro" className="cursor-pointer">
              Pro Mode – higher fidelity
            </Label>
          </div>
        </div>
      )}

      {/* ---------- Generate button + credits ---------- */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Cost: <strong>{creditsPerSec} credits/s</strong>
        </p>
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || (model === "veo" && images.length === 0)}
          className="button-gradient neon-glow"
          size="lg"
        >
          <Wand2 className="w-5 h-5 mr-2" />
          Generate Video
        </Button>
      </div>

      {/* ---------- Prompt tips (same as original) ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
      >
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          How to Write Great Prompts
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Be Descriptive:</strong> scene, lighting, colors, atmosphere.
          </p>
          <p>
            <strong className="text-foreground">Set the Mood:</strong> serene, dramatic, energetic…
          </p>
          <p>
            <strong className="text-foreground">Specify Motion:</strong> camera moves, subject actions.
          </p>
          <p>
            <strong className="text-foreground">Visual Style:</strong> cinematic, painterly, time-lapse.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};