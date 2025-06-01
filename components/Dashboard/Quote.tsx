import TiltedArrowIcon from "@/assets/icons/TiltedArrow";
import { router } from "expo-router";
import { Image, Text, View } from 'react-native';
import CustomButton from "../UI/CustomButton";

export default function Quote() {
    const handleStart = () => {
        router.push(`/learn`);
    };

    return (
        <View className="relative w-full flex flex-col items-center justify-center gap-6 bg-accent-dark rounded-2xl overflow-hidden">
            {/* Soft Overlay Motif */}
            <Image
                source={require('@/assets/images/motif-overlay.png')} // Replace with your motif image path
                className="absolute opacity-30 scale-80 -left-8 -top-10 bottom-5" // Adjusted positioning
                style={{ width: '150%', height: '150%' }} // Increased size to prevent clipping
                resizeMode="contain" // Changed to contain to show the whole image
            />

            <View className="flex flex-row justify-between gap-4 px-6 mt-6">
                <Text className="font-nunito-extrabold text-3xl text-white">"</Text>
                <Text className='w-10/12 text-white text-center font-nunito text-lg'>Buri kimenyetso wiga ni isano nshya yubakwa hagati yawe n’ abo ukunda.</Text>
                <Text className="font-nunito-extrabold text-3xl text-white">"</Text>
            </View>

            <CustomButton
                title="Tangira kwiga!"
                onPress={handleStart}
                color="primary"
                icon={<TiltedArrowIcon width={16} height={16} />}
            />

            <View className="" />
        </View>

    )
}