import ContinueCard from '@/components/Learn/ContinueCard';
import TimelineComponent from '@/components/Learn/Timeline';
import { ScrollView, StatusBar, View } from 'react-native';

export default function LearnScreen() {
    return (
        <ScrollView>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View className="flex-1 gap-8 px-4 py-4">
                <ContinueCard />
                <TimelineComponent />
                <View className="h-20" />
            </View>
        </ScrollView>
    );
}