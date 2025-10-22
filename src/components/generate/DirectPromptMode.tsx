import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { GenerationData } from "@/types/generation";

interface DirectPromptModeProps {
  onProceed: (data: GenerationData) => void;
}

export const DirectPromptMode = ({ onProceed }: DirectPromptModeProps) => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate your video.",
        variant: "destructive",
      });
      return;
    }

    onProceed({
      mode: "direct_prompt",
      directPromptText: prompt,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8 border border-border/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Direct Prompt</h2>
          <p className="text-sm text-muted-foreground">Write your video prompt below</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Your Prompt
          </label>
          <Textarea
            id="prompt"
            placeholder="Describe the video you want to create... (e.g., 'A futuristic cityscape at sunset with flying cars')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[200px] resize-none bg-background/50 border-border/50 focus:border-primary"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {prompt.length} characters
          </p>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim()}
          className="w-full button-gradient neon-glow"
          size="lg"
        >
          <Wand2 className="w-5 h-5 mr-2" />
          Generate Video
        </Button>
      </div>
    </motion.div>
  );
};
