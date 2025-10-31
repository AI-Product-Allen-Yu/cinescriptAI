import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Sparkles, Video, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { GenerationData } from "@/types/generation";

interface DirectPromptModeProps {
  onProceed: (data: GenerationData) => void;
}

const examplePrompts = [
  {
    icon: Video,
    title: "Cinematic Scene",
    prompt: "A futuristic cityscape at sunset with flying cars zooming between towering skyscrapers, neon lights reflecting off glass buildings",
    color: "from-blue-500/20 to-purple-500/20"
  },
  {
    icon: Sparkles,
    title: "Nature Beauty",
    prompt: "A serene mountain landscape with a crystal clear lake, surrounded by pine trees, as morning mist rolls over the water",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: Lightbulb,
    title: "Abstract Art",
    prompt: "Colorful paint splashing in slow motion against a black background, creating vibrant patterns and abstract shapes",
    color: "from-orange-500/20 to-pink-500/20"
  }
];

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

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    toast({
      title: "Example loaded",
      description: "Feel free to edit the prompt as needed.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8 border border-border/50"
    >


      
        {/* Example Cards */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Example Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {examplePrompts.map((example, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleExampleClick(example.prompt)}
              className={`group relative p-4 rounded-xl border border-border/50 bg-gradient-to-br ${example.color} hover:border-primary/50 transition-all duration-300 text-left overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <example.icon className="w-5 h-5 mb-2 text-primary" />
                <h4 className="font-medium text-sm mb-2">{example.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-3">{example.prompt}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>



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




      {/* Instructions Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
      >
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          How to Write Great Prompts
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Be Descriptive:</strong> Include details about the scene, lighting, colors, and atmosphere. The more specific you are, the better the results.
          </p>
          <p>
            <strong className="text-foreground">Set the Mood:</strong> Describe the emotional tone or feeling you want to convey (e.g., "serene," "dramatic," "energetic").
          </p>
          <p>
            <strong className="text-foreground">Specify Motion:</strong> Mention camera movements or subject actions (e.g., "slow pan across," "zooming into," "objects floating").
          </p>
          <p>
            <strong className="text-foreground">Visual Style:</strong> Reference artistic styles or cinematography techniques (e.g., "cinematic," "painterly," "time-lapse").
          </p>
        </div>
      </motion.div>


    </motion.div>





  );
};