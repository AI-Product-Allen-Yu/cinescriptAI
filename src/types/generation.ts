export type GenerationMode = "direct_prompt" | "story_mode";

export interface GenerationData {
  mode: GenerationMode;
  directPromptText?: string;
  story?: string;
  brandValues?: string[];
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
