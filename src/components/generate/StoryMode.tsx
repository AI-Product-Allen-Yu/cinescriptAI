import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SUGGESTED_KEYWORDS = ["luxury skincare", "travel vlog", "fitness journey", "cooking recipes"];
const SUGGESTED_ACCOUNTS = [
  "https://instagram.com/username",
  "https://tiktok.com/@user",
  "https://youtube.com/@channel",
  "https://twitter.com/handle"
];

interface StoryModeProps {
  onProceed: (data: any) => void;
  currentStep?: number;
  initialInput?: {type: string, value: string} | null;
}

export const StoryMode = ({ onProceed, currentStep = 1, initialInput }: StoryModeProps) => {
  const [inputType, setInputType] = useState<"keyword" | "account_link">("account_link");
  const [searchInput, setSearchInput] = useState("");
  const { toast } = useToast();

  // Pre-fill input from URL parameters
  useEffect(() => {
    if (initialInput) {
      if (initialInput.type === "account_link") {
        setInputType("account_link");
        setSearchInput(initialInput.value);
      } else if (initialInput.type === "keyword") {
        setInputType("keyword");
        setSearchInput(initialInput.value);
      }
    }
  }, [initialInput]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
  };

  const handleGenerateIdeas = () => {
    if (!searchInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a keyword or account link to continue.",
        variant: "destructive",
      });
      return;
    }

    onProceed({
      mode: "reverse_engineer",
      [inputType === "keyword" ? "keywords" : "accountLink"]: searchInput,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerateIdeas();
    }
  };

  return (
    <div className="w-full max-w-[100%] mx-auto space-y-8">
      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-4 border border-border/50"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Step {currentStep} of 4</span>
          <span className="text-sm text-muted-foreground">{Math.round((currentStep / 4) * 100)}%</span>
        </div>
        <div className="h-2 bg-background/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-border/50"
      >


         <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Reverse Engineer the Photo/Video</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter a social link or keywords to let AI analyze and understand the content style.
            </p>
          </div>
        </div>

        

        <div className="relative mb-6">
          <div className="flex items-center gap-3 bg-background/50 border-2 border-border/50 rounded-full px-6 py-4 focus-within:border-secondary/50 transition-all shadow-lg hover:shadow-xl">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                inputType === "keyword"
                  ? "Enter keywords (e.g., luxury, skincare, vlog)"
                  : "Paste your social media link (e.g., https://instagram.com/username)"
              }
              className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleGenerateIdeas}
              disabled={!searchInput.trim()}
              className="button-gradient neon-glow rounded-full px-6 flex-shrink-0"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Reverse Engineer
            </Button>
          </div>
        </div>


       

        {/* Tab Selection */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              setInputType("keyword");
              if (!initialInput) setSearchInput("");
            }}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              inputType === "keyword"
                ? "bg-secondary/20 text-secondary border-2 border-secondary/50"
                : "bg-background/30 text-muted-foreground border-2 border-border/30 hover:bg-background/50"
            }`}
          >
            Keywords
          </button>
          <button
            onClick={() => {
              setInputType("account_link");
              if (!initialInput) setSearchInput("");
            }}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              inputType === "account_link"
                ? "bg-secondary/20 text-secondary border-2 border-secondary/50"
                : "bg-background/30 text-muted-foreground border-2 border-border/30 hover:bg-background/50"
            }`}
          >
            Account Link
          </button>
        </div>

        {/* Suggestions */}
        <div className="mb-4">
          <div className="text-sm font-medium text-muted-foreground mb-3">
            {inputType === "keyword" ? "Suggested Keywords:" : "Suggested Accounts:"}
          </div>
          <div className="flex flex-wrap gap-2">
            {(inputType === "keyword" ? SUGGESTED_KEYWORDS : SUGGESTED_ACCOUNTS).map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 rounded-full bg-background/40 hover:bg-background/60 border border-border/50 text-sm transition-all hover:border-secondary/50"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search Box */}
        
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6 border border-border/50"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-secondary" />
          How It Works
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-2">
              1
            </div>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Paste a Link:</strong> Share your photo/video or profile
              link so AI can reverse-engineer its visual tone and context.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-2">
              2
            </div>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Use Keywords:</strong> Alternatively, enter keywords that describe
              your visual style or topic (e.g., "luxury skincare", "travel vlog").
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-2">
              3
            </div>
            <p className="text-muted-foreground">
              <strong className="text-foreground">AI Analysis:</strong> Our AI analyzes the content and generates
              personalized video ideas matching your style.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};