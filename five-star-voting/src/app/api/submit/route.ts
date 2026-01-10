import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { title, url, categoryId } = await req.json();

        if (!title || !url || !categoryId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Basic Embed Logic (Youtube only for MVP demo)
        // Convert https://www.youtube.com/watch?v=XYZ to https://www.youtube.com/embed/XYZ
        let embedUrl = url;
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }

        const newClip = {
            id: uuidv4(),
            title,
            videoUrl: embedUrl,
            status: "PENDING", // If moderation enabled
        };

        const category = await Category.findOne({ id: categoryId });
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        category.clips.push(newClip);
        await category.save();

        return NextResponse.json({ success: true, clip: newClip });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to submit clip" }, { status: 500 });
    }
}
