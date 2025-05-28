import HeroSection from '@/components/Dashboard/Hero';
import Progress from '@/components/Dashboard/Progress';
import QuickActions from '@/components/Dashboard/QuickActions';
import Quote from '@/components/Dashboard/Quote';
import Suggested from '@/components/Dashboard/SuggestedSigns';
import { ScrollView, StatusBar, View } from 'react-native';

export default function HomeScreen() {
    return (
        <ScrollView>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View className="flex-1 gap-8 px-4 py-4">
                <HeroSection />
                <QuickActions />
                <Progress />
                <Suggested />
                <Quote />
                <View className="h-20" />
            </View>
        </ScrollView>
    );
}