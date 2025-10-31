import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Languages, Download, Check, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
];

const AI_MODELS = [
  { id: "gemini", name: "Gemini", description: "Google's multimodal AI" },
  { id: "gpt", name: "GPT", description: "OpenAI's language model" },
  { id: "grok", name: "Grok", description: "xAI's conversational AI" },
  { id: "claude", name: "Claude", description: "Anthropic's AI assistant" },
];

export const CaptionModal = ({
  isOpen,
  onClose,
  onGenerate,
  captions,
  isGenerating,
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState(["en"]);
  const [selectedAiModel, setSelectedAiModel] = useState("gemini");

  const toggleLanguage = (code) => {
    setSelectedLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  };

  const handleGenerate = () => {
    if (selectedLanguages.length > 0 && selectedAiModel) {
      onGenerate(selectedLanguages, selectedAiModel);
    }
  };

  const estimatedCredits = selectedLanguages.length * 5;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Main Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="rounded-2xl p-8 w-full max-w-2xl border border-white/10 
              bg-gradient-to-br from-gray-900/80 to-gray-800/70 
              backdrop-blur-2xl shadow-2xl shadow-black/50 my-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 
                    flex items-center justify-center">
                    <Languages className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Generate Captions</h2>
                    <p className="text-sm text-gray-400">
                      Select languages for video captions
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-lg hover:bg-gray-700/50 
                  flex items-center justify-center transition-all duration-200"
                >
                  <X className="w-4 h-4 text-gray-300" />
                </button>
              </div>

              {/* Main Content */}
              {!captions && (
                <div className="space-y-8">
                  {/* AI Model Selection */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="w-4 h-4 text-indigo-400" />
                      <label className="text-sm font-medium text-gray-300">
                        Select AI Model
                      </label>
                    </div>

                    <RadioGroup value={selectedAiModel} onValueChange={setSelectedAiModel}>
                      <div className="grid grid-cols-2 gap-4">
                        {AI_MODELS.map((model) => (
                          <motion.div
                            key={model.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`rounded-xl p-5 border transition-all duration-300 cursor-pointer
                              ${
                                selectedAiModel === model.id
                                  ? "border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/30"
                                  : "border-white/10 hover:border-purple-400/40 hover:bg-purple-500/5"
                              }`}
                            onClick={() => setSelectedAiModel(model.id)}
                          >
                            <div className="flex items-start gap-3">
                              <RadioGroupItem
                                value={model.id}
                                id={model.id}
                                className="mt-0.5 text-indigo-400"
                              />
                              <div>
                                <Label
                                  htmlFor={model.id}
                                  className="cursor-pointer font-medium text-white block mb-1"
                                >
                                  {model.name}
                                </Label>
                                <p className="text-xs text-gray-400">
                                  {model.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-4">
                      Select Languages
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {AVAILABLE_LANGUAGES.map((lang) => (
                        <motion.div
                          key={lang.code}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleLanguage(lang.code)}
                          className={`rounded-xl p-4 flex items-center gap-3 border transition-all duration-300 cursor-pointer
                            ${
                              selectedLanguages.includes(lang.code)
                                ? "border-blue-400/50 bg-blue-500/10 shadow-md shadow-blue-500/30"
                                : "border-white/10 hover:border-blue-400/40 hover:bg-blue-500/5"
                            }`}
                        >
                          <Checkbox
                            checked={selectedLanguages.includes(lang.code)}
                            onCheckedChange={() => toggleLanguage(lang.code)}
                          />
                          <Label className="cursor-pointer font-medium text-white">
                            {lang.name}
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Cost */}
                  <div className="p-5 rounded-xl border border-white/10 bg-gray-800/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Estimated Cost</p>
                        <p className="text-xs text-gray-400">
                          {selectedLanguages.length} language(s) selected
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-400">
                          {estimatedCredits}
                        </p>
                        <p className="text-xs text-gray-400">credits</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Captions Preview */}
              {captions && captions.length > 0 && (
                <div className="space-y-4">
                  {captions.map((caption) => (
                    <div
                      key={caption.language}
                      className="rounded-xl p-4 border border-white/10 bg-gray-800/50 shadow-inner"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="font-medium text-white">
                            {
                              AVAILABLE_LANGUAGES.find(
                                (l) => l.code === caption.language
                              )?.name
                            }
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {caption.srtUrl && (
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3 mr-1" /> SRT
                            </Button>
                          )}
                          {caption.vttUrl && (
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3 mr-1" /> VTT
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-3">
                        {caption.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/40"
                  disabled={isGenerating}
                >
                  {captions ? "Close" : "Cancel"}
                </Button>

                {!captions && (
                  <Button
                    onClick={handleGenerate}
                    disabled={
                      selectedLanguages.length === 0 ||
                      !selectedAiModel ||
                      isGenerating
                    }
                    className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                    hover:from-indigo-600 hover:to-pink-600 text-white font-semibold 
                    shadow-lg shadow-indigo-500/30 transition-all duration-300"
                  >
                    {isGenerating ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Languages className="w-4 h-4 mr-2" />
                        Generate with{" "}
                        {AI_MODELS.find((m) => m.id === selectedAiModel)?.name}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};