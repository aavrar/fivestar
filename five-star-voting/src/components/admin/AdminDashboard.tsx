"use client";

import { useEffect, useState } from "react";
import { GlowButton } from "@/components/ui/Button";
import { Stage } from "@/models/Settings";

export default function AdminDashboard() {
    const [stage, setStage] = useState<Stage>("COLLECTION");
    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState<any[]>([]);
    const [editingClip, setEditingClip] = useState<any>(null);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.currentStage) setStage(data.currentStage);
                setLoading(false);
            });
        fetchClips();
    }, []);

    const updateStage = async (newStage: Stage) => {
        setStage(newStage);
        await fetch("/api/settings", {
            method: "POST",
            body: JSON.stringify({ currentStage: newStage }),
        });
    };

    const fetchClips = () => {
        fetch("/api/admin/clips")
            .then(res => res.json())
            .then(data => setCategories(data));
    }

    const handleDelete = async (categoryId: string, clipId: string) => {
        const message = clipId ? "Are you sure you want to delete this clip?" : "⚠️ Are you sure you want to delete the ENTIRE category and all its clips?";
        if (!confirm(message)) return;

        await fetch("/api/admin/clips", {
            method: "DELETE",
            body: JSON.stringify({ categoryId, clipId }),
        });
        fetchClips();
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/admin/clips", {
            method: "PUT",
            body: JSON.stringify({
                categoryId: editingClip.categoryId,
                clipId: editingClip.id,
                title: editingClip.title,
                videoUrl: editingClip.videoUrl
            }),
        });
        setEditingClip(null);
        fetchClips();
    };

    const handleCategoryEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/admin/clips", {
            method: "PUT",
            body: JSON.stringify({
                categoryId: editingCategory.id,
                title: editingCategory.title
            }),
        });
        setEditingCategory(null);
        fetchClips();
    };

    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryTitle, setNewCategoryTitle] = useState("");

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/admin/clips", {
            method: "POST",
            body: JSON.stringify({ title: newCategoryTitle }),
        });
        setIsCreatingCategory(false);
        setNewCategoryTitle("");
        fetchClips();
    };

    if (loading) return <div className="p-10 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-background p-10 pb-40">
            <h1 className="text-4xl font-bold text-white mb-10">Event Control Center</h1>

            {/* Stage Controls */}
            <div className="glass-panel p-8 rounded-2xl max-w-4xl mb-10">
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

            {/* Clip Manager */}
            <div className="glass-panel p-8 rounded-2xl max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-400">Manage Clips</h2>
                    <GlowButton onClick={() => setIsCreatingCategory(true)}>
                        + Add Category
                    </GlowButton>
                </div>
                <div className="space-y-8">
                    {categories.map(cat => (
                        <div key={cat.id}>
                            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                <h3 className="text-white font-bold text-lg">{cat.title}</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingCategory(cat)}
                                        className="text-xs text-blue-400 hover:text-blue-300 font-medium px-3 py-1 bg-blue-500/10 rounded transition-colors"
                                    >
                                        Edit Title
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id, "")}
                                        className="text-xs text-red-500 hover:text-red-400 font-medium px-3 py-1 bg-red-500/10 rounded transition-colors"
                                    >
                                        Delete Category
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {cat.clips.map((clip: any) => (
                                    <div key={clip.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-white">{clip.title}</p>
                                            <a href={clip.videoUrl} target="_blank" className="text-xs text-blue-400 hover:underline">{clip.videoUrl}</a>
                                            {clip.status === 'PENDING' && <span className="ml-2 text-xs bg-yellow-500 text-black px-2 rounded">New</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingClip({ ...clip, categoryId: cat.id })}
                                                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm text-white"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id, clip.id)}
                                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {cat.clips.length === 0 && <p className="text-gray-600 italic">No clips yet</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Clip Modal */}
            {editingClip && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="glass-panel p-8 rounded-2xl w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Edit Clip</h3>
                        <form onSubmit={handleEditSave} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400">Title</label>
                                <input
                                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                                    value={editingClip.title}
                                    onChange={e => setEditingClip({ ...editingClip, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Video URL</label>
                                <input
                                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                                    value={editingClip.videoUrl}
                                    onChange={e => setEditingClip({ ...editingClip, videoUrl: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button type="button" onClick={() => setEditingClip(null)} className="text-gray-400">Cancel</button>
                                <GlowButton type="submit">Save Changes</GlowButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {editingCategory && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="glass-panel p-8 rounded-2xl w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Edit Category</h3>
                        <form onSubmit={handleCategoryEditSave} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400">Category Title</label>
                                <input
                                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                                    value={editingCategory.title}
                                    onChange={e => setEditingCategory({ ...editingCategory, title: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button type="button" onClick={() => setEditingCategory(null)} className="text-gray-400">Cancel</button>
                                <GlowButton type="submit">Save Changes</GlowButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Category Modal */}
            {isCreatingCategory && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="glass-panel p-8 rounded-2xl w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Create New Category</h3>
                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400">Category Title</label>
                                <input
                                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                                    value={newCategoryTitle}
                                    onChange={e => setNewCategoryTitle(e.target.value)}
                                    placeholder="e.g. Best New Artist"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button type="button" onClick={() => setIsCreatingCategory(false)} className="text-gray-400">Cancel</button>
                                <GlowButton type="submit">Create Category</GlowButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
