import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { GenerationData } from "@/types/generation";

const TONE_OPTIONS = ["funny", "inspirational", "educational", "professional"] as const;

interface StoryModeProps {
  onProceed: (data: GenerationData) => void;
}

export const StoryMode = ({ onProceed }: StoryModeProps) => {
  const [story, setStory] = useState("");
  const [brandValues, setBrandValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState("");
  const [selectedTone, setSelectedTone] = useState<typeof TONE_OPTIONS[number] | null>(null);
  const { toast } = useToast();

  const handleAddValue = () => {
    if (newValue.trim() && brandValues.length < 5) {
      setBrandValues([...brandValues, newValue.trim()]);
      setNewValue("");
    }
  };

  const handleRemoveValue = (index: number) => {
    setBrandValues(brandValues.filter((_, i) => i !== index));
  };

  const handleGenerateIdeas = () => {
    if (!story.trim()) {
      toast({
        title: "Story required",
        description: "Please share your story to get prompt ideas.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTone) {
      toast({
        title: "Tone required",
        description: "Please select a tone for your video.",
        variant: "destructive",
      });
      return;
    }

    onProceed({
      mode: "story_mode",
      story,
      brandValues,
      tone: selectedTone,
    });
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
          <h2 className="text-2xl font-semibold">Story Mode</h2>
          <p className="text-sm text-muted-foreground">Let AI craft ideas from your story</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Story Input */}
        <div>
          <label htmlFor="story" className="block text-sm font-medium mb-2">
            Your Story
          </label>
          <Textarea
            id="story"
            placeholder="Tell us about your brand, product, or the message you want to convey..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="min-h-[150px] resize-none bg-background/50 border-border/50 focus:border-secondary"
          />
        </div>

        {/* Brand Values */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Brand Values <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add a brand value (e.g., Innovation)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddValue()}
              className="bg-background/50 border-border/50"
              disabled={brandValues.length >= 5}
            />
            <Button
              onClick={handleAddValue}
              disabled={!newValue.trim() || brandValues.length >= 5}
              size="icon"
              variant="outline"
              className="shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {brandValues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {brandValues.map((value, index) => (
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
          <p className="text-xs text-muted-foreground mt-2">
            {brandValues.length}/5 values added
          </p>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Select Tone
          </label>
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
          disabled={!story.trim() || !selectedTone}
          className="w-full button-gradient neon-glow"
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Get Prompt Ideas
        </Button>
      </div>
    </motion.div>
  );
};
