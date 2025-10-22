import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "./IdeaCard";
import type { GenerationData, ContentIdea } from "@/types/generation";
import { useToast } from "@/hooks/use-toast";

interface IdeasGenerationProps {
  generationData: GenerationData;
  onBack: () => void;
  onProceed: (ideas: ContentIdea[]) => void;
}

// Mock AI-generated ideas for demonstration
const generateMockIdeas = (data: GenerationData): ContentIdea[] => {
  const baseIdeas: ContentIdea[] = [
    {
      id: "1",
      title: "The Transformation Story",
      visual_prompt: "A split-screen showing before/after transformation with smooth transitions, warm lighting, and emotional close-ups",
      overlay_text: "From Struggle to Success",
      spoken_narration: "Every great achievement starts with a challenge. This is the story of transformation.",
      rationale: "Transformation narratives create emotional connection and demonstrate value through real results",
      trend_based: true,
    },
    {
      id: "2",
      title: "Behind The Scenes Magic",
      visual_prompt: "Dynamic behind-the-scenes footage with quick cuts, upbeat music, and glimpses of the creative process",
      overlay_text: "How We Make It Happen",
      spoken_narration: "Ever wondered what goes into creating something extraordinary? Let me show you.",
      rationale: "BTS content builds trust and authenticity while satisfying audience curiosity",
      trend_based: true,
    },
    {
      id: "3",
      title: "The Ultimate Guide",
      visual_prompt: "Clean, professional setup with on-screen graphics, numbered steps, and clear demonstrations",
      overlay_text: "Master This in 60 Seconds",
      spoken_narration: "Here are the three essential steps you need to know to succeed.",
      rationale: "Educational content positions you as an expert and provides immediate value",
      trend_based: true,
    },
    {
      id: "4",
      title: "Viral Challenge Remix",
      visual_prompt: "Energetic footage with trending music, creative transitions, and unexpected twist ending",
      overlay_text: "We Tried The Viral Challenge",
      spoken_narration: "You've seen this trend everywhere. Here's our unique take that changes everything.",
      rationale: "Leveraging viral trends with unique spin maximizes reach while maintaining brand identity",
      trend_based: false,
    },
    {
      id: "5",
      title: "Customer Success Stories",
      visual_prompt: "Testimonial-style footage with authentic reactions, real settings, and emotional moments",
      overlay_text: "Real People, Real Results",
      spoken_narration: "Don't just take our word for it. Here's what our community is saying.",
      rationale: "Social proof through authentic testimonials converts viewers into customers",
      trend_based: false,
    },
  ];

  return baseIdeas;
};

export const IdeasGeneration = ({ generationData, onBack, onProceed }: IdeasGenerationProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Simulate AI generation
  useState(() => {
    setTimeout(() => {
      setIdeas(generateMockIdeas(generationData));
      setIsLoading(false);
    }, 2000);
  });

  const handleToggleIdea = (ideaId: string) => {
    setSelectedIdeas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId);
      } else {
        newSet.add(ideaId);
      }
      return newSet;
    });
  };

  const handleProceed = () => {
    if (selectedIdeas.size === 0) {
      toast({
        title: "No ideas selected",
        description: "Please select at least one idea to continue.",
        variant: "destructive",
      });
      return;
    }

    const selectedIdeaObjects = ideas.filter(idea => selectedIdeas.has(idea.id));
    onProceed(selectedIdeaObjects);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Step 2 of 3</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-border" />
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="glass rounded-2xl p-6 border border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">AI-Generated Ideas</h2>
            <p className="text-sm text-muted-foreground">
              Select one or more ideas to create your videos
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-2xl p-12 border border-border/50 flex flex-col items-center justify-center"
          >
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analyzing your input...</h3>
            <p className="text-muted-foreground text-center max-w-md">
              AI is crafting personalized content ideas based on your {generationData.mode === "story_mode" ? "story and brand values" : "prompt"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="ideas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Ideas Grid */}
            <div className="grid gap-4">
              {ideas.map((idea, index) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  isSelected={selectedIdeas.has(idea.id)}
                  onToggle={() => handleToggleIdea(idea.id)}
                  index={index}
                />
              ))}
            </div>

            {/* Action Footer */}
            <div className="glass rounded-xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold mb-1">
                    {selectedIdeas.size} idea{selectedIdeas.size !== 1 ? "s" : ""} selected
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Next step will cost approximately {selectedIdeas.size * 8} credits
                  </div>
                </div>
                <Button
                  onClick={handleProceed}
                  disabled={selectedIdeas.size === 0}
                  className="button-gradient neon-glow"
                  size="lg"
                >
                  Generate Videos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
