import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Vote from '@/models/Vote';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { clipId, categoryId } = await req.json();

        if (!clipId || !categoryId) {
            return NextResponse.json(
                { error: 'Missing clipId or categoryId' },
                { status: 400 }
            );
        }

        // Save vote
        await Vote.create({ clipId, categoryId });

        // Get updated count
        const count = await Vote.countDocuments({ clipId });

        // Revalidate home page cache
        revalidatePath('/');

        return NextResponse.json({ success: true, votes: count });
    } catch (error) {
        console.error('Vote Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const clipId = searchParams.get('clipId');

    if (!clipId) {
        return NextResponse.json({ error: "Missing clipId" }, { status: 400 });
    }

    await dbConnect();
    const count = await Vote.countDocuments({ clipId });
    return NextResponse.json({ votes: count });
}
