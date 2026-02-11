import { useState, useRef, useEffect } from "react";
import { Sparkles, Video, Calendar, Languages, Clock, UserX, Zap, ArrowRight, BarChart3, Link } from "lucide-react";
import type { ReverseResponse } from "@/types/reversePrompt";

import LandingStep1 from "./LandingStep1";
import LandingStep2 from "./LandingStep2View";
import LandingSteps345 from "./LandingStep345";
import Pricing from "./Pricing";

import Contact from "./Contact";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Keep same behavior as old code (env fallback)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE || "https://video-gen-l4st.onrender.com";
  // import.meta.env.VITE_API_BASE || "https://a57a3f7fcb32.ngrok-free.app";

const PROCESS_STEPS = [
  {
    icon: Sparkles,
    title: "Story & Brand",
    description: "Share your story or write a direct prompt",
    step: 1,
    name: "Input Ideas",
  },
  {
    icon: Sparkles,
    title: "AI Prompt Ideas",
    description: "Get 5 AI-generated content ideas",
    step: 2,
    name: "Personalize",
  },
  {
    icon: Video,
    title: "Generate Video",
    description: "Create videos with Sora2 AI",
    step: 3,
    name: "Cinematize",
  },
  {
    icon: Languages,
    title: "Watermark & Captions",
    description: "Remove watermarks and add multi-language captions",
    step: 4,
    name: "Captionize",
  },
  {
    icon: Calendar,
    title: "Schedule & Publish",
    description: "Auto-schedule to TikTok, Instagram, YouTube",
    step: 5,
    name: "Schedule",
  },
];

type Step1Platform = "url" | "instagram" | "tiktok" | "scratch" | "keyword" | "text";
type SplitMode = "disabled" | "api_12s" | "web_15s";
type SpeechStyle =
  | "calm"
  | "confident"
  | "emphatic"
  | "passionate"
  | "fast"
  | "energetic"
  | "Custom"
  | null;

