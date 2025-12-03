import { useState, useEffect } from "react";
import { Command, Menu, LogOut, User, Coins } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [credits, setCredits] = useState(100); // Mock credits
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been signed out successfully",
      });
      navigate("/auth");
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: "Home", onClick: () => navigate("/") },
    { name: "Process", onClick: () => scrollToSection('process') },
    { name: "Pricing", onClick: () => scrollToSection('pricing') },
    { name: "Contact", onClick: () => scrollToSection('contact') },
    { name: "Tools", onClick: () => navigate("/tools") },

    { name: "Dashboard", onClick: () => navigate("/dashboard") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50" 
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src="/logo.png" 
              alt="VideoAI Logo" 
              className="h-8 w-auto object-contain"
            />
          </div>
          

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                {item.name}
              </button>
            ))}
            
            {session && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20">
                <Coins className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{credits}</span>
              </div>
            )}

            {session ? (
              <div className="flex items-center gap-2">
                {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  {session.user.email?.split('@')[0]}
                </div> */}
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="w-3 h-3 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => navigate("/auth")}
                size="sm"
                className="button-gradient"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="glass">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-background">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        item.onClick();
                      }}
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      {item.name}
                    </button>
                  ))}
                  
                  {session && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-primary/20">
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{credits} credits</span>
                    </div>
                  )}

                  {session ? (
                    <>
                      <div className="text-sm text-muted-foreground pt-2">
                        {session.user.email}
                      </div>
                      <Button 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleSignOut();
                        }}
                        variant="outline"
                        className="mt-2"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/auth");
                      }}
                      className="button-gradient mt-4"
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;