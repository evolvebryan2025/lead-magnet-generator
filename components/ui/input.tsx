"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cyan)]/20 transition-colors",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cyan)]/20 transition-colors resize-y min-h-[100px]",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
