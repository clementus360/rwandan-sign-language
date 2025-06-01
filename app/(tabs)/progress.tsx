import CustomButton from '@/components/UI/CustomButton';
import { useCourseStore } from '@/stores/useCourseStore';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StatusBar, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

export default function ProgressPage() {
    const router = useRouter();
    const { units, lessonHistory, loading } = useCourseStore();

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <Text className="text-lg text-gray-500">Loading...</Text>
            </View>
        );
    }

    const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);
    const completedLessons = units.reduce((sum, unit) => sum + unit.progress, 0);
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) : 0;

    const lastLessonId = lessonHistory.length > 0 ? lessonHistory[0] : null;
    const nextLesson = units.flatMap((u) => u.lessons).find((l) => l.status === 'pending');
    const nextLessonId = lastLessonId || nextLesson?.id;

    const hasConsecutiveCompletions = completedLessons >= 3;
    const hasMilestoneReward = completedLessons >= 3;

    const handleContinue = () => {
        if (nextLessonId) {
            router.push(`/learn/${nextLessonId}`);
        }
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView className="flex-1 bg-gray-100">
                <View className="px-4 pt-6 pb-10">

                    {/* Title */}
                    <Text className="text-xl font-nunito-bold text-gray-900 mb-4">Urugendo rwawe</Text>

                    {/* Progress Card */}
                    <View className="bg-white rounded-2xl px-6 py-5 mb-6 shadow-sm flex items-center">
                        <View className='flex flex-row gap-4'>
                            <Progress.Circle
                                size={100}
                                progress={progressPercentage}
                                showsText
                                thickness={10}
                                color="#3B82F6"
                                unfilledColor="#E5E7EB"
                                borderWidth={0}
                                textStyle={{ fontSize: 20, fontWeight: 'bold', color: '#3B82F6' }}
                                formatText={() => `${Math.round(progressPercentage * 100)}%`}
                            />

                            <View className='flex flex-col'>
                                <Text className="text-lg font-nunito-bold text-gray-800">
                                    Umaze kwiga amasomo {completedLessons} mu {totalLessons}
                                </Text>
                                <Text className="text-sm font-inter text-gray-800">
                                    Uri kurushaho kwegera intego yawe!
                                </Text>
                            </View>
                        </View>
                        <Image
                            source={{ uri: 'https://res.cloudinary.com/dpfonnjv3/image/upload/v1748790292/t1zivazccpdcq8r7n3va.png' }} // Replace with your real asset
                            className="w-[80%] h-96 rounded-2xl -mt-16 z-20"
                            resizeMode="cover"
                        />
                    </View>

                    {/* Streak Card */}
                    {hasConsecutiveCompletions && (
                        <View className="flex-row items-center border border-red-200 rounded-2xl p-4 mb-4 bg-white shadow-sm">
                            <Ionicons name="flame" size={28} color="#EF4444" />
                            <View className="ml-4 flex-1">
                                <Text className="font-nunito-bold text-base text-gray-800">
                                    Umaze kwiga inshuro {completedLessons} zikurikiranye
                                </Text>
                                <Text className="text-sm text-gray-600 font-inter">Komereza aho - Wakoze neza cyane!</Text>
                            </View>
                        </View>
                    )}

                    {/* Reward Card */}
                    {hasMilestoneReward && (
                        <View className="flex-row items-center border border-yellow-200 rounded-2xl p-4 mb-6 bg-white shadow-sm">
                            <Feather name="activity" size={24} color="#F59E0B" />
                            <View className="ml-4 flex-1">
                                <Text className="font-nunito-bold text-base text-gray-800">
                                    Wamenye Amarenga {completedLessons} ya mbere
                                </Text>
                                <Text className="text-sm text-gray-600 font-inter">Ni byiza cyane</Text>
                            </View>
                        </View>
                    )}

                    {/* Continue Button */}
                    <CustomButton
                        title="Komereza aho wagarukiye"
                        onPress={handleContinue}
                        color="primary"
                        icon={<Feather name="play" size={16} color="white" />}
                        disabled={!nextLessonId}
                    />
                </View>
                <View className='h-24'></View>
            </ScrollView>
        </>
    );
}