import { useState } from "react";
import { ArrowRight, Sparkles, Video, Calendar, Languages, CheckCircle, Mail, Phone, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Pricing from "./Pricing";
import Contact from "./Contact";


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
      { text: "No monthly Credits", checked: false },
      { text: "Queue single task only", checked: false },
      { text: "Trial offerings from login", checked: true },
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
      { text: "Queue unlimited tasks", checked: true, highlight: true },
      { text: "Fast-track generation", checked: true },
      { text: "Professional mode for videos", checked: true },
      { text: "Watermark removal", checked: true },
      { text: "Video extension", checked: true },
      { text: "Image upscaling", checked: true },
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
      { text: "Queue unlimited tasks", checked: true, highlight: true },
      { text: "Fast-track generation", checked: true },
      { text: "Professional mode for videos", checked: true },
      { text: "Watermark removal", checked: true },
      { text: "Video extension", checked: true },
      { text: "Image upscaling", checked: true },
      { text: "Priority access to new features", checked: true },
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
      { text: "Queue unlimited tasks", checked: true, highlight: true },
      { text: "Fast-track generation", checked: true },
      { text: "Professional mode for videos", checked: true },
      { text: "Watermark removal", checked: true },
      { text: "Video extension", checked: true },
      { text: "Image upscaling", checked: true },
      { text: "Priority access to new features", checked: true },
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

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Message sent! We'll get back to you soon.");
    setContactForm({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleSearchSubmit = () => {
    if (searchInput.trim()) {
      console.log('Searching for:', searchInput, 'Platform:', selectedPlatform);
      alert(`Searching ${selectedPlatform}: ${searchInput}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const getPlaceholder = () => {
    switch(selectedPlatform) {
      case 'instagram':
        return '@username';
      case 'tiktok':
        return 'https://tiktok.com/@user/video/1234567890';
      case 'keyword':
        return 'food, makeup, fitness';
      case 'url':
        return 'https://instagram.com/p/abc123 or any post URL';
      default:
        return 'Enter your input here';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 py-20 md:pt-20 bg-gray-950">
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

          {/* Main Heading */}
          <div className="text-center mb-8 md:mb-12 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-3 md:mb-4 text-white leading-tight">
              ReCreate Viral Videos<br />
              <span className="text-2xl sm:text-3xl md:text-6xl">Effortlessly</span>
            </h1>
           
          </div>

          {/* Main Interface - Full Width */}
          <div className="relative mb-2 w-[95vw] sm:w-full mx-auto">
          {/* <div className="max-w-6xl mx-auto"> */}
            <div>
              {/* Steps Header - Horizontally Scrollable */}
              <div className="px-4 py-3 md:py-4 overflow-x-auto mb-0">
                <div className="flex gap-3 md:gap-8 min-w-max md:min-w-0">
                  {PROCESS_STEPS.map((step) => (
                    <button
                      key={step.step}
                      onClick={() => setActiveStep(step.step)}
                      className={`flex items-center gap-2 md:gap-3 shrink-0 transition-all ${
                        activeStep === step.step ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                      }`}
                    >
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base transition-colors ${
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
              <div className="px-4">
                {/* Step 1 - Input Section */}
                {activeStep === 1 && (
                  <div className="mb-6">
                    {/* <div className="flex items-start gap-2 md:gap-4 p-3 md:p-4 bg-gray-900/50 rounded-lg border border-gray-700"> */}
                    <div className="flex items-start gap-2 md:gap-4 p-3 md:p-6 bg-gray-900/50 rounded-lg border border-gray-700 min-h-[200px] md:min-h-[200px]">

                      <div className="flex-1">
                        {/* Platform Selection */}
                        <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-4 mb-3 md:mb-4">
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
                        </div>

                        {/* Single Input Bar with AI Icon */}
                        <div className="relative mb-2">
                          <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={getPlaceholder()}
                            className="w-full bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 pr-12 text-sm md:text-base"
                          />
                          <button
                            onClick={handleSearchSubmit}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            disabled={!searchInput.trim()}
                            title="Search with AI"
                          >
                            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          </button>
                        </div>
                        
                        {/* Example Suggestions */}
                        <div className="flex flex-wrap gap-2 mt-[18px]" >
                          <span className="text-sm text-gray-350">Try:</span>
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
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 - Personalize */}
                {activeStep === 2 && (
                  <div className="text-center py-8 md:py-12">
                    <Sparkles className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-blue-500" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2">AI Prompt Ideas</h3>
                    <p className="text-sm md:text-base text-gray-600">Get 5 AI-generated content ideas based on your input</p>
                  </div>
                )}

                {/* Step 3 - Cinematize */}
                {activeStep === 3 && (
                  <div className="text-center py-8 md:py-12">
                    <Video className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-blue-500" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Generate Video</h3>
                    <p className="text-sm md:text-base text-gray-600">Create stunning videos with Sora2 AI technology</p>
                  </div>
                )}

                {/* Step 4 - Captionize */}
                {activeStep === 4 && (
                  <div className="text-center py-8 md:py-12">
                    <Languages className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-blue-500" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Watermark & Captions</h3>
                    <p className="text-sm md:text-base text-gray-600">Remove watermarks and add multi-language captions</p>
                  </div>
                )}

                {/* Step 5 - Schedule */}
                {activeStep === 5 && (
                  <div className="text-center py-8 md:py-12">
                    <Calendar className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-blue-500" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Schedule & Publish</h3>
                    <p className="text-sm md:text-base text-gray-600">Auto-schedule to TikTok, Instagram, YouTube</p>
                  </div>
                )}
              </div>
            </div>

            {/* Workflow Preview Images */}
            {activeStep === 1 && (
              <div className="mt-8 md:mt-16 space-y-6 md:space-y-8">
                {/* Search Results Preview */}
                <div className="relative">
                  <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                    <h3 className="text-gray-900 text-sm md:text-base font-semibold mb-3 md:mb-4 flex items-center gap-2">
                      Search Results
                      <span className="text-xs md:text-sm text-gray-500 ml-2">(1)</span>
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 ml-1" />
                      <span className="text-xs md:text-sm text-gray-500 ml-auto">(2)</span>
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 ml-1" />
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="relative group">
                          <div className="w-full aspect-[9/16] rounded-lg overflow-hidden bg-black shadow-lg">
                            <img 
                              src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=300&h=400&fit=crop" 
                              alt="Video thumbnail" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 flex items-center gap-1 md:gap-2 text-white text-xs">
                              <div className="flex items-center gap-1">
                                <Video className="w-2 h-2 md:w-3 md:h-3" />
                                <span className="text-xs">23K</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>❤️</span>
                                <span className="text-xs">16.2K</span>
                              </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                              <p className="text-white text-sm md:text-lg font-bold drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                                BrandedAI
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Analysis Preview */}
                <div className="bg-transparent rounded-lg p-3 md:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <h4 className="text-white text-xs md:text-sm mb-2 md:mb-3 font-medium">Preview</h4>
                      <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 max-w-sm mx-auto lg:max-w-none">
                        <div className="relative aspect-[5/7]">
                          <img 
                            src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=700&fit=crop" 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center px-4">
                            <h2 className="text-white text-2xl md:text-4xl font-bold text-center drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                              What if I told<br />you that
                            </h2>
                          </div>
                          <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 flex flex-col gap-2 md:gap-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900/70 backdrop-blur flex items-center justify-center">
                              <span className="text-white text-xs">❤️</span>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900/70 backdrop-blur flex items-center justify-center">
                              <span className="text-white text-xs">💬</span>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900/70 backdrop-blur flex items-center justify-center">
                              <span className="text-white text-xs">↗️</span>
                            </div>
                          </div>
                          <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 text-white text-xs bg-gray-900/70 backdrop-blur px-2 py-1 rounded">
                            <Video className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                            <span className="text-xs">0:15</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-gray-900 rounded-lg p-3 md:p-4 mt-0 lg:mt-20 space-y-3 md:space-y-4 border border-gray-800">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shrink-0"></div>
                          <div>
                            <p className="text-white text-xs md:text-sm font-semibold">@beautybranded · <span className="text-blue-400">Follow</span></p>
                            <p className="text-gray-400 text-xs">Skincare • Beauty • Vibes</p>
                          </div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded px-2 md:px-3 py-1 md:py-1.5 inline-block">
                          <span className="text-blue-400 text-xs font-medium">@brandedAi AI</span>
                          <span className="text-white text-xs ml-1">• at 5,104,2359</span>
                        </div>
                        <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-300 leading-relaxed">
                          <p className="text-white">We've got a skin fix people rave about!</p>
                          <p>But what if we told you that you could use it to create consistent brand posts?</p>
                          <p className="text-gray-400 text-xs">It's not just amazing marketing storytelling potential.</p>
                          <p>It's also not about leveraging the alt-left creating a consistent brand voice. Systematically.</p>
                          <p className="text-gray-400 text-xs">Across channels. Across campaigns. Across products.</p>
                          <p>That's how great brands stay clean so let that's how your brand should be without spending millions.</p>
                          <p className="text-gray-400 text-xs">And finally, gain your products the penetration they deserve.</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <span className="text-gray-500 text-xs">❤️ 2,104 likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-6 text-center">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-8 py-2 md:py-3 text-sm md:text-base font-semibold rounded-lg shadow-lg w-full md:w-auto">
                      Reverse Engineer Posts (6 credits)
                    </Button>
                  </div>
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
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <step.icon className="w-5 h-5 md:w-7 md:h-7 text-blue-500" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                        <span className="text-xs md:text-sm font-medium text-blue-400">Step {step.step}</span>
                        <h3 className="text-base md:text-xl font-semibold text-white">{step.title}</h3>
                      </div>
                      <p className="text-sm md:text-base text-gray-400">{step.description}</p>
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