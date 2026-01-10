import dbConnect from '@/lib/db';
import Category, { ICategory } from '@/models/Category';
import Vote from '@/models/Vote';

export async function getCategoriesWithVotes() {
    // If no DB URI, return empty or mock errors handled upstream
    if (!process.env.MONGODB_URI) return [];

    try {
        await dbConnect();

        // 1. Fetch Categories (Plain JS objects)
        const categories = await Category.find({}).lean();

        // 2. Fetch Aggregated Votes
        const voteCounts = await Vote.aggregate([
            {
                $group: {
                    _id: "$clipId",
                    count: { $sum: 1 }
                }
            }
        ]);

        const voteMap = new Map(voteCounts.map(v => [v._id, v.count]));

        // 3. Merge
        // Note: We map explicitly to match the VoteCategory interface used in UI
        return categories.map((cat: any) => ({
            id: cat.id,
            title: cat.title,
            description: cat.description,
            clips: cat.clips.map((clip: any) => ({
                id: clip.id,
                title: clip.title,
                videoUrl: clip.videoUrl,
                votes: voteMap.get(clip.id) || 0
            }))
        }));

    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}
