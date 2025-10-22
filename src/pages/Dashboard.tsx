import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  Calendar, 
  Coins, 
  Play, 
  Edit, 
  X, 
  RefreshCw,
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface VideoHistory {
  id: string;
  title: string;
  thumbnail_url: string | null;
  video_url: string | null;
  status: "completed" | "processing" | "failed";
  created_at: string;
  idea_data: any;
}

interface ScheduledPost {
  id: string;
  video_id: string | null;
  platforms: string[];
  caption: string | null;
  scheduled_time: string;
  status: "pending" | "published" | "cancelled";
  workflow_id: string | null;
}

interface CreditTransaction {
  id: string;
  action: string;
  amount: number;
  balance_after: number;
  created_at: string;
}

export default function Dashboard() {
  const [videoHistory, setVideoHistory] = useState<VideoHistory[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load credits
      const { data: creditsData } = await supabase
        .from("user_credits")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (creditsData) {
        setTotalCredits(creditsData.balance);
      } else {
        // Initialize credits for new user
        await supabase.from("user_credits").insert({
          user_id: user.id,
          balance: 100
        });
        setTotalCredits(100);
      }

      // Load video history
      const { data: videosData } = await supabase
        .from("video_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (videosData) setVideoHistory(videosData as VideoHistory[]);

      // Load scheduled posts
      const { data: postsData } = await supabase
        .from("scheduled_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_time", { ascending: false });

      if (postsData) setScheduledPosts(postsData as ScheduledPost[]);

      // Load credit transactions
      const { data: transactionsData } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (transactionsData) setCreditTransactions(transactionsData);

    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemixVideo = (idea: any) => {
    navigate("/generate", { state: { remixIdea: idea } });
  };

  const handleCancelScheduledPost = async (postId: string) => {
    try {
      await supabase
        .from("scheduled_posts")
        .update({ status: "cancelled" })
        .eq("id", postId);

      toast({
        title: "Post Cancelled",
        description: "Scheduled post has been cancelled",
      });

      loadDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel post",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      processing: "secondary",
      failed: "destructive",
      pending: "secondary",
      published: "default",
      cancelled: "outline",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your videos, schedules, and credits
          </p>
        </motion.div>

        {/* Credits Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Available Credits</CardTitle>
                    <CardDescription>Your current balance</CardDescription>
                  </div>
                </div>
                <div className="text-4xl font-bold text-primary">{totalCredits}</div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <div className="grid gap-8">
          {/* Video History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-primary" />
                  <CardTitle>Video History</CardTitle>
                </div>
                <CardDescription>Your generated videos</CardDescription>
              </CardHeader>
              <CardContent>
                {videoHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No videos generated yet</p>
                    <Button
                      onClick={() => navigate("/generate")}
                      className="mt-4"
                      variant="outline"
                    >
                      Generate Your First Video
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videoHistory.map((video) => (
                      <Card key={video.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted relative">
                          {video.thumbnail_url ? (
                            <img
                              src={video.thumbnail_url}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            {getStatusBadge(video.status)}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-1 line-clamp-1">{video.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {format(new Date(video.created_at), "MMM d, yyyy")}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleRemixVideo(video.idea_data)}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Remix
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Scheduled Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <CardTitle>Scheduled Posts</CardTitle>
                </div>
                <CardDescription>Your upcoming and past scheduled posts</CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledPosts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No scheduled posts yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Platforms</TableHead>
                          <TableHead>Caption</TableHead>
                          <TableHead>Scheduled Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduledPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell>
                              <div className="flex gap-1">
                                {post.platforms.map((platform) => (
                                  <Badge key={platform} variant="outline">
                                    {platform}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {post.caption || "No caption"}
                            </TableCell>
                            <TableCell>
                              {format(new Date(post.scheduled_time), "MMM d, yyyy h:mm a")}
                            </TableCell>
                            <TableCell>{getStatusBadge(post.status)}</TableCell>
                            <TableCell>
                              {post.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCancelScheduledPost(post.id)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Credit History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-primary" />
                  <CardTitle>Credit History</CardTitle>
                </div>
                <CardDescription>Your credit usage and purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {creditTransactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {creditTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {format(new Date(transaction.created_at), "MMM d, yyyy h:mm a")}
                            </TableCell>
                            <TableCell className="capitalize">
                              {transaction.action.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell>
                              <span
                                className={
                                  transaction.amount > 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {transaction.amount > 0 ? "+" : ""}
                                {transaction.amount}
                              </span>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {transaction.balance_after}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
