import TiltedArrowIcon from '@/assets/icons/TiltedArrow';
import { Image, Text, View } from 'react-native';
import CustomButton from '../UI/CustomButton';

export default function HeroSection() {
    return (
        <View className="relative w-full bg-accent-dark rounded-2xl overflow-hidden">
            {/* Soft Overlay Motif */}
            <Image
                source={require('@/assets/images/motif-overlay.png')} // Replace with your motif image path
                className="absolute opacity-30 scale-80 left-0 -top-10 bottom-5" // Adjusted positioning
                style={{ width: '150%', height: '150%' }} // Increased size to prevent clipping
                resizeMode="contain" // Changed to contain to show the whole image
            />

            {/* Content Container */}
            <View className="relative z-10 flex-row items-center justify-between px-6">
                {/* Text Section */}
                <View className="flex flex-col gap-4 max-w-[50%]">
                    <Text className="font-nunito-extrabold text-3xl text-white">
                        Menya ururimi rw' amarenga!
                    </Text>
                    <CustomButton
                        title="Tangira kwiga!"
                        onPress={() => alert('Button pressed!')}
                        color="primary"
                        icon={<TiltedArrowIcon width={16} height={16} />}
                    />
                </View>

                {/* Image Section */}
                <Image
                    source={require('@/assets/images/hero-image.png')} // Replace with your image path
                    className="w-40 h-56"
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}