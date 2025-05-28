import AppleIcon from '@/assets/icons/Apple';
import BedIcon from '@/assets/icons/Bed';
import CoffeeIcon from '@/assets/icons/Coffee';
import CustomButton from '@/components/UI/CustomButton';
import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export default function ProgressTracker() {
    const defaultQuickLinks = [
        { id: 'kurya', label: 'Kurya', icon: <AppleIcon width={16} height={16} /> },
        { id: 'kunywa', label: 'Kunywa', icon: <CoffeeIcon width={16} height={16} /> },
        { id: 'kuryama', label: 'Kuryama', icon: <BedIcon width={16} height={16} /> },
    ];

    return (
        <View className="relative w-full flex flex-col gap-6 bg-accent-dark rounded-2xl overflow-hidden p-4">
            {/* Title and Progress Bar */}
            <View className="">
                <Text className="text-white text-lg font-nunito">
                    Igice cya 1: Ibikorwa by'ibanze
                </Text>
                <View className="w-full h-2 bg-white/20 rounded-full mt-2">
                    <View className="h-2 bg-accent rounded-full" style={{ width: '80%' }} />
                </View>
                <Text className="text-white text-sm mt-1">80%</Text>
            </View>

            {/* Quick Links */}
            <View className="flex-row justify-between mb-2">
                {defaultQuickLinks.map((link) => (
                    <View key={link.id} className="bg-emerald-500 rounded-lg p-4 flex items-center justify-center w-28">
                        <View className='flex items-center justify-center p-4 rounded-full bg-white '>
                            {link.icon}
                        </View>
                        <Text className="text-white text-xs mt-1">{link.label}</Text>
                    </View>
                ))}
            </View>

            {/* CTA Button */}
            <CustomButton
                title="Komerenza aho wagarukiye"
                onPress={() => alert('Continue pressed!')}
                color="primary"
                icon={<Feather name="play" size={16} color="white" />}
            />
        </View>
    );
}