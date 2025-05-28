import { Story } from "@/data/types";

// Smart sorting function that balances likes and recency
export const sortStoriesSmart = (stories: Story[]): Story[] => {
    if (stories.length === 0) return [];

    const now = new Date(); // Current time
    const maxLikes = Math.max(...stories.map(story => story.likes), 1); // Avoid division by 0

    // Calculate a score for each story
    const scoredStories = stories.map(story => {
        // Likes score (normalize between 0 and 1)
        const likesScore = story.likes / maxLikes;

        // Recency score (exponential decay based on hours difference)
        const diffMs = now.getTime() - new Date(story.timestamp).getTime();
        const diffHours = diffMs / 3600000; // Convert to hours
        const recencyScore = Math.exp(-diffHours / 24); // Decay over 24 hours

        // Combined score (40% likes, 60% recency)
        const score = (0.4 * likesScore) + (0.6 * recencyScore);

        return { ...story, score };
    });

    // Sort by score (descending)
    return scoredStories.sort((a, b) => b.score - a.score);
};