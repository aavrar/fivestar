"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

const GlowButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300",
                    {
                        "bg-primary text-black shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:shadow-[0_0_30px_rgba(255,0,255,0.6)]":
                            variant === "primary",
                        "border border-primary/50 text-white hover:bg-primary/10 hover:border-primary":
                            variant === "outline",
                        "text-gray-400 hover:text-white hover:bg-white/5": variant === "ghost",
                        "px-4 py-2 text-sm": size === "sm",
                        "px-6 py-3 text-base": size === "md",
                        "px-8 py-4 text-lg": size === "lg",
                    },
                    className
                )}
                {...props}
            >
                {children}
                {variant === "primary" && (
                    <div className="absolute inset-0 -z-10 rounded-lg bg-primary blur-xl opacity-20 transition-opacity duration-300 hover:opacity-40" />
                )}
            </motion.button>
        );
    }
);
GlowButton.displayName = "GlowButton";

export { GlowButton };
