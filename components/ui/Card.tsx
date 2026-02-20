"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(
        "glass-card p-6",
        hover && "hover:shadow-xl hover:shadow-indigo-500/10 transition-shadow duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}