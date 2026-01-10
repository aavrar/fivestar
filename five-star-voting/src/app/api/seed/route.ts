import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

// Default Data
const SEED_DATA = [
    {
        id: "rage",
        title: "Rage",
        description: "Loudest crash-outs.",
        clips: [
            {
                id: "rage-1",
                title: "Controller Breaker 3000",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            },
            {
                id: "rage-2",
                title: "Ending the Stream Early",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            },
        ],
    },
    {
        id: "funny",
        title: "Funny",
        description: "Top tier comedy.",
        clips: [
            {
                id: "funny-1",
                title: "The Freestyle Fail",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            },
        ],
    },
    {
        id: "wholesome",
        title: "Wholesome",
        description: "Rare moments.",
        clips: [
            {
                id: "whole-1",
                title: "Fan Meetup",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            },
        ],
    },
];

export async function GET() {
    try {
        await dbConnect();

        // Clear existing? Maybe optional. For now, let's upsert.
        for (const cat of SEED_DATA) {
            await Category.findOneAndUpdate(
                { id: cat.id },
                cat,
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({ success: true, message: "Database seeded successfully!" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to seed DB", details: error }, { status: 500 });
    }
}
