import ProgressTracker from "@/components/Cards/ProgressTracker";
import { Text, View } from 'react-native';

export default function Progress() {
    return (
        <View className='flex flex-col gap-4'>
            <Text className='font-nunito-bold text-2xl'>Ibyo umaze Kwiga</Text>
            <ProgressTracker />
        </View>
    )
}