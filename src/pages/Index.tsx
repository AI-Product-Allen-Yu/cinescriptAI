import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirectPromptMode } from "@/components/generate/DirectPromptMode";
import { StoryMode } from "@/components/generate/StoryMode";

type Mode = "direct_prompt" | "story_mode" | null;

const Index = () => {
  const [selectedMode, setSelectedMode] = useState<Mode>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold">AI Video Studio</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Credits:</span>
            <span className="font-semibold text-foreground">127</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Generate Your Video</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose how you want to create your video: write a direct prompt or let AI craft ideas from your story.
            </p>
          </div>

          {/* Mode Selection or Selected Mode */}
          {!selectedMode ? (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Direct Prompt Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMode("direct_prompt")}
                className="glass glass-hover rounded-2xl p-8 text-left border border-border/50 transition-all hover:border-primary/50"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Wand2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Direct Prompt</h3>
                <p className="text-muted-foreground mb-4">
                  Write your own prompt and skip straight to video generation.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Fastest path</span>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span className="text-primary font-medium">~3 credits</span>
                </div>
              </motion.button>

              {/* Story Mode Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMode("story_mode")}
                className="glass glass-hover rounded-2xl p-8 text-left border border-border/50 transition-all hover:border-secondary/50"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Prompt Ideas</h3>
                <p className="text-muted-foreground mb-4">
                  Share your story and brand values, let AI refine ideas for you.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">AI-powered</span>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span className="text-secondary font-medium">~3 credits</span>
                </div>
              </motion.button>
            </div>
          ) : (
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setSelectedMode(null)}
                className="mb-6 text-muted-foreground hover:text-foreground"
              >
                ← Change Mode
              </Button>

              {selectedMode === "direct_prompt" && <DirectPromptMode />}
              {selectedMode === "story_mode" && <StoryMode />}
            </div>
          )}

          {/* Credit Estimate Footer */}
          {selectedMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-4 flex items-center justify-between border border-border/50"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Next step cost estimate</span>
              </div>
              <span className="text-lg font-semibold text-primary">3 credits</span>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
