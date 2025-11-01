import { useState } from "react";
import { ArrowRight, Sparkles, Video, Calendar, Languages, CheckCircle, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Pricing from "./Pricing";
import Contact from "./Contact";

const PROCESS_STEPS = [
  {
    icon: Sparkles,
    title: "Story & Brand",
    description: "Share your story or write a direct prompt",
    step: 1,
  },
  {
    icon: Sparkles,
    title: "AI Prompt Ideas",
    description: "Get 5 AI-generated content ideas",
    step: 2,
  },
  {
    icon: Video,
    title: "Generate Video",
    description: "Create videos with Sora2 AI",
    step: 3,
  },
  {
    icon: Languages,
    title: "Watermark & Captions",
    description: "Remove watermarks and add multi-language captions",
    step: 4,
  },
  {
    icon: Calendar,
    title: "Schedule & Publish",
    description: "Auto-schedule to TikTok, Instagram, YouTube",
    step: 5,
  },
];

const CREDIT_PACKAGES = [
  { credits: 330, price: 5 },
  { credits: 660, price: 10 },
  { credits: 1320, price: 20 },
  { credits: 2640, price: 40 },
  { credits: 5280, price: 80 },
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
  const [showCredits, setShowCredits] = useState(false);
  const [customCredits, setCustomCredits] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("tiktok");
  const navigate = useNavigate();

  const calculateCustomPrice = (credits) => {
    const numCredits = parseInt(credits) || 0;
    return (numCredits / 10).toFixed(2);
  };

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
      // Check if input is a URL
      const isUrl = searchInput.includes('instagram.com') || 
                    searchInput.includes('tiktok.com') || 
                    searchInput.includes('youtube.com') ||
                    searchInput.includes('http://') || 
                    searchInput.includes('https://');
      
      if (isUrl) {
        // Navigate with URL as account link
        navigate(`/generate?type=account_link&input=${encodeURIComponent(searchInput)}`);
      } else {
        // Navigate with keyword
        navigate(`/generate?type=keyword&input=${encodeURIComponent(searchInput)}`);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-20 bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent" />
        
        <div className="container mx-auto relative z-10 max-w-7xl">
          {/* Badge */}
          <div className="text-center mb-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 text-sm bg-blue-500/10 backdrop-blur text-blue-400">
                <Sparkles className="w-4 h-4" />
                AI-Powered Video Creation
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white leading-tight">
              ReCreate Viral Videos<br />
              <span className="text-4xl md:text-6xl">Effortlessly</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-400 font-light">
              and make them your own
            </p>
          </div>

          {/* Main Interface Card */}
          <div className="max-w-5xl mx-auto">
            <Card className="bg-white border-0 shadow-2xl overflow-hidden">
              {/* Steps Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                        1
                      </div>
                      <span className="font-medium text-gray-900">Input Viral Ideas</span>
                    </div>
                    <span className="text-gray-400">Personalize</span>
                    <span className="text-gray-400">Cinematize</span>
                    <span className="text-gray-400">Captionize</span>
                    <span className="text-gray-400">Schedule</span>
                  </div>
                </div>
              </div>




              {/* Content Area */}
 {/* Content Area */}
              <div className="p-8">
                {/* Input Section */}
                <div className="mb-6">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold shrink-0">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Find Viral Content</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Enter a Post URL, Instagram/TikTok handle, or Niche Topic
                      </p>
                      
                      {/* Platform Selection */}
                      <div className="flex gap-4 mb-4">
                        <Button 
                          variant="outline" 
                          className={`flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 ${selectedPlatform === 'url' ? 'bg-gray-200 border-gray-400' : ''}`}
                          onClick={() => setSelectedPlatform('url')}
                        >
                          Post URL
                        </Button>
                        <Button 
                          variant="outline" 
                          className={`flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 ${selectedPlatform === 'instagram' ? 'bg-gray-200 border-gray-400' : ''}`}
                          onClick={() => setSelectedPlatform('instagram')}
                        >
                          Instagram
                        </Button>
                        <Button 
                          className={`flex-1 ${selectedPlatform === 'tiktok' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-700 hover:bg-gray-800'} text-white`}
                          onClick={() => setSelectedPlatform('tiktok')}
                        >
                          TikTok
                        </Button>
                        <Button 
                          variant="outline" 
                          className={`flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 ${selectedPlatform === 'keyword' ? 'bg-gray-200 border-gray-400' : ''}`}
                          onClick={() => setSelectedPlatform('keyword')}
                        >
                          Niche Keyword
                        </Button>
                      </div>

                      {/* Single Input Bar with AI Icon */}
                      <div className="relative">
                        <Input
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Enter Post URL, @handle, or niche keyword..."
                          className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 pr-12"
                        />
                        <button
                          onClick={handleSearchSubmit}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          disabled={!searchInput.trim()}
                          title="Search with AI"
                        >
                          <Sparkles className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



            </Card>



            {/* Workflow Preview Images */}
            <div className="mt-16 space-y-8">
              {/* Search Results Preview */}
              <div className="relative">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-gray-900 text-base font-semibold mb-4 flex items-center gap-2">
                    Search Results
                    <span className="text-sm text-gray-500 ml-2">(1)</span>
                    <CheckCircle className="w-5 h-5 text-green-500 ml-1" />
                    <span className="text-sm text-gray-500 ml-auto">(2)</span>
                    <CheckCircle className="w-5 h-5 text-green-500 ml-1" />
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="relative group">
                        <div className="w-full aspect-[9/16] rounded-lg overflow-hidden bg-black shadow-lg">
                          <img 
                            src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=300&h=400&fit=crop" 
                            alt="Video thumbnail" 
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          {/* Stats */}
                          <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white text-xs">
                            <div className="flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              <span>23K</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>❤️</span>
                              <span>16.2K</span>
                            </div>
                          </div>
                          {/* Title */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-white text-lg font-bold drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
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
              <div className="bg-transparent rounded-lg p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white text-sm mb-3 font-medium">Preview</h4>
                    <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                      {/* Instagram Reel Style Preview */}
                      <div className="relative aspect-[5/7]">
                        <img 
                          src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=700&fit=crop" 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay Text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h2 className="text-white text-4xl font-bold text-center px-8 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                            What if I told<br />you that
                          </h2>
                        </div>
                        {/* Bottom Controls */}
                        <div className="absolute bottom-4 right-4 flex flex-col gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-900/70 backdrop-blur flex items-center justify-center">
                            <span className="text-white text-xs">❤️</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-900/70 backdrop-blur flex items-center justify-center">
                            <span className="text-white text-xs">💬</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-900/70 backdrop-blur flex items-center justify-center">
                            <span className="text-white text-xs">↗️</span>
                          </div>
                        </div>
                        {/* Play Icon Indicator */}
                        <div className="absolute bottom-4 left-4 text-white text-xs bg-gray-900/70 backdrop-blur px-2 py-1 rounded">
                          <Video className="w-4 h-4 inline mr-1" />
                          <span>0:15</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gray-900 rounded-lg p-4 mt-20 space-y-4 border border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                        <div>
                          <p className="text-white text-sm font-semibold">@beautybranded · <span className="text-blue-400">Follow</span></p>
                          <p className="text-gray-400 text-xs">Skincare • Beauty • Vibes</p>
                        </div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded px-3 py-1.5 inline-block">
                        <span className="text-blue-400 text-xs font-medium">@brandedAi AI</span>
                        <span className="text-white text-xs ml-1">• at 5,104,2359</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
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
                <div className="mt-6 text-center">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-base font-semibold rounded-lg shadow-lg">
                    [Reverse Engineer 2 Selected Posts (6 credits)]
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple 5-Step Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From concept to published video in minutes
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.step} className="mb-8 last:mb-0">
                <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-primary">Step {step.step}</span>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>

                    <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                  </div>
                </Card>
                
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
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