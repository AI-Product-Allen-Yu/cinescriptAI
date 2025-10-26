import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log("User logged in:", user.email);
        navigate("/");
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    try {
      authSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        toast({
          title: "Welcome back!",
          description: `Logged in as ${userCredential.user.email}`,
        });
      } else {
        // Sign up with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        toast({
          title: "Account Created!",
          description: `Welcome ${userCredential.user.email}!`,
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Handle specific Firebase errors
      let errorMessage = "An error occurred. Please try again.";
      
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered. Please login instead.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. Use at least 6 characters.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password.";
          break;
        default:
          errorMessage = error.message;
      }
      
      toast({
        title: isLogin ? "Login Failed" : "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      toast({
        title: "Success!",
        description: `Welcome ${result.user.displayName || result.user.email}!`,
      });
      
      // User will be redirected by onAuthStateChanged
    } catch (error: any) {
      console.error("Google auth error:", error);
      
      let errorMessage = "Failed to sign in with Google";
      
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in popup was closed. Please try again.";
          break;
        case "auth/cancelled-popup-request":
          errorMessage = "Sign-in was cancelled.";
          break;
        case "auth/popup-blocked":
          errorMessage = "Sign-in popup was blocked. Please allow popups and try again.";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage = "An account already exists with the same email address.";
          break;
        default:
          errorMessage = error.message;
      }
      
      toast({
        title: "Google Sign-In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      
      toast({
        title: "Success!",
        description: `Welcome ${result.user.displayName || result.user.email}!`,
      });
      
      // User will be redirected by onAuthStateChanged
    } catch (error: any) {
      console.error("Facebook auth error:", error);
      
      let errorMessage = "Failed to sign in with Facebook";
      
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in popup was closed. Please try again.";
          break;
        case "auth/cancelled-popup-request":
          errorMessage = "Sign-in was cancelled.";
          break;
        case "auth/popup-blocked":
          errorMessage = "Sign-in popup was blocked. Please allow popups and try again.";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage = "An account already exists with the same email address.";
          break;
        default:
          errorMessage = error.message;
      }
      
      toast({
        title: "Facebook Sign-In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal Navbar */}
      <nav className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">AI Video Generator</h1>
          </div>
        </div>
      </nav>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-2xl p-8 border border-border/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {isLogin ? "Welcome Back" : "Get Started"}
              </h2>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Sign in to continue creating amazing videos"
                  : "Create an account to start generating videos"}
              </p>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full button-gradient neon-glow"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            {/* Divider */}
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

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleAuth}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleFacebookAuth}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            {/* Toggle Login/Signup */}
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

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 AI Video Generator. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}