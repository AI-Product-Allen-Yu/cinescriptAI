import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
