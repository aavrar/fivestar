"use client";

import { Tweet } from "react-tweet";

interface VideoPlayerProps {
    url: string;
    title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
    // --- TWITTER / X ---
    if (url.startsWith("twitter:")) {
        const tweetId = url.split(":")[1];
        return (
            <div className="w-full h-full bg-black flex items-center justify-center overflow-y-auto no-scrollbar">
                <div className="w-full max-w-[350px] transform scale-90 origin-top pt-4">
                    <Tweet id={tweetId} />
                </div>
            </div>
        );
    }

    // --- TIKTOK ---
    if (url.includes("tiktok.com")) {
        // Simple Iframe Embed
        return (
            <div className="w-full h-full bg-black">
                <iframe
                    src={url}
                    title={title}
                    className="w-full h-full border-0"
                    allow="encrypted-media;"
                    referrerPolicy="no-referrer"
                />
            </div>
        );
    }

    // --- TWITCH ---
    if (url.includes("twitch.tv")) {
        // Need to ensure parent is correct if mismatched in DB, but DB handler adds it.
        // We'll trust the DB URL.
        return (
            <div className="w-full h-full bg-black">
                <iframe
                    src={url}
                    title={title}
                    className="w-full h-full border-0"
                    allowFullScreen
                    scrolling="no"
                />
            </div>
        );
    }

    // --- YOUTUBE / DEFAULT ---
    return (
        <div className="relative aspect-[16/9] w-full bg-black">
            <iframe
                src={url}
                title={title}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
        </div>
    );
}