export default function Landing() {
  const { token, isAuthed } = useAuth();

  // ───────── STATE ─────────
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  // ✅ strongly typed (fixes “string not assignable” headaches)
  const [selectedPlatform, setSelectedPlatform] =
    useState<Step1Platform>("tiktok");

  const [activeStep, setActiveStep] = useState(1);
  const [narrationText, setNarrationText] = useState<string>("");

  const [publishPlatform, setPublishPlatform] =
    useState<"TikTok" | "Instagram" | "YouTube">("TikTok");
  const [publishDate, setPublishDate] = useState("");
  const [publishTime, setPublishTime] = useState("");
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [captionText, setCaptionText] = useState("#AI #Viral #BrandedAI");

  const [errorMessage, setErrorMessage] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showReverseResult, setShowReverseResult] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [reverseResult, setReverseResult] = useState<ReverseResponse | null>(
    null
  );
  const [isReversing, setIsReversing] = useState(false);
  const [reverseError, setReverseError] = useState<string | null>(null);

  const [embedSrc, setEmbedSrc] = useState("");
  const [basePrompt, setBasePrompt] = useState("");
  const [showReverseEngineer, setShowReverseEngineer] = useState(false);
  const [reversePrompt, setReversePrompt] = useState("");
  const reverseDownloadUrl =
    reverseResult?.download_url && token
      ? `${API_BASE_URL}${reverseResult.download_url}?access_token=${encodeURIComponent(
          token
        )}&ngrok-skip-browser-warning=1`
      : null;

  const [hasPersonalization, setHasPersonalization] = useState(false);
  const [isStep3Ready, setIsStep3Ready] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  const [videoModel, setVideoModel] = useState<"Sora" | "Veo" | "Wan">("Sora");
  const [copiedPrompt, setCopiedPrompt] = useState("");

  const [removeWatermark, setRemoveWatermark] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [captionStyle, setCaptionStyle] = useState("Bold Center");
  const [showPreview, setShowPreview] = useState(true);

  const [targetLength, setTargetLength] = useState<number | null>(null);
  const [hookType, setHookType] = useState<string | null>(null);
  const [cta, setCta] = useState<string | null>(null);
  const [customCta, setCustomCta] = useState("");
  const [model, setModel] = useState<string>("");
  const [combinedPrompt, setCombinedPrompt] = useState<string>("");

  // ✅ NEW: Split mode + split outputs (Step 2)
  const [splitMode, setSplitMode] = useState<SplitMode>("disabled");
  const [splitPrompts, setSplitPrompts] = useState<string[] | null>(null);
  const [activeSplitPromptIndex, setActiveSplitPromptIndex] = useState(0);
  const [requestedSeconds, setRequestedSeconds] = useState<number | null>(null);
  const [effectiveSeconds, setEffectiveSeconds] = useState<number | null>(null);
  const [refineChangeLog, setRefineChangeLog] = useState<string | null>(null);

  // ✅ NEW: refine control states used by Step 2 (must be passed)
  const [cameraTransitionType, setCameraTransitionType] = useState<string | null>(
    null
  );
  const [customCameraTransition, setCustomCameraTransition] = useState("");
  const [platformOverride, setPlatformOverride] = useState<
    "Instagram" | "TikTok" | null
  >(null);

  const [speechStyle, setSpeechStyle] = useState<SpeechStyle>(null);
  const [customSpeechStyle, setCustomSpeechStyle] = useState("");
  const [soraUsername, setSoraUsername] = useState("");

  // ── Sora video job state (Step 3) ──
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoDownloadUrl, setVideoDownloadUrl] = useState<string | null>(null);
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string | null>(
    null
  );
  const [videoSpritesheetUrl, setVideoSpritesheetUrl] = useState<string | null>(
    null
  );
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const videoStreamRef = useRef<EventSource | null>(null);
  const videoPollRef = useRef<number | null>(null);
  const isPollingRef = useRef(false);
  const VIDEO_ID_STORAGE_KEY = "videoai:last_video_id";

  // ✅ Caption generation (Step 4)
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [captionGenError, setCaptionGenError] = useState<string | null>(null);

  const formatInsufficientCredits = (raw: any) => {
    const detail = raw?.detail?.detail ?? raw?.detail ?? raw;
    if (!detail || detail.code !== "insufficient_credits") return null;

    const required = typeof detail.required === "number" ? detail.required : null;
    const remaining = typeof detail.remaining === "number" ? detail.remaining : null;
    const endpoint = detail.endpoint ? String(detail.endpoint) : "";

    const parts: string[] = [];
    if (required !== null) parts.push(`Required ${required}`);
    if (remaining !== null) parts.push(`Remaining ${remaining}`);

    const suffix = parts.length ? ` (${parts.join(" | ")})` : "";
    return `Not enough credits${endpoint ? ` for ${endpoint}` : ""}.` + suffix + " Please upgrade your plan in Pricing.";
  };

  const parseApiError = (raw: string) => {
    let data: any = null;
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }

    const detail = data?.detail?.detail ?? data?.detail ?? data;
    const insufficient = formatInsufficientCredits(detail);
    if (insufficient) {
      return { message: insufficient, detail, raw: data, code: "insufficient_credits" };
    }

    if (typeof detail === "string" && detail.trim()) {
      return { message: detail, detail, raw: data, code: detail?.code };
    }

    return { message: JSON.stringify(detail), detail, raw: data, code: detail?.code };
  };

  // ───────── HELPERS / LOGIC ─────────
  const isStep1Complete = () => !!searchInput.trim();

  const handleStepChange = (step: number) => {
    setErrorMessage("");
    setActiveStep(step);
  };

  const getPlaceholder = () => {
    switch (selectedPlatform) {
      case "instagram":
        return "@username or Instagram URL";
      case "tiktok":
        return "https://tiktok.com/@user/video/1234567890";
      case "keyword":
        return "food, makeup, fitness";
      case "url":
        return "https://instagram.com/p/abc123 or any post URL";
      case "scratch":
        return "Describe your video idea from scratch...";
      case "text":
        return "Paste transcribed text from audio recording";
      default:
        return "Enter your input here";
    }
  };

  const handleSearchSubmit = () => {
    const text = searchInput.trim();
    if (!text) return;

    setBasePrompt(text);
    setGeneratedPrompt(text);

    setHasPersonalization(false);
    setIsStep3Ready(false);

    // reset split info when user starts over
    setSplitMode("disabled");
    setSplitPrompts(null);
    setActiveSplitPromptIndex(0);
    setRequestedSeconds(null);
    setEffectiveSeconds(null);
    setRefineChangeLog(null);

    setActiveStep(2);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      transcribeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      transcribeFile(e.target.files[0]);
    }
  };

  const transcribeFile = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsTranscribing(true);
    setTranscriptionError(null);

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("language", selectedLanguage || "English");

    try {
      if (!isAuthed || !token) {
        throw new Error("Please sign in to transcribe.");
      }

      const response = await fetch(
        `${API_BASE_URL}/v1/transcribe?ngrok-skip-browser-warning=1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "1",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const raw = await response.text();
        throw new Error(raw || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = (data.text || data.transcript || "").trim();

      if (!text) throw new Error("No transcription text");

      setNarrationText(text);
      setSelectedPlatform("text");
      setSearchInput(text);

      setHasPersonalization(false);
      setIsStep3Ready(false);

      // reset split info
      setSplitMode("disabled");
      setSplitPrompts(null);
      setActiveSplitPromptIndex(0);
      setRequestedSeconds(null);
      setEffectiveSeconds(null);
      setRefineChangeLog(null);
    } catch (error) {
      console.error(error);
      setTranscriptionError("Failed to transcribe.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleReverseFromUrl = async (opts?: {
    confirm_high_cost?: boolean;
    job_id?: string;
  }) => {
    const trimmedInput = searchInput.trim();
    const trimmedNarration = narrationText.trim();

    if (!trimmedInput && !trimmedNarration) return;

    // ✅ IMPORTANT: old code required auth for analyze
    if (!isAuthed || !token) {
      setErrorMessage("Please sign in to analyze videos.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setIsReversing(true);
    setReverseError(null);
    setShowReverseResult(false);

    const isDirectionTextMode =
      selectedPlatform === "text" || selectedPlatform === "keyword" || selectedPlatform === "scratch";

    let body: any;

    if (isDirectionTextMode) {
      const direction_text = trimmedInput || trimmedNarration;

      if (!direction_text) {
        setIsReversing(false);
        setReverseError("Please provide some text first.");
        return;
      }

      body = {
        source_type: "direction_text",
        direction_text,
        language: "English",
        aspect: "9:16",
        platform: "tiktok",
        target_duration_seconds: 20,
        use_audio: true,
      };
    } else {
      const url = trimmedInput;
      const apiPlatform = selectedPlatform === "instagram" ? "instagram" : "tiktok";

      body = {
        source_type: "url",
        url,
        language: "English",
        aspect: "9:16",
        platform: apiPlatform,
        target_duration_seconds: 20,
        speech_rate_wps: 2.4,
        vo_min_fill_ratio: 0.85,
        force_keyframes_every_s: 3,
        use_audio: true,
        visual_fps: 3.0,
      };
    }

    // ✅ ONLY ADD when user confirms popup (do not change normal behavior)
    if (opts?.confirm_high_cost && opts?.job_id) {
      body.confirm_high_cost = true;
      body.job_id = opts.job_id;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/reverse/ingest?ngrok-skip-browser-warning=1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "1",
          },
          body: JSON.stringify(body),
        }
      );

      // ✅ IMPORTANT: keep JSON error payload for popup (job_id, credits, etc.)
      if (!response.ok) {
        const raw = await response.text();
        const parsed = parseApiError(raw);
        const code = parsed?.detail?.code || parsed?.detail?.detail?.code;

        if (code === "long_video_confirmation_required") {
          setReverseError(JSON.stringify(parsed.raw)); // popup reads this
          return;
        }

        setReverseError(parsed.message || `HTTP error! status: ${response.status}`);
        return;
      }

      const data = (await response.json()) as ReverseResponse;
      setReverseResult(data);

      const promptText =
        data.final_reversed_videogenAI_ready_prompt ||
        data.output_1?.final_reversed_videogenAI_ready_prompt ||
        "";

      setBasePrompt(promptText);
      setGeneratedPrompt(promptText);
      setShowReverseResult(true);

      setHasPersonalization(false);
      setIsStep3Ready(false);

      // reset split info on new analyze result
      setSplitMode("disabled");
      setSplitPrompts(null);
      setActiveSplitPromptIndex(0);
      setRequestedSeconds(null);
      setEffectiveSeconds(null);
      setRefineChangeLog(null);

      // setActiveStep(2);
    } catch (err) {
      console.error("Reverse API error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to reverse this input. Please try again.";
      setReverseError(message);
    } finally {
      setIsReversing(false);
    }
  };
  const handleCopyScriptToStep3 = async (opts?: { use_saved_story?: string }) => {
    if (!basePrompt.trim()) {
      setErrorMessage("No base prompt from Step 1 yet. Please run 'Reverse from URL' first.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // if no personalization, just go
    if (!hasPersonalization) {
      const promptToUse = basePrompt;
      setGeneratedPrompt(promptToUse);
      setCopiedPrompt(promptToUse);
      setIsStep3Ready(true);
      setActiveStep(3);

      try {
        await navigator.clipboard.writeText(promptToUse);
      } catch { /* empty */ }
      return;
    }

    // ✅ auth required for refine
    if (!isAuthed || !token) {
      setErrorMessage("Please sign in to refine your script.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setIsRefining(true);
    setRefineError(null);

    // clear previous split output before new refine run
    setSplitPrompts(null);
    setActiveSplitPromptIndex(0);
    setRequestedSeconds(null);
    setEffectiveSeconds(null);
    setRefineChangeLog(null);

    try {
      const body: any = {
        base_prompt: basePrompt,
      };

      if (targetLength !== null) body.target_length_seconds = targetLength;

      if (hookType) {
        const hookThemeMap: Record<string, string> = {
          Question: "question",
          "Bold Claim": "bold_claim",
          "Positive Hook": "positive",
          Story: "story",
          Contrarian: "contrarian",
          "Negative Hook": "negative",
          "Pain Point Relatability": "pain_point_relatability",
        };
        const theme = hookThemeMap[hookType] || hookType.toLowerCase().replace(/\s+/g, "_");
        body.video_narration_theme = theme;
        body.hook_type = hookType;
      }

      if (cta === "Custom") {
        const trimmed = customCta.trim();
        if (trimmed) body.call_to_action = trimmed;
      } else if (cta) {
        body.call_to_action = cta;
      }

      if (combinedPrompt.trim()) body.instructions = combinedPrompt.trim();

      if (model) {
        const modelMap: Record<string, string> = {
          Groq: "gpt-5-turbo",
          Claude: "claude-3.5-sonnet",
          "GPT-4": "gpt-4.1-mini",
        };
        body.model = modelMap[model] || model;
      }

      // ✅ split mode into refine payload
      if (splitMode !== "disabled") {
        body.split_mode = splitMode; // "api_10s" | "api_12s" | "web_15s"
      }

      // ✅ refine controls (only send when set)
      if (platformOverride) body.platform = platformOverride.toLowerCase();
      if (cameraTransitionType && cameraTransitionType !== "Custom") body.camera_transition = cameraTransitionType;
      if (cameraTransitionType === "Custom" && customCameraTransition.trim())
        body.camera_transition = customCameraTransition.trim();

      if (speechStyle && speechStyle !== "Custom") body.speech_style = speechStyle;
      if (speechStyle === "Custom" && customSpeechStyle.trim()) body.speech_style = customSpeechStyle.trim();

      if (soraUsername.trim()) body.sora_character = soraUsername.trim();

      // ✅ FRONTEND-ONLY CHANGE:
      // Only send use_saved_story when checked; otherwise omit the field entirely.
      const story = opts?.use_saved_story?.trim();
      if (story) body.use_saved_story = true;
      if (story) body.user_saved_story = story;

      const resp = await fetch(`${API_BASE_URL}/v1/reverse/refine?ngrok-skip-browser-warning=1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "1",
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const raw = await resp.text();
        const parsed = parseApiError(raw);
        throw new Error(parsed.message || `HTTP error! status: ${resp.status}`);
      }

      const json = await resp.json();

      // ✅ Supports both normal + split outputs
      const refinedPrompt = json.final_reversed_videogenAI_ready_prompt || basePrompt;

      // If backend returns split prompts, keep them
      if (Array.isArray(json.split_prompts) && json.split_prompts.length > 0) {
        setSplitPrompts(json.split_prompts);
        setActiveSplitPromptIndex(0);
        setGeneratedPrompt(json.split_prompts[0] || refinedPrompt);
      } else {
        setGeneratedPrompt(refinedPrompt);
      }

      // optional metadata
      const requestedLen =
        typeof json.requested_length_seconds === "number"
          ? json.requested_length_seconds
          : typeof json.requested_seconds === "number"
          ? json.requested_seconds
          : null;
      const effectiveLen =
        typeof json.effective_length_seconds === "number"
          ? json.effective_length_seconds
          : typeof json.effective_seconds === "number"
          ? json.effective_seconds
          : null;
      if (requestedLen !== null) setRequestedSeconds(requestedLen);
      if (effectiveLen !== null) setEffectiveSeconds(effectiveLen);
      if (typeof json.change_log === "string") setRefineChangeLog(json.change_log);

      setCopiedPrompt(refinedPrompt);
      setIsStep3Ready(true);
      setActiveStep(3);

      try {
        await navigator.clipboard.writeText(refinedPrompt);
      } catch { /* empty */ }
    } catch (err) {
      console.error("Refine API error:", err);
      const msg = err instanceof Error ? err.message : "Failed to refine the prompt. Please try again.";
      setRefineError(msg);
    } finally {
      setIsRefining(false);
    }
  };

  const cleanupVideoStream = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.close();
      videoStreamRef.current = null;
    }
  };

  const clearVideoPoll = () => {
    if (videoPollRef.current) {
      window.clearInterval(videoPollRef.current);
      videoPollRef.current = null;
    }
    isPollingRef.current = false;
  };

  const triggerVideoStatusFetch = async (id: string, authToken: string) => {
    try {
      const resp = await fetch(
        `${API_BASE_URL}/v1/videos/${id}?access_token=${encodeURIComponent(
          authToken
        )}&ngrok-skip-browser-warning=1`
      );
      if (!resp.ok) return null;
      const json = (await resp.json()) as {
        id: string;
        status: string;
        progress: number;
      };
      return json;
    } catch {
      return null;
    }
  };

  const startVideoPolling = (id: string, authToken: string) => {
    if (isPollingRef.current) return;
    isPollingRef.current = true;
    clearVideoPoll();

    const tick = async () => {
      const statusData = await triggerVideoStatusFetch(id, authToken);
      if (!statusData) return;
      if (statusData.status) setVideoStatus(statusData.status);
      if (typeof statusData.progress === "number") {
        setVideoProgress(statusData.progress);
      }
      const status = (statusData.status || "").toLowerCase();
      if (status === "completed") {
        setVideoStatus("completed");
        setVideoProgress(100);

        const base = `${API_BASE_URL}/v1/videos/${id}`;
        const commonQs = `access_token=${encodeURIComponent(
          authToken
        )}&ngrok-skip-browser-warning=1`;
        setVideoDownloadUrl(`${base}/content?variant=video&${commonQs}`);
        setVideoThumbnailUrl(`${base}/content?variant=thumbnail&${commonQs}`);
        setVideoSpritesheetUrl(`${base}/content?variant=spritesheet&${commonQs}`);

        localStorage.removeItem(VIDEO_ID_STORAGE_KEY);
        setIsGeneratingVideo(false);
        clearVideoPoll();
      }
      if (status === "failed") {
        setVideoStatus("failed");
        setVideoError("Video generation failed.");
        localStorage.removeItem(VIDEO_ID_STORAGE_KEY);
        setIsGeneratingVideo(false);
        clearVideoPoll();
      }
    };

    tick();
    videoPollRef.current = window.setInterval(tick, 6000);
  };

  const attachVideoStream = (id: string, authToken: string) => {
    cleanupVideoStream();

    const streamUrl = `${API_BASE_URL}/v1/videos/${id}/stream?access_token=${encodeURIComponent(
      authToken
    )}&ngrok-skip-browser-warning=1`;

    const es = new EventSource(streamUrl);
    videoStreamRef.current = es;

    es.addEventListener("update", (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status) setVideoStatus(data.status);
        if (typeof data.progress === "number") setVideoProgress(data.progress);
      } catch (e) {
        console.error("Failed to parse update event", e, event.data);
      }
    });

    es.addEventListener("completed", async (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        const vid = data.video_id || id;
        setVideoStatus("completed");
        setVideoProgress(100);

        // hit status once to trigger backend idempotent charge
        await triggerVideoStatusFetch(vid, authToken);

        const base = `${API_BASE_URL}/v1/videos/${vid}`;
        const commonQs = `access_token=${encodeURIComponent(
          authToken
        )}&ngrok-skip-browser-warning=1`;

        setVideoDownloadUrl(`${base}/content?variant=video&${commonQs}`);
        setVideoThumbnailUrl(`${base}/content?variant=thumbnail&${commonQs}`);
        setVideoSpritesheetUrl(`${base}/content?variant=spritesheet&${commonQs}`);
      } catch (e) {
        console.error("Failed to parse completed event", e, event.data);
      } finally {
        localStorage.removeItem(VIDEO_ID_STORAGE_KEY);
        setIsGeneratingVideo(false);
        cleanupVideoStream();
        clearVideoPoll();
      }
    });

    es.addEventListener("failed", (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        const detail =
          (data && (data.error?.message || JSON.stringify(data.error))) || "";
        setVideoError(`Video generation failed.${detail ? ` ${detail}` : ""}`);
      } catch {
        setVideoError("Video generation failed.");
      }
      setVideoStatus("failed");
      setIsGeneratingVideo(false);
      localStorage.removeItem(VIDEO_ID_STORAGE_KEY);
      cleanupVideoStream();
      clearVideoPoll();
    });

    es.onerror = (event: any) => {
      console.error("SSE connection error", event);
      cleanupVideoStream();
      startVideoPolling(id, authToken);
    };
  };

  const handleGenerateVideo = async () => {
    const prompt = (generatedPrompt || copiedPrompt || "").trim();
    if (!prompt) {
      setErrorMessage(
        "No script available. Please complete Steps 1 and 2 first."
      );
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (videoModel !== "Sora") {
      setErrorMessage("Only the Sora model is wired up right now.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (!isAuthed || !token) {
      setErrorMessage("Please sign in to generate videos.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const authToken = token;

    setIsGeneratingVideo(true);
    setVideoError(null);
    setVideoId(null);
    setVideoStatus(null);
    setVideoProgress(0);
    setVideoDownloadUrl(null);
    setVideoThumbnailUrl(null);
    setVideoSpritesheetUrl(null);
    cleanupVideoStream();
    clearVideoPoll();

    const modelMap: Record<"Sora" | "Veo" | "Wan", "sora-2" | "sora-2-pro"> = {
      Sora: "sora-2-pro",
      Veo: "sora-2-pro",
      Wan: "sora-2-pro",
    };

    let secondsStr: string | undefined = undefined;
    if (targetLength != null && !Number.isNaN(targetLength)) {
      const allowed = [4, 8, 12];
      const closest = allowed.reduce((prev, curr) =>
        Math.abs(curr - targetLength!) < Math.abs(prev - targetLength!)
          ? curr
          : prev
      );
      secondsStr = String(closest);
    }

    const payload: any = {
      video_generation_prompt: prompt,
      model: modelMap[videoModel],
    };
    if (secondsStr) payload.seconds = secondsStr;

    try {
      const resp = await fetch(
        `${API_BASE_URL}/v1/videos/generate?ngrok-skip-browser-warning=1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            "ngrok-skip-browser-warning": "1",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!resp.ok) {
        const raw = await resp.text();
        const parsed = parseApiError(raw);
        throw new Error(parsed.message || `HTTP error! status: ${resp.status}`);
      }

      const json = (await resp.json()) as {
        id: string;
        status: string;
        model: string;
        seconds: string;
        size: string;
      };

      setVideoId(json.id);
      setVideoStatus(json.status ?? "queued");
      setVideoProgress(0);
      localStorage.setItem(VIDEO_ID_STORAGE_KEY, json.id);

      attachVideoStream(json.id, authToken);
    } catch (err) {
      console.error("Video generate error:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to start video generation.";
      setVideoError(msg);
      setIsGeneratingVideo(false);
      cleanupVideoStream();
      clearVideoPoll();
    }
  };

  // ✅ NEW: caption generation handler (Step 4)
  const mapPublishPlatformToApi = (
    p: "TikTok" | "Instagram" | "YouTube"
  ): "tiktok" | "instagram" | "youtube_shorts" => {
    if (p === "Instagram") return "instagram";
    if (p === "YouTube") return "youtube_shorts";
    return "tiktok";
  };

  const handleGenerateCaption = async () => {
    const prompt = (generatedPrompt || copiedPrompt || "").trim();
    if (!prompt) {
      setErrorMessage("No prompt found. Please complete Steps 1–2 first.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (!isAuthed || !token) {
      setErrorMessage("Please sign in to generate captions.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setIsGeneratingCaption(true);
    setCaptionGenError(null);

    try {
      const body = {
        video_generation_prompt: prompt,
        platform: mapPublishPlatformToApi(publishPlatform),
        language: selectedLanguage,
        include_hashtags: true,
      };

      const resp = await fetch(
        `${API_BASE_URL}/v1/videos/caption?ngrok-skip-browser-warning=1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "1",
          },
          body: JSON.stringify(body),
        }
      );

      if (!resp.ok) {
        const raw = await resp.text();
        const parsed = parseApiError(raw);
        throw new Error(parsed.message || `HTTP error! status: ${resp.status}`);
      }

      const json = await resp.json();
      const full = (json.full_text || json.caption || "").trim();
      if (!full) throw new Error("Caption API returned empty text.");

      setCaptionText(full);
    } catch (err) {
      console.error("Caption generate error:", err);
      const msg = err instanceof Error ? err.message : "Failed to generate caption.";
      setCaptionGenError(msg);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  useEffect(() => {
    if (!isAuthed || !token) return;
    const lastVideoId = localStorage.getItem(VIDEO_ID_STORAGE_KEY);
    if (!lastVideoId) return;
    if (videoId && videoId !== lastVideoId) return;
    setVideoId(lastVideoId);
    setVideoStatus((prev) => prev ?? "queued");
    setIsGeneratingVideo(true);
    attachVideoStream(lastVideoId, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, token]);

  const getEmbedUrl = (url: string) => {
    if (!url) return null;

    if (url.includes("tiktok.com")) {
      const match = url.match(/\/video\/(\d+)/);
      if (match) return `https://www.tiktok.com/embed/v2/${match[1]}`;
      return url;
    } else if (url.includes("instagram.com")) {
      const match = url.match(/\/(p|reel|reels)\/([^/?]+)/);
      if (match) {
        const type = match[1] === "p" ? "p" : "reel";
        return `https://www.instagram.com/${type}/${match[2]}/embed/`;
      }
    }
    return null;
  };

  useEffect(() => {
    const src = getEmbedUrl(searchInput.trim());
    setEmbedSrc(src || "");
  }, [searchInput]);

  useEffect(() => {
    return () => cleanupVideoStream();
  }, []);

  // ───────── SHARED PROPS FOR STEP 1 ─────────
  const sharedProps: any = {
    // state
    contactForm,
    isSubmitting,
    searchInput,
    selectedPlatform,
    activeStep,
    publishPlatform,
    publishDate,
    publishTime,
    autoOptimize,
    captionText,
    errorMessage,
    file,
    isTranscribing,
    transcriptionError,
    showReverseResult,
    generatedPrompt,
    reverseResult,
    reverseDownloadUrl,
    isReversing,
    reverseError,
    embedSrc,
    basePrompt,
    showReverseEngineer,
    reversePrompt,
    hasPersonalization,
    isStep3Ready,
    isRefining,
    refineError,
    videoModel,
    copiedPrompt,
    removeWatermark,
    selectedLanguage,
    captionStyle,
    showPreview,
    targetLength,
    hookType,
    cta,
    customCta,
    model,
    combinedPrompt,
    fileInputRef,

    narrationText,

    // setters
    setContactForm,
    setIsSubmitting,
    setSearchInput,
    setSelectedPlatform,
    setActiveStep,
    setPublishPlatform,
    setPublishDate,
    setPublishTime,
    setAutoOptimize,
    setCaptionText,
    setErrorMessage,
    setFile,
    setIsTranscribing,
    setTranscriptionError,
    setShowReverseResult,
    setGeneratedPrompt,
    setReverseResult,
    setIsReversing,
    setReverseError,
    setEmbedSrc,
    setBasePrompt,
    setShowReverseEngineer,
    setReversePrompt,
    setHasPersonalization,
    setIsStep3Ready,
    setIsRefining,
    setRefineError,
    setVideoModel,
    setCopiedPrompt,
    setRemoveWatermark,
    setSelectedLanguage,
    setCaptionStyle,
    setShowPreview,
    setTargetLength,
    setHookType,
    setCta,
    setCustomCta,
    setModel,
    setCombinedPrompt,

    // functions used in Step 1
    handleStepChange,
    handleReverseFromUrl,
    handleSearchSubmit,
    handleKeyPress,
    handleFileChange,
    handleDragOver,
    handleDrop,
    getPlaceholder,
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* HERO SECTION */}
      {/* HERO SECTION - MINIMAL PADDING FIX */}
        <section
          id="home"
          className="relative w-full overflow-x-hidden flex flex-col items-center justify-start pt-16 pb-8 md:pt-24 md:pb-12 bg-gray-950"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/15 via-transparent to-transparent" />

          <div className="container mx-auto relative z-10 max-w-7xl flex flex-col items-center">
            {/* Heading - Minimal Padding and Tight Line Height */}
            <div className="text-center mb-8 md:mb-12 w-full max-w-4xl mx-auto px-4">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                ReCreate Viral Videos <br />
                <span className="text-2xl sm:text-3xl md:text-5xl font-medium text-cyan-400/90 tracking-tight">
                  Without Filming Yourself
                </span>
              </h1>
            </div>

          {/* Comparison Cards Section */}
          <div className="w-full flex flex-col items-center justify-center -mb-4 md:-mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 scale-90 md:scale-95 origin-top">
              
              {/* Left Card: Original Creator */}
              <div className="relative w-full max-w-[240px] rounded-[1.8rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
                <div className="absolute top-3 left-0 right-0 z-20 flex justify-center">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full border border-white/20">
                    <span className="text-[8px] font-bold uppercase text-white/80">Original Creator</span>
                  </div>
                </div>
                
                <img src="/2.jpg" className="w-full aspect-[9/16] object-cover opacity-60 grayscale-[20%]" alt="Manual Production" />
                
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-16 left-0 right-0 z-20 flex flex-col items-center gap-1.5 px-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg w-full">
                    <Clock className="w-3 h-3 text-red-400" />
                    <span className="text-[10px] text-white font-medium">6+ Hours Effort</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg w-full">
                    <UserX className="w-3 h-3 text-orange-400" />
                    <span className="text-[10px] text-white font-medium">On-Camera Prep</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
                  <div className="flex items-center justify-between w-full px-3 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    <div className="flex flex-col"><span className="text-sm font-bold text-white">2.4M</span><span className="text-[8px] uppercase text-white/50">Views</span></div>
                    <div className="text-[9px] font-bold text-red-400">HARD</div>
                  </div>
                </div>
              </div>

              {/* Transition Arrow */}
              <div className="text-cyan-400/20 hidden md:block">
                <ArrowRight className="w-10 h-10" />
              </div>

              {/* Right Card: ViralSpin AI */}
              <div className="relative w-full max-w-[240px] rounded-[1.8rem] overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.25)] bg-slate-900">
                <div className="absolute top-3 left-0 right-0 z-20 flex justify-center">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/90 backdrop-blur-md rounded-full shadow-lg">
                    <Sparkles className="w-3 h-3 text-white fill-white" />
                    <span className="text-[8px] font-black uppercase text-white">ViralSpin AI</span>
                  </div>
                </div>
                
                <img src="/1.jpg" className="w-full aspect-[9/16] object-cover" alt="AI Production" />

                <div className="absolute inset-0 z-10 bg-gradient-to-t from-cyan-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-16 left-0 right-0 z-20 flex flex-col items-center gap-1.5 px-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-400/20 border border-cyan-400/30 rounded-lg w-full backdrop-blur-sm">
                    <Zap className="w-3 h-3 text-cyan-300 fill-cyan-300" />
                    <span className="text-[10px] text-white font-bold">60 Sec Generation</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-400/20 border border-cyan-400/30 rounded-lg w-full backdrop-blur-sm">
                    <CheckCircle className="w-3 h-3 text-cyan-300" />
                    <span className="text-[10px] text-white font-bold">Zero Filming</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-2.5 right-2.5 z-20 flex items-center justify-between px-3 py-2 bg-black/80 backdrop-blur-2xl rounded-xl border border-cyan-500/30">
                  <div className="flex flex-col"><span className="text-sm font-bold text-white">TBD</span><span className="text-[8px] uppercase text-white/50">Your Result</span></div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-cyan-400 text-slate-950 rounded-md font-black text-[9px]">
                    <BarChart3 className="w-2.5 h-2.5" />
                    EASY
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC WIDE INPUT BAR WITH GLOW */}
          <div className="w-full max-w-5xl px-2 mt-8 z-30">
             <div className="relative group">
                {/* CYAN OUTER GLOW - SHADOW ANIMATION */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition duration-1000 shadow-[0_0_20px_rgba(34,211,238,0.3)]"></div>
                <div className="relative flex flex-col bg-[#0d1525] border border-cyan-500/40 rounded-2xl p-2 shadow-2xl overflow-hidden">
                  
                  {/* Toggle between Input and Textarea based on selection */}
                  {["text", "scratch"].includes(selectedPlatform) ? (
                    <div className="w-full">
                      <textarea 
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder={getPlaceholder()}
                        className="bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 w-full text-lg p-6 min-h-[150px] resize-none"
                      />
                      <div className="flex justify-end p-2">
                        <button 
                          onClick={() => handleReverseFromUrl()}
                          className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-black px-8 py-3 rounded-xl transition-all flex items-center gap-2 active:scale-95"
                        >
                          GENERATE PROMPT <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center gap-2">
                      <div className="flex-1 flex items-center px-6 w-full">
                        <Link className="w-6 h-6 text-cyan-400 mr-4 shrink-0" />
                        <input 
                          type="text" 
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={getPlaceholder()}
                          className="bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 w-full text-lg md:text-xl py-4"
                        />
                      </div>
                      <button 
                        onClick={() => handleReverseFromUrl()}
                        disabled={isReversing}
                        className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-black px-12 py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 whitespace-nowrap"
                      >
                        {isReversing ? "ANALYZING..." : "REVERSE FROM URL"}
                        <Sparkles className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
             </div>

             {/* HELPER TEXT & TRY EXAMPLES */}
             <div className="flex flex-col items-center gap-2 mt-4 mb-2">
                {/* 1. Disclaimer */}
                <p className="text-[10px] text-gray-500 uppercase tracking-widest opacity-60">
                  This can take up to ~2 minutes. Please keep this tab open.
                </p>

                {/* 2. Success Message */}
                {showReverseResult && (
                  <p className="text-green-400 text-sm font-bold animate-pulse">
                    Reverse prompt ready. Scroll down to edit it and send to Step 2.
                  </p>
                )}

                {/* 3. Try Examples */}
                {!showReverseResult && !searchInput && (
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="opacity-50">Try:</span>
                      <button 
                        onClick={() => { setSearchInput("https://www.tiktok.com/@gymshark/video/7298836222629317921"); setSelectedPlatform("tiktok"); }}
                        className="hover:text-cyan-400 transition-colors underline decoration-dotted"
                      >
                        TikTok Viral
                      </button>
                      <span>or</span>
                      <button 
                        onClick={() => { setSearchInput("https://www.instagram.com/reel/C2_r8yCx4pG/"); setSelectedPlatform("instagram"); }}
                        className="hover:text-cyan-400 transition-colors underline decoration-dotted"
                      >
                        IG Reel
                      </button>
                   </div>
                )}
             </div>
             
             {/* Platform selection - BLUE-PURPLE GRADIENT RESTORED */}
             <div className="flex flex-wrap justify-center gap-2 mt-4 px-4">
                {[
                  { id: "url", label: "Post URL" },
                  { id: "instagram", label: "Instagram" },
                  { id: "tiktok", label: "TikTok" },
                  { id: "scratch", label: "Create from Scratch" },
                  { id: "keyword", label: "Niche Keyword" },
                  { id: "text", label: "Paste Narration Text" }
                ].map(btn => (
                  <button
                    key={btn.id}
                    onClick={() => {
                      setSelectedPlatform(btn.id as Step1Platform);
                      setSearchInput("");
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                      selectedPlatform === btn.id 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-white/20 shadow-[0_0_15px_rgba(147,51,234,0.3)]' 
                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
             </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="px-0 md:px-4 text-center text-red-500 mt-4 transition-opacity duration-300">
              {errorMessage}
            </div>
          )}

          {/* STEPS CONTENT */}
          <div className="w-full max-w-4xl px-0 md:px-4 mt-12">
            {activeStep === 1 && (
              <LandingStep1 {...sharedProps} apiBaseUrl={API_BASE_URL} hideMainInput={true} />
            )}

            {activeStep === 2 && (
              <LandingStep2
                basePrompt={basePrompt}
                generatedPrompt={generatedPrompt}
                setGeneratedPrompt={setGeneratedPrompt}
                hasPersonalization={hasPersonalization}
                setHasPersonalization={setHasPersonalization}
                targetLength={targetLength}
                setTargetLength={setTargetLength}
                hookType={hookType}
                setHookType={setHookType}
                cta={cta}
                setCta={setCta}
                customCta={customCta}
                setCustomCta={setCustomCta}
                model={model}
                setModel={setModel}
                combinedPrompt={combinedPrompt}
                setCombinedPrompt={setCombinedPrompt}
                isRefining={isRefining}
                refineError={refineError}
                handleCopyScriptToStep3={handleCopyScriptToStep3}
                isStep3Ready={isStep3Ready}
                setIsStep3Ready={setIsStep3Ready}
                setActiveStep={setActiveStep}
                narrationText={narrationText}
                step1SearchInput={searchInput}
                step1SelectedPlatform={selectedPlatform}
                // ✅ props required by Step 2
                splitMode={splitMode}
                setSplitMode={setSplitMode}
                splitPrompts={splitPrompts}
                activeSplitPromptIndex={activeSplitPromptIndex}
                setActiveSplitPromptIndex={setActiveSplitPromptIndex}
                requestedSeconds={requestedSeconds}
                effectiveSeconds={effectiveSeconds}
                refineChangeLog={refineChangeLog}
                cameraTransitionType={cameraTransitionType}
                setCameraTransitionType={setCameraTransitionType}
                customCameraTransition={customCameraTransition}
                setCustomCameraTransition={setCustomCameraTransition}
                platformOverride={platformOverride}
                setPlatformOverride={setPlatformOverride}
                speechStyle={speechStyle}
                setSpeechStyle={setSpeechStyle}
                customSpeechStyle={customSpeechStyle}
                setCustomSpeechStyle={setCustomSpeechStyle}
                soraUsername={soraUsername}
                setSoraUsername={setSoraUsername}
              />
            )}

            {[3, 4, 5].includes(activeStep) && (
              <LandingSteps345
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                generatedPrompt={generatedPrompt}
                setGeneratedPrompt={setGeneratedPrompt}
                copiedPrompt={copiedPrompt}
                setBasePrompt={setBasePrompt}
                setHasPersonalization={setHasPersonalization}
                setIsStep3Ready={setIsStep3Ready}
                splitPrompts={splitPrompts}
                activeSplitPromptIndex={activeSplitPromptIndex}
                setActiveSplitPromptIndex={setActiveSplitPromptIndex}
                videoModel={videoModel}
                setVideoModel={setVideoModel}
                // Sora integration props
                onGenerateVideo={handleGenerateVideo}
                isGeneratingVideo={isGeneratingVideo}
                videoStatus={videoStatus}
                videoProgress={videoProgress}
                videoDownloadUrl={videoDownloadUrl}
                videoThumbnailUrl={videoThumbnailUrl}
                videoSpritesheetUrl={videoSpritesheetUrl}
                videoError={videoError}
                // step 4
                removeWatermark={removeWatermark}
                setRemoveWatermark={setRemoveWatermark}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                captionStyle={captionStyle}
                setCaptionStyle={setCaptionStyle}
                showPreview={showPreview}
                setShowPreview={setShowPreview}
                // step 5
                publishPlatform={publishPlatform}
                setPublishPlatform={setPublishPlatform}
                publishDate={publishDate}
                publishTime={publishTime}
                setPublishDate={setPublishDate}
                setPublishTime={setPublishTime}
                autoOptimize={autoOptimize}
                setAutoOptimize={setAutoOptimize}
                captionText={captionText}
                setCaptionText={setCaptionText}
                // ✅ NEW caption generation props
                onGenerateCaption={handleGenerateCaption}
                isGeneratingCaption={isGeneratingCaption}
                captionGenError={captionGenError}
              />
            )}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 px-4 bg-gray-950 border-t border-white/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Simple 5-Step Process</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">From concept to published video in minutes</p>
          </div>
          <div className="max-w-5xl mx-auto space-y-6">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.step}>
                <Card className="p-6 border-gray-800 bg-gray-900/50 hover:border-cyan-500/30 transition-all flex items-start gap-6">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <step.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-cyan-500/70">Step {step.step}</span>
                    <h3 className="text-xl font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-cyan-500/40" />
                </Card>
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-px h-6 bg-cyan-500/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />
      <Contact />
    </div>
  );
}
