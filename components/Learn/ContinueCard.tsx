import { useCourseStore } from '@/stores/useCourseStore';
import { useSearchStore } from '@/stores/useSearchStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import CustomButton from '../UI/CustomButton';

export default function ContinueCard() {
    const search = useSearchStore((state) => state.value.toLowerCase().trim());
    const units = useCourseStore((state) => state.units);
    const filterLikedLessons = useCourseStore((state) => state.filterLikedLessons);
    const router = useRouter();
    const [showLikedOnly, setShowLikedOnly] = useState(false);

    // Calculate progress and find next pending lesson
    const lessons = showLikedOnly
        ? filterLikedLessons()
        : units.flatMap((unit) => unit.lessons);
    const totalLessons = lessons.length;
    const completedLessons = lessons.reduce(
        (sum, lesson) => sum + (lesson.status === 'completed' ? 1 : 0),
        0
    );
    const progressPercentage = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // Find the first pending lesson
    let nextLessonId: string | null = null;
    if (showLikedOnly) {
        const pendingLesson = lessons.find((lesson) => lesson.status === 'pending');
        if (pendingLesson) nextLessonId = pendingLesson.id;
    } else {
        for (const unit of units) {
            const pendingLesson = unit.lessons.find((lesson) => lesson.status === 'pending');
            if (pendingLesson) {
                nextLessonId = pendingLesson.id;
                break;
            }
        }
    }
    // Default to first lesson if no pending
    if (!nextLessonId && lessons.length > 0) {
        nextLessonId = lessons[0].id;
    }

    const handleContinue = () => {
        if (nextLessonId) {
            router.push(`/learn/${nextLessonId}`);
        }
    };

    if (search !== '') {
        return null;
    }

    return (
        <View className='flex flex-col gap-4'>
            {completedLessons > 0 &&
                <View className="relative w-full flex flex-col gap-4 bg-accent-dark rounded-2xl overflow-hidden py-8 px-6">
                    {/* Soft Overlay Motif */}
                    <Image
                        source={require('@/assets/images/motif-overlay.png')}
                        className="absolute opacity-30 scale-100 -left-32 -top-10 bottom-5"
                        style={{ width: '250%', height: '250%' }}
                        resizeMode="contain"
                    />

                    {/* Content */}
                    <View className="flex flex-row gap-4 items-center justify-between">
                        <CustomButton
                            onPress={handleContinue}
                            color="primary"
                            size="round"
                            icon={<Feather name="play" size={24} color="white" />}
                            disabled={!nextLessonId}
                        />
                        <View className="flex flex-col gap-2">
                            <Text className="font-nunito-bold text-2xl text-white">
                                Komereza aho wagarukiye
                            </Text>
                            <Text className="font-inter w-9/12 text-md text-white">
                                Wiriwe neza, Wamaze kwiga {completedLessons > 1 ? "amasomo" : "isomo"} {completedLessons} mu {totalLessons} ({progressPercentage}%)
                            </Text>
                        </View>
                    </View>
                </View>}

            {/* Filter Segmented Control */}
            <View className="flex-row justify-center mb-2">
                <View className="flex-row bg-gray-800 rounded-full p-1">
                    <Pressable
                        className={`px-4 py-2 rounded-full ${!showLikedOnly ? 'bg-accent' : ''}`}
                        onPress={() => setShowLikedOnly(false)}
                    >
                        <Text className={`text-sm font-nunito ${!showLikedOnly ? 'text-white' : 'text-gray-400'}`}>
                            All
                        </Text>
                    </Pressable>
                    <Pressable
                        className={`px-4 py-2 rounded-full ${showLikedOnly ? 'bg-accent' : ''}`}
                        onPress={() => setShowLikedOnly(true)}
                    >
                        <Text className={`text-sm font-nunito ${showLikedOnly ? 'text-white' : 'text-gray-400'}`}>
                            Liked
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}