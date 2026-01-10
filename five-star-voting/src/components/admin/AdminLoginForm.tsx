"use client";

import { useState } from "react";
import { GlowButton } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/admin/login", {
            method: "POST",
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            router.push("/admin/dashboard");
        } else {
            setError("Invalid Password");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="w-full max-w-md p-8 glass-panel rounded-2xl">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Admin Password"
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <GlowButton type="submit" className="w-full justify-center">Login</GlowButton>
                </form>
            </div>
        </div>
    );
}
