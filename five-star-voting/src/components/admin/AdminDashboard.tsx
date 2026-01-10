"use client";

import { useEffect, useState } from "react";
import { GlowButton } from "@/components/ui/Button";
import { Stage } from "@/models/Settings";

export default function AdminDashboard() {
    const [stage, setStage] = useState<Stage>("COLLECTION");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.currentStage) setStage(data.currentStage);
                setLoading(false);
            });
    }, []);

    const updateStage = async (newStage: Stage) => {
        setStage(newStage);
        await fetch("/api/settings", {
            method: "POST",
            body: JSON.stringify({ currentStage: newStage }),
        });
    };

    if (loading) return <div className="p-10 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-background p-10">
            <h1 className="text-4xl font-bold text-white mb-10">Event Control Center</h1>

            <div className="glass-panel p-8 rounded-2xl max-w-2xl">
                <h2 className="text-xl font-semibold text-gray-400 mb-6">Current Stage</h2>

                <div className="grid grid-cols-3 gap-4">
                    {(['COLLECTION', 'VOTING', 'RESULTS'] as Stage[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => updateStage(s)}
                            className={`
                            py-4 rounded-xl font-bold transition-all border
                            ${stage === s
                                    ? 'bg-primary text-black border-primary shadow-glow'
                                    : 'bg-surface text-gray-500 border-white/5 hover:bg-white/5'}
                        `}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-surface/50 rounded-lg border border-white/5 text-sm text-gray-300">
                    <p className="mb-2"><strong className="text-white">Collection:</strong> Public submission form is open. Voting hidden.</p>
                    <p className="mb-2"><strong className="text-white">Voting:</strong> Submissions closed. Public voting open.</p>
                    <p><strong className="text-white">Results:</strong> Voting closed. Leaderboard shown.</p>
                </div>
            </div>
        </div>
    );
}
