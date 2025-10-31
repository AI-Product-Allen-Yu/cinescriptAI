import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Plus, X, Link2, Tag, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { GenerationData } from "@/types/generation";

const TONE_OPTIONS = ["funny", "inspirational", "educational", "professional"] as const;

interface StoryModeProps {
  onProceed: (data: GenerationData) => void;
}

export const StoryMode = ({ onProceed }: StoryModeProps) => {
  const [inputType, setInputType] = useState<"keyword" | "account_link">("keyword");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newValue, setNewValue] = useState("");
  const [accountLink, setAccountLink] = useState("");
  const [selectedTone, setSelectedTone] = useState<typeof TONE_OPTIONS[number] | null>(null);
  const { toast } = useToast();

  const handleAddValue = () => {
    if (newValue.trim() && keywords.length < 5) {
      setKeywords([...keywords, newValue.trim()]);
      setNewValue("");
    }
  };

  const handleRemoveValue = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleGenerateIdeas = () => {
    if (!accountLink.trim() && keywords.length === 0) {
      toast({
        title: "Input required",
        description: "Please provide an account link or some keywords first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTone) {
      toast({
        title: "Tone required",
        description: "Please select a tone for your content.",
        variant: "destructive",
      });
      return;
    }

    // onProceed({
    //   mode: "reverse_engineer",
    //   ...(inputType === "keyword" ? { keywords } : { accountLink }),
    //   tone: selectedTone,
    // });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8 border border-border/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Reverse Engineer the Photo/Video</h2>
          <p className="text-sm text-muted-foreground">
            Enter a social link or keywords to let AI analyze and understand the content style.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 p-6 rounded-xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20"
      >
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-secondary" />
          How It Works
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Paste a Link:</strong> Share your photo/video or profile
            link so AI can reverse-engineer its visual tone and context.
          </p>
          <p>
            <strong className="text-foreground">Use Keywords:</strong> Alternatively, enter keywords that describe
            your visual style or topic (e.g., “luxury skincare”, “travel vlog”).
          </p>
          <p>
            <strong className="text-foreground">Select Tone:</strong> Choose how you want your message or
            video style to sound.
          </p>
        </div>
      </motion.div>

      {/* Account Link / Keywords Input */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">Choose Input Type</label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setInputType("keyword")}
              className={`p-4 rounded-xl border transition-all text-left ${
                inputType === "keyword"
                  ? "border-secondary/50 bg-secondary/10"
                  : "border-border/50 bg-background/30 hover:bg-background/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-secondary" />
                <span className="font-medium text-sm">Keywords</span>
              </div>
              <p className="text-xs text-muted-foreground">Describe your content style</p>
            </button>

            <button
              onClick={() => setInputType("account_link")}
              className={`p-4 rounded-xl border transition-all text-left ${
                inputType === "account_link"
                  ? "border-secondary/50 bg-secondary/10"
                  : "border-border/50 bg-background/30 hover:bg-background/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-secondary" />
                <span className="font-medium text-sm">Account Link</span>
              </div>
              <p className="text-xs text-muted-foreground">Paste your social media link</p>
            </button>
          </div>

          {inputType === "keyword" ? (
            <div className="p-4 rounded-xl border border-border/50 bg-background/30">
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add a keyword (e.g., luxury, skincare, vlog)"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddValue()}
                  className="bg-background/50 border-border/50"
                  disabled={keywords.length >= 5}
                />
                <Button
                  onClick={handleAddValue}
                  disabled={!newValue.trim() || keywords.length >= 5}
                  size="icon"
                  variant="outline"
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {keywords.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass px-3 py-1.5 rounded-full flex items-center gap-2 text-sm"
                    >
                      <span>{value}</span>
                      <button
                        onClick={() => handleRemoveValue(index)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">{keywords.length}/5 keywords added</p>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-border/50 bg-background/30">
              <Input
                placeholder="https://instagram.com/username or https://tiktok.com/@user"
                value={accountLink}
                onChange={(e) => setAccountLink(e.target.value)}
                className="bg-background/50 border-border/50"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Paste your social media profile or content URL
              </p>
            </div>
          )}
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Select Tone</label>
          <div className="grid grid-cols-2 gap-3">
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone}
                onClick={() => setSelectedTone(tone)}
                className={`glass glass-hover rounded-lg p-4 text-left border transition-all ${
                  selectedTone === tone
                    ? "border-secondary/50 bg-secondary/10"
                    : "border-border/50"
                }`}
              >
                <div className="font-medium capitalize">{tone}</div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerateIdeas}
          disabled={
            (!accountLink.trim() && keywords.length === 0) || !selectedTone
          }
          className="w-full button-gradient neon-glow"
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Reverse Engineer
        </Button>
      </div>

      {/* ---------------- STORY MODE (Step 2) COMMENTED OUT ---------------- */}
      {/*
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Story Mode (Coming Soon)</h2>
        <p className="text-muted-foreground text-sm">
          This step will allow you to tell your brand’s story and let AI generate deeper
          creative narratives. Currently disabled.
        </p>
      </div>
      */}
    </motion.div>
  );
};
