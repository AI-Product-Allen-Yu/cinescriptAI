import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "./CardSpotlight";

const PricingTier = ({
  name,
  price,
  description,
  features,
  isPopular,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}) => (
  <CardSpotlight className={`h-full ${isPopular ? "border-primary" : "border-white/10"} border-2`}>
    <div className="relative h-full p-6 flex flex-col">
      {isPopular && (
        <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1 w-fit mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-medium mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Custom" && <span className="text-gray-400">/month</span>}
      </div>
      <p className="text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className="button-gradient w-full neon-glow"
        onClick={() => {
          const message = `Hi Saurav! Interested in ${name} package for ${price}. Please provide more details.`;
          window.open(`https://wa.me/9779813984912?text=${encodeURIComponent(message)}`, '_blank');
        }}
      >
        Order Now
      </Button>
    </div>
  </CardSpotlight>
);

export const PricingSection = () => {
  return (
    <section className="container px-4 py-24">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-normal mb-6"
        >
          Service{" "}
          <span className="text-gradient font-medium">Packages</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-lg text-gray-400"
        >
          Choose the perfect package for your digital transformation journey
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <PricingTier
          name="Starter"
          price="NPR 20k"
          description="Perfect for small businesses starting their digital journey"
          features={[
            "Professional Website",
            "Basic SEO Optimization",
            "Mobile Responsive Design",
            "Basic Support"
          ]}
        />
        <PricingTier
          name="Professional"
          price="NPR 40k"
          description="Advanced features for growing businesses"
          features={[
            "Professional Website",
            "Advanced SEO",
            "Admin Dashboard",
            "Content Management",
            "Priority Support"
          ]}
          isPopular
        />
        <PricingTier
          name="E-commerce"
          price="NPR 70k"
          description="Complete online store solution"
          features={[
            "Full E-commerce Website",
            "Payment Integration",
            "Checkout System",
            "Product Management",
            "Order Tracking"
          ]}
        />
        <PricingTier
          name="API Integrated"
          price="NPR 90k"
          description="Advanced integration capabilities"
          features={[
            "Full API Integration",
            "Third-party Services",
            "Custom Functionality",
            "Database Management",
            "Advanced Analytics"
          ]}
        />
        <PricingTier
          name="Complete Suite"
          price="NPR 120k"
          description="Everything you need for digital success"
          features={[
            "Complete Website Solution",
            "Social Media Management",
            "Content Upload Services",
            "Digital Marketing",
            "24/7 Premium Support"
          ]}
        />
      </div>
    </section>
  );
};