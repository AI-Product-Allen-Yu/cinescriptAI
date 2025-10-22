import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "./pricing/CardSpotlight";

interface Feature {
  name: string;
  price: number;
  description: string;
}

const features: Feature[] = [
  { name: "Basic Website", price: 15000, description: "Professional responsive website" },
  { name: "SEO Optimization", price: 5000, description: "Search engine optimization" },
  { name: "Content Creator", price: 5000, description: "Social media marketing" },
  { name: "Brand Building", price: 10000, description: "Proper Brand Level Setup" },
  { name: "Ads Campaign", price: 10000, description: "Meta , Google ,Tiktok Ads Campaign" },
  { name: "Admin Dashboard", price: 20000, description: "Content management system" },
  { name: "E-commerce", price: 30000, description: "Online store functionality" },
  { name: "Payment Integration", price: 20000, description: "Secure payment gateway" },
  { name: "API Integration", price: 20000, description: "Third-party service integration" },
  { name: "Social Media Management", price: 15000, description: "Social media marketing" },
  { name: "Mobile App", price: 70000, description: "Native mobile application" },
  { name: "Analytics Dashboard", price: 15000, description: "Advanced analytics tracking" },
];

export const CustomBuilder = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set(["Basic Website"]));

  const toggleFeature = (featureName: string) => {
    if (featureName === "Basic Website") return; // Basic website is mandatory
    
    const newSelected = new Set(selectedFeatures);
    if (newSelected.has(featureName)) {
      newSelected.delete(featureName);
    } else {
      newSelected.add(featureName);
    }
    setSelectedFeatures(newSelected);
  };

  const totalPrice = features
    .filter(feature => selectedFeatures.has(feature.name))
    .reduce((sum, feature) => sum + feature.price, 0);

  const handleOrderNow = () => {
    const selectedList = features
      .filter(feature => selectedFeatures.has(feature.name))
      .map(feature => feature.name)
      .join(", ");
    
    const message = `Hi Saurav! I want to build a custom package with: ${selectedList}. Total: NPR ${totalPrice.toLocaleString()}. Please provide more details.`;
    window.open(`https://wa.me/9779813984912?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="container px-4 py-24">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-normal mb-6"
        >
          Custom{" "}
          <span className="text-gradient font-medium">Builder</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-lg text-gray-400"
        >
          Build your perfect package with our interactive price calculator
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Features Selection */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CardSpotlight className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleFeature(feature.name)}
                        disabled={feature.name === "Basic Website"}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedFeatures.has(feature.name)
                            ? "bg-primary border-primary" 
                            : "border-gray-400 hover:border-primary"
                        } ${feature.name === "Basic Website" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {selectedFeatures.has(feature.name) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <div>
                        <h3 className="font-medium">{feature.name}</h3>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">
                      NPR {feature.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="lg:sticky lg:top-8">
          <CardSpotlight className="p-6">
            <h3 className="text-2xl font-bold mb-6 text-center">Your Package</h3>
            
            <div className="space-y-3 mb-6">
              {features
                .filter(feature => selectedFeatures.has(feature.name))
                .map(feature => (
                  <div key={feature.name} className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">{feature.name}</span>
                    <span className="text-primary font-semibold">
                      NPR {feature.price.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>

            <div className="border-t border-gray-600 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-gradient">
                  NPR {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <Button 
              className="button-gradient w-full neon-glow"
              onClick={handleOrderNow}
            >
              Order Custom Package
            </Button>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              * Basic Website is included in all packages
            </p>
          </CardSpotlight>
        </div>
      </div>
    </section>
  );
};