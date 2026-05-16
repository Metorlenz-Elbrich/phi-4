"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-br from-brand-cyan via-brand-cyan to-brand-violet text-white shadow-[0_8px_30px_-6px_hsl(var(--brand-cyan)/0.5)] hover:shadow-[0_12px_40px_-6px_hsl(var(--brand-cyan)/0.7)] hover:-translate-y-0.5",
        secondary:
          "border border-border bg-card text-foreground hover:border-brand-cyan/50 hover:bg-card hover:text-foreground",
        ghost:
          "text-foreground hover:bg-muted",
        outline:
          "border border-brand-cyan/40 text-foreground hover:border-brand-cyan hover:bg-brand-cyan/10",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { buttonVariants };
