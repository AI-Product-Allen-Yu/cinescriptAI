import { useState } from "react";
import { ArrowRight, Sparkles, Video, Calendar, Languages, CheckCircle, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 text-sm bg-background/50 backdrop-blur">
                <Sparkles className="w-4 h-4 text-primary" />
                AI-Powered Video Creation
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Create Viral Videos Effortlessly
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              From Story to Scheduled Video in Minutes
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 text-lg h-14 px-8"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg h-14 px-8"
              >
                Learn More
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {["5-Step Process", "Multi-Platform", "AI-Powered"].map((item, i) => (
                <div key={item} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {i === 0 ? "5" : i === 1 ? "3+" : "4"}
                  </div>
                  <div className="text-sm text-muted-foreground">{item}</div>
                </div>
              ))}
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Flexible subscription plans to match your needs
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="default" className="bg-primary/20">
                Yearly <span className="ml-2 text-green-500">-34%</span>
              </Button>
              <Button variant="ghost" className="text-muted-foreground">
                Monthly <span className="ml-2 text-green-500">-12%</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {PRICING_PACKAGES.map((pkg, index) => (
              <div key={pkg.name}>
                <Card className={`p-6 border-border/50 h-full flex flex-col bg-background/50 backdrop-blur ${
                  pkg.popular ? "border-primary/50 bg-primary/5" : ""
                }`}>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg">$</span>
                        <span className="text-4xl font-bold">{pkg.price}</span>
                        {pkg.price > 0 && (
                          <>
                            <span className="text-muted-foreground ml-2 text-sm">/ Year</span>
                            {pkg.originalPrice && (
                              <span className="text-muted-foreground line-through ml-2 text-sm">
                                ${pkg.originalPrice}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      {pkg.price === 0 && (
                        <p className="text-sm text-muted-foreground mt-1">{pkg.subtitle}</p>
                      )}
                      {pkg.discount > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Next yearly renewal: ${pkg.price} ({pkg.discount}% off)
                        </p>
                      )}
                    </div>

                    <Button
                      className={`w-full mb-4 ${
                        pkg.buttonVariant === "default" ? "bg-blue-500/20 hover:bg-blue-500/30 text-white" : 
                        pkg.buttonVariant === "secondary" ? "bg-amber-200 hover:bg-amber-300 text-black" : ""
                      }`}
                      variant={pkg.buttonVariant}
                    >
                      {pkg.buttonText}
                    </Button>

                    {pkg.discount > 0 && (
                      <p className="text-xs text-center text-muted-foreground mb-4">Cancel Anytime</p>
                    )}
                  </div>

                  {pkg.credits && (
                    <div className="p-4 rounded-lg mb-4 border border-border/30 bg-background/30">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                        <span className="font-semibold">{pkg.credits}</span>
                        <span className="text-muted-foreground text-sm">Credits per month</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        As low as ${pkg.creditCost} per 100 Credits
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pkg.images} images / {pkg.videos} standard videos
                      </p>
                    </div>
                  )}

                  <ul className="space-y-3 flex-1">
                    {pkg.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-2 text-sm">
                        {feature.checked ? (
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0 mt-0.5" />
                        )}
                        <span className={feature.highlight ? "font-medium" : "text-muted-foreground"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <Card className="p-8 border-border/50 bg-background/50 backdrop-blur">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your name"
                      className="mt-2 bg-background/50 border-border/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com"
                      className="mt-2 bg-background/50 border-border/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Your message..."
                      className="mt-2 min-h-[120px] bg-background/50 border-border/50"
                    />
                  </div>

                  <Button
                    onClick={handleContactSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-purple-600"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">support@videoai.com</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office</h3>
                    <p className="text-muted-foreground">
                      123 AI Street<br />
                      Tech Valley, CA 94025
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}