"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "primary" | "blue" | "purple" | "none";
  delay?: number;
  role?: string;
  ariaLabel?: string;
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = "none",
  delay = 0,
  role,
  ariaLabel
}: GlassCardProps) {
  const glowClass = {
    primary: "glow-primary",
    blue: "glow-blue",
    purple: "glow-purple",
    none: ""
  }[glow];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      className={cn(
        "glass rounded-2xl p-6 shadow-lg",
        hover && "cursor-pointer transition-all duration-300",
        glowClass,
        className
      )}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  );
}

export function GlassCardStrong({
  children,
  className,
  role,
  ariaLabel
}: Omit<GlassCardProps, "hover" | "glow" | "delay">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "glass-strong rounded-2xl p-6 shadow-xl",
        className
      )}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  );
}
