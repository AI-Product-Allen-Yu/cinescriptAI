// src/pages/Landing.tsx 
import { useState, useRef, useEffect } from "react";
import { Sparkles, Video, Calendar, Languages } from "lucide-react";
import type { ReverseResponse } from "@/types/reversePrompt";

import LandingStep1 from "./LandingStep1";
import LandingStep2 from "./LandingStep2";
import LandingSteps345 from "./LandingStep345";
import Pricing from "./Pricing";
import Contact from "./Contact";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const API_BASE_URL = "https://15cb509f4bb7.ngrok-free.app";

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

export default function Landing() {
  // ───────── STATE ─────────
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("tiktok");
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

  const [hasPersonalization, setHasPersonalization] = useState(false);
  const [isStep3Ready, setIsStep3Ready] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  const [videoModel, setVideoModel] =
    useState<"Sora" | "Veo" | "Wan">("Sora");
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

  // ───────── HELPERS / LOGIC ─────────
  const isStep1Complete = () => !!searchInput.trim();

  const handleStepChange = (step: number) => {
    if (step > 1 && !isStep1Complete()) {
      setErrorMessage("Please complete Step 1 first.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    if (step === 3 && !isStep3Ready) {
      setErrorMessage("Please use 'Copy Script to Step 3' in Step 2 first.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    setActiveStep(step);
  };

  const getPlaceholder = () => {
    switch (selectedPlatform) {
      case "instagram":
        return "@username";
      case "tiktok":
        return "https://tiktok.com/@user/video/1234567890";
      case "keyword":
        return "food, makeup, fitness";
      case "url":
        return "https://instagram.com/p/abc123 or any post URL";
      case "text":
        return "Paste transcribed text from audio recording";
      default:
        return "Enter your input here";
    }
  };

  const handleSearchSubmit = () => {
    const text = searchInput.trim();
    if (!text) return;

    // user typed this — treat it as prompt
    setBasePrompt(text);
    setGeneratedPrompt(text);

    setHasPersonalization(false);
    setIsStep3Ready(false);

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
  formData.append("model_id", "scribe_v1");

  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/speech-to-text/convert",
      {
        method: "POST",
        headers: {
          "xi-api-key": "sk_0cf4edc045464432d6041e91bb2bcf63e8bf03b95bbee960",
        },
        body: formData,
      }
    );

    const data = await response.json();
    const text = (data.text || data.transcript || "").trim();

    if (!text) throw new Error("No transcription text");

    // 🔹 Save transcription separately
    setNarrationText(text);

    // 🔹 Show transcription inside Step 1 "Paste narration" box
    setSelectedPlatform("text");
    setSearchInput(text);

    // 🔹 DO NOT jump to Step 2 automatically anymore
    // setBasePrompt / setGeneratedPrompt / setActiveStep are removed here

    setHasPersonalization(false);
    setIsStep3Ready(false);
  } catch (error) {
    console.error(error);
    setTranscriptionError("Failed to transcribe.");
  } finally {
    setIsTranscribing(false);
  }
};

  // const transcribeFile = async (uploadedFile: File) => {
  //   setFile(uploadedFile);
  //   setIsTranscribing(true);
  //   setTranscriptionError(null);

  //   const formData = new FormData();
  //   formData.append("file", uploadedFile);
  //   formData.append("model_id", "scribe_v1");

  //   try {
  //     const response = await fetch(
  //       "https://api.elevenlabs.io/v1/speech-to-text/convert",
  //       {
  //         method: "POST",
  //         headers: {
  //           "xi-api-key": "sk_0cf4edc045464432d6041e91bb2bcf63e8bf03b95bbee960",
  //         },
  //         body: formData,
  //       }
  //     );

  //     const data = await response.json();
  //     const text = (data.text || data.transcript || "").trim();

  //     if (!text) throw new Error("No transcription text");

  //     // fill Step 2 prompt
  //     setBasePrompt(text);
  //     setGeneratedPrompt(text);

  //     setHasPersonalization(false);
  //     setIsStep3Ready(false);
  //     setActiveStep(2);
  //   } catch (error) {
  //     console.error(error);
  //     setTranscriptionError("Failed to transcribe.");
  //   } finally {
  //     setIsTranscribing(false);
  //   }
  // };

  const handleReverseFromUrl = async () => {
    const url = searchInput.trim();
    if (!url) return;

    setIsReversing(true);
    setReverseError(null);
    setShowReverseResult(false);

    const apiPlatform =
      selectedPlatform === "instagram" ? "instagram" : "tiktok";

    try {
      const response = await fetch(`${API_BASE_URL}/v1/reverse/ingest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          language: "English",
          aspect: "9:16",
          platform: apiPlatform,
          target_duration_seconds: 60,
          speech_rate_wps: 2.4,
          vo_min_fill_ratio: 0.85,
          force_keyframes_every_s: 3,
          use_audio: false,
          visual_fps: 3.0,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
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
      setActiveStep(2);
    } catch (err) {
      console.error("Reverse API error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to reverse this URL. Please try again.";
      setReverseError(message);
    } finally {
      setIsReversing(false);
    }
  };

  const handleCopyScriptToStep3 = async () => {
    if (!basePrompt.trim()) {
      setErrorMessage(
        "No base prompt from Step 1 yet. Please run 'Reverse from URL' first."
      );
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // no personalization → just use basePrompt
    if (!hasPersonalization) {
      const promptToUse = basePrompt;
      setGeneratedPrompt(promptToUse);
      setCopiedPrompt(promptToUse);
      setIsStep3Ready(true);
      setActiveStep(3);

      try {
        await navigator.clipboard.writeText(promptToUse);
      } catch {
        // ignore clipboard errors
      }
      return;
    }

    // personalization → call refine API
    setIsRefining(true);
    setRefineError(null);

    try {
      const body: any = {
        base_prompt: basePrompt,
      };

      if (targetLength !== null) {
        body.target_length_seconds = targetLength;
      }

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
        const theme =
          hookThemeMap[hookType] ||
          hookType.toLowerCase().replace(/\s+/g, "_");
        body.video_narration_theme = theme;
      }

      if (cta === "Custom") {
        const trimmed = customCta.trim();
        if (trimmed) body.call_to_action = trimmed;
      } else if (cta) {
        body.call_to_action = cta;
      }

      if (combinedPrompt.trim()) {
        body.instructions = combinedPrompt.trim();
      }

      if (model) {
        const modelMap: Record<string, string> = {
          Groq: "gpt-5-turbo",
          Claude: "claude-3.5-sonnet",
          "GPT-4": "gpt-4.1-mini",
        };
        body.model = modelMap[model] || model;
      }

      const resp = await fetch(`${API_BASE_URL}/v1/reverse/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `HTTP error! status: ${resp.status}`);
      }

      const json = await resp.json();
      const refinedPrompt =
        json.final_reversed_videogenAI_ready_prompt || basePrompt;

      setGeneratedPrompt(refinedPrompt);
      setCopiedPrompt(refinedPrompt);
      setIsStep3Ready(true);
      setActiveStep(3);

      try {
        await navigator.clipboard.writeText(refinedPrompt);
      } catch {
        // ignore
      }
    } catch (err) {
      console.error("Refine API error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to refine the prompt. Please try again.";
      setRefineError(msg);
    } finally {
      setIsRefining(false);
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;

    if (url.includes("tiktok.com")) {
      // Normal TikTok video URL
      const match = url.match(/\/video\/(\d+)/);
      if (match) {
        return `https://www.tiktok.com/embed/v2/${match[1]}`;
      }

      // Short links like:
      // https://www.tiktok.com/t/ZP8U4LRTD/
      // or vm.tiktok.com/...
      // we can't easily extract the ID on the frontend, so we just iframe the URL itself
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
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO + STEPS */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center px-4 py-20 md:pt-20 bg-gray-950"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent" />

        <div className="container mx-auto relative z-10 max-w-7xl">
          {/* Badge */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-blue-500/30 text-xs md:text-sm bg-blue-500/10 backdrop-blur text-blue-400">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                AI-Powered Video Creation
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8 md:mb-12 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-3 md:mb-4 text-white leading-tight">
              ReCreate Viral Videos
              <br />
              <span className="text-2xl sm:text-3xl md:text-6xl">
                Effortlessly
              </span>
            </h1>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Steps header */}
            <div className="px-4 py-3 md:py-4 overflow-x-auto mb-0">
              <div className="flex gap-3 md:gap-8 min-w-max md:min-w-0">
                {PROCESS_STEPS.map((step) => (
                  <button
                    key={step.step}
                    onClick={() => handleStepChange(step.step)}
                    className={`flex items-center gap-2 md:gap-3 shrink-0 transition-all ${
                      activeStep === step.step
                        ? "opacity-100"
                        : "opacity-50 hover:opacity-75"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base transition-colors ${
                        activeStep === step.step
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {step.step}
                    </div>
                    <span
                      className={`font-medium text-xs md:text-base whitespace-nowrap ${
                        activeStep === step.step
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="px-0 md:px-4 text-center text-red-500 mb-4 transition-opacity duration-300">
                {errorMessage}
              </div>
            )}

            {/* STEPS CONTENT */}
            <div className="px-0 md:px-4">
              {activeStep === 1 && <LandingStep1 {...sharedProps} />}

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
    narrationText={narrationText}   // 🔹 NEW
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
                  videoModel={videoModel}
                  setVideoModel={setVideoModel}
                  removeWatermark={removeWatermark}
                  setRemoveWatermark={setRemoveWatermark}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  captionStyle={captionStyle}
                  setCaptionStyle={setCaptionStyle}
                  showPreview={showPreview}
                  setShowPreview={setShowPreview}
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
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-12 md:py-24 px-4 bg-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <img
              src="/process.jpeg"
              alt="Video creation process illustration"
              className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl object-cover h-74 md:h-96"
            />
          </div>

          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-white">
              Simple 5-Step Process
            </h2>
            <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              From concept to published video in minutes
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.step} className="mb-6 md:mb-8 last:mb-0">
                <Card className="p-4 md:p-6 border-gray-700 bg-gray-900">
                  <div className="flex items-start gap-3 md:gap-6">
                    <div className="shrink-0">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <step.icon className="w-5 h-5 md:w-7 md:h-7 text-blue-500" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                        <span className="text-xs md:text-sm font-medium text-blue-400">
                          Step {step.step}
                        </span>
                        <h3 className="text-base md:text-xl font-semibold text-white">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm md:text-base text-gray-400">
                        {step.description}
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-500 shrink-0" />
                  </div>
                </Card>

                {index < PROCESS_STEPS.length - 1 && (
                  <div className="flex justify-center my-3 md:my-4">
                    <div className="w-px h-6 md:h-8 bg-gradient-to-b from-blue-500/50 to-transparent" />
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
