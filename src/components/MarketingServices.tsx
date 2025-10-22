import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Megaphone, 
  Building, 
  Smartphone, 
  BarChart3,
  Palette,
  Camera
} from "lucide-react";

const services = [
  {
    icon: Camera,
    title: "Content Creation",
    description: "Professional photography, videography, and graphic design services",
    color: "text-neon-blue"
  },
  {
    icon: Target,
    title: "Meta Advertising",
    description: "Facebook and Instagram advertising campaigns with high ROI",
    color: "text-neon-purple"
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Comprehensive digital marketing strategies and campaigns",
    color: "text-neon-cyan"
  },
  {
    icon: Building,
    title: "Physical Marketing",
    description: "Traditional marketing methods including print and outdoor advertising",
    color: "text-neon-blue"
  },
  {
    icon: Palette,
    title: "Brand Development",
    description: "Complete brand identity creation and brand strategy development",
    color: "text-neon-purple"
  },
  {
    icon: Users,
    title: "Social Media Management",
    description: "Full-service social media management and community building",
    color: "text-neon-cyan"
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Data-driven insights and comprehensive performance reporting",
    color: "text-neon-blue"
  },
  {
    icon: Smartphone,
    title: "Mobile Marketing",
    description: "Mobile-first marketing strategies and app promotion",
    color: "text-neon-purple"
  }
];

export const MarketingServices = () => {
  return (
    <section className="container px-4 py-24">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-normal mb-6"
        >
          Marketing{" "}
          <span className="text-gradient font-medium">Services</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-lg text-gray-400"
        >
          Comprehensive marketing solutions to grow your business and reach your target audience
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="glass glass-hover rounded-xl p-6 h-full border border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`w-6 h-6 ${service.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12"
      >
        <p className="text-lg text-gray-300 mb-6">
          Ready to boost your marketing efforts?
        </p>
        <button
          onClick={() => {
            const message = "Hi Saurav! I'm interested in your marketing services. Can you tell me more about what you offer?";
            window.open(`https://wa.me/9779813984912?text=${encodeURIComponent(message)}`, '_blank');
          }}
          className="button-gradient px-8 py-3 rounded-full font-semibold neon-glow hover:scale-105 transition-transform"
        >
          Get Marketing Consultation
        </button>
      </motion.div>
    </section>
  );
};