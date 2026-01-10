"use client";

import { motion } from "framer-motion";
import { GlowButton } from "@/components/ui/Button";

export function HeroSection() {
    return (
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-20">

            {/* Abstract Background Elements */}
            <div className="absolute right-[-10%] top-[20%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[150px] opacity-60" />
            <div className="absolute left-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px] opacity-30" />

            <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.8, duration: 1, ease: "easeOut" }}
                    className="z-10"
                >
                    <h1 className="text-7xl font-semibold tracking-tighter text-white md:text-8xl lg:text-9xl mb-6">
                        Best of PlaqueBoyMax <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                            2025.
                        </span>
                    </h1>
                    <p className="max-w-md text-xl font-medium text-gray-400 mb-8 leading-relaxed">
                        5$tar Shit. 5$tar Forever. Curated by the 5$tar community.
                    </p>
                    <div className="flex gap-4">
                        <GlowButton
                            size="lg"
                            className="rounded-full px-10"
                            onClick={() => {
                                document.getElementById('voting-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Start Voting
                        </GlowButton>
                    </div>
                </motion.div>

                {/* Visual Element (Right Side) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3, duration: 1.2, ease: "easeOut" }}
                    className="relative hidden lg:block h-[600px] w-full"
                >
                    {/* 3D-ish Card Stack Visual */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[500px] bg-gradient-to-br from-surface to-black border border-white/10 rounded-[40px] shadow-2xl rotate-[-6deg] z-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[500px] bg-gradient-to-br from-surface to-black border border-white/10 rounded-[40px] shadow-2xl rotate-[6deg] z-20 backdrop-blur-md" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[500px] bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 rounded-[40px] shadow-glow z-30 flex items-center justify-center">
                        <img
                            src="/assets/loading.gif"
                            alt="5Star Logo"
                            className="w-[70%] h-auto object-contain opacity-50"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
