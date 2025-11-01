import { useState } from "react";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function Contact() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Message sent! We'll get back to you soon.");
    setContactForm({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* Contact Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <Card className="p-8 border-border/50 bg-background/50 backdrop-blur">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your name"
                      className="mt-2 bg-background/50 border-border/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com"
                      className="mt-2 bg-background/50 border-border/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Your message..."
                      className="mt-2 min-h-[120px] bg-background/50 border-border/50"
                    />
                  </div>

                  <Button
                    onClick={handleContactSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-purple-600"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">support@videoai.com</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office</h3>
                    <p className="text-muted-foreground">
                      123 AI Street<br />
                      Tech Valley, CA 94025
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/50 bg-primary/5 border-primary/20 backdrop-blur">
                <h3 className="font-semibold mb-3">Office Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Other Ways to Reach Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-border/50 bg-background/50 backdrop-blur text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Chat with our support team in real-time
              </p>
              <Button variant="outline" className="w-full">
                Start Chat
              </Button>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50 backdrop-blur text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold mb-2">Help Center</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Browse our comprehensive documentation
              </p>
              <Button variant="outline" className="w-full">
                Visit Help Center
              </Button>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50 backdrop-blur text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="font-semibold mb-2">Video Tutorials</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Learn with step-by-step video guides
              </p>
              <Button variant="outline" className="w-full">
                Watch Tutorials
              </Button>
            </Card>
          </div>
        </div>
      </section>

     
    </div>
  );
}