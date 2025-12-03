import {useState, useRef, useEffect} from "react";
import {
    ArrowRight,
    Sparkles,
    Video,
    Calendar,
    Languages,
    CheckCircle,
    Mail,
    Phone,
    MapPin,
    DollarSign,
    X,
    Upload,
    Loader2
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Card} from "@/components/ui/card";
import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import Pricing from "./Pricing";
import Contact from "./Contact";
import type {ReverseResponse} from "@/types/reversePrompt";

const API_BASE_URL = "https://bc07688f8cae.ngrok-free.app";

const PROCESS_STEPS = [
    {
        icon: Sparkles,
        title: "Story & Brand",
        description: "Share your story or write a direct prompt",
        step: 1,
        name: "Input Ideas"
    },
    {
        icon: Sparkles,
        title: "AI Prompt Ideas",
        description: "Get 5 AI-generated content ideas",
        step: 2,
        name: "Personalize"
    },
    {
        icon: Video,
        title: "Generate Video",
        description: "Create videos with Sora2 AI",
        step: 3,
        name: "Cinematize"
    },
    {
        icon: Languages,
        title: "Watermark & Captions",
        description: "Remove watermarks and add multi-language captions",
        step: 4,
        name: "Captionize"
    },
    {
        icon: Calendar,
        title: "Schedule & Publish",
        description: "Auto-schedule to TikTok, Instagram, YouTube",
        step: 5,
        name: "Schedule"
    },
];
const PRICING_PACKAGES = [
    {
        name: "Basic",
        price: 0,
        subtitle: "Free forever",
        features: [
            {text: "No monthly Credits", checked: false},
            {text: "Queue single task only", checked: false},
            {text: "Trial offerings from login", checked: true},
        ],
        buttonText: "Free",
        buttonVariant: "outline",
    },
    {
        name: "Standard",
        price: 79.2,
        originalPrice: 120,
        discount: 34,
        credits: 660,
        creditCost: 1,
        images: 3300,
        videos: 33,
        features: [
            {text: "Queue unlimited tasks", checked: true, highlight: true},
            {text: "Fast-track generation", checked: true},
            {text: "Professional mode for videos", checked: true},
            {text: "Watermark removal", checked: true},
            {text: "Video extension", checked: true},
            {text: "Image upscaling", checked: true},
        ],
        buttonText: "Manage",
        buttonVariant: "secondary",
    },
    {
        name: "Pro",
        price: 293.04,
        originalPrice: 444,
        discount: 34,
        credits: 3000,
        creditCost: 0.81,
        images: 15000,
        videos: 150,
        popular: true,
        features: [
            {text: "Queue unlimited tasks", checked: true, highlight: true},
            {text: "Fast-track generation", checked: true},
            {text: "Professional mode for videos", checked: true},
            {text: "Watermark removal", checked: true},
            {text: "Video extension", checked: true},
            {text: "Image upscaling", checked: true},
            {text: "Priority access to new features", checked: true},
        ],
        buttonText: "Subscribe Pro Yearly",
        buttonVariant: "default",
    },
    {
        name: "Premier",
        price: 728.64,
        originalPrice: 1104,
        discount: 34,
        credits: 8000,
        creditCost: 0.76,
        images: 40000,
        videos: 400,
        features: [
            {text: "Queue unlimited tasks", checked: true, highlight: true},
            {text: "Fast-track generation", checked: true},
            {text: "Professional mode for videos", checked: true},
            {text: "Watermark removal", checked: true},
            {text: "Video extension", checked: true},
            {text: "Image upscaling", checked: true},
            {text: "Priority access to new features", checked: true},
        ],
        buttonText: "Subscribe Premier Yearly",
        buttonVariant: "default",
    },
];
export default function Landing() {
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("tiktok");
    const [activeStep, setActiveStep] = useState(1);
    const [publishPlatform, setPublishPlatform] = useState<"TikTok" | "Instagram" | "YouTube">("TikTok");
    const [publishDate, setPublishDate] = useState("");
    const [publishTime, setPublishTime] = useState("");
    const [autoOptimize, setAutoOptimize] = useState(true);
    const [captionText, setCaptionText] = useState("#AI #Viral #BrandedAI");
    const [errorMessage, setErrorMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showReverseResult, setShowReverseResult] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    // new state for backend reverse call
    const [reverseResult, setReverseResult] = useState<ReverseResponse | null>(null);
    const [isReversing, setIsReversing] = useState(false);
    const [reverseError, setReverseError] = useState<string | null>(null);

    const [embedSrc, setEmbedSrc] = useState("");
    // 🔹 NEW: base prompt coming from Step 1 (reverse API)
    const [basePrompt, setBasePrompt] = useState("");

    // 🔹 NEW: personalization + refine state for Step 2 → Step 3
    const [hasPersonalization, setHasPersonalization] = useState(false);
    const [isStep3Ready, setIsStep3Ready] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [refineError, setRefineError] = useState<string | null>(null);
    const handleReverseFromUrl = async () => {
        const url = searchInput.trim();
        if (!url) return;

        setIsReversing(true);
        setReverseError(null);
        setShowReverseResult(false);

        // Map UI selection to API platform (simple, can refine later)
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

            // 🔹 store original as base prompt & also show it
            setBasePrompt(promptText);
            setGeneratedPrompt(promptText);
            setShowReverseResult(true);

            // new prompt => reset personalization & Step 3 readiness
            setHasPersonalization(false);
            setIsStep3Ready(false);

            // jump to Step 2 once the prompt is ready
            setActiveStep(2);

        } catch (err) {
            console.error("Reverse API error:", err);
            const message =
                err instanceof Error ? err.message : "Failed to reverse this URL. Please try again.";
            setReverseError(message);
        } finally {
            setIsReversing(false);
        }
    };

    const handleContactSubmit = async () => {
        if (!contactForm.name || !contactForm.email || !contactForm.message) {
            alert("Please fill in all fields");
            return;
        }
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert("Message sent! We'll get back to you soon.");
        setContactForm({name: "", email: "", message: ""});
        setIsSubmitting(false);
    };
    const isStep1Complete = () => !!searchInput.trim();
    const handleStepChange = (step: number) => {
        if (step > 1 && !isStep1Complete()) {
            setErrorMessage("Please complete Step 1 first.");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        // 🔹 Block Step 3 until script is prepared via "Copy Script to Step 3"
        if (step === 3 && !isStep3Ready) {
            setErrorMessage("Please use 'Copy Script to Step 3' in Step 2 first.");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        setActiveStep(step);
    };
    const handleCopyScriptToStep3 = async () => {
        if (!basePrompt.trim()) {
            setErrorMessage("No base prompt from Step 1 yet. Please run 'Reverse from URL' first.");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        // 🧼 If user hasn't changed anything in Step 2 → no refine API call
        if (!hasPersonalization) {
            const promptToUse = basePrompt;

            setGeneratedPrompt(promptToUse);
            setCopiedPrompt(promptToUse);
            setIsStep3Ready(true);
            setActiveStep(3);

            try {
                await navigator.clipboard.writeText(promptToUse);
            } catch {
                // ignore clipboard failures
            }
            return;
        }

        // 🧪 Otherwise: call /v1/reverse/refine
        setIsRefining(true);
        setRefineError(null);

        try {
            const body: any = {
                base_prompt: basePrompt,
            };

            // Only include fields that were actually set:
            if (targetLength !== null) {
                body.target_length_seconds = targetLength;
            }

            if (hookType) {
                const hookThemeMap: Record<string, string> = {
                    "Question": "question",
                    "Bold Claim": "bold_claim",
                    "Positive Hook": "positive",
                    "Story": "story",
                    "Contrarian": "contrarian",
                    "Negative Hook": "negative",
                    "Pain Point Relatability": "pain_point_relatability",
                };
                const theme = hookThemeMap[hookType] || hookType.toLowerCase().replace(/\s+/g, "_");
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
                // map dropdown to actual model names used by your backend
                const modelMap: Record<string, string> = {
                    Groq: "gpt-5-turbo",
                    Claude: "claude-3.5-sonnet",
                    "GPT-4": "gpt-4.1-mini",
                };
                body.model = modelMap[model] || model;
            }

            const resp = await fetch(`${API_BASE_URL}/v1/reverse/refine`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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

    const handleSearchSubmit = () => {
        if (searchInput.trim()) {
            console.log('Searching for:', searchInput, 'Platform:', selectedPlatform);
            setActiveStep(2);
        }
    };
    const [videoModel, setVideoModel] = useState<"Sora" | "Veo" | "Wan">("Sora");
    const [copiedPrompt, setCopiedPrompt] = useState("");
    const [removeWatermark, setRemoveWatermark] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [captionStyle, setCaptionStyle] = useState("Bold Center");
    const [showPreview, setShowPreview] = useState(true);
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    // 🔹 STEP 2 personalization – start with "unselected"
    const [targetLength, setTargetLength] = useState<number | null>(null);
    const [hookType, setHookType] = useState<string | null>(null);
    const [cta, setCta] = useState<string | null>(null); // "Follow for More" | "Link in Bio" | "Custom" | null
    const [customCta, setCustomCta] = useState("");
    const [model, setModel] = useState<string>("");      // "" = no preference
    const [combinedPrompt, setCombinedPrompt] = useState<string>(""); // empty = none

    // ⛔️ REMOVE the old `outputPrompt` constant completely

    const getPlaceholder = () => {
        switch (selectedPlatform) {
            case 'instagram':
                return '@username';
            case 'tiktok':
                return 'https://tiktok.com/@user/video/1234567890';
            case 'keyword':
                return 'food, makeup, fitness';
            case 'url':
                return 'https://instagram.com/p/abc123 or any post URL';
            case 'text':
                return 'Paste transcribed text from audio recording';
            default:
                return 'Enter your input here';
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            transcribeFile(e.target.files[0]);
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
    const transcribeFile = async (uploadedFile: File) => {
        setFile(uploadedFile);
        setIsTranscribing(true);
        setTranscriptionError(null);
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('model_id', 'scribe_v1');
        try {
            const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text/convert', {
                method: 'POST',
                headers: {
                    'xi-api-key': 'sk_0cf4edc045464432d6041e91bb2bcf63e8bf03b95bbee960'
                },
                body: formData
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSearchInput(data.text || data.transcript || '');
        } catch (error) {
            console.error('Transcription error:', error);
            setTranscriptionError('Failed to transcribe the file. Please try again.');
        } finally {
            setIsTranscribing(false);
        }
    };
    const getEmbedUrl = (url: string) => {
        if (url.includes('tiktok.com')) {
            const match = url.match(/\/video\/(\d+)/);
            if (match) {
                return `https://www.tiktok.com/embed/v2/${match[1]}`;
            }
        } else if (url.includes('instagram.com')) {
            const match = url.match(/\/(p|reel|reels)\/([^/?]+)/);
            if (match) {
                const type = match[1] === 'p' ? 'p' : 'reel';
                return `https://www.instagram.com/${type}/${match[2]}/embed/`;
            }
        }
        return null;
    };
    useEffect(() => {
        const src = getEmbedUrl(searchInput);
        setEmbedSrc(src || '');
    }, [searchInput]);
    const isLinkEntered = searchInput.includes('instagram.com') || searchInput.includes('tiktok.com');
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section id="home"
                     className="relative min-h-screen flex items-center justify-center px-4 py-20 md:pt-20 bg-gray-950">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent"/>

                <div className="container mx-auto relative z-10 max-w-7xl">
                    {/* Badge */}
                    <div className="text-center mb-6 md:mb-8">
                        <div className="inline-block">
              <span
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-blue-500/30 text-xs md:text-sm bg-blue-500/10 backdrop-blur text-blue-400">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4"/>
                AI-Powered Video Creation
              </span>
                        </div>
                    </div>
                    {/* Main Heading */}
                    <div className="text-center mb-8 md:mb-12 px-4">
                        <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-3 md:mb-4 text-white leading-tight">
                            ReCreate Viral Videos<br/>
                            <span className="text-2xl sm:text-3xl md:text-6xl">Effortlessly</span>
                        </h1>
                    </div>
                    {/* Main Interface - Full Width */}
                    <div className="max-w-6xl mx-auto">
                        <div>
                            {/* Steps Header - Horizontally Scrollable */}
                            <div className="px-4 py-3 md:py-4 overflow-x-auto mb-0">
                                <div className="flex gap-3 md:gap-8 min-w-max md:min-w-0">
                                    {PROCESS_STEPS.map((step) => (
                                        <button
                                            key={step.step}
                                            onClick={() => handleStepChange(step.step)}
                                            className={`flex items-center gap-2 md:gap-3 shrink-0 transition-all ${
                                                activeStep === step.step ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                                            }`}
                                        >
                                            <div
                                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base transition-colors ${
                                                    activeStep === step.step
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-700 text-gray-300'
                                                }`}>
                                                {step.step}
                                            </div>
                                            <span className={`font-medium text-xs md:text-base whitespace-nowrap ${
                                                activeStep === step.step ? 'text-white' : 'text-gray-500'
                                            }`}>
                        {step.name}
                      </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Content Area */}
                            <div className="px-0 md:px-4">
                                {errorMessage && (
                                    <div className="text-center text-red-500 mb-4 transition-opacity duration-300">
                                        {errorMessage}
                                    </div>
                                )}
                                {/* Step 1 - Input Section */}
                                {activeStep === 1 && (
                                    <div className="mb-6">
                                        <div
                                            className="px-1 md:px-3 flex flex-col p-4 md:p-8 bg-gray-900/50 rounded-lg border border-gray-700 min-h-[200px] w-full">
                                            <div className="flex-1 w-full">
                                                {/* Platform Selection */}
                                                <div
                                                    className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-4 md:mb-6">
                                                    <Button
                                                        variant="outline"
                                                        className={`text-xs md:text-sm border-gray-600 text-gray-300 hover:bg-gray-800 ${selectedPlatform === 'url' ? 'bg-gray-700 border-gray-500' : 'bg-gray-900'}`}
                                                        onClick={() => setSelectedPlatform('url')}
                                                    >
                                                        Post URL
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className={`text-xs md:text-sm border-gray-600 text-gray-300 hover:bg-gray-800 ${selectedPlatform === 'instagram' ? 'bg-gray-700 border-gray-500' : 'bg-gray-900'}`}
                                                        onClick={() => setSelectedPlatform('instagram')}
                                                    >
                                                        Instagram
                                                    </Button>
                                                    <Button
                                                        className={`text-xs md:text-sm ${selectedPlatform === 'tiktok' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                                                        onClick={() => setSelectedPlatform('tiktok')}
                                                    >
                                                        TikTok
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className={`text-xs md:text-sm border-gray-600 text-gray-300 hover:bg-gray-800 ${selectedPlatform === 'keyword' ? 'bg-gray-700 border-gray-500' : 'bg-gray-900'}`}
                                                        onClick={() => setSelectedPlatform('keyword')}
                                                    >
                                                        Niche Keyword
                                                    </Button>
                                                    <Button
                                                        className={`text-xs md:text-sm ${selectedPlatform === 'text' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                                                        onClick={() => setSelectedPlatform('text')}
                                                    >
                                                        Paste Narration Text
                                                    </Button>
                                                </div>
                                                {/* Single Input Bar with AI Icon */}
                                                <div className="relative mb-4">
                                                    {selectedPlatform === 'text' ? (
                                                        <Textarea
                                                            value={searchInput}
                                                            onChange={(e) => setSearchInput(e.target.value)}
                                                            placeholder={getPlaceholder()}
                                                            className="w-full bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 min-h-[100px] pr-12 text-sm md:text-base rounded-lg"
                                                        />
                                                    ) : (
                                                        <Input
                                                            value={searchInput}
                                                            onChange={(e) => setSearchInput(e.target.value)}
                                                            onKeyPress={handleKeyPress}
                                                            placeholder={getPlaceholder()}
                                                            className="w-full bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 pr-12 text-sm md:text-base"
                                                        />
                                                    )}
                                                    <button
                                                        onClick={handleSearchSubmit}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                        disabled={!searchInput.trim()}
                                                        title="Search with AI"
                                                    >
                                                        <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white"/>
                                                    </button>
                                                </div>

                                                {/* Reverse Button – talks to FastAPI backend */}
                                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                                    <Button
                                                        onClick={handleReverseFromUrl}
                                                        disabled={!searchInput.trim() || isReversing}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
                                                    >
                                                        {isReversing && (
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                        )}
                                                        {isReversing ? "Analyzing video..." : "Reverse from URL"}
                                                    </Button>
                                                    <p className="text-xs text-gray-400">
                                                        This step can take up to ~2 minutes. Please keep this tab open.
                                                    </p>
                                                </div>

                                                {reverseError && (
                                                    <p className="text-xs text-red-400 mb-2">
                                                        {reverseError}
                                                    </p>
                                                )}

                                                {showReverseResult && !isReversing && (
                                                    <p className="text-xs text-green-400 mb-2">
                                                        Reverse prompt ready — check &quot;Prompt from Step 1&quot; in
                                                        Step 2.
                                                    </p>
                                                )}


                                                {selectedPlatform === 'text' && (
                                                    <div className="flex gap-6 items-start">
                                                        <div className="flex-1">
                                                            <p className="text-sm text-gray-300 mb-4">
                                                                Updated iPhones have Voice Memo app with voice
                                                                transcription on text feature. You can play the video on
                                                                desktop and manually record on your phone and paste text
                                                                here.
                                                            </p>
                                                            <div
                                                                className="mt-4 p-6 border border-dashed border-blue-500 rounded-lg text-center bg-gray-800/50"
                                                                onDragOver={handleDragOver}
                                                                onDrop={handleDrop}
                                                            >
                                                                <Upload
                                                                    className="mx-auto h-12 w-12 text-gray-400 mb-2"/>
                                                                <p className="text-sm text-gray-300 mb-2">Drop audio or
                                                                    video here</p>
                                                                <p className="text-xs text-gray-500 mb-4">Supported
                                                                    files: Audio: wav, mp3, m4a, aac, flac, ogg<br/>Video:
                                                                    mp4, mov, m4v</p>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => fileInputRef.current?.click()}
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
                                                                {isTranscribing &&
                                                                    <p className="text-sm text-blue-500 mt-4">Transcribing...</p>}
                                                                {file && !isTranscribing &&
                                                                    <p className="text-sm text-green-500 mt-4">File
                                                                        uploaded: {file.name}</p>}
                                                                {transcriptionError &&
                                                                    <p className="text-sm text-red-500 mt-4">{transcriptionError}</p>}
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
                                                    {selectedPlatform === 'instagram' && (
                                                        <>
                                                            <button
                                                                onClick={() => setSearchInput('@beautyinfluencer')}
                                                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                                                            >
                                                                @beautyinfluencer
                                                            </button>
                                                            <button
                                                                onClick={() => setSearchInput('@fitnessguru')}
                                                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                                                            >
                                                                @fitnessguru
                                                            </button>
                                                        </>
                                                    )}
                                                    {selectedPlatform === 'tiktok' && (
                                                        <>
                                                            <button
                                                                onClick={() => setSearchInput('https://tiktok.com/@user/video/1234567890')}
                                                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                                                            >
                                                                TikTok video URL
                                                            </button>
                                                            <button
                                                                onClick={() => setSearchInput('https://tiktok.com/@creator/video/9876543210')}
                                                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                                                            >
                                                                Another example
                                                            </button>
                                                        </>
                                                    )}
                                                    {selectedPlatform === 'keyword' && (
                                                        <>
                                                            <button
                                                                onClick={() => setSearchInput('food')}
                                                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                                                            >
                                                                food
                                                            </button>
                                                            <button
                                                                onClick={() => setSearchInput('makeup')}
                                                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                                                            >
                                                                makeup
                                                            </button>
                                                            <button
                                                                onClick={() => setSearchInput('fitness')}
                                                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                                                            >
                                                                fitness
                                                            </button>
                                                        </>
                                                    )}
                                                    {selectedPlatform === 'url' && (
                                                        <>
                                                            <button
                                                                onClick={() => setSearchInput('https://instagram.com/p/abc123')}
                                                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                                                            >
                                                                Instagram post
                                                            </button>
                                                            <button
                                                                onClick={() => setSearchInput('https://youtube.com/watch?v=xyz789')}
                                                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                                                            >
                                                                YouTube video
                                                            </button>
                                                        </>
                                                    )}
                                                    {selectedPlatform === 'text' && (
                                                        <>
                                                            <button
                                                                onClick={() => setSearchInput('Sample transcribed text: This is a test narration.')}
                                                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition-colors"
                                                            >
                                                                Sample narration
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {/* [Other steps 2–5 unchanged - keep your original code] */}
                                {/* ──────────────────────── STEP 2 – PERSONALIZE (FULLY INTERACTIVE) ──────────────────────── */}
                                {activeStep === 2 && (
                                    <div className="px-0 py-2">

                                        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
                                            {/* Header */}
                                            <div
                                                className="flex items-center justify-between p-5 border-b border-gray-800">
                                                <div className="flex items-center gap-3">
                                                    <Sparkles className="w-8 h-8 text-blue-500"/>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">Personalize</h3>
                                                        <p className="text-sm text-gray-500">
                                                            Reverse-engineered prompts from URL/username/keyword/news
                                                            article
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-medium px-5">
                                                    Reverse Engineer
                                                </Button>
                                            </div>
                                            {/* Body – Two Columns */}
                                            <div className="grid md:grid-cols-2 gap-6 p-5">
                                                {/* LEFT COLUMN */}
                                                <div className="space-y-5">
                                                    {/* Prompt Box from Step 1 - Moved to top */}
                                                    <div>
                                                        <Label className="text-xs text-gray-400">Prompt from Step
                                                            1</Label>
                                                        <Textarea
                                                            rows={6}
                                                            className="mt-1 bg-[#1a1a1a] border-gray-700 text-gray-300 text-xs placeholder:text-gray-500 resize-none"
                                                            value={generatedPrompt}
                                                            onChange={(e) => setGeneratedPrompt(e.target.value)}
                                                        />
                                                    </div>
                                                    {/* URL Input */}
                                                    <div>
                                                        <Label className="text-xs text-gray-400">URL / username /
                                                            keyword</Label>
                                                        <div className="relative mt-1">
                                                            <Input
                                                                placeholder="https://www.instagram.com/username/post/1234"
                                                                className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500 pr-10"
                                                                value={searchInput}
                                                                onChange={(e) => setSearchInput(e.target.value)}
                                                            />
                                                            <Sparkles
                                                                className="absolute right-3 top-3 w-5 h-5 text-gray-500"/>
                                                        </div>
                                                    </div>
                                                    {/* Video Preview (Optional Pre-fill) */}
                                                    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                                                        <p className="text-xs text-gray-400 mb-3">Optionally Pre-filled
                                                            from Step 1</p>
                                                        <div
                                                            className="aspect-[5/4] bg-black rounded overflow-hidden relative">
                                                            <img
                                                                src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=300&h=500&fit=crop"
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div
                                                                className="absolute inset-0 flex items-center justify-center">
                                                                <p className="text-white text-3xl font-bold drop-shadow-lg"
                                                                   style={{textShadow: '2px 2px 6px rgba(0,0,0,0.8)'}}>
                                                                    BrandedAI
                                                                </p>
                                                            </div>
                                                            <div
                                                                className="absolute bottom-2 left-2 flex items-center gap-3 text-white text-xs">
                                                                <span>21K</span>
                                                                <span>16.2K</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Saved Story */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <Label className="text-xs text-gray-400">My Saved
                                                                Story</Label>
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
                                                        <p className="text-xs text-red-400 mt-2">
                                                            Allow admin to edit GPT prompt for MyStory Agent to ask the
                                                            user questions about their target audience, values,
                                                            perspective
                                                        </p>
                                                    </div>
                                                    {/* Persona Tags */}
                                                    <div>
                                                        <p className="text-xs text-gray-400 mb-2">For this video - ONLY
                                                            emphasize these personal traits:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["Laid off tech worker", "Conspiracy theorist"].map((tag, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-xs text-blue-300 flex items-center gap-1 hover:bg-blue-500/30 transition"
                                                                >
                                  {tag}
                                                                    <button
                                                                        onClick={() => alert(`Remove: ${tag}`)}
                                                                        className="hover:text-white"
                                                                    >
                                    <X className="w-3 h-3"/>
                                  </button>
                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* RIGHT COLUMN – Controls */}
                                                <div className="space-y-5">
                                                    {/* Target Length */}
                                                    <div>
                                                        <Label className="text-xs text-gray-400">Target Length of
                                                            Reel/TikTok/Short</Label>
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
                                                    {/* Hook Style */}
                                                    <div>
                                                        <Label className="text-xs text-gray-400">Hook</Label>
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            {["Question", "Bold Claim", "Positive Hook", "Story", "Contrarian", "Negative Hook", "Pain Point Relatability"].map((h) => (
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
                                                            <option>Groq</option>
                                                            <option>Claude</option>
                                                            <option>GPT-4</option>
                                                        </select>
                                                    </div>
                                                    {/* Instructions (Combined Prompt) */}
                                                    <div>
                                                        <Label className="text-xs text-gray-400">Instructions (Combined
                                                            Prompt)</Label>
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
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Saved Output Prompt */}
                                            <div className="border-t border-gray-800 p-5 bg-[#0a0a0a]">
                                                <div className="flex items-center justify-between mb-3">
                                                    <Label className="text-xs text-gray-400">Saved Output Prompt</Label>
                                                    <Button
                                                        onClick={handleCopyScriptToStep3}
                                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                                                        disabled={isRefining || !basePrompt}
                                                    >
                                                        {isRefining && <Loader2 className="w-3 h-3 animate-spin"/>}
                                                        {isRefining ? "Preparing script..." : "Copy Script to Step 3 (Sora)"}
                                                    </Button>
                                                </div>

                                                <div
                                                    className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 font-mono text-xs text-gray-300 space-y-2">
                                                  <pre className="whitespace-pre-wrap break-words text-[11px] leading-snug">
                                                    {generatedPrompt || "Your Sora-ready prompt will appear here after Step 1 / Step 2."}
                                                  </pre>
                                                </div>

                                                {refineError && (
                                                    <p className="mt-2 text-xs text-red-400">{refineError}</p>
                                                )}
                                                {isStep3Ready && !refineError && (
                                                    <p className="mt-2 text-xs text-green-400">
                                                        Script ready — opened in Step 3.
                                                    </p>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* ──────────────────────── STEP 3 – CINEMATIZE (SORA / VEO / WAN) ──────────────────────── */}
                                {activeStep === 3 && (
                                    <div className="px-0 py-2">
                                        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
                                            {/* Header */}
                                            <div
                                                className="flex items-center justify-between p-5 border-b border-gray-800">
                                                <div className="flex items-center gap-3">
                                                    <Video className="w-8 h-8 text-blue-500"/>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">Cinematize</h3>
                                                        <p className="text-sm text-gray-500">Generate video using AI —
                                                            powered by your script</p>
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
                                                {/* Prompt Box from Step 1 - Added at top */}
                                                <div>
                                                    <Label className="text-xs text-gray-400">Prompt from Step 1</Label>
                                                    <Textarea
                                                        rows={6}
                                                        className="mt-1 bg-[#1a1a1a] border-gray-700 text-gray-300 text-xs placeholder:text-gray-500 resize-none"
                                                        value={generatedPrompt}
                                                        onChange={(e) => {
                                                            setGeneratedPrompt(e.target.value);
                                                            setBasePrompt(e.target.value);
                                                            setHasPersonalization(true);
                                                            setIsStep3Ready(false);
                                                        }}
                                                    />

                                                </div>
                                                {/* Copied Prompt Display */}
                                                {copiedPrompt && (
                                                    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                                                        <p className="text-xs text-gray-400 mb-2">Script from Step 2
                                                            (Auto-filled)</p>
                                                        <div
                                                            className="bg-[#0a0a0a] p-3 rounded font-mono text-xs text-gray-300 max-h-32 overflow-y-auto">
                                                            {copiedPrompt}
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Video Previews */}
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-3">Video Previews (Generating
                                                        with {videoModel}...)</p>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        {[1, 2].map((i) => (
                                                            <div
                                                                key={i}
                                                                className="aspect-[5/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 relative group cursor-pointer hover:border-blue-500 transition"
                                                            >
                                                                <div
                                                                    className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="text-center">
                                                                        <Video
                                                                            className="w-12 h-12 text-blue-500 mx-auto mb-2"/>
                                                                        <p className="text-sm text-gray-400">Preview {i}</p>
                                                                        <p className="text-xs text-gray-500 mt-1">Click
                                                                            to play</p>
                                                                    </div>
                                                                </div>
                                                                {/* Optional: Add play button overlay */}
                                                                <div
                                                                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                                    <div
                                                                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                                                        <div
                                                                            className="w-0 h-0 border-l-8 border-l-white border-y-transparent border-y-8 border-r-0 ml-1"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Generate Button */}
                                                <div className="flex justify-center">
                                                    <Button
                                                        onClick={() => alert(`Generating video with ${videoModel}...`)}
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
                                {/* ──────────────────────── STEP 4 – CAPTIONIZE (WATERMARK + CAPTIONS) ──────────────────────── */}
                                {activeStep === 4 && (
                                    <div className="px-0 py-2">
                                        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
                                            {/* Header */}
                                            <div
                                                className="flex items-center justify-between p-5 border-b border-gray-800">
                                                <div className="flex items-center gap-3">
                                                    <Languages className="w-8 h-8 text-blue-500"/>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">Captionize</h3>
                                                        <p className="text-sm text-gray-500">Remove watermarks & add
                                                            global captions</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => alert("Video finalized and ready for download!")}
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
                                                        <p className="text-xs text-gray-400">Live Preview (with
                                                            captions)</p>
                                                        <button
                                                            onClick={() => setShowPreview(!showPreview)}
                                                            className="text-xs text-blue-400 hover:underline"
                                                        >
                                                            {showPreview ? "Hide" : "Show"} Preview
                                                        </button>
                                                    </div>
                                                    {showPreview && (
                                                        <div
                                                            className="aspect-[16/9] bg-black rounded-lg overflow-hidden border border-gray-700 relative">
                                                            <img
                                                                src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=700&fit=crop"
                                                                alt="Video"
                                                                className="w-full h-full object-cover"
                                                            />
                                                            {/* Watermark (conditionally hidden) */}
                                                            {!removeWatermark && (
                                                                <div
                                                                    className="absolute top-4 right-4 bg-white/80 text-black text-xs px-2 py-1 rounded font-bold">
                                                                    TikTok @user
                                                                </div>
                                                            )}
                                                            {/* Caption Overlay */}
                                                            <div className={`
                                absolute bottom-8 left-1/2 transform -translate-x-1/2
                                px-4 py-2 rounded-lg text-white font-bold text-lg
                                ${captionStyle.includes("Bold") ? "bg-black/60 backdrop-blur" : "bg-transparent"}
                                ${captionStyle.includes("Center") ? "text-center w-full max-w-xs" : "text-left"}
                                ${captionStyle.includes("Top") ? "top-8 bottom-auto" : ""}
                                ${captionStyle.includes("Animated") ? "animate-pulse" : ""}
                              `}>
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
                                                                    className={`w-5 h-5 ${removeWatermark ? "text-green-500" : "text-gray-600"}`}/>
                                                                <span className="text-white font-medium text-sm">Watermark Removal</span>
                                                            </div>
                                                            <button
                                                                onClick={() => setRemoveWatermark(!removeWatermark)}
                                                                className={`w-10 h-5 rounded-full relative transition ${removeWatermark ? "bg-blue-500" : "bg-gray-600"}`}
                                                            >
                                                                <span
                                                                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${removeWatermark ? "translate-x-5" : ""}`}/>
                                                            </button>
                                                        </div>
                                                        <p className="text-xs text-gray-400">Auto-detect and remove
                                                            platform watermarks</p>
                                                    </div>
                                                    {/* Language Selector */}
                                                    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Languages className="w-5 h-5 text-blue-400"/>
                                                            <span className="text-white font-medium text-sm">Caption Language</span>
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
                                                        <p className="text-xs text-gray-400 mt-2">Auto-translate & sync
                                                            captions</p>
                                                    </div>
                                                    {/* Caption Style */}
                                                    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Sparkles className="w-5 h-5 text-purple-400"/>
                                                            <span className="text-white font-medium text-sm">Caption Style</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {["Bold Center", "Minimal", "Top Banner", "Animated"].map((style) => (
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
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-2">Customize position,
                                                            font & animation</p>
                                                    </div>
                                                </div>
                                                {/* Caption Editor */}
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-2">Edit Caption Text (per
                                                        scene)</p>
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
                                                        <Button size="sm"
                                                                className="text-xs bg-blue-500 hover:bg-blue-600">
                                                            Auto-Generate Captions
                                                        </Button>
                                                    </div>
                                                </div>
                                                {/* Export Options */}
                                                <div
                                                    className="flex justify-between items-center pt-4 border-t border-gray-800">
                                                    <div className="text-xs text-gray-500">
                                                        <p>Format: MP4 • 1080p • 30fps</p>
                                                        <p>Estimated size: ~45MB</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" className="text-xs">
                                                            Preview in Editor
                                                        </Button>
                                                        <Button size="sm"
                                                                className="text-xs bg-green-600 hover:bg-green-500">
                                                            Download Now
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* ──────────────────────── STEP 5 – SCHEDULE & PUBLISH ──────────────────────── */}
                                {activeStep === 5 && (
                                    <div className="px-0 py-2">
                                        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
                                            {/* Header */}
                                            <div
                                                className="flex items-center justify-between p-5 border-b border-gray-800">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-8 h-8 text-blue-500"/>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">Schedule &
                                                            Publish</h3>
                                                        <p className="text-sm text-gray-500">Auto-post to TikTok,
                                                            Instagram, YouTube</p>
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
                                                        onClick={() => alert(`Scheduled for ${publishDate} ${publishTime}`)}
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
                                                                name: "TikTok",
                                                                icon: "video",
                                                                color: "from-pink-500 to-red-500"
                                                            },
                                                            {
                                                                name: "Instagram",
                                                                icon: "camera",
                                                                color: "from-purple-500 to-pink-500"
                                                            },
                                                            {
                                                                name: "YouTube",
                                                                icon: "youtube",
                                                                color: "from-red-500 to-red-600"
                                                            },
                                                        ].map((plat) => (
                                                            <button
                                                                key={plat.name}
                                                                onClick={() => setPublishPlatform(plat.name as any)}
                                                                className={`p-4 rounded-lg border transition ${
                                                                    publishPlatform === plat.name
                                                                        ? "bg-gradient-to-br ${plat.color} text-white border-transparent"
                                                                        : "bg-[#1a1a1a] border-gray-700 text-gray-400 hover:bg-gray-800"
                                                                }`}
                                                            >
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <div
                                                                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                                        {plat.icon === "video" && <div
                                                                            className="w-0 h-0 border-l-4 border-l-white border-y-transparent border-y-4 border-r-0 ml-1"/>}
                                                                        {plat.icon === "camera" && <div
                                                                            className="w-5 h-5 bg-white rounded-sm"/>}
                                                                        {plat.icon === "youtube" && <div
                                                                            className="w-5 h-3 bg-white rounded-sm"/>}
                                                                    </div>
                                                                    <span
                                                                        className="text-xs font-medium">{plat.name}</span>
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
                                                        <Label className="text-xs text-gray-400">Time (Your
                                                            Timezone)</Label>
                                                        <Input
                                                            type="time"
                                                            className="mt-1 bg-[#1a1a1a] border-gray-700 text-white text-sm"
                                                            value={publishTime}
                                                            onChange={(e) => setPublishTime(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Auto-Optimize Toggle */}
                                                <div
                                                    className="flex items-center justify-between bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                                                    <div className="flex items-center gap-3">
                                                        <Sparkles className="w-5 h-5 text-yellow-400"/>
                                                        <div>
                                                            <p className="text-white font-medium text-sm">Auto-Optimize
                                                                for {publishPlatform}</p>
                                                            <p className="text-xs text-gray-400">Best time, hashtags,
                                                                thumbnail</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setAutoOptimize(!autoOptimize)}
                                                        className={`w-10 h-5 rounded-full relative transition ${autoOptimize ? "bg-blue-500" : "bg-gray-600"}`}
                                                    >
                                                        <span
                                                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${autoOptimize ? "translate-x-5" : ""}`}/>
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
                                                        {["#AI", "#Viral", "#BrandedAI", "#Tech", "#Motivation"].map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="text-xs px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-300"
                                                            >
                                {tag}
                              </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Post Preview */}
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-3">Post Preview</p>
                                                    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                                                        <div
                                                            className="aspect-[16/9] bg-black rounded overflow-hidden mb-3 relative">
                                                            <img
                                                                src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=700&fit=crop"
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute bottom-4 left-4 text-white">
                                                                <p className="font-bold text-lg">This changed
                                                                    everything...</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <div
                                                                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shrink-0"/>
                                                            <div className="flex-1">
                                                                <p className="text-white text-sm font-medium">@yourbrand</p>
                                                                <p className="text-gray-400 text-xs line-clamp-2">{captionText}</p>
                                                                <p className="text-gray-500 text-xs mt-1">Just now</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Final Actions */}
                                                <div
                                                    className="flex justify-center gap-3 pt-4 border-t border-gray-800">
                                                    <Button variant="outline" size="sm" className="text-xs">
                                                        Save as Draft
                                                    </Button>
                                                    <Button size="sm"
                                                            className="text-xs bg-green-600 hover:bg-green-500">
                                                        Publish to {publishPlatform}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        
                        {/* [Rest of your hero content - unchanged] */}
                        {activeStep === 1 && (
                            <div className="mt-2 md:mt-16 space-y-6 md:space-y-8">

                                <div className="bg-transparent rounded-lg p-3 md:p-6">
                                    {isLinkEntered && (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                            <div>
                                                <h4 className="text-white text-xs md:text-sm mb-2 md:mb-3 font-medium">Preview</h4>
                                                <div
                                                    className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 max-w-sm mx-auto lg:max-w-none">
                                                    <div className="relative aspect-[9/16]">
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
                                            <div
                                                className="bg-gray-900 rounded-lg p-3 md:p-4 mt-0 lg:mt-20 space-y-3 md:space-y-4 border border-gray-800">
                                                {/* Comments */}
                                                <div className="space-y-2 border-t border-gray-800 pt-2">
                                                    <h5 className="text-white text-xs font-medium">Comments</h5>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                                                        <div>
                                                            <p className="text-gray-300 text-xs font-semibold">@nba_slimzy</p>
                                                            <p className="text-gray-400 text-xs">💯💯💯</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                                                        <div>
                                                            <p className="text-gray-300 text-xs font-semibold">@steve.kailu</p>
                                                            <p className="text-gray-400 text-xs">@centralcee Can't rush
                                                                greatness 💪🏾💯</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                                                        <div>
                                                            <p className="text-gray-300 text-xs font-semibold">@budu_gad</p>
                                                            <p className="text-gray-400 text-xs">Live yours 🥂👏💯</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                                                        <div>
                                                            <p className="text-gray-300 text-xs font-semibold">@jay.bourny</p>
                                                            <p className="text-gray-400 text-xs">🙌🙌</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                                                        <div>
                                                            <p className="text-gray-300 text-xs font-semibold">@_mamiiie_</p>
                                                            <p className="text-gray-400 text-xs">❤️❤️❤️facts</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                                                        <div>
                                                            <p className="text-gray-300 text-xs font-semibold">@lifemotivus</p>
                                                            <p className="text-gray-400 text-xs">embrace the journey
                                                                🔥</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                                                        <div>
                                                            <p className="text-gray-300 text-xs font-semibold">@simon___325</p>
                                                            <p className="text-gray-400 text-xs">🔥🔥🔥🔥🔥🔥🔥</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                                                        <div>
                                                            <p className="text-gray-300 text-xs font-semibold">@reallfxalexg</p>
                                                            <p className="text-gray-400 text-xs">🔥🔥</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                                                        <div>
                                                            <p className="text-gray-300 text-xs font-semibold">@adrianojunior009</p>
                                                            <p className="text-gray-400 text-xs">Believe yourself❤️</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                                                        <div>
                                                            <p className="text-gray-300 text-xs font-semibold">@nopeacexi</p>
                                                            <p className="text-gray-400 text-xs">True</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                                                        <div>
                                                            <p className="text-gray-300 text-xs font-semibold">@lyxon_0_1</p>
                                                            <p className="text-gray-400 text-xs">🔥🔥🔥</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {/* Process Section */}
            <section id="process" className="py-12 md:py-24 px-4 bg-gray-950">
                <div className="container mx-auto">
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
                                            <div
                                                className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <step.icon className="w-5 h-5 md:w-7 md:h-7 text-blue-500"/>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                                <span
                                                    className="text-xs md:text-sm font-medium text-blue-400">Step {step.step}</span>
                                                <h3 className="text-base md:text-xl font-semibold text-white">{step.title}</h3>
                                            </div>
                                            <p className="text-sm md:text-base text-gray-400">{step.description}</p>
                                        </div>
                                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-500 shrink-0"/>
                                    </div>
                                </Card>

                                {index < PROCESS_STEPS.length - 1 && (
                                    <div className="flex justify-center my-3 md:my-4">
                                        <div
                                            className="w-px h-6 md:h-8 bg-gradient-to-b from-blue-500/50 to-transparent"/>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Pricing/>
            <Contact/>
        </div>
    );
}