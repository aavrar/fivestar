import mongoose, { Schema, Document } from 'mongoose';

export interface IClip {
    id: string; // Internal ID for voting
    title: string;
    videoUrl: string;
    uniqueVideoId?: string; // Extracted video ID for efficient duplicate detection
    votes?: number; // Optional, can be aggregated from Vote collection
}

export interface ICategory extends Document {
    id: string; // Slug
    title: string;
    description: string;
    clips: IClip[];
}

const ClipSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    uniqueVideoId: { type: String },
});

const CategorySchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    clips: [ClipSchema],
});

CategorySchema.index({ "clips.uniqueVideoId": 1 }, { sparse: true });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
