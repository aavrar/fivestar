import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
    clipId: string;
    categoryId: string;
    createdAt: Date;
}

const VoteSchema: Schema = new Schema({
    clipId: { type: String, required: true },
    categoryId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Prevent model recompilation error in Next.js dev mode
export default mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);
