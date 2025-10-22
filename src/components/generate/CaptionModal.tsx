import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Languages, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Caption } from "@/types/generation";

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

interface CaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (languages: string[]) => void;
  captions?: Caption[];
  isGenerating?: boolean;
}

export const CaptionModal = ({
  isOpen,
  onClose,
  onGenerate,
  captions,
  isGenerating,
}: CaptionModalProps) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);

  const toggleLanguage = (code: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  };

  const handleGenerate = () => {
    if (selectedLanguages.length > 0) {
      onGenerate(selectedLanguages);
    }
  };

  const estimatedCredits = selectedLanguages.length * 5;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
          >
            <div className="glass rounded-2xl p-6 border border-border/50 max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Languages className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Generate Captions</h2>
                    <p className="text-sm text-muted-foreground">
                      Select languages for video captions
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-background/50 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Language Selection */}
              {!captions && (
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="grid grid-cols-2 gap-3">
                      {AVAILABLE_LANGUAGES.map((lang) => (
                        <div
                          key={lang.code}
                          className={`glass glass-hover rounded-lg p-4 border transition-all cursor-pointer ${
                            selectedLanguages.includes(lang.code)
                              ? "border-secondary/50 bg-secondary/10"
                              : "border-border/50"
                          }`}
                          onClick={() => toggleLanguage(lang.code)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedLanguages.includes(lang.code)}
                              onCheckedChange={() => toggleLanguage(lang.code)}
                            />
                            <Label className="cursor-pointer font-medium">
                              {lang.name}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="mt-6 p-4 glass rounded-lg border border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Estimated Cost</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedLanguages.length} language(s) selected
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-secondary">
                          {estimatedCredits}
                        </p>
                        <p className="text-xs text-muted-foreground">credits</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Caption Preview */}
              {captions && captions.length > 0 && (
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {captions.map((caption) => (
                        <div
                          key={caption.language}
                          className="glass rounded-lg p-4 border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-secondary" />
                              <span className="font-medium">
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
                                  <Download className="w-3 h-3 mr-1" />
                                  SRT
                                </Button>
                              )}
                              {caption.vttUrl && (
                                <Button size="sm" variant="outline">
                                  <Download className="w-3 h-3 mr-1" />
                                  VTT
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {caption.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                  disabled={isGenerating}
                >
                  {captions ? "Close" : "Cancel"}
                </Button>
                {!captions && (
                  <Button
                    onClick={handleGenerate}
                    disabled={selectedLanguages.length === 0 || isGenerating}
                    className="flex-1 button-gradient"
                  >
                    {isGenerating ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Languages className="w-4 h-4 mr-2" />
                        Generate Captions
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
