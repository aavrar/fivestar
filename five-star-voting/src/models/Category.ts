import mongoose, { Schema, Document } from 'mongoose';

export interface IClip {
    id: string; // Internal ID for voting
    title: string;
    videoUrl: string;
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
});

const CategorySchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    clips: [ClipSchema],
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
