"use client";

import { useState } from "react";
import { VoteCategory } from "@/lib/types";
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
            <h3 className="text-4xl font-semibold text-white tracking-tight mb-8">Vote Categories</h3>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:w-1/4">
                    <div className="lg:sticky lg:top-24 space-y-1">
                        <p className="text-gray-400 mb-4 text-sm font-medium uppercase tracking-wider pl-4">Categories</p>
                        <div className="flex overflow-x-auto pb-4 lg:pb-0 lg:flex-col gap-2 no-scrollbar">
                            {categories.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setActiveCategoryId(c.id)}
                                    className={`
                                        whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-medium transition-all
                                        ${activeCategoryId === c.id
                                            ? "bg-primary text-black font-bold shadow-glow"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"}
                                    `}
                                >
                                    {c.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:w-3/4 min-h-[500px]">
                    <div className="mb-6 pl-2">
                        <h2 className="text-2xl font-bold text-white mb-1">{activeCategory.title}</h2>
                        <p className="text-gray-400">{activeCategory.description}</p>
                    </div>

                    <motion.div
                        layout
                        className="grid gap-6 sm:grid-cols-2"
                    >
                        <AnimatePresence mode="popLayout">
                            {displayClips.map((clip, index) => (
                                <motion.div
                                    key={clip.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative flex flex-col overflow-hidden rounded-[24px] bg-surface border border-white/5 transition-transform duration-500 hover:-translate-y-1 hover:border-primary/50"
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
                                        <iframe
                                            src={clip.videoUrl}
                                            title={clip.title}
                                            className="absolute inset-0 h-full w-full border-0"
                                            allowFullScreen
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between p-5">
                                        <h4 className="mb-3 text-lg font-semibold text-white leading-tight">
                                            {clip.title}
                                        </h4>

                                        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                                            {readOnly ? (
                                                <div className="text-lg font-bold text-primary">{clip.votes.toLocaleString()} Votes</div>
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

                    {displayClips.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-2xl">
                            <p className="text-gray-500">No clips in this category yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
