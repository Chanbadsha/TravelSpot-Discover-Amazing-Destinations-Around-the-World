"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiUser,
  FiMessageSquare,
} from "react-icons/fi";
import { MdHeadsetMic, MdContactSupport } from "react-icons/md";
import { fadeUp, stagger, scaleIn } from "@/src/Components/Animations";
import { Button } from "@heroui/react";

const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const contactInfo = [
  {
    icon: FiPhone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    detail: "Mon–Fri, 9am–6pm EST",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: FiMail,
    label: "Email",
    value: "hello@travelspot.com",
    detail: "We reply within 24 hours",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: FiMapPin,
    label: "Office",
    value: "350 5th Avenue, Suite 1200",
    detail: "New York, NY 10118, USA",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: FiClock,
    label: "Business Hours",
    value: "Mon–Fri: 9:00 AM – 6:00 PM",
    detail: "Sat: 10:00 AM – 2:00 PM",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const faqs = [
  {
    q: "How quickly do you respond to inquiries?",
    a: "We typically respond within 24 hours during business days. For urgent matters, we recommend calling our support line.",
  },
  {
    q: "Can I book a trip over the phone?",
    a: "Absolutely! Our travel consultants are happy to help you plan and book your perfect trip over the phone.",
  },
  {
    q: "Do you offer group travel arrangements?",
    a: "Yes, we specialize in group travel. Contact our team to discuss custom itineraries for your group.",
  },
];

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Contact form submitted:", data);
    reset();
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <MdHeadsetMic className="text-[var(--accent)] text-2xl" />
            <span className="text-[var(--accent)] font-semibold text-sm tracking-widest uppercase">
              Get in Touch
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-white/70 max-w-lg mx-auto">
            Have a question, feedback, or just want to say hello? Reach out and
            our team will get back to you promptly.
          </p>
        </motion.div>
      </div>

      {/* Contact Info Cards */}
      <div className="relative z-10 -mt-10 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.label}
                  variants={scaleIn}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${info.bg} flex items-center justify-center mb-3`}
                  >
                    <Icon className={`text-xl ${info.color}`} />
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wider mb-0.5">
                    {info.label}
                  </p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {info.value}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    {info.detail}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Form + Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Contact Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">
                Send Us a Message
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-6">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
                    >
                      Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[var(--muted-foreground)]">
                        <FiUser className="size-4" />
                      </span>
                      <input
                        id="name"
                        type="text"
                        {...register("name")}
                        placeholder="Your name"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]/20"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[var(--error)] text-xs mt-1.5">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[var(--muted-foreground)]">
                        <FiMail className="size-4" />
                      </span>
                      <input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]/20"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[var(--error)] text-xs mt-1.5">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    {...register("subject")}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]/20 appearance-none cursor-pointer"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Question</option>
                    <option value="support">Customer Support</option>
                    <option value="feedback">Feedback &amp; Suggestions</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="text-[var(--error)] text-xs mt-1.5">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
                  >
                    Message
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-0 flex items-start pl-3.5 pointer-events-none text-[var(--muted-foreground)]">
                      <FiMessageSquare className="size-4" />
                    </span>
                    <textarea
                      id="message"
                      rows={5}
                      {...register("message")}
                      placeholder="Tell us what's on your mind..."
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]/20 resize-none"
                    />
                  </div>
                  {errors.message && (
                    <p className="text-[var(--error)] text-xs mt-1.5">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  isDisabled={isSubmitting}
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold px-8 rounded-xl transition-colors cursor-pointer"
                  size="lg"
                >
                  <FiSend className="mr-2 text-sm" />
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Map / Side Info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            {/* Map Placeholder */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden h-64">
              <div className="w-full h-full bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/40 dark:to-emerald-900/40 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]">
                  <div
                    className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxNEE4QTgiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0wIDB2LTRoLTR2NGg0em0tNCAwdi00aDR2NGgtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat"
                  />
                </div>
                <FiMapPin className="text-5xl text-[var(--primary)] mb-3" />
                <p className="text-sm font-medium text-[var(--foreground)]">
                  350 5th Avenue, Suite 1200
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  New York, NY 10118, USA
                </p>
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MdContactSupport className="text-xl text-[var(--primary)]" />
                <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider">
                  Quick Answers
                </h3>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx}>
                    <p className="text-sm font-medium text-[var(--foreground)] mb-1">
                      {faq.q}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
