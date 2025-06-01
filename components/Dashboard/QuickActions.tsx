import BarChartIcon from '@/assets/icons/BarChart';
import PlayCircleIcon from '@/assets/icons/CirclePlay';
import RepeatIcon from '@/assets/icons/Repeat';
import { useCourseStore } from '@/stores/useCourseStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function QuickActions() {
    const [activeAction, setActiveAction] = useState<number | null>(null);
    const router = useRouter();
    const { units, filterLikedLessons } = useCourseStore();

    // Check data availability
    const hasPendingLessons = units.some((unit) =>
        unit.lessons.some((lesson) => lesson.status === 'pending')
    );
    const hasCompletedLessons = units
        .flatMap((unit) => unit.lessons)
        .some((lesson) => lesson.status === 'completed');
    const hasLikedLessons = filterLikedLessons().length > 0;
    const hasLessons = units.some((unit) => unit.lessons.length > 0);

    const handleStartNew = () => {
        const currentUnit = units.find((unit) => unit.lessons.some((l) => l.status === 'pending')) || units[0];
        const nextLesson = currentUnit?.lessons.find((l) => l.status === 'pending') || currentUnit?.lessons[0];
        if (nextLesson) {
            router.push(`/learn/${nextLesson.id}`);
        }
    };

    const handleReviewLesson = () => {
        const completedLessons = units
            .flatMap((unit) => unit.lessons)
            .filter((lesson) => lesson.status === 'completed');
        if (completedLessons.length > 0) {
            const randomLesson = completedLessons[Math.floor(Math.random() * completedLessons.length)];
            router.push(`/learn/${randomLesson.id}`);
        }
    };

    const handleLikedLessons = () => {
        const likedLessons = filterLikedLessons();
        if (likedLessons.length > 0) {
            router.push(`/learn/${likedLessons[0].id}`);
        }
    };

    const handleViewProgress = () => {
        router.push('/progress');
    };

    const quickActions = [
        {
            id: 1,
            title: 'Tangira',
            icon: <PlayCircleIcon width={16} height={16} />,
            onPress: handleStartNew,
            visible: hasPendingLessons || hasLessons,
        },
        {
            id: 2,
            title: 'Subiramo',
            icon: <RepeatIcon width={16} height={16} />,
            onPress: handleReviewLesson,
            visible: hasCompletedLessons,
        },
        // {
        //     id: 3,
        //     title: 'Ibikunzwe',
        //     icon: <HeartIcon width={16} height={16} />,
        //     onPress: handleLikedLessons,
        //     visible: hasLikedLessons,
        // },
        {
            id: 4,
            title: 'Ibyagezweho',
            icon: <BarChartIcon width={16} height={16} />,
            onPress: handleViewProgress,
            visible: hasLessons, // Assume progress page is available if lessons exist
        },
    ].filter((action) => action.visible).slice(0, 3); ;

    if (quickActions.length === 0) {
        return null;
    }

    return (
        <View className="flex flex-col gap-4">
            <Text className="font-nunito-bold text-2xl">Ibikorwa byihuse</Text>
            <View className="flex-row justify-between gap-2">
                {quickActions.map((action) => (
                    <Pressable
                        key={action.id}
                        onPressIn={() => setActiveAction(action.id)}
                        onPressOut={() => setActiveAction(null)}
                        onPress={action.onPress}
                        className={`flex-1 flex-row items-center justify-center bg-white rounded-full gap-2 px-4 py-4 border ${activeAction === action.id ? 'border-primary' : 'border-gray-200'
                            }`}
                        style={({ pressed }) => [
                            {
                                elevation: pressed ? 0 : 3,
                                transform: [{ scale: pressed ? 0.98 : 1 }],
                            },
                        ]}
                    >
                        {action.icon}
                        <Text className="text-center text-sm font-inter-medium text-nowrap">{action.title}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}