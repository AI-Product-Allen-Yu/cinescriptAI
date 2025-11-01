import { useState } from "react";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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

export default function Pricing() {
  const [showCredits, setShowCredits] = useState(false);
  const [customCredits, setCustomCredits] = useState("");

  const calculateCustomPrice = (credits) => {
    const numCredits = parseInt(credits) || 0;
    return (numCredits / 10).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
    

      {/* Pricing Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Plan
            </h1>
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
            {PRICING_PACKAGES.map((pkg) => (
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

          {/* Add Credits Button */}
          <div className="text-center mt-12">
            <Button
              onClick={() => setShowCredits(!showCredits)}
              variant="outline"
              size="lg"
              className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 text-lg"
            >
              {showCredits ? "Hide" : "Add"} Credits
              <ArrowRight className={`ml-2 w-5 h-5 transition-transform ${showCredits ? "rotate-90" : ""}`} />
            </Button>
          </div>

          {/* Credits Purchase Section */}
          {showCredits && (
            <div className="mt-12 max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground">
                  Note: Credits cannot be exchanged for memberships, nor refunded, transferred or withdrawn. 2 years validity upon redemption.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {CREDIT_PACKAGES.map((pkg) => (
                  <Card key={pkg.credits} className="relative bg-gray-900 border-gray-800 p-6 hover:border-green-500/50 transition-colors overflow-hidden">
                    <div className="relative z-10 text-center">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-green-500" />
                        <span className="text-3xl font-bold text-white">{pkg.credits}</span>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-white">${pkg.price}</span>
                      </div>

                      <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700">
                        Purchase
                      </Button>
                    </div>

                    {/* Decorative flame background */}
                    <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                      <svg width="100" height="100" viewBox="0 0 100 100" className="text-green-500">
                        <path
                          fill="currentColor"
                          d="M50 10 Q60 30 70 40 Q60 50 65 70 Q50 60 50 80 Q50 60 35 70 Q40 50 30 40 Q40 30 50 10 Z"
                        />
                      </svg>
                    </div>
                  </Card>
                ))}

                {/* Custom Credits Card */}
                <Card className="relative bg-gray-900 border-gray-800 p-6 hover:border-green-500/50 transition-colors overflow-hidden">
                  <div className="relative z-10 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Sparkles className="w-6 h-6 text-green-500" />
                      <span className="text-lg font-bold text-white">Custom</span>
                    </div>
                    
                    <div className="mb-3">
                      <Input
                        type="number"
                        placeholder="Credits"
                        value={customCredits}
                        onChange={(e) => setCustomCredits(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white text-center"
                        min="0"
                      />
                    </div>

                    <div className="mb-4">
                      <span className="text-2xl font-bold text-white">
                        ${calculateCustomPrice(customCredits)}
                      </span>
                    </div>

                    <Button 
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                      disabled={!customCredits || parseInt(customCredits) <= 0}
                    >
                      Purchase
                    </Button>
                  </div>

                  {/* Decorative flame background */}
                  <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                    <svg width="100" height="100" viewBox="0 0 100 100" className="text-green-500">
                      <path
                        fill="currentColor"
                        d="M50 10 Q60 30 70 40 Q60 50 65 70 Q50 60 50 80 Q50 60 35 70 Q40 50 30 40 Q40 30 50 10 Z"
                      />
                    </svg>
                  </div>
                </Card>
              </div>

              <div className="text-center mt-6">
                <p className="text-xs text-muted-foreground">
                  Rate: $1 = 10 credits
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
              <h3 className="font-semibold mb-2">Can I cancel my subscription at any time?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your billing period.
              </p>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
              <h3 className="font-semibold mb-2">What happens to my credits when I upgrade?</h3>
              <p className="text-muted-foreground text-sm">
                When you upgrade, any unused credits from your previous plan will be carried over to your new plan.
              </p>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
              <h3 className="font-semibold mb-2">How long are credits valid?</h3>
              <p className="text-muted-foreground text-sm">
                Credits purchased separately have a 2-year validity period. Monthly subscription credits expire at the end of each billing cycle.
              </p>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground text-sm">
                We offer a 7-day money-back guarantee for first-time subscribers. Credits cannot be refunded once purchased.
              </p>
            </Card>
          </div>
        </div>
      </section>

     
    </div>
  );
}