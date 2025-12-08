import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Upload, Loader2 } from "lucide-react";

type Props = any;

const LandingStep1: React.FC<Props> & { Preview?: React.FC<Props> } = (props) => {
  const {
    // from sharedProps in Landing.tsx
    searchInput,
    setSearchInput,
    selectedPlatform,
    setSelectedPlatform,
    handleSearchSubmit,
    handleKeyPress,
    handleReverseFromUrl,
    getPlaceholder,

    // reverse-related
    isReversing,
    reverseError,
    showReverseResult,

    // step control
    setActiveStep,

    // prompt state coming from Landing (reverse / transcription)
    basePrompt,
    setBasePrompt,
    generatedPrompt,
    setGeneratedPrompt,

    // preview
    embedSrc,

    // transcription / upload from Landing.tsx
    file,
    isTranscribing,
    transcriptionError,
    handleFileChange,
    handleDragOver,
    handleDrop,
    fileInputRef,
  } = props;

  // 🔹 Local prompt box state (above preview)
  const [promptText, setPromptText] = useState<string>(
    "Hook: Success doesn’t come from what you do occasionally, but from what you do consistently. This is a dummy prompt you can edit."
  );

  // Highlight URL input on focus / when filled
  const [isUrlFocused, setIsUrlFocused] = useState(false);
  const isUrlActive =
    selectedPlatform === "url" &&
    (isUrlFocused || (searchInput && searchInput.trim().length > 0));

  // When reverse result is ready, fill the prompt box with reversed prompt
  useEffect(() => {
    if (showReverseResult && generatedPrompt) {
      setPromptText(generatedPrompt);
    }
  }, [showReverseResult, generatedPrompt]);

  // 🔹 Send edited prompt to Step 2
  const handleSendToStep2 = () => {
    const trimmed = promptText.trim();
    if (!trimmed) return;
    setBasePrompt(trimmed);
    setGeneratedPrompt(trimmed);
    setActiveStep(2);
  };

  return (
    <div className="mb-6">
      <div className="px-1 md:px-3 flex flex-col p-4 md:p-8 bg-gray-900/50 rounded-lg border border-gray-700 min-h-[200px] w-full">
        <div className="flex-1 w-full">
          {/* Platform Selection */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-4 md:mb-6">
            <Button
              variant="outline"
              className={`text-xs md:text-sm border-gray-600 text-gray-300 hover:bg-gray-800 ${
                selectedPlatform === "url"
                  ? "bg-gray-700 border-gray-500"
                  : "bg-gray-900"
              }`}
              onClick={() => setSelectedPlatform("url")}
            >
              Post URL
            </Button>
            <Button
              variant="outline"
              className={`text-xs md:text-sm border-gray-600 text-gray-300 hover:bg-gray-800 ${
                selectedPlatform === "instagram"
                  ? "bg-gray-700 border-gray-500"
                  : "bg-gray-900"
              }`}
              onClick={() => setSelectedPlatform("instagram")}
            >
              Instagram
            </Button>
            <Button
              className={`text-xs md:text-sm ${
                selectedPlatform === "tiktok"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white`}
              onClick={() => setSelectedPlatform("tiktok")}
            >
              TikTok
            </Button>
            <Button
              variant="outline"
              className={`text-xs md:text-sm border-gray-600 text-gray-300 hover:bg-gray-800 ${
                selectedPlatform === "keyword"
                  ? "bg-gray-700 border-gray-500"
                  : "bg-gray-900"
              }`}
              onClick={() => setSelectedPlatform("keyword")}
            >
              Niche Keyword
            </Button>
            <Button
              className={`text-xs md:text-sm ${
                selectedPlatform === "text"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white`}
              onClick={() => setSelectedPlatform("text")}
            >
              Paste Narration Text
            </Button>
          </div>

          {/* Single Input Bar */}
          <div className="relative mb-4">
            {selectedPlatform === "text" ? (
              <Textarea
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full bg-gray-800 border border-gray-600 text-white placeholder:text-gray-400 min-h-[100px] pr-12 text-sm md:text-base rounded-lg"
              />
            ) : (
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsUrlFocused(true)}
                onBlur={() => setIsUrlFocused(false)}
                placeholder={getPlaceholder()}
                className={`w-full bg-gray-800 text-white placeholder:text-gray-400 pr-12 text-sm md:text-base border rounded-lg transition-all ${
                  isUrlActive
                    ? "border-blue-400 shadow-[0_0_0_1px_rgba(96,165,250,0.9)] bg-gray-800/90"
                    : "border-gray-600"
                }`}
              />
            )}

            {/* AI button only when NOT in URL mode */}
            {/* {selectedPlatform !== "url" && (
              <button
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={!searchInput?.trim()}
                title="Search with AI"
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </button>
            )} */}
          </div>


          

          {/* Reverse Button – changes name only for Paste Narration */}
<div className="flex flex-wrap items-center gap-3 mb-4">

  {selectedPlatform === "text" ? (
    // 👉 PASTE NARRATION MODE — rename button
    <Button
      onClick={handleReverseFromUrl}
      disabled={!searchInput.trim() || isReversing}
      className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
    >
      {isReversing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isReversing ? "Analyzing..." : "Generate Detailed Prompt"}
    </Button>
  ) : (
    // 👉 All other modes — original Reverse From URL
    <Button
      onClick={handleReverseFromUrl}
      disabled={!searchInput.trim() || isReversing}
      className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
    >
      {isReversing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isReversing ? "Analyzing video..." : "Reverse from URL"}
    </Button>
  )}

  <p className="text-xs text-gray-400">
    This step can take up to ~2 minutes. Please keep this tab open.
  </p>
</div>


          {reverseError && (
            <p className="text-xs text-red-400 mb-2">{reverseError}</p>
          )}

          {showReverseResult && !isReversing && (
            <p className="text-xs text-green-400 mb-2">
              Reverse prompt ready. Scroll down to edit it and send to Step 2.
            </p>
          )}

          {/* Text + file upload helper (uses handlers from Landing.tsx) */}
          {selectedPlatform === "text" && (
            <div className="flex gap-6 items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-4">
                  Updated iPhones have Voice Memo app with voice transcription on
                  text feature. You can play the video on desktop and manually
                  record on your phone and paste text here, or upload audio/video below.
                </p>
                <div
                  className="mt-4 p-6 border border-dashed border-blue-500 rounded-lg text-center bg-gray-800/50"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-300 mb-2">
                    Drop audio or video here
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Supported files: Audio: wav, mp3, m4a, aac, flac, ogg
                    <br />
                    Video: mp4, mov, m4v
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef?.current?.click()}
                    className="text-sm"
                  >
                    Choose files
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                  />
                  {isTranscribing && (
                    <p className="text-sm text-blue-500 mt-4">
                      Transcribing...
                    </p>
                  )}
                  {file && !isTranscribing && (
                    <p className="text-sm text-green-500 mt-4">
                      File uploaded: {file.name}
                    </p>
                  )}
                  {transcriptionError && (
                    <p className="text-sm text-red-500 mt-4">
                      {transcriptionError}
                    </p>
                  )}
                </div>
              </div>
              <img
                src="/demo-guide.jpeg"
                alt="How to view transcript in Voice Memos app"
                className="w-48 md:w-64 rounded-lg shadow-lg object-contain"
              />
            </div>
          )}

          {/* Example Suggestions */}
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="text-sm text-gray-400">Try:</span>

            {selectedPlatform === "instagram" && (
              <>
                <button
                  onClick={() => setSearchInput("@beautyinfluencer")}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                >
                  @beautyinfluencer
                </button>
                <button
                  onClick={() => setSearchInput("@fitnessguru")}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                >
                  @fitnessguru
                </button>
              </>
            )}

            {selectedPlatform === "tiktok" && (
              <>
                <button
                  onClick={() =>
                    setSearchInput("https://tiktok.com/@user/video/1234567890")
                  }
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                >
                  TikTok video URL
                </button>
                <button
                  onClick={() =>
                    setSearchInput(
                      "https://tiktok.com/@creator/video/9876543210"
                    )
                  }
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                >
                  Another example
                </button>
              </>
            )}

            {selectedPlatform === "keyword" && (
              <>
                <button
                  onClick={() => setSearchInput("food")}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                >
                  food
                </button>
                <button
                  onClick={() => setSearchInput("makeup")}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                >
                  makeup
                </button>
                <button
                  onClick={() => setSearchInput("fitness")}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                >
                  fitness
                </button>
              </>
            )}

            {selectedPlatform === "url" && (
              <>
                <button
                  onClick={() =>
                    setSearchInput("https://instagram.com/p/abc123")
                  }
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                >
                  Instagram post
                </button>
                <button
                  onClick={() =>
                    setSearchInput("https://youtube.com/watch?v=xyz789")
                  }
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                >
                  YouTube video
                </button>
              </>
            )}

            {selectedPlatform === "text" && (
              <button
                onClick={() =>
                  setSearchInput(
                    "Sample transcribed text: This is a test narration."
                  )
                }
                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
              >
                Sample narration
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview + Prompt box */}
      <LandingStep1Preview
        embedSrc={embedSrc}
        promptText={promptText}
        setPromptText={setPromptText}
        showReverseResult={showReverseResult}
        handleSendToStep2={handleSendToStep2}
      />
    </div>
  );
};

