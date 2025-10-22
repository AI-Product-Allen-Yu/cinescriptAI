import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import type { VideoGenerationJob } from "@/types/generation";

const PLATFORMS = [
  { id: "tiktok", name: "TikTok", icon: "🎵" },
  { id: "instagram", name: "Instagram", icon: "📷" },
  { id: "youtube", name: "YouTube", icon: "▶️" },
] as const;

const TIMEZONE = "Asia/Kathmandu";
const CREDITS_PER_POST = 4;
const SCHEDULE_SETUP_CREDITS = 3;

interface SchedulePostProps {
  job: VideoGenerationJob;
  onBack: () => void;
}

export const SchedulePost = ({ job, onBack }: SchedulePostProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("12:00");
  const [isScheduling, setIsScheduling] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const { toast } = useToast();

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const totalCredits = SCHEDULE_SETUP_CREDITS + (selectedPlatforms.length * CREDITS_PER_POST);

  const getScheduledDateTime = () => {
    if (!scheduleDate) return null;
    const [hours, minutes] = scheduleTime.split(":").map(Number);
    const dateTime = new Date(scheduleDate);
    dateTime.setHours(hours, minutes, 0, 0);
    return toZonedTime(dateTime, TIMEZONE);
  };

  const handleSchedule = async () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform to publish to.",
        variant: "destructive",
      });
      return;
    }

    if (!scheduleDate) {
      toast({
        title: "No date selected",
        description: "Please select a date and time for scheduling.",
        variant: "destructive",
      });
      return;
    }

    if (!caption.trim()) {
      toast({
        title: "Caption required",
        description: "Please add a caption for your post.",
        variant: "destructive",
      });
      return;
    }

    setIsScheduling(true);

    // Simulate scheduling
    setTimeout(() => {
      const newWorkflowId = `WF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setWorkflowId(newWorkflowId);
      setIsScheduling(false);

      toast({
        title: "Post scheduled!",
        description: `Your video will be published to ${selectedPlatforms.length} platform(s)`,
      });
    }, 2000);
  };

  const scheduledDateTime = getScheduledDateTime();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Step 4 of 4</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="glass rounded-2xl p-6 border border-border/50">
        <h2 className="text-2xl font-semibold mb-2">Schedule & Publish</h2>
        <p className="text-sm text-muted-foreground">
          Schedule your video to be automatically published across platforms
        </p>
      </div>

      {/* Video Preview */}
      <div className="glass rounded-xl p-4 border border-border/50">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <span className="text-2xl">🎬</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{job.title}</h3>
            <p className="text-sm text-muted-foreground">
              1080p • 30s • {job.watermarkRemoved ? "No watermark" : "With watermark"}
            </p>
          </div>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="glass rounded-xl p-6 border border-border/50 space-y-4">
        <Label className="text-base font-semibold">Select Platforms</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`glass glass-hover rounded-lg p-4 border transition-all cursor-pointer ${
                selectedPlatforms.includes(platform.id)
                  ? "border-secondary/50 bg-secondary/10"
                  : "border-border/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => togglePlatform(platform.id)}
                />
                <span className="text-2xl">{platform.icon}</span>
                <Label className="cursor-pointer font-medium flex-1">
                  {platform.name}
                </Label>
                {selectedPlatforms.includes(platform.id) && (
                  <Check className="w-4 h-4 text-secondary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caption & Hashtags */}
      <div className="glass rounded-xl p-6 border border-border/50 space-y-4">
        <div>
          <Label htmlFor="caption">Caption</Label>
          <Textarea
            id="caption"
            placeholder="Write your caption here..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-2 min-h-[100px] bg-background/50 border-border/50"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {caption.length} characters
          </p>
        </div>

        <div>
          <Label htmlFor="hashtags">Hashtags</Label>
          <Input
            id="hashtags"
            placeholder="#trending #viral #ai"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="mt-2 bg-background/50 border-border/50"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Separate hashtags with spaces
          </p>
        </div>
      </div>

      {/* Schedule Date & Time */}
      <div className="glass rounded-xl p-6 border border-border/50 space-y-4">
        <Label className="text-base font-semibold">Schedule Date & Time</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="text-sm mb-2 block">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-background/50"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduleDate}
                  onSelect={setScheduleDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="time" className="text-sm mb-2 block">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 glass rounded-lg border border-border/50">
          <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Timezone: {TIMEZONE}</p>
            {scheduledDateTime && (
              <p className="mt-1">
                Scheduled for: {format(scheduledDateTime, "PPP 'at' p")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Credit Cost */}
      <div className="glass rounded-xl p-6 border border-secondary/50 bg-secondary/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Total Cost</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Schedule setup: {SCHEDULE_SETUP_CREDITS} credits</p>
              <p>Platforms ({selectedPlatforms.length}): {selectedPlatforms.length * CREDITS_PER_POST} credits</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-secondary">{totalCredits}</div>
            <div className="text-xs text-muted-foreground">credits</div>
          </div>
        </div>
      </div>

      {/* Workflow Status */}
      {workflowId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 border border-secondary/50 bg-secondary/5"
        >
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-secondary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Scheduled Successfully!</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Workflow ID:</span> {workflowId}
                </p>
                {scheduledDateTime && (
                  <p>
                    <span className="font-medium">Next Run:</span>{" "}
                    {format(scheduledDateTime, "PPP 'at' p")}
                  </p>
                )}
                <p>
                  <span className="font-medium">Platforms:</span>{" "}
                  {selectedPlatforms.map(id => 
                    PLATFORMS.find(p => p.id === id)?.name
                  ).join(", ")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      <Button
        onClick={handleSchedule}
        disabled={isScheduling || selectedPlatforms.length === 0 || !scheduleDate || !caption.trim() || workflowId !== null}
        className="w-full button-gradient neon-glow"
        size="lg"
      >
        {isScheduling ? (
          <>Scheduling...</>
        ) : workflowId ? (
          <>Scheduled</>
        ) : (
          <>Confirm & Schedule ({totalCredits} credits)</>
        )}
      </Button>
    </motion.div>
  );
};
