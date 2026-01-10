import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';

// Helper to check auth
async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.get('admin_token')?.value === 'true';
}

export async function GET() {
    await dbConnect();
    // Get setting or create default
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({ currentStage: 'COLLECTION' });
    }
    return NextResponse.json(settings);
}

export async function POST(req: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const { currentStage } = await req.json();

        // Update the singleton
        const settings = await Settings.findOneAndUpdate(
            {},
            { currentStage, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
