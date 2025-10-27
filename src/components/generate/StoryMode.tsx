import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Plus, X, BookOpen, Target, Zap, Lightbulb, Link2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { GenerationData } from "@/types/generation";

const TONE_OPTIONS = ["funny", "inspirational", "educational", "professional"] as const;

const exampleStories = [
  {
    icon: BookOpen,
    title: "Product Launch",
    story: "We're launching an eco-friendly water bottle that keeps drinks cold for 48 hours. Our mission is to reduce plastic waste while providing superior quality.",
    brandValues: ["Sustainability", "Innovation", "Quality"],
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: Target,
    title: "Brand Story",
    story: "A family-owned bakery celebrating 50 years of tradition. We use grandmother's recipes and locally-sourced ingredients to create authentic pastries.",
    brandValues: ["Tradition", "Authenticity", "Community"],
    color: "from-amber-500/20 to-orange-500/20"
  },
  {
    icon: Zap,
    title: "Service Highlight",
    story: "Our fitness app uses AI to create personalized workout plans. We help busy professionals stay fit with just 15 minutes a day.",
    brandValues: ["Technology", "Health", "Efficiency"],
    color: "from-purple-500/20 to-pink-500/20"
  }
];

interface StoryModeProps {
  onProceed: (data: GenerationData) => void;
}

export const StoryMode = ({ onProceed }: StoryModeProps) => {
  const [story, setStory] = useState("");
  const [inputType, setInputType] = useState<"brand_values" | "account_link">("brand_values");
  const [brandValues, setBrandValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState("");
  const [accountLink, setAccountLink] = useState("");
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

  const handleExampleClick = (example: typeof exampleStories[0]) => {
    setStory(example.story);
    setBrandValues(example.brandValues);
    setInputType("brand_values");
    toast({
      title: "Example loaded",
      description: "Feel free to edit the story and values as needed.",
    });
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
      ...(inputType === "brand_values" ? { brandValues } : { accountLink }),
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

      {/* Example Cards */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Example Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exampleStories.map((example, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleExampleClick(example)}
              className={`group relative p-4 rounded-xl border border-border/50 bg-gradient-to-br ${example.color} hover:border-secondary/50 transition-all duration-300 text-left overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <example.icon className="w-5 h-5 mb-2 text-secondary" />
                <h4 className="font-medium text-sm mb-2">{example.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-3">{example.story}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Instructions Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 p-6 rounded-xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20"
      >
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-secondary" />
          How to Share Your Story
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Tell Your Journey:</strong> Share your brand's mission, product features, or the problem you're solving. Be authentic and specific.
          </p>
          <p>
            <strong className="text-foreground">Add Context:</strong> Include brand values (keywords that define you) or link your social account for AI to understand your style.
          </p>
          <p>
            <strong className="text-foreground">Choose Your Tone:</strong> Select how you want your message delivered - funny, inspirational, educational, or professional.
          </p>
          <p>
            <strong className="text-foreground">Get AI Ideas:</strong> Our AI will analyze your story and generate multiple video prompt ideas tailored to your brand.
          </p>
        </div>
      </motion.div>

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

        {/* Brand Values or Account Link */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Brand Context <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setInputType("brand_values")}
              className={`p-4 rounded-xl border transition-all text-left ${
                inputType === "brand_values"
                  ? "border-secondary/50 bg-secondary/10"
                  : "border-border/50 bg-background/30 hover:bg-background/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-secondary" />
                <span className="font-medium text-sm">Brand Values</span>
              </div>
              <p className="text-xs text-muted-foreground">Add keywords that define your brand</p>
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
              <p className="text-xs text-muted-foreground">Link your social media profile</p>
            </button>
          </div>

          {inputType === "brand_values" ? (
            <div className="p-4 rounded-xl border border-border/50 bg-background/30">
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add a brand value (e.g., Innovation, Quality)"
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
                <div className="flex flex-wrap gap-2 mb-2">
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
              <p className="text-xs text-muted-foreground">
                {brandValues.length}/5 values added
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-border/50 bg-background/30">
              <Input
                placeholder="https://twitter.com/username or https://instagram.com/username"
                value={accountLink}
                onChange={(e) => setAccountLink(e.target.value)}
                className="bg-background/50 border-border/50"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Paste your social media profile URL
              </p>
            </div>
          )}
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