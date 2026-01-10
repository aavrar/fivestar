import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

// Helper to check auth
async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.get('admin_token')?.value === 'true';
}

export async function GET() {
    if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const categories = await Category.find({});
    return NextResponse.json(categories);
}

export async function DELETE(req: Request) {
    if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();
        const { categoryId, clipId } = await req.json();

        const category = await Category.findOne({ id: categoryId });
        if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

        category.clips = category.clips.filter((c: any) => c.id !== clipId);
        await category.save();

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();
        const { categoryId, clipId, title, videoUrl } = await req.json();

        // Basic Embed Logic for updates
        let embedUrl = videoUrl;
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            if (!videoUrl.includes('/embed/')) {
                const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
        }

        const category = await Category.findOne({ id: categoryId });
        if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

        const clipIndex = category.clips.findIndex((c: any) => c.id === clipId);
        if (clipIndex === -1) return NextResponse.json({ error: "Clip not found" }, { status: 404 });

        category.clips[clipIndex].title = title;
        category.clips[clipIndex].videoUrl = embedUrl;

        await category.save();

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
