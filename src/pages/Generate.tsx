import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DirectPromptMode } from "@/components/generate/DirectPromptMode";
import { StoryMode } from "@/components/generate/StoryMode";
import { IdeasGeneration } from "@/components/generate/IdeasGeneration";
import { VideoGeneration } from "@/components/generate/VideoGeneration";
import type { GenerationData, ContentIdea } from "@/types/generation";

type Step = "mode_selection" | "ideas_generation" | "video_generation";

export default function Generate() {
  const [currentStep, setCurrentStep] = useState<Step>("mode_selection");
  const [generationData, setGenerationData] = useState<GenerationData | null>(null);
  const [selectedIdeas, setSelectedIdeas] = useState<ContentIdea[]>([]);

  const handleModeSelect = (mode: "direct_prompt" | "story_mode") => {
    setGenerationData({ mode });
  };

  const handleProceedToIdeas = (data: GenerationData) => {
    setGenerationData(data);
    setCurrentStep("ideas_generation");
  };

  const handleProceedToVideos = (ideas: ContentIdea[]) => {
    setSelectedIdeas(ideas);
    setCurrentStep("video_generation");
  };

  const handleBackToIdeas = () => {
    setCurrentStep("ideas_generation");
  };

  const handleBackToModeSelection = () => {
    setCurrentStep("mode_selection");
    setGenerationData(null);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <AnimatePresence mode="wait">
          {currentStep === "mode_selection" && (
            <motion.div
              key="mode-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                  Generate Your Video
                </h1>
                <p className="text-xl text-muted-foreground">
                  Choose how you want to start
                </p>
              </div>

              {/* Mode Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {!generationData?.mode ? (
                  <>
                    <div onClick={() => handleModeSelect("direct_prompt")}>
                      <DirectPromptMode onProceed={handleProceedToIdeas} />
                    </div>
                    <div onClick={() => handleModeSelect("story_mode")}>
                      <StoryMode onProceed={handleProceedToIdeas} />
                    </div>
                  </>
                ) : generationData.mode === "direct_prompt" ? (
                  <DirectPromptMode onProceed={handleProceedToIdeas} />
                ) : (
                  <StoryMode onProceed={handleProceedToIdeas} />
                )}
              </div>
            </motion.div>
          )}

          {currentStep === "ideas_generation" && generationData && (
            <motion.div
              key="ideas-generation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <IdeasGeneration
                generationData={generationData}
                onBack={handleBackToModeSelection}
                onProceed={handleProceedToVideos}
              />
            </motion.div>
          )}

          {currentStep === "video_generation" && selectedIdeas.length > 0 && (
            <motion.div
              key="video-generation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VideoGeneration
                selectedIdeas={selectedIdeas}
                onBack={handleBackToIdeas}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
