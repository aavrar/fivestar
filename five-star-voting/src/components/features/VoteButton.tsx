"use client";

import { useState } from "react";
import { GlowButton } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface VoteButtonProps {
    initialVotes: number;
    clipId: string;
    categoryId: string;
}

export function VoteButton({ initialVotes, clipId, categoryId }: VoteButtonProps) {
    const [votes, setVotes] = useState(initialVotes);
    const [hasVoted, setHasVoted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleVote = async () => {
        if (hasVoted || isSaving) return;

        setIsSaving(true);

        // Optimistic Update
        setVotes((prev) => prev + 1);
        setHasVoted(true);

        try {
            const res = await fetch('/api/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clipId, categoryId }),
            });

            if (!res.ok) {
                throw new Error("Failed to vote");
            }

            // Update with server truth
            const data = await res.json();
            if (data.votes) setVotes(data.votes);

        } catch (error) {
            console.error(error);
            // Revert on error
            setVotes((prev) => prev - 1);
            setHasVoted(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <GlowButton
                    onClick={handleVote}
                    disabled={hasVoted || isSaving}
                    size="sm"
                    className={`rounded-full px-6 transition-all ${hasVoted
                            ? "bg-surface text-primary border-primary/20 cursor-default"
                            : "hover:scale-105 active:scale-95"
                        }`}
                >
                    <Heart className={`mr-2 h-4 w-4 ${hasVoted ? "fill-current" : ""}`} />
                    {hasVoted ? "Voted" : "Vote"}
                </GlowButton>

                {/* Particle Effect */}
                <AnimatePresence>
                    {hasVoted && (
                        <>
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        opacity: 0,
                                        scale: 1,
                                        x: (Math.random() - 0.5) * 100,
                                        y: (Math.random() - 0.5) * 100,
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-primary"
                                />
                            ))}
                        </>
                    )}
                </AnimatePresence>
            </div>

            <motion.span
                key={votes}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold text-subtle"
            >
                {votes.toLocaleString()}
            </motion.span>
        </div>
    );
}
