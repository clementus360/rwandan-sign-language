// types.ts

export type LessonStatus = 'completed' | 'pending';

export interface Lesson {
    id: string;
    title: string;
    description: string;
    type: 'story' | 'sign'
    video: string;
    image: string;
    icon: string;
    status: 'completed' | 'pending';
    isLiked: boolean;
    downloaded?: boolean; // New field
    localUri?: string;
}

export interface Unit {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    progress: number;
    lessons: Lesson[];
}

export interface PracticeQuestion {
    id: string;
    video: string;
    correctAnswer: string;
    options: string[];
}

// types.ts
export interface Story {
    id: string;
    userName: string;
    text: string;
    image: string | null;
    likes: number;
    liked: boolean;
    timestamp: string; // ISO 8601 format, e.g., "2025-05-27T21:31:00Z"
}