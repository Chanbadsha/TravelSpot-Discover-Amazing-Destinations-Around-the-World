"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/src/Components/Animations";

type LoaderVariant = "spinner" | "pulse" | "skeleton";
type LoaderSize = "sm" | "md" | "lg";

interface GlobalLoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeMap: Record<LoaderSize, { spinner: string; container: string }> = {
  sm: { spinner: "size-4 border-2", container: "gap-2" },
  md: { spinner: "size-8 border-[3px]", container: "gap-3" },
  lg: { spinner: "size-12 border-4", container: "gap-4" },
};

const SkeletonBlock = ({ size }: { size: LoaderSize }) => {
  const h = size === "sm" ? "h-3" : size === "md" ? "h-4" : "h-6";
  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <div className={`${h} bg-[var(--border)] rounded-full animate-pulse w-3/4`} />
      <div className={`${h} bg-[var(--border)] rounded-full animate-pulse w-full`} />
      <div className={`${h} bg-[var(--border)] rounded-full animate-pulse w-5/6`} />
    </div>
  );
};

const PulseDots = ({ size }: { size: LoaderSize }) => {
  const dotSize = size === "sm" ? "size-1.5" : size === "md" ? "size-2" : "size-3";
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSize} bg-[var(--primary)] rounded-full animate-pulse`}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

const GlobalLoader = ({
  variant = "spinner",
  size = "md",
  text,
  fullScreen = false,
  className = "",
}: GlobalLoaderProps) => {
  const s = sizeMap[size];

  const content = (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`flex flex-col items-center justify-center ${s.container} ${className}`}
    >
      {variant === "spinner" && (
        <div
          className={`${s.spinner} rounded-full border-[var(--primary)]/30 border-t-[var(--primary)] animate-spin`}
        />
      )}
      {variant === "pulse" && <PulseDots size={size} />}
      {variant === "skeleton" && <SkeletonBlock size={size} />}

      {variant !== "skeleton" && text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[var(--muted-foreground)]"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default GlobalLoader;
