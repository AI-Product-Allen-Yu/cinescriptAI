export type GenerationMode = "direct_prompt" | "story_mode";

export interface GenerationData {
  mode: GenerationMode;
  directPromptText?: string;
  story?: string;
  brandValues?: string[];
  accountLink?: string;
  tone?: "funny" | "inspirational" | "educational" | "professional";
}

export interface ContentIdea {
  id: string;
  title: string;
  visual_prompt: string;
  overlay_text: string;
  spoken_narration: string;
  rationale: string;
  trend_based?: boolean;
}

export interface VideoGenerationJob {
  id: string;
  ideaId: string;
  title: string;
  status: "queued" | "generating" | "completed" | "failed";
  progress: number;
  videoUrl?: string;
  creditsUsed: number;
  estimatedCredits: number;
  watermarkRemoved?: boolean;
  watermarkRemoving?: boolean;
  cleanVideoUrl?: string;
  captions?: Caption[];
  captionGenerating?: boolean;
}

export interface Caption {
  language: string;
  text: string;
  srtUrl?: string;
  vttUrl?: string;
}

export interface SoraOptions {
  resolution: string;
  voice_style?: string;
  duration_seconds: number;
}
