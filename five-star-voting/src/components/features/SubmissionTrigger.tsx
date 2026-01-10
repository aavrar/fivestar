"use client";

import { useState } from "react";
import { GlowButton } from "@/components/ui/Button";
import { SubmissionModal } from "@/components/features/SubmissionModal";
import { VoteCategory } from "@/lib/types";
import { Plus } from "lucide-react";

export default function SubmissionTrigger({ categories }: { categories: VoteCategory[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="flex justify-center my-8">
                <GlowButton onClick={() => setIsOpen(true)} size="lg" className="rounded-full shadow-glow animate-pulse-slow">
                    <Plus className="mr-2" />
                    Submit Your Clip
                </GlowButton>
            </div>
            <SubmissionModal isOpen={isOpen} onClose={() => setIsOpen(false)} categories={categories} />
        </>
    );
}
