"use client";

import { cn } from "@/lib/utils";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95",
    secondary: "px-6 py-3 bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 active:scale-95",
    ghost: "px-4 py-2 text-slate-400 hover:text-white transition-colors",
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "",
    lg: "text-lg px-8 py-4",
  };

  return (
    <button
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}