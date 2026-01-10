export interface VoteClip {
    id: string;
    title: string;
    videoUrl: string; // YouTube/Twitch embed URL
    thumbnail?: string;
    votes: number;
}

export interface VoteCategory {
    id: string;
    title: string;
    description: string;
    clips: VoteClip[];
}
