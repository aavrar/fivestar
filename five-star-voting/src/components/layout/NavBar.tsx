"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function NavBar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ delay: 2.6, duration: 0.8, ease: "easeOut" }} // Delays until loading is done
            className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/5"
        >
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:text-primary transition-colors">
                    5<span className="text-primary">STAR</span>
                </Link>

                <div className="flex items-center gap-6">
                    <span className="text-xs uppercase tracking-widest text-subtle">End of Year 2025</span>
                </div>
            </div>
        </motion.nav>
    );
}
