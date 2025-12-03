import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/pricing");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/pricing");
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email login/signup
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = authSchema.safeParse({ email, password });

    if (!check.success) {
      toast({
        title: "Validation Error",
        description: check.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({ title: "Success", description: "Logged in successfully" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/pricing`,
          },
        });

        if (error) {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Account Created",
          description: "Check your email to confirm your account",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // OAuth Login
  const handleOAuth = async (provider: "google" | "facebook") => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/pricing`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "OAuth Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      {/* NAVBAR */}
      <nav className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">AI Video Generator</h1>
        </div>
      </nav>

      {/* AUTH CARD */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-2xl p-8 border border-border/50">

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {isLogin ? "Welcome Back" : "Create Your Account"}
              </h2>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Sign in to continue creating amazing videos"
                  : "Sign up to start generating AI videos"}
              </p>
            </div>

            {/* EMAIL + PASSWORD FORM */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <Label>Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50"
                  />
                </div>
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full button-gradient neon-glow"
                disabled={loading}
                size="lg"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </form>

            {/* DIVIDER */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* OAUTH BUTTONS */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* GOOGLE */}
              <Button
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={() => handleOAuth("google")}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25a10.5 10.5 0 0 0-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31l3.57 2.77c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18V17.8C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09a7.9 7.9 0 0 1-.35-2.09c0-.73.13-1.43.35-2.09V7.07H2.18A11.3 11.3 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
                </svg>
                Google
              </Button>

              {/* FACEBOOK */}
              <Button
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={() => handleOAuth("facebook")}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073C0 18.062 4.388 23.027 10.125 23.927v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>

            </div>

            {/* TOGGLE */}
            <div className="mt-6 text-center text-sm">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>

          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-sm text-muted-foreground flex justify-between">
          <p>© 2025 AI Video Generator. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
