import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";

type Step2Props = {
  basePrompt: string;
  generatedPrompt: string;
  setGeneratedPrompt: (v: string) => void;
  hasPersonalization: boolean;
  setHasPersonalization: (v: boolean) => void;
  targetLength: number | null;
  setTargetLength: (v: number | null) => void;
  hookType: string | null;
  setHookType: (v: string | null) => void;
  cta: string | null;
  setCta: (v: string | null) => void;
  customCta: string;
  setCustomCta: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  combinedPrompt: string;
  setCombinedPrompt: (v: string) => void;
  isRefining: boolean;
  refineError: string | null;
  handleCopyScriptToStep3: () => void; // "Update Prompt (Spin)" logic

  // extra
  isStep3Ready: boolean;
  setIsStep3Ready: (v: boolean) => void;
  setActiveStep: (v: number) => void;

  // 🔹 NEW
  narrationText: string;
};

const LandingStep2: React.FC<Step2Props> = (props) => {
  const {
    basePrompt,
    generatedPrompt,
    setGeneratedPrompt,
    hasPersonalization,
    setHasPersonalization,
    targetLength,
    setTargetLength,
    hookType,
    setHookType,
    cta,
    setCta,
    customCta,
    setCustomCta,
    model,
    setModel,
    combinedPrompt,
    setCombinedPrompt,
    isRefining,
    refineError,
    handleCopyScriptToStep3,
    isStep3Ready,
    setIsStep3Ready,
    setActiveStep,
    narrationText,
  } = props;

  const [selectedTransition, setSelectedTransition] =
    useState<string | null>(null);
  const [customTransition, setCustomTransition] = useState("");
  const [selectedPlatform, setSelectedPlatform] =
    useState<"Instagram" | "TikTok" | null>(null);

  // 🔹 URL field is now local, not tied to searchInput
  const [urlInput, setUrlInput] = useState("");

  const handleUpdatePrompt = () => {
    handleCopyScriptToStep3();
  };

  const handleGoToStep3 = () => {
    if (!generatedPrompt.trim() && !basePrompt.trim()) return;
    setActiveStep(3);
  };

  return (
    <div className="px-0 py-2 space-y-4">
      {/* URL / username / keyword – full width at top */}
      <div>
        <Label className="text-xs text-gray-400">URL / username / keyword</Label>
        <div className="relative mt-1">
          <Input
            placeholder="https://www.instagram.com/username/post/1234"
            className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500 pr-10"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Sparkles className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* 🔹 Prompt from Step 1 – auto height with Narration text under it */}
      <div>
        <Label className="text-xs text-gray-400">Prompt from Step 1</Label>
        <Textarea
          className="mt-1 h-auto min-h-[300px] max-h-[800px] overflow-y-auto bg-[#1a1a1a] border-gray-700 text-gray-300 text-xs placeholder:text-gray-500 resize-none"
          value={generatedPrompt}
          onChange={(e) => setGeneratedPrompt(e.target.value)}
        />
        {narrationText && (
          <p className="mt-2 text-[11px] text-gray-400">
            <span className="font-semibold text-gray-300">Narration text: </span>
            {narrationText}
          </p>
        )}
      </div>

      {/* Main Personalize card */}
      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="text-xl font-bold text-white">Personalize</h3>
              <p className="text-sm text-gray-500">
                Fine-tune your script, hooks, CTA, transitions, and platform
                settings.
              </p>
            </div>
          </div>
        </div>

        {/* Body – Two Columns */}
        <div className="grid md:grid-cols-2 gap-6 p-5">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            {/* Target Length */}
            <div>
              <Label className="text-xs text-gray-400">
                Target Length of Reel/TikTok/Short
              </Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {[7, 15, 20, 30, 45, 60].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setTargetLength(s);
                      setHasPersonalization(true);
                      setIsStep3Ready(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      targetLength === s
                        ? "bg-blue-500 text-white"
                        : "bg-[#1a1a1a] text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>

            {/* Hook */}
            <div>
              <Label className="text-xs text-gray-400">Hook</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  "Question",
                  "Bold Claim",
                  "Positive Hook",
                  "Story",
                  "Contrarian",
                  "Negative Hook",
                  "Pain Point Relatability",
                ].map((h) => (
                  <button
                    key={h}
                    onClick={() => {
                      setHookType(h);
                      setHasPersonalization(true);
                      setIsStep3Ready(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                      hookType === h
                        ? "bg-blue-500 text-white"
                        : "bg-[#1a1a1a] text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Story */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-gray-400">My Saved Story</Label>
                <button
                  onClick={() => alert("Open MyStory Agent questionnaire")}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Answer More Questions
                </button>
              </div>
              <Textarea
                className="bg-[#1a1a1a] border-gray-700 text-gray-300 text-sm min-h-[100px] resize-none"
                defaultValue="Former laid off tech worker now helping users build their personal brand with AI. Favorite tennis player: Alcaraz. Favorite podcaster: Candace Owens."
              />
            </div>
          </div>

          {/* RIGHT COLUMN – Controls */}
          <div className="space-y-5">
            {/* Call-To-Action */}
            <div>
              <Label className="text-xs text-gray-400">Call-To-Action</Label>
              <div className="flex gap-2 mt-2 flex-wrap items-center">
                {["Follow for More", "Link in Bio"].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCta(c);
                      setHasPersonalization(true);
                      setIsStep3Ready(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      cta === c
                        ? "bg-blue-500 text-white"
                        : "bg-[#1a1a1a] text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
                <Input
                  placeholder="Custom CTA"
                  className="flex-1 min-w-[120px] bg-[#1a1a1a] border-gray-700 text-white text-sm"
                  value={cta === "Custom" ? customCta : ""}
                  onChange={(e) => {
                    setCta("Custom");
                    setCustomCta(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setHasPersonalization(true);
                      setIsStep3Ready(false);
                    }
                  }}
                />
              </div>
            </div>

            {/* Camera Transitions */}
            <div>
              <Label className="text-xs text-gray-400">Camera Transitions</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {["Zoom in", "Fade"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTransition(t);
                      setHasPersonalization(true);
                      setIsStep3Ready(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedTransition === t
                        ? "bg-blue-500 text-white"
                        : "bg-[#1a1a1a] text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Type custom transition name"
                className="mt-2 bg-[#1a1a1a] border-gray-700 text-white text-sm"
                value={customTransition}
                onChange={(e) => {
                  setCustomTransition(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setSelectedTransition("Custom");
                    setHasPersonalization(true);
                    setIsStep3Ready(false);
                  }
                }}
              />
            </div>

            {/* Platform Selection */}
            <div>
              <Label className="text-xs text-gray-400">Platform</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {["Instagram", "TikTok"].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPlatform(p as "Instagram" | "TikTok");
                      setHasPersonalization(true);
                      setIsStep3Ready(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedPlatform === p
                        ? "bg-blue-500 text_WHITE"
                        : "bg-[#1a1a1a] text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Model */}
            <div>
              <Label className="text-xs text-gray-400">Model</Label>
              <select
                className="w-full mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  if (e.target.value) {
                    setHasPersonalization(true);
                    setIsStep3Ready(false);
                  }
                }}
              >
                <option value="">Select model</option>
                <option value="Groq">Groq</option>
                <option value="Claude">Claude</option>
                <option value="GPT-4">GPT-4</option>
              </select>
            </div>

            {/* Instructions + UPDATE PROMPT */}
            <div>
              <Label className="text-xs text-gray-400">
                Instructions (Combined Prompt)
              </Label>
              <Textarea
                rows={6}
                className="mt-1 bg-[#1a1a1a] border-gray-700 text-gray-300 text-xs placeholder:text-gray-500 resize-none"
                value={combinedPrompt}
                onChange={(e) => {
                  const value = e.target.value;
                  setCombinedPrompt(value);
                  if (value.trim() !== "") {
                    setHasPersonalization(true);
                    setIsStep3Ready(false);
                  }
                }}
              />

              <Button
                className="mt-3 w-full text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                type="button"
                onClick={handleUpdatePrompt}
                disabled={isRefining || !basePrompt}
              >
                {isRefining && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isRefining ? "Updating Prompt..." : "Update Prompt (Spin)"}
              </Button>
            </div>
          </div>
        </div>

        {/* Saved Output Prompt – auto height with min/max */}
        <div className="border-t border-gray-800 p-5 bg-[#0a0a0a]">
          <div className="flex items-center justify_between mb-3">
            <Label className="text-xs text-gray-400">Saved Output Prompt</Label>
            <Button
              onClick={handleGoToStep3}
              className="text-xs bg-blue-500 hover:bg-blue-600 text_WHITE flex items-center gap-1"
              disabled={!isStep3Ready}
            >
              Copy Script to Step 3 (Sora)
            </Button>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 font-mono text-xs text-gray-300 space-y-2 min-h-[300px] max-h-[800px] overflow-y-auto">
            <pre className="whitespace-pre-wrap break-words text-[11px] leading-snug">
              {generatedPrompt ||
                "Your Sora-ready prompt will appear here after Step 1 / Step 2."}
            </pre>
          </div>

          {refineError && (
            <p className="mt-2 text-xs text-red-400">{refineError}</p>
          )}
          {isStep3Ready && !refineError && (
            <p className="mt-2 text-xs text-green-400">
              Script ready — click &quot;Copy Script to Step 3&quot; to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingStep2;
