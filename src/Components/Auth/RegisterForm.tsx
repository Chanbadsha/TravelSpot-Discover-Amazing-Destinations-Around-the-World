"use client";

import React, { useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiCamera,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { authClient } from "@/src/lib/auth-client";
import toast from "react-hot-toast";
import Image from "next/image";
import GlobalLoader from "@/src/Components/UI/GlobalLoader";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    avatar: z.string().optional(),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function getPasswordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!pw) return { score: 0, label: "", color: "" };
  if (pw.length < 6)
    return { score: 1, label: "Very weak", color: "var(--error)" };
  let score = 1;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const labels = ["", "Very weak", "Weak", "Fair", "Strong", "Very strong"];
  const colors = [
    "",
    "var(--error)",
    "var(--error)",
    "var(--warning)",
    "var(--success)",
    "var(--success)",
  ];
  return { score, label: labels[score], color: colors[score] };
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password");
  const strength = useMemo(
    () => getPasswordStrength(passwordValue || ""),
    [passwordValue],
  );

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingPhoto(true);
      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/upload/image", { method: "POST", body: formData });
        const json = await res.json();
        if (!json.success) {
          toast.error(json?.error?.message || "Failed to upload image");
        } else {
          setPreview(json.data.display_url || json.data.url);
        }
      } catch (err) {
        console.error("Image upload error:", err);
        toast.error("Failed to upload image");
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (uploadingPhoto) {
      toast.error("Please wait for the image to upload");
      return;
    }
    const result = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      image: preview || undefined,
    });
    if (result.error) {
      toast.error(`${result.error.message}`);
      console.log(result.error);
    } else {
      toast.success("Account created successfully");
      router.push(redirectTo || "/");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[var(--card)] rounded-2xl shadow-lg border border-(--border) px-8 py-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Join TravelSpot
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-2">
            Create your account and start exploring the world
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="flex flex-col items-center"
          >
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploadingPhoto}
              className="relative size-20 rounded-full bg-background border-2 border-dashed border-(--border) hover:border-(--primary) transition-colors overflow-hidden cursor-pointer group disabled:opacity-60 disabled:cursor-wait"
            >
              {uploadingPhoto ? (
                <GlobalLoader variant="spinner" size="md" />
              ) : preview ? (
                <Image
                  src={preview}
                  height={600}
                  width={600}
                  alt="Profile preview"
                  className="size-full object-cover rounded-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center size-full gap-0.5">
                  <FiCamera className="text-lg text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                  <span className="text-[10px] text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors">
                    Photo
                  </span>
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
            {uploadingPhoto && (
              <p className="text-[10px] text-[var(--primary)] mt-1.5">
                Uploading...
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <p className="text-[10px] text-[var(--muted-foreground)] mt-1.5">
              Profile photo (optional)
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
          >
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
                placeholder="John Doe"
                className="w-full bg-[var(--background)] border border-(--border) rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]/20"
              />
            </div>
            {errors.name && (
              <p className="text-[var(--error)] text-xs mt-1.5">
                {errors.name.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.35 }}
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
                className="w-full bg-[var(--background)] border border-(--border) rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]/20"
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
            transition={{ duration: 0.35, delay: 0.4 }}
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
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="At least 6 characters"
                className="w-full bg-[var(--background)] border border-(--border) rounded-xl pl-10 pr-10 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <FiEyeOff className="size-4" />
                ) : (
                  <FiEye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[var(--error)] text-xs mt-1.5">
                {errors.password.message}
              </p>
            )}
            {/* Password Strength */}
            {passwordValue && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
                className="mt-2 overflow-hidden"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full transition-colors"
                      style={{
                        backgroundColor:
                          i <= strength.score
                            ? strength.color
                            : "var(--border)",
                      }}
                    />
                  ))}
                </div>
                <p
                  className="text-[11px] mt-1 font-medium"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.45 }}
          >
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[var(--muted-foreground)]">
                <FiLock className="size-4" />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Re-enter your password"
                className="w-full bg-[var(--background)] border border-(--border) rounded-xl pl-10 pr-10 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="size-4" />
                ) : (
                  <FiEye className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[var(--error)] text-xs mt-1.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </motion.div>

          {/* Terms Checkbox */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.5 }}
          >
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...register("terms")}
                className="mt-0.5 size-4 rounded border-(--border) text-[var(--primary)] accent-[var(--primary)] cursor-pointer"
              />
              <span className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                I agree to the{" "}
                <Link
                  href="#"
                  className="text-[var(--primary)] hover:text-[var(--primary-hover)] underline-offset-2 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-[var(--primary)] hover:text-[var(--primary-hover)] underline-offset-2 hover:underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-[var(--error)] text-xs mt-1.5">
                {errors.terms.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.55 }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-hover)] text-white font-semibold rounded-xl h-11 text-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <GlobalLoader variant="spinner" size="sm" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <FiUserPlus className="size-4 shrink-0" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="text-center text-sm text-[var(--muted-foreground)] mt-6"
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
