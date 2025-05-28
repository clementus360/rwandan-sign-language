import { useSearchStore } from '@/stores/useSearchStore';
import { Feather } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';
import CustomButton from '../UI/CustomButton';

export default function ContinueCard() {
    const search = useSearchStore(state => state.value.toLowerCase().trim());

    return (
        <>
            {search == '' &&
                <View className="relative w-full flex flex-row items-center justify-center gap-6 bg-accent-dark rounded-2xl overflow-hidden py-8 px-16">
                    {/* Soft Overlay Motif */}
                    <Image
                        source={require('@/assets/images/motif-overlay.png')} // Replace with your motif image path
                        className="absolute opacity-30 scale-100 -left-32 -top-10 bottom-5" // Adjusted positioning
                        style={{ width: '250%', height: '250%' }} // Increased size to prevent clipping
                        resizeMode="contain" // Changed to contain to show the whole image
                    />

                    <CustomButton
                        onPress={() => alert('Continue pressed!')}
                        color="primary"
                        size='round'
                        icon={<Feather name="play" size={24} color="white" />}
                    />

                    <View className="flex flex-col gap-2">
                        <Text className="font-nunito-bold text-2xl text-white">
                            Komereza aho wagarukiye
                        </Text>
                        <Text className="font-inter text-md text-white">
                            Wiriwe neza, Wamaze kwiga amarenga 4 mu 9 (44%)
                        </Text>

                    </View>
                </View>
            }
        </>
    )
}