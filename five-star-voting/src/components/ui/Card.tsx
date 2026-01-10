"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
    hoverEffect?: boolean;
}

export function Card({ className, children, hoverEffect = false, ...props }: CardProps) {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -5 } : undefined}
            className={cn(
                "glass-panel rounded-xl p-6 transition-all duration-300",
                hoverEffect && "hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,0,255,0.15)]",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
