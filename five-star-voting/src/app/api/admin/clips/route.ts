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

        // If no clipId is provided, delete the entire category
        if (!clipId) {
            await Category.deleteOne({ id: categoryId });
            return NextResponse.json({ success: true });
        }

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

        const category = await Category.findOne({ id: categoryId });
        if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

        // If no clipId is provided, update the category title
        if (!clipId) {
            if (title) category.title = title;
            await category.save();
            return NextResponse.json({ success: true });
        }

        const clipIndex = category.clips.findIndex((c: any) => c.id === clipId);
        if (clipIndex === -1) return NextResponse.json({ error: "Clip not found" }, { status: 404 });

        // Basic Embed Logic for updates
        let embedUrl = videoUrl;
        if (videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'))) {
            if (!videoUrl.includes('/embed/')) {
                const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop().split('?')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
        }

        category.clips[clipIndex].title = title;
        category.clips[clipIndex].videoUrl = embedUrl;

        await category.save();

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
export async function POST(req: Request) {
    if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();
        const { title } = await req.json();

        if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

        // Generate unique Category ID (e.g., "new-category")
        // Simple slugification or just uuid
        const { v4: uuidv4 } = require('uuid');
        const newCategory = new Category({
            id: uuidv4(),
            title,
            clips: []
        });

        await newCategory.save();
        return NextResponse.json({ success: true, category: newCategory });

    } catch (e) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
