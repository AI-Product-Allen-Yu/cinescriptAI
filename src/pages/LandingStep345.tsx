import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Video,
  Languages,
  Calendar,
  Sparkles,
  CheckCircle,
} from "lucide-react";

type Steps345Props = {
  activeStep: number;
  setActiveStep: (step: number) => void;

  // shared script/prompt data
  generatedPrompt: string;
  setGeneratedPrompt: (v: string) => void;
  copiedPrompt: string;
  setBasePrompt: (v: string) => void;
  setHasPersonalization: (v: boolean) => void;
  setIsStep3Ready: (v: boolean) => void;

  // step 3
  videoModel: "Sora" | "Veo" | "Wan";
  setVideoModel: (v: "Sora" | "Veo" | "Wan") => void;

  // step 4
  removeWatermark: boolean;
  setRemoveWatermark: (v: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (v: string) => void;
  captionStyle: string;
  setCaptionStyle: (v: string) => void;
  showPreview: boolean;
  setShowPreview: (v: boolean) => void;

  // step 5
  publishPlatform: "TikTok" | "Instagram" | "YouTube";
  setPublishPlatform: (v: "TikTok" | "Instagram" | "YouTube") => void;
  publishDate: string;
  publishTime: string;
  setPublishDate: (v: string) => void;
  setPublishTime: (v: string) => void;
  autoOptimize: boolean;
  setAutoOptimize: (v: boolean) => void;
  captionText: string;
  setCaptionText: (v: string) => void;
};

const LandingStep345: React.FC<Steps345Props> = (props) => {
  const {
    activeStep,
    setActiveStep,
    generatedPrompt,
    setGeneratedPrompt,
    copiedPrompt,
    setBasePrompt,
    setHasPersonalization,
    setIsStep3Ready,
    videoModel,
    setVideoModel,
    removeWatermark,
    setRemoveWatermark,
    selectedLanguage,
    setSelectedLanguage,
    captionStyle,
    setCaptionStyle,
    showPreview,
    setShowPreview,
    publishPlatform,
    setPublishPlatform,
    publishDate,
    publishTime,
    setPublishDate,
    setPublishTime,
    autoOptimize,
    setAutoOptimize,
    captionText,
    setCaptionText,
  } = props;

  return (
    <>
      {/* ───────────────────── STEP 3 – CINEMATIZE ───────────────────── */}
      {activeStep === 3 && (
        <div className="px-0 py-2">
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Video className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="text-xl font-bold text-white">Cinematize</h3>
                  <p className="text-sm text-gray-500">
                    Generate video using AI — powered by your script
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {["Sora", "Veo", "Wan"].map((model) => (
                  <button
                    key={model}
                    onClick={() => setVideoModel(model as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      videoModel === model
                        ? "bg-blue-500 text-white"
                        : "bg-[#1a1a1a] text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6">
              {/* Prompt Box from Step 1 / Step 2 */}
              <div>
                <Label className="text-xs text-gray-400">Prompt from Step 1</Label>
                <Textarea
                  rows={6}
                  className="mt-1 bg-[#1a1a1a] border-gray-700 text-gray-300 text-xs placeholder:text-gray-500 resize-none"
                  value={generatedPrompt}
                  onChange={(e) => {
                    const value = e.target.value;
                    setGeneratedPrompt(value);
                    setBasePrompt(value);
                    setHasPersonalization(true);
                    setIsStep3Ready(false);
                  }}
                />
              </div>

              {/* Copied Prompt Display */}
              {copiedPrompt && (
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">
                    Script from Step 2 (Auto-filled)
                  </p>
                  <div className="bg-[#0a0a0a] p-3 rounded font-mono text-xs text-gray-300 max-h-32 overflow-y-auto">
                    {copiedPrompt}
                  </div>
                </div>
              )}

              {/* Video Previews */}
              <div>
                <p className="text-xs text-gray-400 mb-3">
                  Video Previews (Generating with {videoModel}...)
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="aspect-[5/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 relative group cursor-pointer hover:border-blue-500 transition"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Video className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">Preview {i}</p>
                          <p className="text-xs text-gray-500 mt-1">Click to play</p>
                        </div>
                      </div>
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <div className="w-0 h-0 border-l-8 border-l-white border-y-transparent border-y-8 border-r-0 ml-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={() =>
                    alert(`Generating video with ${videoModel}...`)
                  }
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg"
                >
                  Generate Video with {videoModel}
                </Button>
              </div>

              {/* Credits Info */}
              <div className="text-center text-xs text-gray-500">
                <p>Cost: ~12 credits per 30s video</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────── STEP 4 – CAPTIONIZE ───────────────────── */}
      {activeStep === 4 && (
        <div className="px-0 py-2">
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Languages className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="text-xl font-bold text-white">Captionize</h3>
                  <p className="text-sm text-gray-500">
                    Remove watermarks & add global captions
                  </p>
                </div>
              </div>
              <Button
                onClick={() =>
                  alert("Video finalized and ready for download!")
                }
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white text-sm font-medium px-5"
              >
                Finalize & Download
              </Button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6">
              {/* Video Preview with Live Captions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-400">
                    Live Preview (with captions)
                  </p>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    {showPreview ? "Hide" : "Show"} Preview
                  </button>
                </div>
                {showPreview && (
                  <div className="aspect-[16/9] bg-black rounded-lg overflow-hidden border border-gray-700 relative">
                    <img
                      src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=700&fit=crop"
                      alt="Video"
                      className="w-full h-full object-cover"
                    />
                    {/* Watermark (conditionally hidden) */}
                    {!removeWatermark && (
                      <div className="absolute top-4 right-4 bg-white/80 text-black text-xs px-2 py-1 rounded font-bold">
                        TikTok @user
                      </div>
                    )}
                    {/* Caption Overlay */}
                    <div
                      className={`
                        absolute bottom-8 left-1/2 transform -translate-x-1/2
                        px-4 py-2 rounded-lg text-white font-bold text-lg
                        ${
                          captionStyle.includes("Bold")
                            ? "bg-black/60 backdrop-blur"
                            : "bg-transparent"
                        }
                        ${
                          captionStyle.includes("Center")
                            ? "text-center w-full max-w-xs"
                            : "text-left"
                        }
                        ${
                          captionStyle.includes("Top")
                            ? "top-8 bottom-auto"
                            : ""
                        }
                        ${
                          captionStyle.includes("Animated") ? "animate-pulse" : ""
                        }
                      `}
                    >
                      "This changed everything for me..."
                    </div>
                  </div>
                )}
              </div>

              {/* Controls Grid */}
              <div className="grid md:grid-cols-3 gap-5">
                {/* Watermark Removal */}
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        className={`w-5 h-5 ${
                          removeWatermark ? "text-green-500" : "text-gray-600"
                        }`}
                      />
                      <span className="text-white font-medium text-sm">
                        Watermark Removal
                      </span>
                    </div>
                    <button
                      onClick={() => setRemoveWatermark(!removeWatermark)}
                      className={`w-10 h-5 rounded-full relative transition ${
                        removeWatermark ? "bg-blue-500" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${
                          removeWatermark ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Auto-detect and remove platform watermarks
                  </p>
                </div>

                {/* Language Selector */}
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium text-sm">
                      Caption Language
                    </span>
                  </div>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-600 rounded px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-blue-500"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Arabic</option>
                    <option>Hindi</option>
                    <option>Portuguese</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-2">
                    Auto-translate & sync captions
                  </p>
                </div>

                {/* Caption Style */}
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium text-sm">
                      Caption Style
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {["Bold Center", "Minimal", "Top Banner", "Animated"].map(
                      (style) => (
                        <button
                          key={style}
                          onClick={() => setCaptionStyle(style)}
                          className={`text-xs py-1.5 rounded transition ${
                            captionStyle === style
                              ? "bg-purple-500 text-white"
                              : "bg-[#0a0a0a] text-gray-400 hover:bg-gray-700"
                          }`}
                        >
                          {style}
                        </button>
                      )
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Customize position, font & animation
                  </p>
                </div>
              </div>

              {/* Caption Editor */}
              <div>
                <p className="text-xs text-gray-400 mb-2">
                  Edit Caption Text (per scene)
                </p>
                <Textarea
                  rows={3}
                  placeholder="Enter caption for 0-3s..."
                  className="bg-[#1a1a1a] border-gray-700 text-white text-sm placeholder:text-gray-500"
                  defaultValue="This changed everything for me..."
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    + Add Scene
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs bg-blue-500 hover:bg-blue-600"
                  >
                    Auto-Generate Captions
                  </Button>
                </div>
              </div>

              {/* Export Options */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                <div className="text-xs text-gray-500">
                  <p>Format: MP4 • 1080p • 30fps</p>
                  <p>Estimated size: ~45MB</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Preview in Editor
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs bg-green-600 hover:bg-green-500"
                  >
                    Download Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────── STEP 5 – SCHEDULE & PUBLISH ───────────────────── */}
      {activeStep === 5 && (
        <div className="px-0 py-2">
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Schedule & Publish
                  </h3>
                  <p className="text-sm text-gray-500">
                    Auto-post to TikTok, Instagram, YouTube
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => alert("Video published instantly!")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-medium px-5"
                >
                  Publish Now
                </Button>
                <Button
                  onClick={() =>
                    alert(`Scheduled for ${publishDate} ${publishTime}`)
                  }
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 text-sm font-medium px-5"
                >
                  Schedule
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6">
              {/* Platform Selector */}
              <div>
                <p className="text-xs text-gray-400 mb-3">Select Platform</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      name: "TikTok" as const,
                      icon: "video",
                      color: "from-pink-500 to-red-500",
                    },
                    {
                      name: "Instagram" as const,
                      icon: "camera",
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      name: "YouTube" as const,
                      icon: "youtube",
                      color: "from-red-500 to-red-600",
                    },
                  ].map((plat) => (
                    <button
                      key={plat.name}
                      onClick={() => setPublishPlatform(plat.name)}
                      className={`p-4 rounded-lg border transition ${
                        publishPlatform === plat.name
                          ? `bg-gradient-to-br ${plat.color} text-white border-transparent`
                          : "bg-[#1a1a1a] border-gray-700 text-gray-400 hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          {plat.icon === "video" && (
                            <div className="w-0 h-0 border-l-4 border-l-white border-y-transparent border-y-4 border-r-0 ml-1" />
                          )}
                          {plat.icon === "camera" && (
                            <div className="w-5 h-5 bg-white rounded-sm" />
                          )}
                          {plat.icon === "youtube" && (
                            <div className="w-5 h-3 bg-white rounded-sm" />
                          )}
                        </div>
                        <span className="text-xs font-medium">
                          {plat.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Picker */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-400">Date</Label>
                  <Input
                    type="date"
                    className="mt-1 bg-[#1a1a1a] border-gray-700 text-white text-sm"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">
                    Time (Your Timezone)
                  </Label>
                  <Input
                    type="time"
                    className="mt-1 bg-[#1a1a1a] border-gray-700 text-white text-sm"
                    value={publishTime}
                    onChange={(e) => setPublishTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Auto-Optimize Toggle */}
              <div className="flex items-center justify-between bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium text-sm">
                      Auto-Optimize for {publishPlatform}
                    </p>
                    <p className="text-xs text-gray-400">
                      Best time, hashtags, thumbnail
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoOptimize(!autoOptimize)}
                  className={`w-10 h-5 rounded-full relative transition ${
                    autoOptimize ? "bg-blue-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${
                      autoOptimize ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Caption Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-gray-400">Caption</Label>
                  <button className="text-xs text-blue-400 hover:underline">
                    AI Suggest
                  </button>
                </div>
                <Textarea
                  rows={3}
                  placeholder="Add your caption..."
                  className="bg-[#1a1a1a] border-gray-700 text-white text-sm placeholder:text-gray-500"
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {["#AI", "#Viral", "#BrandedAI", "#Tech", "#Motivation"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-300"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Post Preview */}
              <div>
                <p className="text-xs text-gray-400 mb-3">Post Preview</p>
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                  <div className="aspect-[16/9] bg-black rounded overflow-hidden mb-3 relative">
                    <img
                      src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=700&fit=crop"
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-bold text-lg">
                        This changed everything...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        @yourbrand
                      </p>
                      <p className="text-gray-400 text-xs line-clamp-2">
                        {captionText}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">Just now</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Actions */}
              <div className="flex justify-center gap-3 pt-4 border-t border-gray-800">
                <Button variant="outline" size="sm" className="text-xs">
                  Save as Draft
                </Button>
                <Button
                  size="sm"
                  className="text-xs bg-green-600 hover:bg-green-500"
                >
                  Publish to {publishPlatform}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingStep345;
