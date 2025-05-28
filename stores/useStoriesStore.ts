import storiesData from '@/data/storiesData.json';
import { Story } from '@/data/types';
import { sortStoriesSmart } from '@/utils/postsorting';
import { create } from 'zustand';

interface StoriesStore {
    stories: Story[];
    loading: boolean;
    init: () => void;
    addStory: (text: string, image: string | null) => void;
    toggleLike: (storyId: string) => void;
}

export const useStoriesStore = create<StoriesStore>((set, get) => ({
    stories: [],
    loading: true,

    init: () => {
        const sortedStories = sortStoriesSmart(storiesData.map(story => ({
            ...story,
            timestamp: new Date(story.timestamp).toISOString(),
        })));
        set({
            stories: sortedStories,
            loading: false,
        });
    },

    addStory: (text: string, image: string | null) => {
        const newStory: Story = {
            id: (get().stories.length + 1).toString(),
            userName: 'User',
            text,
            image,
            likes: 0,
            liked: false,
            timestamp: new Date().toISOString(),
        };
        set(state => ({
            stories: sortStoriesSmart([newStory, ...state.stories]),
        }));
    },

    toggleLike: (storyId: string) => {
        set(state => {
            const updatedStories = state.stories.map(story => {
                if (story.id === storyId) {
                    return {
                        ...story,
                        liked: !story.liked,
                        likes: story.liked ? story.likes - 1 : story.likes + 1,
                    };
                }
                return story;
            });
            return {
                stories: sortStoriesSmart(updatedStories),
            };
        });
    },
}));