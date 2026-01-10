"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock loading time
        const timer = setTimeout(() => setIsLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
                >
                    {/* Placeholder for the Rotating GIF */}
                    <div className="relative h-48 w-48 mb-8">
                        <img
                            src="/assets/loading.gif"
                            alt="Loading..."
                            className="w-full h-full object-contain"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
