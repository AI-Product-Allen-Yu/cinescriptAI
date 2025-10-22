import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { VideoGenerationCard } from "./VideoGenerationCard";
import type { ContentIdea, VideoGenerationJob } from "@/types/generation";

interface VideoGenerationProps {
  selectedIdeas: ContentIdea[];
  onBack: () => void;
}

const CREDITS_PER_SECOND = 2;
const BASE_CREDITS = 10;
const DEFAULT_DURATION = 30;

// Mock video generation simulation
const simulateVideoGeneration = (
  idea: ContentIdea,
  onUpdate: (job: VideoGenerationJob) => void
) => {
  const estimatedCredits = BASE_CREDITS + (DEFAULT_DURATION * CREDITS_PER_SECOND);
  
  const job: VideoGenerationJob = {
    id: `job-${idea.id}-${Date.now()}`,
    ideaId: idea.id,
    title: idea.title,
    status: "queued",
    progress: 0,
    creditsUsed: 0,
    estimatedCredits,
  };

  onUpdate(job);

  // Simulate queued state
  setTimeout(() => {
    job.status = "generating";
    onUpdate(job);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      if (job.progress < 100) {
        job.progress += Math.random() * 15;
        if (job.progress > 100) job.progress = 100;
        job.creditsUsed = Math.floor((job.progress / 100) * estimatedCredits);
        onUpdate({ ...job });

        if (job.progress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            job.status = "completed";
            job.creditsUsed = estimatedCredits;
            job.videoUrl = `https://example.com/video-${idea.id}.mp4`;
            onUpdate({ ...job });
          }, 500);
        }
      }
    }, 800);
  }, 1000);
};

export const VideoGeneration = ({ selectedIdeas, onBack }: VideoGenerationProps) => {
  const [jobs, setJobs] = useState<Map<string, VideoGenerationJob>>(new Map());
  const [totalCreditsUsed, setTotalCreditsUsed] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Start generating videos for all selected ideas
    selectedIdeas.forEach((idea) => {
      simulateVideoGeneration(idea, (updatedJob) => {
        setJobs((prev) => {
          const newJobs = new Map(prev);
          newJobs.set(updatedJob.ideaId, updatedJob);
          return newJobs;
        });
      });
    });
  }, [selectedIdeas]);

  useEffect(() => {
    // Calculate total credits used
    const total = Array.from(jobs.values()).reduce(
      (sum, job) => sum + job.creditsUsed,
      0
    );
    setTotalCreditsUsed(total);
  }, [jobs]);

  const allCompleted = Array.from(jobs.values()).every(
    (job) => job.status === "completed"
  );

  const handleRetry = (ideaId: string) => {
    const idea = selectedIdeas.find((i) => i.id === ideaId);
    if (idea) {
      simulateVideoGeneration(idea, (updatedJob) => {
        setJobs((prev) => {
          const newJobs = new Map(prev);
          newJobs.set(updatedJob.ideaId, updatedJob);
          return newJobs;
        });
      });
    }
  };

  const handleRemoveWatermark = (ideaId: string) => {
    setJobs((prev) => {
      const newJobs = new Map(prev);
      const job = newJobs.get(ideaId);
      if (job) {
        newJobs.set(ideaId, { ...job, watermarkRemoving: true });
      }
      return newJobs;
    });

    // Simulate watermark removal
    setTimeout(() => {
      setJobs((prev) => {
        const newJobs = new Map(prev);
        const job = newJobs.get(ideaId);
        if (job) {
          newJobs.set(ideaId, {
            ...job,
            watermarkRemoving: false,
            watermarkRemoved: true,
            cleanVideoUrl: `https://example.com/clean-video-${ideaId}.mp4`,
            creditsUsed: job.creditsUsed + 20,
          });
        }
        return newJobs;
      });
      setTotalCreditsUsed((prev) => prev + 20);
      toast({
        title: "Watermark removed",
        description: "Your video is now watermark-free!",
      });
    }, 3000);
  };

  const handleGenerateCaptions = (ideaId: string, languages: string[], aiModel: string) => {
    setJobs((prev) => {
      const newJobs = new Map(prev);
      const job = newJobs.get(ideaId);
      if (job) {
        newJobs.set(ideaId, { ...job, captionGenerating: true });
      }
      return newJobs;
    });

    // Simulate caption generation
    setTimeout(() => {
      const mockCaptions = languages.map((lang) => ({
        language: lang,
        text: `This is a sample caption text for the video in ${lang}. It describes the visual content and spoken narration...`,
        srtUrl: `https://example.com/captions-${ideaId}-${lang}.srt`,
        vttUrl: `https://example.com/captions-${ideaId}-${lang}.vtt`,
      }));

      const captionCredits = languages.length * 5;

      setJobs((prev) => {
        const newJobs = new Map(prev);
        const job = newJobs.get(ideaId);
        if (job) {
          newJobs.set(ideaId, {
            ...job,
            captionGenerating: false,
            captions: mockCaptions,
            creditsUsed: job.creditsUsed + captionCredits,
          });
        }
        return newJobs;
      });
      setTotalCreditsUsed((prev) => prev + captionCredits);
      toast({
        title: "Captions generated",
        description: `Created captions in ${languages.length} language(s) using ${aiModel.toUpperCase()}`,
      });
    }, 4000);
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
          <span className="text-muted-foreground">Step 3 of 3</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="glass rounded-2xl p-6 border border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Generating Videos</h2>
              <p className="text-sm text-muted-foreground">
                Creating {selectedIdeas.length} video{selectedIdeas.length > 1 ? "s" : ""} with Sora2
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{totalCreditsUsed}</div>
            <div className="text-xs text-muted-foreground">credits used</div>
          </div>
        </div>
      </div>

      {/* Video Generation Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {selectedIdeas.map((idea, index) => {
            const job = jobs.get(idea.id);
            return (
              <VideoGenerationCard
                key={idea.id}
                idea={idea}
                job={job}
                index={index}
                onRetry={() => handleRetry(idea.id)}
                onRemoveWatermark={() => handleRemoveWatermark(idea.id)}
                onGenerateCaptions={(languages, aiModel) => handleGenerateCaptions(idea.id, languages, aiModel)}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Summary Footer */}
      {allCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 border border-border/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold mb-1">All videos generated!</div>
              <div className="text-sm text-muted-foreground">
                Total credits used: {totalCreditsUsed}
              </div>
            </div>
            <Button className="button-gradient neon-glow" size="lg">
              Download All
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