// Preview block + Prompt box above it
const LandingStep1Preview: React.FC<Props> = (props) => {
  const { embedSrc, promptText, setPromptText, showReverseResult, handleSendToStep2 } =
    props;

  const hasPrompt = !!promptText?.trim();

  return (
    <div className="mt-2 md:mt-16 space-y-6 md:space-y-8">
      
      {/* Prompt box */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <h4 className="text-white text-sm md:text-base font-medium">
            Prompt Generated from This Video
          </h4>
          <div className="flex items-center gap-3 flex-wrap">
            {showReverseResult && (
              <span className="text-xs text-green-400">
                Reverse prompt ready – you can edit before sending.
              </span>
            )}
            {hasPrompt && (
              <Button
                onClick={handleSendToStep2}
                className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Send to Step 2
              </Button>
            )}
          </div>
        </div>

        <Textarea
          value={promptText}
          onChange={(e) => setPromptText && setPromptText(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 text-white text-sm md:text-base min-h-[140px] rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500"
          placeholder="Your reverse engineered prompt will appear here..."
        />
      </div>

      {/* Preview + Details (your original design) */}
      <div className="bg-transparent rounded-lg p-3 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
          {/* Left: Preview */}
          <div>
            <h4 className="text-white text-xs md:text-sm mb-2 md:mb-3 font-medium">
              Preview
            </h4>
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 max-w-sm mx-auto lg:max-w-none">
              <div className="relative aspect-[4/5]">
                {embedSrc ? (
                  <iframe
                    src={embedSrc}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Video preview"
                  ></iframe>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=700&fit=crop"
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right: Details (unchanged) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white text-xs md:text-sm font-medium">
                Video Details
              </h4>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">
                    @motivationhub
                  </p>
                  <p className="text-gray-400 text-xs">1.2M followers</p>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Success doesn't come from what you do occasionally. It comes
                from what you do consistently. Keep pushing forward, even when
                it's hard. Your future self will thank you. 💪
                <br />
                <br />
                <span className="text-blue-400">
                  #motivation #success #mindset #growth #hustle #entrepreneur
                  #goals
                </span>
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </div>
                  <p className="text-white text-sm font-semibold">24.5K</p>
                  <p className="text-gray-400 text-xs">Likes</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-white text-sm font-semibold">3.2K</p>
                  <p className="text-gray-400 text-xs">Comments</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </div>
                  <p className="text-white text-sm font-semibold">1.8K</p>
                  <p className="text-gray-400 text-xs">Shares</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h5 className="text-white text-sm font-semibold mb-3">
                Performance
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Views</span>
                  <span className="text-white text-sm font-medium">
                    487.3K
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">
                    Engagement Rate
                  </span>
                  <span className="text-green-400 text-sm font-medium">
                    5.8%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Posted</span>
                  <span className="text-white text-sm">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

LandingStep1.Preview = LandingStep1Preview;

export default LandingStep1;
