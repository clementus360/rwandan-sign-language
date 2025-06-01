import AppleIcon from '@/assets/icons/Apple';
import BedIcon from '@/assets/icons/Bed';
import CoffeeIcon from '@/assets/icons/Coffee';
import CustomButton from '@/components/UI/CustomButton';
import { useCourseStore } from '@/stores/useCourseStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { JSX } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function ProgressTracker() {
    const units = useCourseStore((state) => state.units);
    const router = useRouter();

    // Find the current unit (first with pending lessons, or first unit)
    const currentUnit = units.find((unit) =>
        unit.lessons.some((lesson) => lesson.status === 'pending')
    ) || units[0];

    // Define quick links mapping
    const lessonIconMap: { [key: string]: JSX.Element } = {
        Kurya: <AppleIcon width={16} height={16} />,
        Kunywa: <CoffeeIcon width={16} height={16} />,
        Kuryama: <BedIcon width={16} height={16} />,
    };

    // Select up to three lessons from the unit
    const quickLinks = currentUnit
        ? currentUnit.lessons
            .filter((lesson) => Object.keys(lessonIconMap).includes(lesson.title))
            .slice(0, 3)
            .map((lesson) => ({
                id: lesson.id,
                label: lesson.title,
                icon: lessonIconMap[lesson.title],
            }))
        : [];

    // Calculate progress
    const progressPercentage = currentUnit
        ? currentUnit.lessons.length > 0
            ? Math.round((currentUnit.progress / currentUnit.lessons.length) * 100)
            : 0
        : 0;

    // Find the next pending lesson in the current unit
    const nextLessonId = currentUnit
        ? currentUnit.lessons.find((lesson) => lesson.status === 'pending')?.id ||
        currentUnit?.lessons[0]?.id
        : null;

    const handleContinue = () => {
        if (nextLessonId) {
            router.push(`/learn/${nextLessonId}`);
        }
    };

    const handleLessonPress = (lessonId: string) => {
        router.push(`/learn/${lessonId}`);
    };

    if (!currentUnit) {
        return (
            <View className="relative w-full flex flex-col gap-6 bg-accent-dark rounded-2xl overflow-hidden p-4">
                <Text className="text-white text-lg font-nunito">No units available</Text>
            </View>
        );
    }

    return (
        <View className="relative w-full flex flex-col gap-6 bg-accent-dark rounded-2xl overflow-hidden p-4">
            {/* Title and Progress Bar */}
            <View className="flex flex-col gap-4">
                <View>
                    <Text className="text-white text-lg font-nunito-bold">{currentUnit.title}</Text>
                    <Text className="text-white text-md font-nunito">{currentUnit.description}</Text>
                </View>
                <View>
                    <View className="w-full h-2 bg-white/20 rounded-full mt-2">
                        <View
                            className="h-2 bg-accent rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </View>
                    <Text className="text-white text-sm mt-1">{progressPercentage}%</Text>
                </View>
            </View>

            {/* Quick Links */}
            <View className="flex-row justify-between mb-2">
                {quickLinks.map((link) => (
                    <Pressable
                        key={link.id}
                        onPress={() => handleLessonPress(link.id)}
                        className="bg-emerald-500 rounded-lg p-4 flex items-center justify-center w-28">

                        <View className="flex items-center justify-center p-4 rounded-full bg-white">
                            {link.icon}
                        </View>

                        <Text className="text-white text-xs mt-1">{link.label}</Text>
                    </Pressable>
                ))}
            </View>

            {/* CTA Button */}
            <CustomButton
                title="Komerenza aho wagarukiye"
                onPress={handleContinue}
                color="primary"
                icon={<Feather name="play" size={16} color="white" />}
                disabled={!nextLessonId}
            />
        </View>
    );
}