"use client";

import { motion } from "framer-motion";
import { MdTravelExplore } from "react-icons/md";

interface AuthLoaderProps {
  text?: string;
  fullScreen?: boolean;
}

const AuthLoader = ({
  text = "Checking authentication...",
  fullScreen = true,
}: AuthLoaderProps) => {
  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-5"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <MdTravelExplore className="text-5xl text-[var(--primary)]" />
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          TravelSpot
        </h2>
        <div className="flex items-center gap-2">
          <div className="size-5 border-[3px] border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
          <span className="text-sm text-[var(--muted-foreground)]">{text}</span>
        </div>
      </div>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]">
        {content}
      </div>
    );
  }

  return content;
};

export default AuthLoader;
