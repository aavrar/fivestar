import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

// Default Data
const SEED_DATA = [
    {
        id: "booth",
        title: "Best In The Booth Session",
        description: "His flagship series where he records with artists live.",
        clips: [],
    },
    {
        id: "songwars",
        title: "Best Song Wars Performance",
        description: "His tournament-style competition format.",
        clips: [],
    },
    {
        id: "stream-song",
        title: "Best Song Created on Stream",
        description: "Musical genius in real-time.",
        clips: [],
    },
    {
        id: "producer",
        title: "Best Producer Moment",
        description: "Top tier production highlights.",
        clips: [],
    },
    {
        id: "historic",
        title: "Most Historic Moment",
        description: "Moments that changed everything.",
        clips: [],
    },
    {
        id: "guest",
        title: "Best Celebrity Guest",
        description: "Star-studded appearances.",
        clips: [],
    },
    {
        id: "wholesome",
        title: "Most Wholesome Moment",
        description: "Heartwarming 5Star interactions.",
        clips: [],
    },
    {
        id: "comeback",
        title: "Best Comeback Stream",
        description: "Return of the Max.",
        clips: [],
    },
    {
        id: "chat",
        title: "Funniest Chat Interaction",
        description: "Chat moving mad.",
        clips: [],
    },
    {
        id: "chaotic",
        title: "Most Chaotic Stream",
        description: "Absolute mayhem.",
        clips: [],
    },
    {
        id: "rant",
        title: "Best Rant/Hot Take",
        description: "Max speaking facts (or nonsense).",
        clips: [],
    },
    {
        id: "cashmax",
        title: "Best Ca$h Max Moment",
        description: "Money moves.",
        clips: [],
    },
    {
        id: "member",
        title: "Best 5Star Member Feature",
        description: "Community spotlight.",
        clips: [],
    },
    {
        id: "best-stream",
        title: "Best Stream",
        description: "The undisputed goat stream of 2025.",
        clips: [],
    },
];

export async function GET() {
    try {
        await dbConnect();

        // CLEAR existing categories first to remove old/renamed ones
        await Category.deleteMany({});

        // Insert new data
        await Category.insertMany(SEED_DATA);

        return NextResponse.json({ success: true, message: "Database reset and seeded successfully!" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to seed DB", details: error }, { status: 500 });
    }
}
