import mongoose, { Schema, Document } from 'mongoose';

export type Stage = 'COLLECTION' | 'VOTING' | 'RESULTS';

export interface ISettings extends Document {
    currentStage: Stage;
    updatedAt: Date;
}

const SettingsSchema = new Schema({
    currentStage: {
        type: String,
        enum: ['COLLECTION', 'VOTING', 'RESULTS'],
        default: 'COLLECTION'
    },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
