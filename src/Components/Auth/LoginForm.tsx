"use client";

import { authClient } from "@/src/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiLock, FiLogIn, FiMail, FiShield } from "react-icons/fi";
import { z } from "zod";
import GlobalLoader from "@/src/Components/UI/GlobalLoader";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const DEMO_ADMIN = {
  email: "admin@travelspot.com",
  password: "TravelSpo@tAdmin",
};

export default function LoginForm() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await authClient.signIn.email(data);
    if (result.error) {
      toast.error(result.error.message || "Failed to sign in");
    } else {
      toast.success("Signed in successfully");
      router.push("/");
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    const result = await authClient.signIn.email(DEMO_ADMIN);
    if (result.error) {
      toast.error(result.error.message || "Failed to sign in");
    } else {
      toast.success("Signed in as admin");
      router.push("/");
    }
    setDemoLoading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--border)] px-8 py-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Welcome Back, Explorer
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-2">
            Sign in to continue your journey
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.35 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[var(--muted-foreground)]">
                <FiLock className="size-4" />
              </span>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]/20"
              />
            </div>
            {errors.password && (
              <p className="text-[var(--error)] text-xs mt-1.5">
                {errors.password.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.45 }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-hover)] text-white font-semibold rounded-xl h-11 text-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <GlobalLoader variant="spinner" size="sm" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="size-4 shrink-0" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-4"
        >
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-600 text-white font-semibold rounded-xl h-11 text-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {demoLoading ? (
              <>
                <GlobalLoader variant="spinner" size="sm" />
                <span>Signing in as admin...</span>
              </>
            ) : (
              <>
                <FiShield className="size-4 shrink-0" />
                <span>Demo Admin Login</span>
              </>
            )}
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="text-center text-sm text-[var(--muted-foreground)] mt-6"
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium underline-offset-2 hover:underline"
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
