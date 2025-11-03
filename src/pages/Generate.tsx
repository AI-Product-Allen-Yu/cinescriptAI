// src/pages/Generate.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { DirectPromptMode } from "@/components/generate/DirectPromptMode";
import { StoryMode } from "@/components/generate/StoryMode";
import { IdeasGeneration } from "@/components/generate/IdeasGeneration";
import { VideoGeneration } from "@/components/generate/VideoGeneration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GenerationData, ContentIdea } from "@/types/generation";

type Step = "mode_selection" | "ideas_generation" | "video_generation";

export default function Generate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<Step>("mode_selection");
  const [generationData, setGenerationData] = useState<GenerationData | null>(null);
  const [selectedIdeas, setSelectedIdeas] = useState<ContentIdea[]>([]);
  const [initialInput, setInitialInput] = useState<{ type: string; value: string } | null>(null);

  // -----------------------------------------------------------------
  // 1. READ URL PARAMS (type, input, model)
  // -----------------------------------------------------------------
  useEffect(() => {
    const type = searchParams.get("type");
    const input = searchParams.get("input");
    const model = searchParams.get("model"); // sora | veo | wan

    if (type && input) {
      setInitialInput({ type, value: decodeURIComponent(input) });
    }

    // Auto-fill model if it exists (from Tools)
    if (model === "sora" || model === "veo" || model === "wan") {
      setGenerationData((prev) => ({
        mode: prev?.mode ?? "direct_prompt",
        model,
      }));
    }
  }, [searchParams]);

  // -----------------------------------------------------------------
  // 2. MODE SELECTION HANDLERS
  // -----------------------------------------------------------------
  const handleModeSelect = (mode: "direct_prompt" | "story_mode") => {
    setGenerationData((prev) => ({
      mode,
      // keep model if already selected
      model: prev?.model,
    }));
  };

  const handleModelChange = (model: "sora" | "veo" | "wan") => {
    setGenerationData((prev) => ({
      ...prev!,
      model,
    }));
    // Update URL so back-button works
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("model", model);
    navigate(`${newUrl.pathname}${newUrl.search}`, { replace: true });
  };

  const handleProceedToIdeas = (data: GenerationData) => {
    setGenerationData(data);
    setCurrentStep("ideas_generation");
  };

  const handleProceedToVideos = (ideas: ContentIdea[]) => {
    setSelectedIdeas(ideas);
    setCurrentStep("video_generation");
  };

  const handleBackToIdeas = () => setCurrentStep("ideas_generation");
  const handleBackToModeSelection = () => {
    setCurrentStep("mode_selection");
    setGenerationData(null);
  };

  // -----------------------------------------------------------------
  // 3. RENDER LOGIC
  // -----------------------------------------------------------------
  const showModeSelector = !generationData?.mode;
  const selectedModel = generationData?.model;

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-2 sm:px-6 lg:px-10">
      <div className="container mx-auto max-w-[95vw]">

        <AnimatePresence mode="wait">
          {/* ====================== MODE SELECTION ====================== */}
          {currentStep === "mode_selection" && (
            <motion.div
              key="mode-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* ----- Model Dropdown (always visible) ----- */}
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Select AI Model
                </label>
                <Select
                  value={selectedModel ?? "sora"}
                  onValueChange={handleModelChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sora">Sora 2.5</SelectItem>
                    <SelectItem value="veo">Veo 3.1</SelectItem>
                    <SelectItem value="wan">Wan 2.2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ----- Mode Cards (only if no mode yet) ----- */}
              {showModeSelector ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[90vw] mx-auto">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeSelect("direct_prompt")}
                    className="cursor-pointer"
                  >
                    <DirectPromptMode
                      model={selectedModel as any}
                      onProceed={handleProceedToIdeas}
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeSelect("story_mode")}
                    className="cursor-pointer"
                  >
                    <StoryMode
                      onProceed={handleProceedToIdeas}
                      initialInput={initialInput}
                    />
                  </motion.div>
                </div>
              ) : (
                /* ----- Already selected a mode → show only that UI ----- */
                <div className="max-w-4xl mx-auto">
                  {generationData.mode === "direct_prompt" ? (


                    <DirectPromptMode
                      model={generationData.model as "sora" | "veo" | "wan"}
                      onProceed={handleProceedToIdeas}
                    />
                  ) : (
                    <StoryMode
                      onProceed={handleProceedToIdeas}
                      initialInput={initialInput}
                    />
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ====================== IDEAS GENERATION ====================== */}
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

          {/* ====================== VIDEO GENERATION ====================== */}
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