"use client";

import { useState } from "react";
import { FiMessageCircle, FiSend, FiStar, FiMail } from "react-icons/fi";
import { MdFormatQuote } from "react-icons/md";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/src/Components/Animations";
import { Card, Button } from "@heroui/react";
import toast from "react-hot-toast";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Adventure Traveler",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    quote:
      "I found the most incredible hidden waterfall spot thanks to another traveler's post! The community here really knows the best places. No agency fluff, just real experiences.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Family Vacationer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    quote:
      "The reviews and photos from other families helped us pick the perfect beach spot for our kids. Love that anyone can contribute and share their discoveries.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Solo Explorer",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    quote:
      "I love that this is just a free platform for sharing travel spots. No booking pressure, no hidden fees - just pure travel inspiration from real people like me.",
    rating: 5,
  },
];

const TestimonialsAndNewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Subscribed successfully! Check your inbox.");
    setEmail("");
  };

  return (
    <section>
      {/* Testimonials Section */}
      <div className="py-16 md:py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <FiMessageCircle className="text-[var(--primary)] text-2xl" />
              <span className="text-[var(--primary)] font-semibold text-sm tracking-widest uppercase">
                Testimonials
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-3">
              What Our Travelers Say
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
              Real stories from real people who traveled with us
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div key={t.id} variants={fadeUp}>
                <Card className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--card)]">
                  <MdFormatQuote className="text-3xl text-[var(--primary)]/20 mb-3" />
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-5 line-clamp-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <FiStar
                        key={i}
                        className="text-[var(--accent)] fill-current text-sm"
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <div
                      className="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url(${t.avatar})` }}
                    />
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        {t.name}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 md:py-24 bg-[var(--primary)]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiMail className="text-white/80 text-2xl" />
            <span className="text-white/80 font-semibold text-sm tracking-widest uppercase">
              Stay Updated
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Get Travel Inspiration
          </h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            Subscribe to our newsletter and be the first to know about new
            spots, traveler stories, and hidden gems shared by the community.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <div className="flex-1">
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none transition-colors group-focus-within:text-[var(--accent)]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className="w-full bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-[var(--accent)] rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:ring-4 focus:ring-[var(--accent)]/20 shadow-lg shadow-black/5"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold px-8 py-[17px] transition-all rounded-xl shrink-0 cursor-pointer shadow-lg shadow-[var(--accent)]/25 hover:shadow-[var(--accent)]/40 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              <FiSend className="text-lg sm:hidden" />
              <span className="hidden sm:inline">Subscribe</span>
            </Button>
          </form>

          <p className="text-white/60 text-xs mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsAndNewsLetter;
