"use client";

import { useState } from "react";
import { VoteCategory } from "@/lib/types";
import { Tabs } from "@/components/ui/Tabs";
import { VoteButton } from "@/components/features/VoteButton";
import { motion, AnimatePresence } from "framer-motion";

interface VotingGridProps {
    categories: VoteCategory[];
    readOnly?: boolean;
}

export function VotingGrid({ categories, readOnly = false }: VotingGridProps) {
    const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
    const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0];

    // Logic: In results phase, we might want to sort by votes desc
    const displayClips = readOnly
        ? [...activeCategory.clips].sort((a, b) => b.votes - a.votes)
        : activeCategory.clips;

    return (
        <section className="container mx-auto px-6 py-20 relative z-20">
            <div className="mb-12 flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/10 pb-6">
                <div>
                    <h3 className="text-3xl font-semibold text-white tracking-tight mb-2">Vote Categories</h3>
                    <p className="text-gray-400">Select a category to cast your votes.</p>
                </div>
                <Tabs
                    tabs={categories.map((c) => ({ id: c.id, label: c.title }))}
                    activeTab={activeCategoryId}
                    onChange={setActiveCategoryId}
                />
            </div>

            <motion.div
                layout
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
                <AnimatePresence mode="popLayout">
                    {displayClips.map((clip, index) => (
                        <motion.div
                            key={clip.id}
                            layout // Magic layout transition
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="group relative flex flex-col overflow-hidden rounded-[32px] bg-surface transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            {/* Rank Badge for Results */}
                            {readOnly && index < 3 && (
                                <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full font-bold text-black ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-orange-400'
                                    }`}>
                                    #{index + 1}
                                </div>
                            )}
                            {/* Video Container */}
                            <div className="relative aspect-[16/9] w-full bg-black">
                                {/* 
                     NOTE: In real app, consider using a specialized player wrapper 
                     to handle different platform Aspect Ratios properly.
                  */}
                                <iframe
                                    src={clip.videoUrl}
                                    title={clip.title}
                                    className="absolute inset-0 h-full w-full border-0"
                                    allowFullScreen
                                />
                                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 pointer-events-none" />
                            </div>

                            <div className="flex flex-1 flex-col justify-between p-6">
                                <div>
                                    <h4 className="mb-3 text-xl font-semibold text-white leading-tight">
                                        {clip.title}
                                    </h4>
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                                    {readOnly ? (
                                        <div className="text-xl font-bold text-primary">{clip.votes.toLocaleString()} Votes</div>
                                    ) : (
                                        <VoteButton
                                            initialVotes={clip.votes}
                                            clipId={clip.id}
                                            categoryId={activeCategory.id}
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
