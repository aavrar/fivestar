import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

        let embedUrl = url;
        let uniqueId = ""; // Used for duplicate checking

        // --- YOUTUBE ---
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            uniqueId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop().split('?')[0];
            embedUrl = `https://www.youtube.com/embed/${uniqueId}`;
        }
        // --- TWITCH ---
        else if (url.includes('twitch.tv')) {
            // Clip: clips.twitch.tv/Slug OR twitch.tv/User/clip/Slug
            if (url.includes('/clip/') || url.includes('clips.twitch.tv')) {
                uniqueId = url.split('/').pop().split('?')[0];
                // Note: parent param is required for Twitch embeds. 
                // We add commonly used domains + localhost.
                embedUrl = `https://clips.twitch.tv/embed?clip=${uniqueId}&parent=localhost&parent=fivestarvoting.vercel.app&parent=www.fivestarvoting.vercel.app`;
            }
            // VOD: twitch.tv/videos/123
            else if (url.includes('/videos/')) {
                uniqueId = url.split('/videos/')[1].split('?')[0];
                embedUrl = `https://player.twitch.tv/?video=${uniqueId}&parent=localhost&parent=fivestarvoting.vercel.app&parent=www.fivestarvoting.vercel.app`;
            }
        }
        // --- TIKTOK ---
        else if (url.includes('tiktok.com')) {
            // https://www.tiktok.com/@user/video/7311...
            uniqueId = url.split('/video/')[1]?.split('?')[0];
            if (uniqueId) {
                // Using the v2 embed endpoint
                embedUrl = `https://www.tiktok.com/embed/v2/${uniqueId}`;
            }
        }
        // --- TWITTER / X ---
        else if (url.includes('twitter.com') || url.includes('x.com')) {
            // https://x.com/user/status/123456...
            uniqueId = url.split('/status/')[1]?.split('?')[0];
            if (uniqueId) {
                // We mark it with a prefix so frontend knows to use Tweet Component
                embedUrl = `twitter:${uniqueId}`;
            }
        }
        // --- FALLBACK ---
        else {
            uniqueId = url; // Full URL as ID for duplicates
        }

        // Check for duplicates using indexed field
        if (uniqueId) {
            const existingClip = await Category.findOne({
                "clips.uniqueVideoId": uniqueId
            });

            if (existingClip) {
                return NextResponse.json({ error: "This clip has already been submitted!" }, { status: 400 });
            }
        }

        const newClip = {
            id: uuidv4(),
            title,
            videoUrl: embedUrl,
            uniqueVideoId: uniqueId || undefined,
            status: "PENDING",
        };

        const category = await Category.findOne({ id: categoryId });
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        category.clips.push(newClip);
        await category.save();

        // Revalidate home page cache
        revalidatePath('/');

        return NextResponse.json({ success: true, clip: newClip });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to submit clip" }, { status: 500 });
    }
}
