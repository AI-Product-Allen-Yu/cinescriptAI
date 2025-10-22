import { motion } from "framer-motion";
import { Check, TrendingUp, Eye, MessageSquare, Volume2 } from "lucide-react";
import type { ContentIdea } from "@/types/generation";

interface IdeaCardProps {
  idea: ContentIdea;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}

export const IdeaCard = ({ idea, isSelected, onToggle, index }: IdeaCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onToggle}
      className={`
        w-full glass glass-hover rounded-2xl p-6 text-left border transition-all
        ${isSelected 
          ? "border-primary/50 bg-primary/5" 
          : "border-border/50"
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Selection Indicator */}
        <div
          className={`
            shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
            ${isSelected 
              ? "border-primary bg-primary" 
              : "border-muted"
            }
          `}
        >
          {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">{idea.title}</h3>
              {idea.trend_based && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>Trending</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{idea.rationale}</p>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Visual Prompt */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>Visual</span>
              </div>
              <p className="text-sm leading-relaxed">{idea.visual_prompt}</p>
            </div>

            {/* Overlay Text */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span>Overlay Text</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed">{idea.overlay_text}</p>
            </div>

            {/* Spoken Narration */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span>Narration</span>
              </div>
              <p className="text-sm italic leading-relaxed">{idea.spoken_narration}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};
