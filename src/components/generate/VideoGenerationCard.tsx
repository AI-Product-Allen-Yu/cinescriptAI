import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Download, 
  RefreshCw,
  Play,
  Clock,
  Sparkles,
  Languages,
  CalendarClock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CaptionModal } from "./CaptionModal";
import type { ContentIdea, VideoGenerationJob } from "@/types/generation";

interface VideoGenerationCardProps {
  idea: ContentIdea;
  job?: VideoGenerationJob;
  index: number;
  onRetry: () => void;
  onRemoveWatermark?: () => void;
  onGenerateCaptions?: (languages: string[], aiModel: string) => void;
  onSchedule?: () => void;
}

export const VideoGenerationCard = ({ 
  idea, 
  job, 
  index,
  onRetry,
  onRemoveWatermark,
  onGenerateCaptions,
  onSchedule
}: VideoGenerationCardProps) => {
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const getStatusIcon = () => {
    if (!job) return <Clock className="w-5 h-5 text-muted-foreground" />;
    
    switch (job.status) {
      case "queued":
        return <Clock className="w-5 h-5 text-muted-foreground animate-pulse" />;
      case "generating":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-destructive" />;
    }
  };

  const getStatusText = () => {
    if (!job) return "Initializing...";
    
    switch (job.status) {
      case "queued":
        return "Queued";
      case "generating":
        return `Generating... ${Math.round(job.progress)}%`;
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-xl border border-border/50 overflow-hidden"
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon()}
              <h3 className="font-semibold">{idea.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {idea.visual_prompt}
            </p>
          </div>
          
          {/* Credit Usage */}
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-primary">
              {job?.creditsUsed || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              / {job?.estimatedCredits || 70} credits
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {job && job.status === "generating" && (
          <div className="space-y-2">
            <Progress value={job.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{getStatusText()}</span>
              <span>~{Math.ceil((100 - job.progress) / 3)} seconds remaining</span>
            </div>
          </div>
        )}

        {/* Status Message */}
        {job && job.status !== "generating" && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{getStatusText()}</span>
          </div>
        )}

        {/* Video Preview (when completed) */}
        {job?.status === "completed" && (
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-colors">
              <Button
                size="lg"
                className="button-gradient neon-glow"
              >
                <Play className="w-5 h-5 mr-2" />
                Preview
              </Button>
            </div>
            <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
              1080p • 30s
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {job?.status === "completed" && (
            <>
              {/* Watermark Removal */}
              {!job.watermarkRemoved && !job.watermarkRemoving && onRemoveWatermark && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRemoveWatermark}
                  className="w-full"
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  Remove Watermark (20 credits)
                </Button>
              )}
              
              {job.watermarkRemoving && (
                <div className="glass rounded-lg p-3 border border-border/50">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                    <span className="text-sm">Removing watermark...</span>
                  </div>
                </div>
              )}

              {job.watermarkRemoved && (
                <div className="glass rounded-lg p-3 border border-secondary/50 bg-secondary/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium">Watermark removed</span>
                  </div>
                </div>
              )}

              {/* Caption Generation */}
              {!job.captions && !job.captionGenerating && onGenerateCaptions && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCaptionModal(true)}
                  className="w-full"
                >
                  <Languages className="w-3 h-3 mr-2" />
                  Generate Captions (5 credits/lang)
                </Button>
              )}

              {job.captionGenerating && (
                <div className="glass rounded-lg p-3 border border-border/50">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                    <span className="text-sm">Generating captions...</span>
                  </div>
                </div>
              )}

              {job.captions && job.captions.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCaptionModal(true)}
                  className="w-full"
                >
                  <Languages className="w-3 h-3 mr-2" />
                  View Captions ({job.captions.length})
                </Button>
              )}

              {/* Primary Actions */}
              <div className="flex items-center gap-2">
                {!job.scheduled && onSchedule && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={onSchedule}
                  >
                    <CalendarClock className="w-4 h-4 mr-2" />
                    Schedule Post
                  </Button>
                )}
                {job.scheduled && (
                  <div className="flex-1 glass rounded-lg p-3 border border-secondary/50 bg-secondary/10">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium">Scheduled</span>
                    </div>
                  </div>
                )}
                <Button
                  size="sm"
                  className="flex-1 button-gradient"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </>
          )}
          
          {job?.status === "failed" && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onRetry}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Generation
            </Button>
          )}
        </div>

        {/* Details */}
        <div className="pt-4 border-t border-border/50 space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Overlay Text: </span>
            <span className="font-medium">{idea.overlay_text}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Narration: </span>
            <span className="text-muted-foreground/80 italic">
              "{idea.spoken_narration}"
            </span>
          </div>
        </div>
      </div>

      {job && (
        <CaptionModal
          isOpen={showCaptionModal}
          onClose={() => setShowCaptionModal(false)}
          onGenerate={(languages, aiModel) => {
            onGenerateCaptions?.(languages, aiModel);
            setShowCaptionModal(false);
          }}
          captions={job.captions}
          isGenerating={job.captionGenerating}
        />
      )}
    </motion.div>
  );
};
