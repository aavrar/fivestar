"use client";

import { useState } from "react";
import { GlowButton } from "@/components/ui/Button";
import { VoteCategory } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: VoteCategory[];
}

export function SubmissionModal({ isOpen, onClose, categories }: SubmissionModalProps) {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
    const [errorMsg, setErrorMsg] = useState("Failed to submit");
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        const res = await fetch("/api/submit", {
            method: "POST",
            body: JSON.stringify({ url, title, categoryId }),
        });

        const data = await res.json();

        if (res.ok) {
            setStatus("success");
            setTimeout(() => {
                onClose();
                setStatus("idle");
                setUrl("");
                setTitle("");
                setErrorMsg("Failed to submit"); // Reset default
            }, 1000);
        } else {
            setStatus("error");
            setErrorMsg(data.error || "Failed to submit");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-lg glass-panel p-8 rounded-3xl z-10"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6">Submit a Clip</h2>

                        {status === 'success' ? (
                            <div className="text-center py-10">
                                <p className="text-green-400 text-xl font-bold">Submitted Successfully!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Clip Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        placeholder="Epic Fail Moment"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    >
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">YouTube Video URL</label>
                                    <input
                                        type="url"
                                        required
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>

                                <GlowButton
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full justify-center mt-4"
                                >
                                    {status === 'submitting' ? 'Submitting...' : 'Submit Clip'}
                                </GlowButton>
                                {status === 'error' && <p className="text-red-400 text-center font-semibold">{errorMsg}</p>}
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
