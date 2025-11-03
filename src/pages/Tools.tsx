import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Wand2,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

type Model = "sora" | "veo" | "wan";

const Tools = () => {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>("AI VIDEO");

  const toolCategories = [
    {
      id: "AI VIDEO",
      title: "AI VIDEO",
      subtitle: "Choose your creative tool",
      icon: Video,
      tools: [
        {
          id: "sora-talk",
          name: "Sora 2.5 Talk",
          description: "Generate videos from your image",
          icon: MessageSquare,
          badge: "NEW",
          model: "sora" as Model,
        },
        {
          id: "wan-talk",
          name: "Wan 2.5 Talk",
          description: "Generate videos from your image",
          icon: MessageSquare,
          badge: "NEW",
          model: "wan" as Model,
        },
        {
          id: "veo-talk",
          name: "Veo 2.5 Talk",
          description: "Generate videos from your image",
          icon: MessageSquare,
          badge: "NEW",
          model: "veo" as Model,
        },
      ],
    },
  ];

  const toggleCategory = (id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

//   const handleToolClick = (model: Model) => {
//     // Pass model via query string – DirectPromptMode will read it
//     navigate(`/generate?tool=${model}-talk&mode=direct_prompt&model=${model}`);
//   };

  const handleToolClick = (model: "sora" | "veo" | "wan") => {
  navigate(`/generate?tool=${model}-talk&mode=direct_prompt&model=${model}`);
};

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Tools</h1>
          <p className="text-muted-foreground">Choose your creative tool to start generating</p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-4">
          {toolCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-border/50 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <cat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-semibold">{cat.title}</h2>
                    <p className="text-sm text-muted-foreground">{cat.subtitle}</p>
                  </div>
                </div>
                <motion.div animate={{ rotate: expandedCategory === cat.id ? 90 : 0 }}>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>

              {/* Tools */}
              <AnimatePresence>
                {expandedCategory === cat.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-2">
                      {cat.tools.map((tool, ti) => (
                        <motion.button
                          key={tool.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ti * 0.05 }}
                          onClick={() => handleToolClick(tool.model)}
                          className="w-full group relative p-4 rounded-xl bg-background hover:bg-primary/5 border border-border/50 hover:border-primary/50 transition-all duration-300 text-left overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <tool.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{tool.name}</h3>
                                {tool.badge && (
                                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{tool.description}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Info cards (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-border/50">
            <Wand2 className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Multiple AI Models</h3>
            <p className="text-sm text-muted-foreground">
              Access Veo, Wan, and Sora all in one place
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-border/50">
            <Video className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">High Quality Output</h3>
            <p className="text-sm text-muted-foreground">
              Generate professional videos up to 1080p resolution with pro mode
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tools;