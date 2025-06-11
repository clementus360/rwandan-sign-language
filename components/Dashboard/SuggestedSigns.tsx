import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import CardSection from '../Cards/SuggestionCard';

export default function Suggested() {

    const suggestions = [
        {
            imageSource: require('@/assets/images/family-image.png'), // Replace with your image path
            title: "Amarangamutima",
            description: "Menya uko wavugana n'abagize umuryango wawe — mama, papa, murumuna...",
            iconSource: '@/assets/icons/user-love', // Replace with your icon path
            onCTAPress: () => router.push('/learn/9'), // Navigate to the specific lesson
        },
        {
            imageSource: require('@/assets/images/greetings-image.png'), // Replace with another image path
            title: "Indamukanyo",
            description: "Uko wasuhuza, uvuga ‘bite’, ‘murakoze’, ‘naramutse’...",
            iconSource: '@/assets/icons/peace-hand.png', // Replace with your icon path
            onCTAPress: () => router.push('/learn/5'), // Navigate to the specific lesson
        },
        // Add more suggestions as needed
    ]
    return (
        <View className='flex flex-col gap-4'>
            <Text className='font-nunito-bold text-2xl'>Amarenga yakugirira akamaro</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row p-4"
            >
                {suggestions.map((suggestion, index) => (
                    <CardSection
                        key={index}
                        imageSource={suggestion.imageSource}
                        title={suggestion.title}
                        description={suggestion.description}
                        onCTAPress={suggestion.onCTAPress}
                    />
                ))}
            </ScrollView>
        </View>
    )
}