"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

const testimonials = [
  {
    name: "James Musk",
    role: "Angel Investor",
    image: "https://avatars.githubusercontent.com/u/1234567?v=4",
    content: "Suggesting this agency to my companies is my best decision. The prompt engineer is best at video gen using veo3."
  },
  {
    name: "Tommorrow Box",
    role: "Founder",
    image: "https://avatars.githubusercontent.com/u/2345678?v=4",
    content: "The email automation tool for outreach and marketing helps us to gain 20x of the money that we have invested into it."
  },
  {
    name: "Anamol Gautam",
    role: "Sales Executive",
    image: "https://avatars.githubusercontent.com/u/3456789?v=4",
    content: "The content creation ideas with the camera movement speciality is still helping me grow my organic reach."
  },
  {
    name: "Bagaicha",
    role: "Managing Director",
    image: "https://avatars.githubusercontent.com/u/4567890?v=4",
    content: "The online booking system is great and getting me 20% more customers just from website alone."
  },
  {
    name: "Prabesh Ghimire",
    role: "Director",
    image: "https://avatars.githubusercontent.com/u/5678901?v=4",
    content: "The wide variety of content creator is helping me to execute my plans exactly as planned."
  },
  {
    name: "Rabins Bhusal",
    role: "Departure Store",
    image: "https://avatars.githubusercontent.com/u/6789012?v=4",
    content: "Thanks to the sales management system , that I able to expand my store outlet in 3 new location's."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 overflow-hidden bg-black">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-normal mb-4">Trusted by Businesses and Enterpreneur</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied businesses in growthspire
          </p>
        </motion.div>

        <div className="relative flex flex-col antialiased">
          <div className="relative flex overflow-hidden py-4">
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={`${index}-1`} className="w-[400px] shrink-0 bg-black/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-white/90">{testimonial.name}</h4>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>
              ))}
            </div>
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={`${index}-2`} className="w-[400px] shrink-0 bg-black/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-white/90">{testimonial.name}</h4>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;