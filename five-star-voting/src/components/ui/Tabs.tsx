"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
    id: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
    return (
        <div className={cn("flex flex-wrap justify-center gap-2", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "relative px-4 py-2 text-sm font-medium transition-colors md:text-base",
                        activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-white"
                    )}
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-full bg-surface border border-primary/30"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
